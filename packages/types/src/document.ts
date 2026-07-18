/**
 * ElevateFlow Document Status — State Machine Values
 *
 * The document lifecycle is a strict state machine.
 * Valid transitions are defined in transitions.ts (Phase 3).
 */
export const DOCUMENT_STATUSES = [
  "draft",
  "submitted",
  "approved",
  "rejected",
  "published",
  "archived",
] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export interface Document {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly status: DocumentStatus;
  readonly authorId: string;
  readonly version: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Document with author information joined.
 * Used in list views and detail pages.
 */
export interface DocumentWithAuthor extends Document {
  readonly author: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
  };
}
