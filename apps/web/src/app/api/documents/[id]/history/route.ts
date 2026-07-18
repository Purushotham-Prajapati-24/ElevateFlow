import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db, auditEvents, documents, users } from "@elevateflow/db";
import { eq, asc } from "drizzle-orm";
import { HTTP_STATUS, ERROR_CODES } from "@elevateflow/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/documents/:id/history
 * Retrieve full, chronological audit trail for a document with actor info.
 * Enforces role authorization rules.
 */
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.UNAUTHORIZED,
            message: "Authentication required",
          },
        },
        { status: HTTP_STATUS.UNAUTHORIZED },
      );
    }

    // Load document to verify authorization
    const [doc] = await db
      .select({
        id: documents.id,
        authorId: documents.authorId,
        status: documents.status,
      })
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (!doc) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: "Document not found",
          },
        },
        { status: HTTP_STATUS.NOT_FOUND },
      );
    }

    // Role-based authorization check
    let canViewHistory = false;
    switch (user.role) {
      case "author":
        canViewHistory = doc.authorId === user.id || doc.status === "published";
        break;
      case "reviewer":
        canViewHistory = doc.status === "submitted" || doc.status === "published";
        break;
      case "viewer":
        canViewHistory = doc.status === "published";
        break;
      case "admin":
        canViewHistory = true;
        break;
      default:
        canViewHistory = doc.status === "published";
        break;
    }

    if (!canViewHistory) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: "You do not have permission to view this document history",
          },
        },
        { status: HTTP_STATUS.FORBIDDEN },
      );
    }

    // Fetch chronological audit history
    const history = await db
      .select({
        id: auditEvents.id,
        documentId: auditEvents.documentId,
        actorId: auditEvents.actorId,
        action: auditEvents.action,
        prevStatus: auditEvents.prevStatus,
        newStatus: auditEvents.newStatus,
        comment: auditEvents.comment,
        metadata: auditEvents.metadata,
        createdAt: auditEvents.createdAt,
        actor: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(auditEvents)
      .innerJoin(users, eq(auditEvents.actorId, users.id))
      .where(eq(auditEvents.documentId, id))
      .orderBy(asc(auditEvents.createdAt));

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("GET /api/documents/:id/history error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: "Internal server error",
        },
      },
      { status: HTTP_STATUS.INTERNAL_ERROR },
    );
  }
}
