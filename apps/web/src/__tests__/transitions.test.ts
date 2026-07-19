import { describe, it, expect } from "vitest";
import { isValidTransition } from "../lib/transitions";
import type { DocumentStatus } from "@elevateflow/types";

describe("Workflow State Machine (transitions.ts)", () => {
  it("allows valid state transitions", () => {
    // Draft transitions
    expect(isValidTransition("draft", "submitted")).toBe(true);
    expect(isValidTransition("draft", "archived")).toBe(true);

    // Submitted transitions
    expect(isValidTransition("submitted", "approved")).toBe(true);
    expect(isValidTransition("submitted", "rejected")).toBe(true);
    expect(isValidTransition("submitted", "archived")).toBe(true);

    // Approved transitions
    expect(isValidTransition("approved", "published")).toBe(true);
    expect(isValidTransition("approved", "archived")).toBe(true);

    // Rejected transitions
    expect(isValidTransition("rejected", "draft")).toBe(true);
    expect(isValidTransition("rejected", "archived")).toBe(true);

    // Published transitions
    expect(isValidTransition("published", "archived")).toBe(true);
  });

  it("rejects invalid state transitions", () => {
    // Cannot skip states
    expect(isValidTransition("draft", "published")).toBe(false);
    expect(isValidTransition("draft", "approved")).toBe(false);
    expect(isValidTransition("draft", "rejected")).toBe(false);

    // Cannot revert directly without rejection
    expect(isValidTransition("submitted", "draft")).toBe(false);
    expect(isValidTransition("submitted", "published")).toBe(false);

    // Cannot edit/revert approved docs back to draft directly
    expect(isValidTransition("approved", "draft")).toBe(false);
    expect(isValidTransition("approved", "submitted")).toBe(false);

    // Cannot edit published documents (Published docs are immutable)
    expect(isValidTransition("published", "draft")).toBe(false);
    expect(isValidTransition("published", "submitted")).toBe(false);
    expect(isValidTransition("published", "approved")).toBe(false);

    // Archived is a terminal state
    const allStatuses: DocumentStatus[] = [
      "draft",
      "submitted",
      "approved",
      "rejected",
      "published",
      "archived",
    ];

    for (const status of allStatuses) {
      expect(isValidTransition("archived", status)).toBe(false);
    }
  });
});
