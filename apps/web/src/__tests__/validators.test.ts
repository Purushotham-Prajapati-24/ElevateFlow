import { describe, it, expect } from "vitest";
import {
  createDocumentSchema,
  editDocumentSchema,
  rejectDocumentSchema,
  loginSchema,
} from "@elevateflow/validators";

describe("Zod Validation Schemas (@elevateflow/validators)", () => {
  describe("createDocumentSchema", () => {
    it("accepts valid title and body", () => {
      const result = createDocumentSchema.safeParse({
        title: "Valid Title",
        body: "Valid content body",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty title or whitespace-only title", () => {
      const result = createDocumentSchema.safeParse({
        title: "   ",
        body: "Valid body",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty body", () => {
      const result = createDocumentSchema.safeParse({
        title: "Valid Title",
        body: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("rejectDocumentSchema", () => {
    it("accepts non-empty comment and valid version", () => {
      const result = rejectDocumentSchema.safeParse({
        comment: "Needs citations section",
        version: 1,
      });
      expect(result.success).toBe(true);
    });

    it("STRICT INVARIANT: rejects rejection request without a comment", () => {
      const result = rejectDocumentSchema.safeParse({
        comment: "",
        version: 1,
      });
      expect(result.success).toBe(false);
    });

    it("rejects rejection request without version for OCC", () => {
      const result = rejectDocumentSchema.safeParse({
        comment: "Comment",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("editDocumentSchema", () => {
    it("requires version for OCC validation", () => {
      const valid = editDocumentSchema.safeParse({
        title: "New Title",
        body: "New Body",
        version: 2,
      });
      expect(valid.success).toBe(true);

      const invalid = editDocumentSchema.safeParse({
        title: "New Title",
        body: "New Body",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "alice@elevateflow.dev",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects malformed email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });
});
