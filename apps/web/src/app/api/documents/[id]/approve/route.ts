import { executeTransition } from "@/lib/workflow-service";
import { canApprove } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/documents/:id/approve
 * Transition: submitted → approved
 * Reviewer only. Authors CANNOT approve their own document.
 */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return executeTransition(req, {
    documentId: id,
    targetStatus: "approved",
    action: "approved",
    checkPermission: canApprove,
  });
}
