import { pgEnum } from "drizzle-orm/pg-core";
import { USER_ROLES } from "@elevateflow/types";
import { DOCUMENT_STATUSES } from "@elevateflow/types";
import { AUDIT_ACTIONS } from "@elevateflow/types";

/**
 * PostgreSQL ENUM types.
 * These map 1:1 with the TypeScript const arrays in @elevateflow/types.
 */

export const userRoleEnum = pgEnum(
  "user_role",
  USER_ROLES as unknown as [string, ...string[]],
);

export const documentStatusEnum = pgEnum(
  "document_status",
  DOCUMENT_STATUSES as unknown as [string, ...string[]],
);

export const auditActionEnum = pgEnum(
  "audit_action",
  AUDIT_ACTIONS as unknown as [string, ...string[]],
);
