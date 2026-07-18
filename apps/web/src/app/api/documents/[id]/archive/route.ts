import { executeTransition } from "@/lib/workflow-service";
import { canArchive } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/documents/:id/archive
 * Transition: any active state → archived
 * Admin only.
 * Soft delete — archived documents cannot be edited or published.
 */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return executeTransition(req, {
    documentId: id,
    targetStatus: "archived",
    action: "archived",
    checkPermission: canArchive,
  });
}
