import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db, documents, auditEvents, users } from "@elevateflow/db";
import { editDocumentSchema } from "@elevateflow/validators";
import { eq, and, sql } from "drizzle-orm";
import { HTTP_STATUS, ERROR_CODES } from "@elevateflow/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/documents/:id
 * Retrieve single document by ID, enforced by user role visibility rules:
 * - author: own documents (any state) OR published documents
 * - reviewer: submitted documents OR published documents
 * - viewer: published documents ONLY
 * - admin: any document
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

    const [doc] = await db
      .select({
        id: documents.id,
        title: documents.title,
        body: documents.body,
        status: documents.status,
        authorId: documents.authorId,
        version: documents.version,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(documents)
      .innerJoin(users, eq(documents.authorId, users.id))
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

    // Role-based authorization check for viewing
    let canView = false;

    switch (user.role) {
      case "author":
        canView = doc.authorId === user.id || doc.status === "published";
        break;

      case "reviewer":
        canView = doc.status === "submitted" || doc.status === "published";
        break;

      case "viewer":
        canView = doc.status === "published";
        break;

      case "admin":
        canView = true;
        break;

      default:
        canView = doc.status === "published";
        break;
    }

    if (!canView) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: "You do not have permission to view this document",
          },
        },
        { status: HTTP_STATUS.FORBIDDEN },
      );
    }

    return NextResponse.json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error("GET /api/documents/:id error:", error);
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

/**
 * PATCH /api/documents/:id
 * Edit an existing document title/body.
 *
 * Strict Rules:
 * - Must be authenticated as author
 * - Must be the author who owns the document (ownership is immutable)
 * - Document state MUST be 'draft' or 'rejected'
 * - Published documents are IMMUTABLE
 * - Optimistic Concurrency Control: version in body must match DB version
 * - Transactional atomicity: Document update + 'edited' audit event in SAME transaction
 */
export async function PATCH(req: Request, { params }: RouteParams) {
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

    if (user.role !== "author") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: "Only authors can edit documents",
          },
        },
        { status: HTTP_STATUS.FORBIDDEN },
      );
    }

    const json = await req.json().catch(() => ({}));
    const parsed = editDocumentSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "Validation failed",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: HTTP_STATUS.VALIDATION_ERROR },
      );
    }

    const { title, body, version: expectedVersion } = parsed.data;

    // Load current document to verify ownership and state BEFORE writing
    const [existing] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (!existing) {
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

    // Ownership check — only document owner can edit
    if (existing.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: "You can only edit your own documents",
          },
        },
        { status: HTTP_STATUS.FORBIDDEN },
      );
    }

    // State check — only draft or rejected documents can be edited
    if (existing.status !== "draft" && existing.status !== "rejected") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.INVALID_TRANSITION,
            message: `Cannot edit document in status '${existing.status}'. Published and submitted documents are immutable.`,
          },
        },
        { status: HTTP_STATUS.INVALID_TRANSITION },
      );
    }

    // Transactional Update with OCC check
    try {
      const updatedDoc = await db.transaction(async (tx) => {
        // Atomic update with version check in WHERE clause
        const [updated] = await tx
          .update(documents)
          .set({
            title,
            body,
            version: sql`${documents.version} + 1`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(documents.id, id),
              eq(documents.version, expectedVersion),
            ),
          )
          .returning();

        // 0 rows updated means version mismatch (stale write)
        if (!updated) {
          throw new Error("VERSION_MISMATCH");
        }

        // Insert audit event in SAME transaction
        await tx.insert(auditEvents).values({
          documentId: id,
          actorId: user.id,
          action: "edited",
          prevStatus: existing.status,
          newStatus: existing.status,
          comment: null,
        });

        return updated;
      });

      return NextResponse.json({
        success: true,
        data: updatedDoc,
      });
    } catch (txError: unknown) {
      if (
        txError instanceof Error &&
        txError.message === "VERSION_MISMATCH"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ERROR_CODES.CONFLICT,
              message:
                "Document has been modified by another user or session. Please refresh and try again.",
            },
          },
          { status: HTTP_STATUS.CONFLICT },
        );
      }
      throw txError;
    }
  } catch (error) {
    console.error("PATCH /api/documents/:id error:", error);
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
