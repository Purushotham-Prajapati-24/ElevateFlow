import { NextResponse } from "next/server";
import { getCurrentUser, type CurrentUser } from "./session";
import { db, documents, auditEvents } from "@elevateflow/db";
import { isValidTransition } from "./transitions";
import { transitionDocumentSchema } from "@elevateflow/validators";
import { eq, and, sql } from "drizzle-orm";
import {
  HTTP_STATUS,
  ERROR_CODES,
  type DocumentStatus,
  type AuditAction,
  type Document,
} from "@elevateflow/types";

interface TransitionOptions {
  documentId: string;
  targetStatus: DocumentStatus;
  action: AuditAction;
  checkPermission: (user: CurrentUser, doc: Document) => boolean;
  comment?: string | null;
  parsedVersion?: number;
}

/**
 * Execute a workflow transition atomically.
 *
 * Verifies:
 * 1. User authentication
 * 2. Document existence
 * 3. Centralized permission check (canSubmit, canApprove, etc.)
 * 4. State machine validity (isValidTransition)
 * 5. OCC version matching
 * 6. Single DB transaction for document status update + audit event insertion
 */
export async function executeTransition(
  req: Request,
  {
    documentId,
    targetStatus,
    action,
    checkPermission,
    comment = null,
  }: TransitionOptions,
) {
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

    const json = await req.json().catch(() => ({}));
    const parsed = transitionDocumentSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "Version is required for state transition",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: HTTP_STATUS.VALIDATION_ERROR },
      );
    }

    const expectedVersion = parsed.data.version;

    // Fetch current document
    const [existing] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
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

    // Permission Engine Check
    if (!checkPermission(user, existing as Document)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message:
              "You do not have permission to execute this workflow transition on this document",
          },
        },
        { status: HTTP_STATUS.FORBIDDEN },
      );
    }

    const currentStatus = existing.status as DocumentStatus;

    // State Machine Transition Graph Check
    if (!isValidTransition(currentStatus, targetStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.INVALID_TRANSITION,
            message: `Invalid transition from '${currentStatus}' to '${targetStatus}'`,
          },
        },
        { status: HTTP_STATUS.INVALID_TRANSITION },
      );
    }

    // Execute Document Update + Audit Event in SINGLE DB Transaction
    try {
      const updatedDoc = await db.transaction(async (tx) => {
        const [updated] = await tx
          .update(documents)
          .set({
            status: targetStatus,
            version: sql`${documents.version} + 1`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(documents.id, documentId),
              eq(documents.version, expectedVersion),
            ),
          )
          .returning();

        if (!updated) {
          throw new Error("VERSION_MISMATCH");
        }

        await tx.insert(auditEvents).values({
          documentId,
          actorId: user.id,
          action,
          prevStatus: currentStatus,
          newStatus: targetStatus,
          comment,
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
                "Document version conflict. Document was modified by another action. Please refresh.",
            },
          },
          { status: HTTP_STATUS.CONFLICT },
        );
      }
      throw txError;
    }
  } catch (error) {
    console.error(`Workflow transition error (${action}):`, error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: "Internal server error during workflow transition",
        },
      },
      { status: HTTP_STATUS.INTERNAL_ERROR },
    );
  }
}
