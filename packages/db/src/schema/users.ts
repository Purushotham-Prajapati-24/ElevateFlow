import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";

/**
 * Users table — Better Auth compatible with custom extensions.
 *
 * Better Auth requires: id, email, name, emailVerified, image, createdAt, updatedAt.
 * We add: role, version (custom fields for ElevateFlow domain).
 *
 * Better Auth's Drizzle adapter maps to this schema.
 */
export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("viewer"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
