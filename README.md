# ElevateFlow — Controlled Document Approval Workflow Engine

<div align="center">

**Controlled Document Approval. Zero Shortcuts.**

*The enterprise platform that guarantees every document is reviewed, every action is authorized, and every change is permanently recorded — before anything goes public.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44-green.svg)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.1-amber.svg)](https://better-auth.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

## 🌟 Executive Summary

Organizations don't need another generic document editor. They need a system that makes publishing without approval structurally impossible, that makes unauthorized edits blocked at the database level, and that makes every decision fully traceable.

**ElevateFlow** is a workflow engine with a document interface. Built on Next.js 15, PostgreSQL 16, Drizzle ORM, Better Auth, and Tailwind CSS v4, ElevateFlow strictly enforces:
- **Server-Side Authorization Authority**: UI controls are convenience only; every mutation is validated server-side.
- **Strict Document State Machine**: Allowed transitions only (`draft → submitted → approved → published`, `submitted → rejected → draft`, `active → archived`).
- **Transactional Audit Integrity**: Document state updates and audit event log insertions occur in the **same database transaction**.
- **Optimistic Concurrency Control (OCC)**: Version-checked updates prevent stale overwrites (HTTP 409 Conflict).
- **Prohibition of Self-Approval**: Authors are structurally forbidden from approving their own submitted proposals.

---

## 🎭 Seeded User Credentials & Roles

ElevateFlow comes pre-seeded with 4 fixed personas for testing and evaluation. All seeded accounts use the password **`password123`**.

| Name | Role | Email | Action Permissions | Read Scope |
|------|------|-------|-------------------|------------|
| **Alice Author** | `author` | `alice@elevateflow.dev` | Create draft, edit own draft/rejected, submit own for review, reopen own rejected doc | Own documents (any state) + Published library |
| **Bob Reviewer** | `reviewer` | `bob@elevateflow.dev` | Approve submitted (not own), Reject submitted with required comment, Publish approved | Review Queue (`submitted` docs) + Published library |
| **Charlie Admin** | `admin` | `charlie@elevateflow.dev` | Publish approved, Archive any active document, System administration | Full System Overview (all docs & statuses) |
| **Vera Viewer** | `viewer` | `vera@elevateflow.dev` | Read published articles | Published library ONLY |

---

## 🔄 Document State Machine Graph

```
Draft ──→ Submitted ──→ Approved ──→ Published
  ▲           │            │            │
  │           ▼            │            │
  └───── Rejected ─────────┤            │
                           │            │
Draft / Submitted / Approved / Published ──→ Archived (Terminal)
```

### Transition Enforcement Matrix

| From | To | Trigger / Endpoint | Role Required | Invariants Enforced |
|------|----|-------------------|---------------|---------------------|
| `draft` | `submitted` | `POST /api/documents/:id/submit` | `author` | Must own document |
| `submitted` | `approved` | `POST /api/documents/:id/approve` | `reviewer` | `authorId != userId` (No self-approval) |
| `submitted` | `rejected` | `POST /api/documents/:id/reject` | `reviewer` | `authorId != userId`, **Rejection comment required** |
| `rejected` | `draft` | `POST /api/documents/:id/reopen` | `author` | Must own document |
| `approved` | `published` | `POST /api/documents/:id/publish` | `reviewer` / `admin` | Published documents are immutable |
| *Active* | `archived` | `POST /api/documents/:id/archive` | `admin` | Soft delete — terminal state |

---

## 🎨 Design System — Warm Dark Enterprise Canvas

ElevateFlow implements a warm-dark enterprise design system (detailed in [`DESIGN.md`](./DESIGN.md)):
- **Canvas**: `#09090b` warm dark canvas
- **Surface Ladder**: `surface-1` (`#18181b`), `surface-2` (`#1f1f23`), `surface-3` (`#27272a`), `surface-4` (`#2e2e33`)
- **Primary Accent**: Amber (`#f59e0b`) — scarce, reserved for primary CTAs, active nav indicators, and hero glow
- **Typography**: Inter (display + body, 1.55 line-height for readability) + JetBrains Mono (eyebrows, version numbers, timestamps, audit hashes)
- **Document State Palette**:
  - `Draft`: `#94a3b8` / `#1e293b` (slate)
  - `Submitted`: `#3b82f6` / `#1e3a5f` (blue)
  - `Approved`: `#10b981` / `#064e3b` (emerald)
  - `Rejected`: `#f43f5e` / `#4c0519` (rose)
  - `Published`: `#8b5cf6` / `#2e1065` (violet)
  - `Archived`: `#71717a` / `#27272a` (zinc)

---

## 🏗️ Monorepo Architecture

```
.
├── apps/
│   └── web/                   # Next.js 15 App Router Application
│       ├── src/app/           # Auth, Dashboard, and REST API Routes
│       ├── src/components/    # StatusBadge, AuditTimeline, RejectModal, Actions
│       ├── src/lib/           # auth, session, transitions, permissions, workflow-service
│       └── src/__tests__/     # Vitest Unit & Integration Test Suites
├── packages/
│   ├── db/                    # Drizzle ORM Schema, Migrations, Postgres Client, Seed Script
│   ├── types/                 # Shared Domain Types & Error Codes (Zero Dependencies)
│   ├── validators/            # Shared Zod Schemas (create, edit, reject, login)
│   └── ui/                    # Base UI Utilities (cn(), Tailwind tokens)
├── docs/                      # Core System Specifications & Requirements
└── docker-compose.yml         # Local PostgreSQL 16 Service
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites

- **Node.js**: `v22.0.0` or higher
- **pnpm**: `v9.15.0` or higher
- **Docker Desktop**: Running locally (for PostgreSQL 16 container)

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/Purushotham-Prajapati-24/ElevateFlow.git
cd ElevateFlow
pnpm install
```

### Step 2: Configure Environment

Copy `.env.example` to `.env.local` in the root directory:

```bash
cp .env.example .env.local
```

Default local environment variables:

```env
DATABASE_URL=postgresql://elevateflow:elevateflow_dev@localhost:5432/elevateflow
BETTER_AUTH_SECRET=9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Start PostgreSQL Container

```bash
docker-compose up -d
```

### Step 4: Run Migrations & Seed Users & Documents

```bash
pnpm db:migrate
pnpm db:seed
pnpm db:seed:documents
```

### Step 5: Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Testing

ElevateFlow includes automated test suites covering state machine transitions, permission rules, Zod validators, security audit verification, and production build integrity.

```bash
# Run all Vitest unit and integration test suites
pnpm test

# Run full 45-point security & workflow audit test suite
node tests/security-audit.js

# Run strict monorepo TypeScript check across all packages
pnpm typecheck

# Run production Next.js build
pnpm build
```

---

## 📁 Key Documentation References

- [`DESIGN.md`](./DESIGN.md) — **Engineering Design Note (Show Your Thinking)** & Visual Design Tokens Specification
- [`docs/PRD.md`](./docs/PRD.md) — Product Requirements & User Stories
- [`docs/architecture.md`](./docs/architecture.md) — Detailed System Architecture & Trust Boundaries
- [`docs/db.md`](./docs/db.md) — Database Schema & Concurrency Design
- [`docs/Rules.md`](./docs/Rules.md) — Engineering Rules & Invariants Matrix
- [`DESIGN.md`](./DESIGN.md) — Design System Tokens & Component Specifications
- [`AGENTS.md`](./AGENTS.md) — AI SWE Contract Invariants

---

*Built with strict adherence to software engineering correctness. Zero shortcuts.*
