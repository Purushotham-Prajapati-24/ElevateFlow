import type { DocumentStatus } from "@elevateflow/types";

/**
 * Single Source of Truth for Document State Transitions.
 *
 * Allowed lifecycle transitions:
 * draft     → submitted, archived
 * submitted → approved, rejected, archived
 * approved  → published, archived
 * rejected  → draft, archived
 * published → archived
 * archived  → (terminal state — no transitions out)
 *
 * Every other transition is forbidden and rejected with InvalidTransition error.
 */
export const ALLOWED_TRANSITIONS: Record<
  DocumentStatus,
  readonly DocumentStatus[]
> = {
  draft: ["submitted", "archived"],
  submitted: ["approved", "rejected", "archived"],
  approved: ["published", "archived"],
  rejected: ["draft", "archived"],
  published: ["archived"],
  archived: [],
};

/**
 * Check if a state transition from `from` to `to` is valid in the workflow graph.
 */
export function isValidTransition(
  from: DocumentStatus,
  to: DocumentStatus,
): boolean {
  const allowed = ALLOWED_TRANSITIONS[from];
  if (!allowed) return false;
  return allowed.includes(to);
}
