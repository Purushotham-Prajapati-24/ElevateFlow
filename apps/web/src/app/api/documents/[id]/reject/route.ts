import { NextResponse } from "next/server";
import { executeTransition } from "@/lib/workflow-service";
import { canReject } from "@/lib/permissions";
import { rejectDocumentSchema } from "@elevateflow/validators";
import { HTTP_STATUS, ERROR_CODES } from "@elevateflow/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/documents/:id/reject
 * Transition: submitted → rejected
 * Reviewer only.
 * Mandate: Rejection MUST include a non-empty comment.
 */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;

  // Clone request to parse rejection comment before passing to executeTransition
  const bodyText = await req.text();
  const json = bodyText ? JSON.parse(bodyText) : {};

  const parsed = rejectDocumentSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: "Rejection comment is required",
          details: parsed.error.flatten().fieldErrors,
        },
      },
      { status: HTTP_STATUS.VALIDATION_ERROR },
    );
  }

  // Create mock request with cloned body for executeTransition
  const mockReq = new Request(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify({ version: parsed.data.version }),
  });

  return executeTransition(mockReq, {
    documentId: id,
    targetStatus: "rejected",
    action: "rejected",
    checkPermission: canReject,
    comment: parsed.data.comment,
  });
}
