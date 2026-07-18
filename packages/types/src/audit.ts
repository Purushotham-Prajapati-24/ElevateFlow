import type { DocumentStatus } from "./document";

/**
 * ElevateFlow Audit Actions
 *
 * Every state-changing operation produces exactly one audit event.
 * Audit events are append-only — no UPDATE, no DELETE.
 */
export const AUDIT_ACTIONS = [
  "created",
  "edited",
  "submitted",
  "approved",
  "rejected",
  "published",
  "archived",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditEvent {
  readonly id: string;
  readonly documentId: string;
  readonly actorId: string;
  readonly action: AuditAction;
  readonly prevStatus: DocumentStatus | null;
  readonly newStatus: DocumentStatus | null;
  readonly comment: string | null;
  readonly metadata: Record<string, unknown> | null;
  readonly createdAt: Date;
}

/**
 * Audit event with actor details for display in timeline.
 */
export interface AuditEventWithActor extends AuditEvent {
  readonly actor: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
  };
}
