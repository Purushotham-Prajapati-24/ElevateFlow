import { executeTransition } from "@/lib/workflow-service";
import { canReopen } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/documents/:id/reopen
 * Transition: rejected → draft
 * Author only, own document only.
 * Moves a rejected document back to draft so it can be edited and resubmitted.
 */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return executeTransition(req, {
    documentId: id,
    targetStatus: "draft",
    action: "edited",
    checkPermission: canReopen,
  });
}
