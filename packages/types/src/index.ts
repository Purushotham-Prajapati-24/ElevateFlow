// Domain types
export type { User, UserRole } from "./user";
export { USER_ROLES } from "./user";

export type {
  Document,
  DocumentWithAuthor,
  DocumentStatus,
} from "./document";
export { DOCUMENT_STATUSES } from "./document";

export type { AuditEvent, AuditEventWithActor, AuditAction } from "./audit";
export { AUDIT_ACTIONS } from "./audit";

export type { ErrorCode, ApiError, ApiResponse } from "./errors";
export { ERROR_CODES, HTTP_STATUS } from "./errors";
