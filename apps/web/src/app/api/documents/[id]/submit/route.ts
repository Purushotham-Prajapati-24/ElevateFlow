import { executeTransition } from "@/lib/workflow-service";
import { canSubmit } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/documents/:id/submit
 * Transition: draft → submitted
 * Author only, own document only.
 */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return executeTransition(req, {
    documentId: id,
    targetStatus: "submitted",
    action: "submitted",
    checkPermission: canSubmit,
  });
}
