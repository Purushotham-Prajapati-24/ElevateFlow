import { headers } from "next/headers";
import { auth } from "./auth";
import type { UserRole } from "@elevateflow/types";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  version: number;
}

/**
 * Get current authenticated user from session headers.
 * Safe for use in API Route Handlers and Server Components.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    const user = session.user as Record<string, unknown>;

    return {
      id: user.id as string,
      email: user.email as string,
      name: user.name as string,
      role: (user.role as UserRole) || "viewer",
      version: typeof user.version === "number" ? user.version : 1,
    };
  } catch (error) {
    console.error("Error retrieving current user session:", error);
    return null;
  }
}
