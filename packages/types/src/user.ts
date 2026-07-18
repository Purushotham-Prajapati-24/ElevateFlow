/**
 * ElevateFlow User Roles
 *
 * Fixed set of roles — no dynamic role creation.
 * Roles are seeded in the database and never modified at runtime.
 */
export const USER_ROLES = [
  "viewer",
  "author",
  "reviewer",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly version: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
