
# ElevateFlow — Engineering Design Note

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

