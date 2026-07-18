/**
 * ElevateFlow Domain Errors
 *
 * Typed error codes for predictable API responses.
 * Every API error maps to a specific HTTP status code and a domain error code.
 */

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_TRANSITION: "INVALID_TRANSITION",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const HTTP_STATUS: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 400,
  INVALID_TRANSITION: 422,
  INTERNAL_ERROR: 500,
};

export interface ApiError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

/**
 * Standard API response envelope.
 * Success responses carry `data`. Error responses carry `error`.
 */
export type ApiResponse<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: ApiError };
