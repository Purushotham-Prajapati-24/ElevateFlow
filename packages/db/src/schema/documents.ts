import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { documentStatusEnum } from "./enums";
import { users } from "./users";

/**
 * Documents table — the core entity of the workflow engine.
 *
 * Every document has exactly one owner (author_id) and one current status.
 * Ownership never changes. Status changes are governed by transitions.ts.
 *
 * CHECK constraints enforce non-empty title/body at the database level.
 */
export const documents = pgTable(
  "document",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    status: documentStatusEnum("status").notNull().default("draft"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_documents_status").on(table.status),
    index("idx_documents_author_id").on(table.authorId),
    index("idx_documents_created_at").on(table.createdAt),
    index("idx_documents_author_status").on(table.authorId, table.status),
    check("title_not_empty", sql`length(${table.title}) > 0`),
    check("body_not_empty", sql`length(${table.body}) > 0`),
  ],
);
