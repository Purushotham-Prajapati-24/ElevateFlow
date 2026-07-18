import { describe, it, expect } from "vitest";
import {
  canEdit,
  canSubmit,
  canApprove,
  canReject,
  canReopen,
  canPublish,
  canArchive,
} from "../lib/permissions";
import type { CurrentUser } from "../lib/session";
import type { Document } from "@elevateflow/types";

describe("Centralized Permission Engine (permissions.ts)", () => {
  const aliceAuthor: CurrentUser = {
    id: "user-alice",
    email: "alice@elevateflow.dev",
    name: "Alice",
    role: "author",
    version: 1,
  };

  const bobReviewer: CurrentUser = {
    id: "user-bob",
    email: "bob@elevateflow.dev",
    name: "Bob",
    role: "reviewer",
    version: 1,
  };

  const charlieAdmin: CurrentUser = {
    id: "user-charlie",
    email: "charlie@elevateflow.dev",
    name: "Charlie",
    role: "admin",
    version: 1,
  };

  const veraViewer: CurrentUser = {
    id: "user-vera",
    email: "vera@elevateflow.dev",
    name: "Vera",
    role: "viewer",
    version: 1,
  };

  const draftDoc: Document = {
    id: "doc-1",
    title: "Draft Proposal",
    body: "Content",
    status: "draft",
    authorId: "user-alice",
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const submittedDoc: Document = {
    ...draftDoc,
    status: "submitted",
  };

  const rejectedDoc: Document = {
    ...draftDoc,
    status: "rejected",
  };

  const approvedDoc: Document = {
    ...draftDoc,
    status: "approved",
  };

  const publishedDoc: Document = {
    ...draftDoc,
    status: "published",
  };

  describe("canEdit", () => {
    it("allows author to edit own draft or rejected document", () => {
      expect(canEdit(aliceAuthor, draftDoc)).toBe(true);
      expect(canEdit(aliceAuthor, rejectedDoc)).toBe(true);
    });

    it("prevents author from editing another author's document", () => {
      const otherDoc = { ...draftDoc, authorId: "user-other" };
      expect(canEdit(aliceAuthor, otherDoc)).toBe(false);
    });

    it("prevents editing submitted or published documents", () => {
      expect(canEdit(aliceAuthor, submittedDoc)).toBe(false);
      expect(canEdit(aliceAuthor, publishedDoc)).toBe(false);
    });

    it("prevents non-authors (reviewers, viewers) from editing", () => {
      expect(canEdit(bobReviewer, draftDoc)).toBe(false);
      expect(canEdit(veraViewer, draftDoc)).toBe(false);
    });
  });

  describe("canApprove (AGENTS.md Invariant: Author cannot approve own document)", () => {
    it("allows reviewer to approve submitted document from another author", () => {
      expect(canApprove(bobReviewer, submittedDoc)).toBe(true);
    });

    it("STRICT INVARIANT: prevents author from approving own document even if role matches", () => {
      const selfReviewer: CurrentUser = {
        ...bobReviewer,
        id: "user-alice", // Same ID as doc author
      };
      expect(canApprove(selfReviewer, submittedDoc)).toBe(false);
    });

    it("prevents approving non-submitted documents", () => {
      expect(canApprove(bobReviewer, draftDoc)).toBe(false);
      expect(canApprove(bobReviewer, approvedDoc)).toBe(false);
    });
  });

  describe("canReject", () => {
    it("allows reviewer to reject submitted document from another author", () => {
      expect(canReject(bobReviewer, submittedDoc)).toBe(true);
    });

    it("prevents author from rejecting own document", () => {
      const selfReviewer: CurrentUser = {
        ...bobReviewer,
        id: "user-alice",
      };
      expect(canReject(selfReviewer, submittedDoc)).toBe(false);
    });
  });

  describe("canPublish", () => {
    it("allows reviewer or admin to publish approved document", () => {
      expect(canPublish(bobReviewer, approvedDoc)).toBe(true);
      expect(canPublish(charlieAdmin, approvedDoc)).toBe(true);
    });

    it("prevents publishing non-approved documents", () => {
      expect(canPublish(bobReviewer, draftDoc)).toBe(false);
      expect(canPublish(bobReviewer, submittedDoc)).toBe(false);
    });
  });

  describe("canArchive", () => {
    it("allows admin to archive any active document", () => {
      expect(canArchive(charlieAdmin, draftDoc)).toBe(true);
      expect(canArchive(charlieAdmin, submittedDoc)).toBe(true);
      expect(canArchive(charlieAdmin, publishedDoc)).toBe(true);
    });

    it("prevents non-admins from archiving", () => {
      expect(canArchive(aliceAuthor, draftDoc)).toBe(false);
      expect(canArchive(bobReviewer, draftDoc)).toBe(false);
    });
  });
});
