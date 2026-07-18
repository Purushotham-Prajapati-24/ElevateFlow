import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db, documents, auditEvents, users } from "@elevateflow/db";
import { createDocumentSchema } from "@elevateflow/validators";
import { eq, or, and, ne, desc } from "drizzle-orm";
import { HTTP_STATUS, ERROR_CODES } from "@elevateflow/types";

/**
 * POST /api/documents
 * Create a new draft document.
 * Restrict to authors only.
 * Document creation and audit event insertion occur in a single database transaction.
 */
export async function POST(req: Request) {
  try {
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
            message: "Only authors can create documents",
          },
        },
        { status: HTTP_STATUS.FORBIDDEN },
      );
    }

    const json = await req.json().catch(() => ({}));
    const parsed = createDocumentSchema.safeParse(json);

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

    const { title, body } = parsed.data;

    // Transactional atomicity: Document Creation + Audit Event in SAME transaction
    const createdDoc = await db.transaction(async (tx) => {
      const [newDoc] = await tx
        .insert(documents)
        .values({
          title,
          body,
          status: "draft",
          authorId: user.id,
          version: 1,
        })
        .returning();

      if (!newDoc) {
        throw new Error("Failed to insert document");
      }

      await tx.insert(auditEvents).values({
        documentId: newDoc.id,
        actorId: user.id,
        action: "created",
        prevStatus: null,
        newStatus: "draft",
        comment: null,
      });

      return newDoc;
    });

    return NextResponse.json(
      {
        success: true,
        data: createdDoc,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/documents error:", error);
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
 * GET /api/documents
 * List documents filtered by current user's role:
 * - author: own documents (any status) + published documents from others
 * - reviewer: submitted documents (queue) + published documents
 * - viewer: published documents only
 * - admin: all active documents (excluding archived by default)
 */
export async function GET() {
  try {
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

    let filterCondition;

    switch (user.role) {
      case "author":
        // Authors see their own documents in any state, plus published documents
        filterCondition = and(
          ne(documents.status, "archived"),
          or(eq(documents.authorId, user.id), eq(documents.status, "published")),
        );
        break;

      case "reviewer":
        // Reviewers see submitted documents (queue) + published documents
        filterCondition = and(
          ne(documents.status, "archived"),
          or(eq(documents.status, "submitted"), eq(documents.status, "published")),
        );
        break;

      case "viewer":
        // Viewers see ONLY published documents
        filterCondition = eq(documents.status, "published");
        break;

      case "admin":
        // Admins see all documents (including archived)
        filterCondition = undefined;
        break;

      default:
        filterCondition = eq(documents.status, "published");
        break;
    }

    const query = db
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
      .orderBy(desc(documents.createdAt));

    const docs = filterCondition
      ? await query.where(filterCondition)
      : await query;

    return NextResponse.json({
      success: true,
      data: docs,
    });
  } catch (error) {
    console.error("GET /api/documents error:", error);
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
