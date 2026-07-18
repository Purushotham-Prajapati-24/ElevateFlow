import type { CurrentUser } from "./session";
import type { Document } from "@elevateflow/types";

/**
 * ElevateFlow Centralized Permission Engine.
 *
 * All permission checks live in this module.
 * AGENTS.md Mandate: "Permission logic belongs in one place. Never duplicate permission checks."
 */

export function canEdit(user: CurrentUser, doc: Document): boolean {
  if (user.role !== "author") return false;
  if (doc.authorId !== user.id) return false;
  return doc.status === "draft" || doc.status === "rejected";
}

export function canSubmit(user: CurrentUser, doc: Document): boolean {
  if (user.role !== "author") return false;
  if (doc.authorId !== user.id) return false;
  return doc.status === "draft";
}

export function canApprove(user: CurrentUser, doc: Document): boolean {
  if (user.role !== "reviewer") return false;
  // Rule: Authors cannot approve their own documents
  if (doc.authorId === user.id) return false;
  return doc.status === "submitted";
}

export function canReject(user: CurrentUser, doc: Document): boolean {
  if (user.role !== "reviewer") return false;
  // Rule: Authors cannot reject their own documents
  if (doc.authorId === user.id) return false;
  return doc.status === "submitted";
}

export function canReopen(user: CurrentUser, doc: Document): boolean {
  if (user.role !== "author") return false;
  if (doc.authorId !== user.id) return false;
  return doc.status === "rejected";
}

export function canPublish(user: CurrentUser, doc: Document): boolean {
  if (user.role !== "reviewer" && user.role !== "admin") return false;
  return doc.status === "approved";
}

export function canArchive(user: CurrentUser, doc: Document): boolean {
  if (user.role !== "admin") return false;
  return doc.status !== "archived";
}
