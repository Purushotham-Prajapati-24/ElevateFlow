import { z } from "zod";

/**
 * Create a new document (draft).
 * Both title and body are required and cannot be empty.
 */
export const createDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title cannot exceed 500 characters")
    .trim(),
  body: z
    .string()
    .min(1, "Body is required")
    .max(50000, "Body cannot exceed 50,000 characters")
    .trim(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

/**
 * Edit an existing document (draft or rejected, own only).
 * Requires version for optimistic concurrency.
 */
export const editDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title cannot exceed 500 characters")
    .trim(),
  body: z
    .string()
    .min(1, "Body is required")
    .max(50000, "Body cannot exceed 50,000 characters")
    .trim(),
  version: z.number().int().positive("Version must be a positive integer"),
});

export type EditDocumentInput = z.infer<typeof editDocumentSchema>;

/**
 * Reject a submitted document.
 * Comment is mandatory — rejection without explanation is forbidden.
 */
export const rejectDocumentSchema = z.object({
  comment: z
    .string()
    .min(1, "Rejection comment is required")
    .max(2000, "Comment cannot exceed 2,000 characters")
    .trim(),
  version: z.number().int().positive("Version must be a positive integer"),
});

export type RejectDocumentInput = z.infer<typeof rejectDocumentSchema>;

/**
 * Generic transition schema.
 * Used for submit, approve, publish, archive — actions that don't require additional input.
 */
export const transitionDocumentSchema = z.object({
  version: z.number().int().positive("Version must be a positive integer"),
});

export type TransitionDocumentInput = z.infer<
  typeof transitionDocumentSchema
>;
