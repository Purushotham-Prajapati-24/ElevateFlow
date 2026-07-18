import { z } from "zod";

/**
 * UUID parameter validation.
 * Used for route params like :id.
 */
export const uuidSchema = z.string().uuid("Invalid ID format");

/**
 * Pagination parameters.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
