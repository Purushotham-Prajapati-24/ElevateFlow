# ElevateFlow — Controlled Document Approval Workflow Engine

<div align="center">

**Controlled Document Approval. Zero Shortcuts.**

*The enterprise platform that guarantees every document is reviewed, every action is authorized, and every change is permanently recorded — before anything goes public.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black.svg)](https://nextjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-red.svg)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-9.15.0-orange.svg)](https://pnpm.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44-green.svg)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.1-amber.svg)](https://better-auth.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

## 🌟 Executive Summary

Organizations don't need another generic document editor. They need a system that makes publishing without approval structurally impossible, that makes unauthorized edits blocked at the database level, and that makes every decision fully traceable.

**ElevateFlow** is a workflow engine with a document interface. Built on Next.js 15, Turborepo, PostgreSQL 16, Drizzle ORM, Better Auth, and Tailwind CSS v4, ElevateFlow strictly enforces:
- **Server-Side Authorization Authority**: UI controls are convenience only; every mutation is validated server-side.
- **Strict Document State Machine**: Allowed transitions only (`draft → submitted → approved → published`, `submitted → rejected → draft`, `active → archived`).
- **Transactional Audit Integrity**: Document state updates and audit event log insertions occur in the **same database transaction**.
- **Optimistic Concurrency Control (OCC)**: Version-checked updates prevent stale overwrites (HTTP 409 Conflict).
- **Prohibition of Self-Approval**: Authors are structurally forbidden from approving their own submitted proposals.

---

## 🛠️ System Requirements & Prerequisites

Before setting up ElevateFlow locally, ensure your system has the following core tools installed:

| Tool / Dependency | Minimum Version | Installation / Enable Command | Purpose |
|:---|:---|:---|:---|
| **Node.js** | `>= 22.0.0` | [nodejs.org](https://nodejs.org/) or `nvm install 22` | JavaScript runtime environment |
| **pnpm** | `9.15.0` (or `>= 9.0.0`) | `corepack enable` or `npm i -g pnpm` | Monorepo package manager (strictly enforced) |
| **Docker Desktop** | `>= 24.0.0` | [docker.com](https://www.docker.com/products/docker-desktop/) | Manages local PostgreSQL 16 container DB |
| **PostgreSQL** *(Alternative)* | `v16` | `brew install postgresql@16` or [Postgres App](https://postgresapp.com/) | Native DB fallback if Docker is not used |
| **Git** | Any modern version | [git-scm.com](https://git-scm.com/) | Repository version control |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      Browser / Client Interface                          │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ HTTP / JSON Requests
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ Next.js 15 App Router Server (apps/web)                                  │
│                                                                          │
│ ┌───────────────────────┐  ┌─────────────────────┐  ┌──────────────────┐ │
│ │  API & Page Routes    │  │  Better Auth        │  │  Zod Schema      │ │
│ │  /api/documents/*     │  │  lib/session.ts     │  │  Validators      │ │
│ └───────────┬───────────┘  └──────────┬──────────┘  └────────┬─────────┘ │
│             │                         │                      │           │
│             ▼                         ▼                      │           │
│ ┌────────────────────────────────────────────────┐           │           │
│ │  Permission Engine (lib/permissions.ts)        │           │           │
│ └───────────────────────────┬────────────────────┘           │           │
│                             │ Authorize Action               │           │
│                             ▼                                ▼           │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │  Workflow Transaction Service (lib/workflow-service.ts)              │ │
│ └───────────────────────────┬──────────────────────────────────────────┘ │
│                             │ Valid State Transition?                    │
│                             ▼                                            │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │  State Transition Graph (lib/transitions.ts)                         │ │
│ └───────────────────────────┬──────────────────────────────────────────┘ │
└─────────────────────────────┼────────────────────────────────────────────┘
                              │ Atomic Single DB Transaction
                              ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ PostgreSQL 16 Database (packages/db)                                     │
│                                                                          │
│  ┌──────────────────────────────┐       ┌─────────────────────────────┐  │
│  │  documents Table             │       │  audit_events Table         │  │
│  │  (version INT, constraints)  │       │  (immutable history logs)   │  │
│  └──────────────────────────────┘       └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

```mermaid
flowchart TD
    Client["Browser / Client Interface"]

    subgraph AppServer ["Next.js 15 App Router Server (apps/web)"]
        Routes["API & Page Routes<br/>/api/documents/*"]
        AuthModule["Better Auth Session Validation<br/>lib/session.ts"]
        PermEngine["Permission Engine<br/>lib/permissions.ts"]
        StateMachine["State Transition Graph<br/>lib/transitions.ts"]
        WorkflowSvc["Workflow Transaction Service<br/>lib/workflow-service.ts"]
        ZodVal["Zod Schema Validator<br/>packages/validators"]
    end

    subgraph DataLayer ["Monorepo Shared Packages"]
        Drizzle["Drizzle ORM<br/>packages/db"]
        Types["Domain Types<br/>packages/types"]
    end

    subgraph DB ["PostgreSQL 16 Database"]
        DocsTable[("documents Table<br/>version INT, check constraints")]
        AuditTable[("audit_events Table<br/>immutable history")]
        UsersTable[("users / sessions Tables")]
    end

    Client -->|"HTTP / JSON Requests"| Routes
    Routes --> AuthModule
    AuthModule -->|"User Session & Role"| PermEngine
    Routes --> ZodVal
    ZodVal -->|"Validated Input"| WorkflowSvc
    PermEngine -->|"Can Execute Action?"| WorkflowSvc
    WorkflowSvc --> StateMachine
    StateMachine -->|"Valid Transition?"| WorkflowSvc
    WorkflowSvc -->|"Atomic Transaction"| Drizzle
    Drizzle -->|"WHERE version = expectedVersion"| DocsTable
    Drizzle -->|"Insert Audit Log"| AuditTable
```

---

## 🔄 Document State Machine Graph

*Filled node is public. Dashed node is terminal. Any move that is not an arrow here is an invalid transition the server must reject.*  
*Admin can archive from draft, submitted, approved or published.*

```mermaid
flowchart LR
    draft["draft"]
    submitted["submitted"]
    rejected["rejected"]
    approved["approved"]
    published[/"PUBLISHED (public)"/]
    archived[("archived (terminal)")]

    draft -->|"submit"| submitted
    submitted -->|"approve"| approved
    submitted -->|"reject (comment)"| rejected
    rejected -->|"reopen"| draft
    approved -->|"publish"| published

    draft -.-|"archive"| archived
    submitted -.-|"archive"| archived
    approved -.-|"archive"| archived
    published -.-|"archive"| archived

    classDef publicNode fill:#000,stroke:#333,color:#fff,stroke-width:2px;
    classDef terminalNode fill:none,stroke:#888,stroke-dasharray: 5 5,color:#aaa;
    class published publicNode;
    class archived terminalNode;
```

```
                                      ┌──────────────────────┐
            . - - - - - - - - - - - - │  archived (terminal) │< - - - - - - - .
           .                          └──────────▲───────────┘                .
          .                                      │ archive                     .
    ┌──────────┐   submit    ┌──────────────┐  approve  ┌──────────┐  publish  ┌───────────┐
    │  draft   │ ──────────► │  submitted   │ ────────► │ approved │ ────────► │ PUBLISHED │
    └────▲─────┘             └──────┬───────┘           └──────────┘           └───────────┘
         │                          │ reject                                    (public)
         │ reopen                   │ (comment)
         │                          ▼
         └──────────────────── ┌──────────┐
                               │ rejected │
                               └──────────┘

 Legend:
  ● PUBLISHED = Public (viewers can see)
  ● archived  = Terminal state (dashed)
  ● ────────► = Valid state transition
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

## 🎭 Seeded User Credentials & Roles

ElevateFlow comes pre-seeded with 4 fixed personas for testing and evaluation. All seeded accounts use the password **`password123`**.

| Name | Role | Email | Action Permissions | Read Scope |
|------|------|-------|-------------------|------------|
| **Alice Author** | `author` | `alice@elevateflow.dev` | Create draft, edit own draft/rejected, submit own for review, reopen own rejected doc | Own documents (any state) + Published library |
| **Bob Reviewer** | `reviewer` | `bob@elevateflow.dev` | Approve submitted (not own), Reject submitted with required comment, Publish approved | Review Queue (`submitted` docs) + Published library |
| **Charlie Admin** | `admin` | `charlie@elevateflow.dev` | Publish approved, Archive any active document, System administration | Full System Overview (all docs & statuses) |
| **Vera Viewer** | `viewer` | `vera@elevateflow.dev` | Read published articles | Published library ONLY |

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

## 📁 Monorepo Workspace Structure

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

## 🚀 Quickstart & Complete Setup Guide (Zero to Running)

Follow these step-by-step instructions to get ElevateFlow running locally from a clean machine environment.

### Step 1: Install Core Tooling (If Not Already Installed)

1. **Install Node.js (v22+)**:
   ```bash
   # Verify Node.js version
   node -v   # Should output v22.0.0 or higher
   ```
2. **Enable or Install pnpm**:
   ```bash
   corepack enable
   # Or install via npm:
   npm install -g pnpm@9.15.0
   ```

---

### Step 2: Clone Repository & Install Monorepo Dependencies

```bash
git clone https://github.com/Purushotham-Prajapati-24/ElevateFlow.git
cd ElevateFlow

# Install all monorepo dependencies across apps and packages
pnpm install
```

---

### Step 3: Configure Environment Variables

Copy the provided environment template `.env.example` to `.env.local`:

- **Linux / macOS**:
  ```bash
  cp .env.example .env.local
  ```
- **Windows (Command Prompt / PowerShell)**:
  ```powershell
  copy .env.example .env.local
  ```

Default local `.env.local` contents:
```env
DATABASE_URL=postgresql://elevateflow:elevateflow_dev@localhost:5432/elevateflow
BETTER_AUTH_SECRET=9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

### Step 4: Start Local PostgreSQL Database

#### Option A: Using Docker Desktop (Recommended)

Ensure Docker Desktop is running, then launch the PostgreSQL 16 container:
```bash
docker-compose up -d
```

#### Option B: Using Native Local PostgreSQL (Without Docker)

If you prefer running local PostgreSQL without Docker:
1. Ensure PostgreSQL 16 is running on `localhost:5432`.
2. Create database and user:
   ```sql
   CREATE USER elevateflow WITH PASSWORD 'elevateflow_dev';
   CREATE DATABASE elevateflow OWNER elevateflow;
   GRANT ALL PRIVILEGES ON DATABASE elevateflow TO elevateflow;
   ```

---

### Step 5: Execute Database Migrations & Seed Data

Run the database setup pipeline to apply PostgreSQL schemas, create all tables, seed persona accounts, and populate test documents:

```bash
# 1. Apply Drizzle database migrations
pnpm db:migrate

# 2. Seed 4 persona users (Alice, Bob, Charlie, Vera)
pnpm db:seed

# 3. Seed initial workflow documents across all state machine phases
pnpm db:seed:documents
```

---

### Step 6: Launch Development Application Server

Start the Turborepo development server:

```bash
pnpm dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

- Select any persona on the login page (password: `password123`) to explore authoring, review queues, document approval, and audit trails!

---

## 🧪 Verification & Automated Testing

ElevateFlow includes 100% passing test suites covering permissions, state machine invariants, schema validators, security controls, and TypeScript compilation.

```bash
# 1. Run unit & integration test suites (Vitest)
pnpm test

# 2. Run 45-point comprehensive security & workflow audit suite
node tests/security-audit.js

# 3. Run strict monorepo TypeScript verification across all 5 packages
pnpm typecheck

# 4. Verify Next.js production build bundle
pnpm build
```

---

## 📁 Key Documentation References

- [`DESIGN.md`](./DESIGN.md) — **Engineering Design Note (Show Your Thinking)** 
