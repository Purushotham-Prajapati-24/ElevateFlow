# agents.md

# ElevateBox SWE Challenge
## AI Engineering Contract

This document defines the engineering rules every AI agent must follow while contributing to this repository.

These instructions are **mandatory**.

If a generated implementation violates any invariant in this file, it must be considered incorrect even if it compiles.

---

# Primary Goal

Build a correct workflow engine, not a CRUD application.

The system exists to guarantee:

- Correct document lifecycle
- Strong authorization
- Transactional consistency
- Complete audit history
- Optimistic concurrency
- Database as source of truth

The UI is secondary.

---

# Engineering Principles

Always optimize for:

1. Correctness
2. Simplicity
3. Type Safety
4. Maintainability
5. Predictability
6. Explicitness

Never optimize for:

- clever abstractions
- unnecessary generic code
- overengineering
- magic
- premature optimization

---

# Core Invariants

These invariants must NEVER be broken.

## Authentication

Private endpoints always require authentication.

No client-side validation may replace server-side authentication.

---

## Authorization

Permissions are enforced ONLY on the server.

UI permissions are convenience only.

Never trust:

- buttons
- forms
- hidden routes
- frontend state

Always validate:

- current user
- role
- ownership
- document state

before every mutation.

---

## State Machine

The document state machine is the source of truth.

Allowed transitions only:

Draft
→ Submitted

Submitted
→ Approved

Submitted
→ Rejected

Rejected
→ Draft

Approved
→ Published

Draft
Submitted
Approved
Published
→ Archived

Everything else is invalid.

Reject invalid transitions with an explicit error.

Never silently ignore them.

---

## State Validation

Mutations must always validate:

Current State

Role

Ownership

Version

before writing.

---

## Audit Consistency

Every state-changing action MUST create exactly one audit event.

The audit event and state update must occur inside the SAME database transaction.

Never:

Update document

then

Insert audit

Those are one atomic operation.

---

## Optimistic Concurrency

Every mutable entity contains:

version INT NOT NULL

Every mutation must:

1. Read current version

2. Compare expected version

3. Reject stale writes

4. Increment version

Never overwrite newer data.

Return HTTP 409 Conflict.

---

## Ownership

Authors own documents.

Ownership never changes.

Authors may only edit:

Draft

Rejected

that belong to themselves.

---

## Published Documents

Published documents are immutable.

Never edit published content.

If editing is required in the future, create a new draft revision.

Never mutate history.

---

## Archive

Archive is soft delete.

Archived documents:

cannot be edited

cannot be published

cannot re-enter workflow

unless an explicit restore feature is added.

---

# Data Model Rules

Every table has:

Primary Key

CreatedAt

UpdatedAt

Version

Never store derived state.

Use normalization.

Avoid duplicated information.

---

## Suggested Entities

User

Document

AuditEvent

Session

Nothing else unless justified.

---

# API Rules

Mutations are commands.

Reads are queries.

Never mix responsibilities.

Examples:

POST /documents

PATCH /documents/:id

POST /documents/:id/submit

POST /documents/:id/approve

POST /documents/:id/reject

POST /documents/:id/publish

POST /documents/:id/archive

Each endpoint performs exactly one business action.

---

# Validation

Validate on server using Zod.

Never trust client input.

Reject:

empty title

empty body

invalid ids

invalid enum

invalid version

missing rejection comment

unknown role

---

# Error Handling

Never return generic errors.

Use typed domain errors.

Examples:

Unauthorized

Forbidden

InvalidTransition

Conflict

ValidationError

NotFound

Every API response should be predictable.

---

# Transactions

The following operations require a transaction:

Create document

Edit document

Submit

Approve

Reject

Publish

Archive

Any audit creation

Never split transactional logic across services.

---

# Logging

Application logs are not audit logs.

Audit logs are immutable business history.

Do not confuse the two.

---

# Repository Structure

Organize by feature.

Example:

src/

    modules/

        documents/

            service.ts

            repository.ts

            routes.ts

            validators.ts

            permissions.ts

            transitions.ts

        auth/

        audit/

        users/

Shared utilities belong in:

shared/

Never create a utils folder containing unrelated helpers.

---

# Permission Logic

Permission logic belongs in one place.

Never duplicate permission checks.

Prefer:

canEdit()

canApprove()

canPublish()

canArchive()

over scattered inline conditions.

---

# Workflow Logic

Workflow transitions belong in one module.

Example:

transition.ts

Single source of truth:

allowedTransitions

Never duplicate transition logic.

---

# Database

Database is the source of truth.

Not:

React

Server Memory

Client Cache

Every mutation must be verified against persisted state.

---

# React Rules

Keep components small.

Business logic never belongs in components.

Components:

render

collect input

call API

Nothing more.

---

# State Management

Prefer TanStack Query.

Do not duplicate server state.

Avoid unnecessary global stores.

---

# TypeScript Rules

Never use:

any

unknown as escape hatch

type assertions without reason

Prefer:

strict typing

discriminated unions

readonly

const assertions

enums only where appropriate

---

# Code Quality

Functions should:

do one thing

be deterministic

have explicit inputs

return predictable outputs

Prefer composition.

Avoid inheritance.

---

# Testing Priorities

Highest priority:

Permission tests

Workflow tests

Transaction tests

Concurrency tests

Audit tests

Validation tests

Lower priority:

UI snapshot tests

---

# Performance

Do not optimize prematurely.

Correctness > speed.

Avoid N+1 queries.

Index:

document state

owner

createdAt

audit documentId

---

# Security

Never trust:

headers

cookies

body

params

Always verify session.

Always verify permissions.

Always validate ownership.

---

# AI Coding Rules

Before writing any mutation code, verify:

✓ Authentication

✓ Authorization

✓ Ownership

✓ Current State

✓ Transition

✓ Validation

✓ Transaction

✓ Audit Event

✓ Version Check

✓ Response

If any item is missing:

STOP.

Do not generate code.

---

# Pull Request Checklist

Every PR must answer:

Can this break workflow invariants?

Can unauthorized users mutate data?

Can audit history drift?

Can stale updates overwrite data?

Can invalid states occur?

Can permissions be bypassed?

If any answer is "Yes",

the implementation is incomplete.

---

# Definition of Done

A feature is complete only if:

✓ Authorization enforced

✓ Validation complete

✓ Workflow validated

✓ Transactional

✓ Audit logged

✓ Version checked

✓ Tests added

✓ Types strict

✓ No duplicated logic

✓ No invariant broken

Correctness always wins over convenience.