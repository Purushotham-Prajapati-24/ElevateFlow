import { executeTransition } from "@/lib/workflow-service";
import { canPublish } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/documents/:id/publish
 * Transition: approved → published
 * Reviewer or Admin.
 * Makes approved document visible to all users (including viewers).
 */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return executeTransition(req, {
    documentId: id,
    targetStatus: "published",
    action: "published",
    checkPermission: canPublish,
  });
}
