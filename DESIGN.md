---
version: 1.0.0
name: ElevateFlow Design System
description: "A dark-canvas enterprise workflow system drawing typographic and chromatic DNA from Framer and Linear.app. Features a cool charcoal canvas (#08090a), a 5-step surface ladder, a refined golden-amber accent (#e5a100) reserved strictly for key CTAs and focus states, Geist Sans display typography with negative tracking, Geist Mono tracked eyebrows for system taxonomy, and a dedicated document-state semantic color system."

colors:
  # ── Brand & Accent ──
  primary: "#e5a100"
  primary-hover: "#f0b429"
  primary-muted: "#7a5600"
  on-primary: "#08090a"

  # ── Ink (Text) ──
  ink: "#fafafa"
  ink-muted: "#a1a1aa"
  ink-subtle: "#6b6b76"
  ink-disabled: "#4a4a52"

  # ── Canvas & Surface Ladder ──
  canvas: "#08090a"
  surface-1: "#141517"
  surface-2: "#1b1c1f"
  surface-3: "#232428"
  surface-4: "#2b2c31"
  surface-5: "#33343a"

  # ── Borders & Focus ──
  hairline: "#232428"
  hairline-strong: "#3a3b41"
  hairline-focus: "#e5a100"

  # ── Document State Semantic Palette ──
  state-draft: "#94a3b8"
  state-draft-bg: "#1a2332"
  state-submitted: "#3b82f6"
  state-submitted-bg: "#172554"
  state-approved: "#10b981"
  state-approved-bg: "#052e1c"
  state-rejected: "#f43f5e"
  state-rejected-bg: "#3f0516"
  state-published: "#8b5cf6"
  state-published-bg: "#1e0a4a"
  state-archived: "#6b6b76"
  state-archived-bg: "#232428"

  # ── System Semantic ──
  error: "#ef4444"
  error-bg: "#3b0c0c"
  success: "#10b981"
  success-bg: "#052e1c"

typography:
  display-hero:
    fontFamily: Geist, Inter, system-ui, sans-serif
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -2.5px
  display-md:
    fontFamily: Geist, Inter, system-ui, sans-serif
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.5px
  headline:
    fontFamily: Geist, Inter, system-ui, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.3px
  body:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  body-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  eyebrow:
    fontFamily: Geist Mono, monospace
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.30
    letterSpacing: 0.8px

rounded:
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  pill: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  card-document:
    backgroundColor: "{colors.surface-1}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 20px
  badge-state:
    rounded: "{rounded.pill}"
    padding: 2px 8px
---

# ElevateFlow — Engineering Design Note

> **Show Your Thinking**: System Invariants, Permission Architecture, Optimistic Concurrency, and Production Considerations.

---

### 1. What are the most important invariants in your system?

1. **Server-Side Authorization Authority**: Permissions are strictly enforced on the server. UI element hiding is a visual convenience only; all API mutations validate authentication, user role, document ownership, and status.
2. **Deterministic State Machine**: Documents only move along valid transition paths (`draft → submitted → approved → published`, `submitted → rejected → draft`, `active → archived`). Invalid state jumps are rejected with explicit `INVALID_TRANSITION` domain errors.
3. **Prohibition of Self-Approval**: Authors are structurally forbidden from approving or rejecting their own submitted documents (`authorId !== userId`), preventing conflicts of interest.
4. **Rejection Comment Mandatory**: Rejecting a submitted document requires a non-empty, non-whitespace comment.
5. **Transactional Audit Consistency**: Every state mutation and its corresponding `audit_event` log insertion occur in the **same database transaction**.
6. **Optimistic Concurrency Control (OCC)**: Every mutation checks `WHERE id = :id AND version = :expectedVersion` and increments `version`. Stale writes are rejected with `HTTP 409 Conflict`.
7. **Immutability of Published Documents**: Published documents cannot be directly edited.
8. **Ownership Immutability**: The `authorId` assigned at creation never changes.

---

### 2. Which invariants are enforced by the database, and which by application code?

- **Enforced by Database**:
  - **Foreign Key Constraints**: `author_id` references `users.id`; `document_id` and `actor_id` in `audit_event` reference `documents.id` and `users.id`.
  - **Non-Empty Text Constraints**: PostgreSQL `CHECK` constraints (`length(title) > 0`, `length(body) > 0`).
  - **Enum Type Constraints**: Native PostgreSQL `pgEnum` for `document_status`, `user_role`, `audit_action`.
  - **NOT NULL & Default Values**: Required columns and defaults (`version = 1`, `status = 'draft'`).
  - **Atomic Version Check**: `WHERE id = :id AND version = :expectedVersion` executed directly in the database UPDATE query.

