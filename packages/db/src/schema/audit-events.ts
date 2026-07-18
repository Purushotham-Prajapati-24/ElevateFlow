import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { auditActionEnum, documentStatusEnum } from "./enums";
import { documents } from "./documents";
import { users } from "./users";

/**
 * Audit events table — append-only, immutable event log.
 *
 * One event per state-changing action.
 * No UPDATE. No DELETE. Ever.
 *
 * No `updated_at` — audit events are immutable.
 * No `version` — audit events are append-only, no concurrency conflict.
 */
export const auditEvents = pgTable(
  "audit_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id),
    actorId: uuid("actor_id")
      .notNull()
      .references(() => users.id),
    action: auditActionEnum("action").notNull(),
    prevStatus: documentStatusEnum("prev_status"),
    newStatus: documentStatusEnum("new_status"),
    comment: text("comment"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_audit_events_document_id").on(
      table.documentId,
      table.createdAt,
    ),
    index("idx_audit_events_actor_id").on(table.actorId),
  ],
);
