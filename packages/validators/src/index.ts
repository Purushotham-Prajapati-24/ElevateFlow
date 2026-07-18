// Document schemas
export {
  createDocumentSchema,
  editDocumentSchema,
  rejectDocumentSchema,
  transitionDocumentSchema,
} from "./document";
export type {
  CreateDocumentInput,
  EditDocumentInput,
  RejectDocumentInput,
  TransitionDocumentInput,
} from "./document";

// Auth schemas
export { loginSchema } from "./auth";
export type { LoginInput } from "./auth";

// Common schemas
export { uuidSchema, paginationSchema } from "./common";
export type { PaginationInput } from "./common";