- **Enforced by Application Code**:
  - **State Transition Graph**: Evaluated in `isValidTransition(currentStatus, targetStatus)` in `transitions.ts`.
  - **Role & Ownership Permissions**: Centralized permission engine (`canApprove`, `canReject`, `canEdit`, `canSubmit`) in `permissions.ts`.
  - **Zod Schema Parsing**: Pre-database validation and sanitization of input payloads.
  - **Audit Event Payload Construction**: Assembling `prevStatus`, `newStatus`, `action`, `actorId`, and `comment` prior to transactional execution.

---

### 3. How do permissions work?

ElevateFlow uses a **centralized permission engine** ([`apps/web/src/lib/permissions.ts`](file:///d:/College%20Projects/ElevateBox/apps/web/src/lib/permissions.ts)). 

Every mutation endpoint passes the authenticated user and document entity to strict boolean predicate functions:
- `canEdit(user, doc)`: `role === 'author' && authorId === user.id && (status === 'draft' || status === 'rejected')`
- `canSubmit(user, doc)`: `role === 'author' && authorId === user.id && status === 'draft'`
- `canApprove(user, doc)`: `role === 'reviewer' && authorId !== user.id && status === 'submitted'` *(Self-approval guard)*
- `canReject(user, doc)`: `role === 'reviewer' && authorId !== user.id && status === 'submitted'`
- `canPublish(user, doc)`: `(role === 'reviewer' || role === 'admin') && status === 'approved'`
- `canArchive(user, doc)`: `role === 'admin' && status !== 'archived'`

Permission checks are executed on the server before starting database transactions or state transitions.

---

### 4. How do you prevent stale or conflicting updates?

ElevateFlow uses **Optimistic Concurrency Control (OCC)** via an integer `version` column:
1. Every write payload (`PATCH /api/documents/:id`, `POST /api/documents/:id/*`) must supply the client's `version`.
2. The database update queries specifically for both the document ID and the version:
   ```typescript
   const [updated] = await tx
     .update(documents)
     .set({ ...changes, version: sql`${documents.version} + 1` })
     .where(and(eq(documents.id, id), eq(documents.version, expectedVersion)))
     .returning();
   ```
3. If zero rows are returned (meaning another session modified the document and incremented the version), the server throws `VERSION_MISMATCH` and returns **`HTTP 409 Conflict`**.
4. The UI captures the 409 status and prompts the user to refresh the page to view the latest state.

---

### 5. How do you keep audit events consistent with document state changes?

Audit log consistency is achieved via **database transactions**:
- The document state update and the `auditEvents` insertion are executed together inside a single `db.transaction(async (tx) => { ... })` block in `workflow-service.ts`.
- If the document update fails (e.g. OCC version mismatch or constraint violation), the transaction aborts and no audit event is written.
- If the audit event write fails, the entire transaction rolls back, reverting the document state.
- This guarantees 1:1 atomicity: **No un-audited state changes can ever exist.**

---

### 6. What failure cases did you consider?

1. **Concurrent Mutations**: Two reviewers or an author and reviewer acting simultaneously (handled via OCC `409 Conflict`).
2. **Self-Approval Exploits**: Authors with reviewer privileges attempting to approve their own documents (blocked by `canApprove` ownership check).
3. **Unauthorized Visibility / Draft Leaks**: Non-authors or viewers attempting to access private drafts (enforced via role-scoped SQL filters in `GET /api/documents`).
4. **Empty Rejections**: Reviewers rejecting documents without explanatory context (rejected by Zod `rejectDocumentSchema`).
5. **Partial Execution / Server Crashes**: Power loss or crash during state updates (prevented by atomic database transactions).
6. **Malicious / Injection Input**: Malicious strings tested via `tests/security-audit.js` — stored safely as literal parameterized values.

---

### 7. What would you improve with more time?

1. **New Draft Revisions**: Implement a "create new draft from published version" flow (`parentDocumentId`) to allow iterating on published content without mutating history.
2. **Real-time SSE / WebSockets**: Push document state changes in real-time to active sessions to minimize 409 conflicts during concurrent reviews.
3. **Visual Diff History**: Highlight inline text additions and deletions between versions in the audit timeline component.
4. **Delegated Review Queues**: Support team/department-scoped reviewer assignments rather than global reviewer access.

---

### 8. What would need to change for a real production system?

1. **Enterprise Identity & Auth**: Replace basic session cookies with OAuth 2.0 / OIDC (Okta, Auth0, WorkOS) with mandatory MFA.
2. **Database Read Replicas & Connection Pooling**: Implement PgBouncer connection pooling and dedicated read replicas for querying published documents.
3. **API Rate Limiting & Gateway**: Redis-backed token bucket rate limiting to prevent brute force or denial of service attacks.
4. **Immutable Audit Storage**: Stream audit events to append-only WORM storage (such as AWS S3 Object Lock) for legal compliance.

---

### 9. Technical Learning Outside Web Stack (Systems & Infrastructure)

Working with **Rust** and low-level Linux systems programming taught me to prioritize **explicit state representation** and **compile-time invariant guarantees**:
- **Ownership & Borrow Checker**: Rust's model shift from runtime defensive checks to explicit ownership structures influenced how permissions and data flow are modeled in this engine — making illegal states unrepresentable.
- **Explicit Error Enums (`Result<T, E>`)**: Rust's handling of failures inspired the typed domain error system in ElevateFlow (`INVALID_TRANSITION`, `CONFLICT`, `FORBIDDEN`), ensuring no generic unhandled errors leak to the user.

---

# ElevateFlow — Design System Specification

## Overview

ElevateFlow's visual language is built for precision-demanding reviewer tools. It unifies three distinct design influences into a cohesive, non-generic dark interface:

1. **Framer Influence**: Aggressive display tracking, geometric sans display typography, tight line heights, pill-shaped hero CTAs, and a single atmospheric radial glow.
2. **Linear.app Influence**: Deep charcoal canvas (`#08090a`), a 5-step surface elevation ladder (`surface-1` through `surface-5`), hairline borders carrying all card elevation (no drop shadows), dense 8px button padding, and product-UI-first marketing layout.
3. **xAI Influence**: Geist Mono uppercase tracked eyebrows for section headers, table column titles, and metadata tags, creating an engineered "code comment" aesthetic.

---

## Color System

### Canvas & Surface Ladder
- **Canvas** (`#08090a`): Near-black with a subtle cool tint.
- **Surface 1** (`#141517`): Card backgrounds, document containers.
- **Surface 2** (`#1b1c1f`): Hovered cards, table headers, form inputs.
- **Surface 3** (`#232428`): Active navigation items, secondary action buttons.
- **Surface 4** (`#2b2c31`): Tooltips, dropdown menus.
- **Surface 5** (`#33343a`): High-contrast lifted controls.

### Accent & Ink
- **Primary Amber** (`#e5a100`): Used strictly for primary CTAs, active route indicators, and focus rings.
- **Ink** (`#fafafa`): High-emphasis text and titles.
- **Ink Muted** (`#a1a1aa`): Secondary descriptions and content body.
- **Ink Subtle** (`#6b6b76`): Metadata, timestamps, inactive icons.

### Document State Semantic Palette
- **Draft**: Slate (`#94a3b8` / bg: `#1a2332`)
- **Submitted**: Blue (`#3b82f6` / bg: `#172554`)
- **Approved**: Emerald (`#10b981` / bg: `#052e1c`)
- **Rejected**: Rose (`#f43f5e` / bg: `#3f0516`)
- **Published**: Violet (`#8b5cf6` / bg: `#1e0a4a`)
- **Archived**: Zinc (`#6b6b76` / bg: `#232428`)

---

## Typography System

- **Display**: **Geist Sans** (400–700 weight). Used for page titles and hero headlines with negative tracking (-2.5px to -0.5px).
- **Body**: **Inter** (400–500 weight) with geometric OpenType features (`cv01`, `cv11`, `ss03`) enabled. Line height set to 1.65 for maximum long-form document readability.
- **Eyebrow & Metadata**: **Geist Mono** (400 weight) in uppercase with +0.8px tracking for section tags, timestamps, version labels, and table headers.

---

## Component Language

- **Cards**: `surface-1` background, `hairline` 1px border, 10px rounded corners, top-edge linear highlight gradient.
- **Buttons**: 8px rounded corners, 8px 16px compact padding. No pill buttons inside dashboard; pills reserved for landing page hero CTAs and status badges.
- **Status Badges**: Pill shape (`9999px`), 2px 8px padding, 10px Geist Mono text with state-color dot indicator.
- **Tables**: `surface-2` header background with Geist Mono uppercase tracked titles; `surface-1` rows with hover transition to `surface-2`.

---

## Principles & Guardrails

- **Do**: Reserve amber `#e5a100` for high-intent primary actions and focus states.
- **Do**: Use hairline borders and surface ladder steps for visual depth instead of drop shadows.
- **Don't**: Use emoji for dashboard icons — use Lucide icons with consistent stroke weight.
- **Don't**: Put mono typography on body text — keep mono strictly for eyebrows, metadata, and code.
- **Don't**: Add a light mode — ElevateFlow is strictly a dark-canvas engine.
