import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { documents, users, auditEvents } from "./schema/index";
import { eq } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

const DOCUMENTS = [
  {
    title: "Q3 System Architecture & Zero-Trust Guidelines",
    body: `# Q3 System Architecture & Zero-Trust Guidelines

## Overview
This document outlines the architectural principles and zero-trust security guidelines for the Q3 platform modernization initiative.

## Core Principles

### Zero-Trust Architecture
- **Never trust, always verify** - Every request must be authenticated and authorized
- **Least privilege access** - Users and services get minimum required permissions
- **Micro-segmentation** - Network segmentation at the application layer
- **Continuous verification** - Real-time monitoring and validation

### System Architecture Layers

#### 1. Identity Layer
- Centralized identity provider (IdP) with MFA enforcement
- Service-to-service authentication via mTLS
- Just-in-time (JIT) access provisioning
- Automated certificate rotation every 90 days

#### 2. Network Layer
- Service mesh implementation (Istio/Linkerd)
- East-west traffic encryption
- Network policies enforced at pod level
- Egress controls with allow-lists only

#### 3. Data Layer
- Encryption at rest (AES-256) and in transit (TLS 1.3)
- Database-level row-level security (RLS)
- Automated PII detection and classification
- Cross-region replication with consistency guarantees

#### 4. Application Layer
- Runtime application self-protection (RASP)
- API gateway with rate limiting and threat detection
- Secure coding standards enforcement in CI/CD
- Automated dependency scanning and SBOM generation

## Implementation Roadmap

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| Phase 1 | Q3 Weeks 1-4 | Identity foundation, mTLS rollout |
| Phase 2 | Q3 Weeks 5-8 | Service mesh deployment, network policies |
| Phase 3 | Q3 Weeks 9-12 | Data encryption, RLS, PII classification |
| Phase 4 | Q3 Weeks 13-16 | RASP, API gateway, SBOM automation |

## Compliance Mapping
- SOC 2 Type II: CC6.1, CC6.2, CC6.3, CC6.6, CC6.7
- ISO 27001: A.9.1, A.9.2, A.9.4, A.13.1, A.13.2
- NIST 800-53: AC-2, AC-3, AC-6, SC-7, SC-8, SC-13

## Approval
**Author:** Alice Author (alice@elevateflow.dev)
**Status:** Draft - Pending Review
**Version:** 1.0
**Classification:** Internal - Confidential`,
    status: "draft" as const,
    authorEmail: "alice@elevateflow.dev",
  },
  {
    title: "API Rate Limiting & Throttling Specification",
    body: `# API Rate Limiting & Throttling Specification

## Purpose
Define the rate limiting strategy for all public and internal APIs to ensure system stability, prevent abuse, and guarantee fair usage across all consumers.

## Rate Limit Tiers

### Tier 1: Public APIs (External Consumers)
- **Requests:** 100 req/min per API key
- **Burst:** 200 req/min (token bucket)
- **Quota:** 10,000 req/day per API key
- **Headers:** \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`

### Tier 2: Partner APIs (Authenticated Partners)
- **Requests:** 1,000 req/min per partner ID
- **Burst:** 2,000 req/min
- **Quota:** 500,000 req/day per partner
- **Headers:** Standard rate limit headers + \`X-Partner-Tier\`

### Tier 3: Internal Services (Service-to-Service)
- **Requests:** 10,000 req/min per service identity
- **Burst:** 20,000 req/min
- **No daily quota** - governed by circuit breakers
- **Authentication:** mTLS + JWT with \`aud\` claim validation

## Throttling Behavior

### Soft Limit (Warning)
- HTTP 429 not returned
- \`X-RateLimit-Warning\` header added
- Logging at WARN level
- Metrics emitted for alerting

### Hard Limit (Enforced)
- HTTP 429 Too Many Requests
- \`Retry-After\` header with seconds until reset
- Response body: \`{"error": "rate_limit_exceeded", "retry_after": 45}\`
- Logging at ERROR level
- Alert fired to on-call

## Algorithm: Token Bucket
- **Capacity:** Burst limit
- **Refill Rate:** Requests per minute / 60
- **Initial Tokens:** Full capacity on first request
- **Per:** API key / Partner ID / Service Identity

## Implementation Notes
- Redis-backed distributed token buckets (Redlock for consistency)
- Rate limit keys: \`ratelimit:{tier}:{identifier}\`
- TTL: 24 hours with sliding window
- Lua scripts for atomic operations

## Exemptions
- Health check endpoints: \`/health\`, \`/ready\`
- Authentication endpoints: \`/auth/*\` (separate brute-force protection)
- Webhook delivery retries: Exponential backoff, max 5 attempts

## Monitoring & Alerting
- **P99 latency** < 50ms for rate limit check
- **False positive rate** < 0.1% (legitimate traffic blocked)
- **Dashboard:** Grafana - API Gateway / Rate Limiting
- **Alerts:** PagerDuty - rate_limit_exceeded > 5/min for 5min

## Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-07-15 | Alice Author | Initial specification |
| 1.1 | 2024-07-20 | Alice Author | Added partner tier, webhook exemptions |

**Status:** Submitted for Review
**Author:** Alice Author (alice@elevateflow.dev)`,
    status: "submitted" as const,
    authorEmail: "alice@elevateflow.dev",
  },
  {
    title: "Database Migration Strategy: Blue-Green Deployments",
    body: `# Database Migration Strategy: Blue-Green Deployments

## Objective
Achieve zero-downtime database schema migrations using blue-green deployment patterns with automated rollback capabilities.

## Strategy Overview

### Dual-Schema Architecture
- **Blue Schema:** Active production schema (current version)
- **Green Schema:** Staging schema (target version)
- **Shared Data:** Read replicas sync via logical replication

### Migration Phases

#### Phase 1: Preparation (Green Schema)
1. Provision green schema as copy of blue
2. Apply all DDL changes to green schema
3. Run migration validation suite
4. Verify data integrity with checksums

#### Phase 2: Shadow Traffic (Dual Write)
1. Enable dual-write to both schemas
2. Mirror 100% of write traffic to green
3. Compare read results for 48 hours
4. Alert on any divergence > 0.001%

#### Phase 3: Cutover
1. Switch read traffic to green (gradual 10% → 100%)
2. Monitor error rates, latency, data consistency
3. Complete cutover within 15-minute window
4. Blue schema becomes rollback target

#### Phase 4: Cleanup
1. Decommission blue schema after 7-day stabilization
2. Archive migration logs and metrics
3. Update documentation and runbooks

## Rollback Procedure
**Automated Triggers:**
- Error rate > 1% for 2 consecutive minutes
- P99 latency increase > 200ms sustained
- Data consistency check failures > 0

**Manual Rollback:**
1. Switch reads back to blue (instant)
2. Disable dual-write to green
3. Investigate and remediate
4. Re-attempt after root cause analysis

## Tooling
- **Migration Runner:** Custom TypeScript runner with Drizzle ORM
- **Replication:** PostgreSQL logical replication (pglogical)
- **Validation:** pg_compare + custom checksum verification
- **Observability:** OpenTelemetry traces, Prometheus metrics
- **Orchestration:** GitHub Actions workflow with manual approval gates

## Schema Change Guidelines
### Safe Operations (Auto-Approved)
- ADD COLUMN with DEFAULT NULL
- CREATE INDEX CONCURRENTLY
- ADD CHECK CONSTRAINT NOT VALID → VALIDATE
- DROP UNUSED COLUMN (after 30-day deprecation)

### Risky Operations (Require Manual Approval)
- ALTER COLUMN TYPE
- DROP COLUMN (immediate)
- RENAME COLUMN/TABLE
- ADD FOREIGN KEY (without NOT VALID)
- TRUNCATE TABLE

### Forbidden in Blue-Green
- DROP DATABASE
- ALTER SYSTEM parameters
- VACUUM FULL on large tables

## Testing Requirements
- Unit tests for all migration scripts
- Integration tests against production-scale data (10M+ rows)
- Chaos testing: kill migration mid-flight, verify rollback
- Performance benchmarks: migration time < 30 min for 100GB

## Compliance
- SOC 2: CC7.1, CC7.2 (Change Management)
- PCI DSS: 6.4.5 (Change Control)
- Audit trail: All migrations logged to immutable store

---
**Author:** Alice Author (alice@elevateflow.dev)
**Status:** Approved - Ready for Implementation
**Approved By:** Bob Reviewer (bob@elevateflow.dev)
**Published:** 2024-07-25`,
    status: "approved" as const,
    authorEmail: "alice@elevateflow.dev",
  },
  {
    title: "Incident Response Runbook: Database Outage",
    body: `# Incident Response Runbook: Database Outage

## Severity: SEV-1 (Critical)
**RTO:** 15 minutes | **RPO:** 1 minute

## Detection & Alerting
- **Primary:** Prometheus alert \`pg_up == 0\` for > 30s
- **Secondary:** Application health checks failing > 60s
- **Tertiary:** On-call paged via PagerDuty escalation policy

## Runbook Steps

### 1. Acknowledge & Assess (0-2 min)
- [ ] Acknowledge PagerDuty alert
- [ ] Check \`#incidents\` Slack channel
- [ ] Verify: Is it primary, replica, or both?
- [ ] Check cloud provider status page

### 2. Initial Diagnosis (2-5 min)
\`\`\`bash
# Check primary status
kubectl exec -it pg-primary-0 -- pg_isready

# Check replication lag
kubectl exec -it pg-primary-0 -- psql -c "SELECT * FROM pg_stat_replication;"

# Check disk space
kubectl exec -it pg-primary-0 -- df -h /var/lib/postgresql/data
\`\`\`

### 3. Failover Decision Matrix

| Condition | Action |
|-----------|--------|
| Primary down, replica healthy | Promote replica (auto via Patroni) |
| Primary down, replica lag > 1min | Manual failover, accept data loss |
| Both down | Restore from latest backup (RPO: 1min) |
| Network partition | Wait for partition heal (max 5min) |

### 4. Execute Failover (if needed)
\`\`\`bash
# Manual promotion (if auto-failover disabled)
kubectl exec -it pg-replica-0 -- patronictl failover --force

# Verify promotion
kubectl exec -it pg-replica-0 -- psql -c "SELECT pg_is_in_recovery();"
# Should return 'f' (false = primary)
\`\`\`

### 5. Application Reconnection
- Kubernetes services auto-update endpoints (30s TTL)
- Connection poolers (PgBouncer) drain & reconnect
- Verify: \`curl -f https://api.internal/health\`

### 6. Post-Failover Validation (5-10 min)
- [ ] Write throughput recovered > 95% baseline
- [ ] Read latency P99 < 100ms
- [ ] Replication re-established (new replica)
- [ ] No data loss verified via checksum

### 7. Root Cause & Documentation
- Capture: Timeline, actions, metrics, logs
- Create: Incident report in Confluence (template: IR-DB-001)
- Schedule: Blameless postmortem within 5 business days

## Contact Escalation
1. **Primary On-Call:** Database SRE (current rotation)
2. **Secondary:** Platform Lead
3. **Management:** VP Engineering (if > 30min)

## Related Runbooks
- IR-DB-002: Replication Lag Alert
- IR-DB-003: Backup Restore Procedure
- IR-INFRA-001: Kubernetes Node Failure

---
**Author:** Charlie Admin (charlie@elevateflow.dev)
**Status:** Published - Active Runbook
**Last Reviewed:** 2024-07-15
**Next Review:** 2025-01-15`,
    status: "published" as const,
    authorEmail: "charlie@elevateflow.dev",
  },
  {
    title: "Frontend Performance Budget: Core Web Vitals Targets",
    body: `# Frontend Performance Budget: Core Web Vitals Targets

## Executive Summary
This document establishes non-negotiable performance budgets for all ElevateFlow frontend applications. Exceeding these budgets blocks deployment.

## Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor | **Budget (Must Pass)** |
|--------|------|-------------------|------|------------------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4.0s | > 4.0s | **≤ 2.5s** |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms | > 500ms | **≤ 200ms** |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 | **≤ 0.1** |

## Resource Budgets (Per Page Load)

| Resource Type | Budget | Enforcement |
|---------------|--------|-------------|
| **Total JS** | ≤ 170 KB gzipped | CI Gate |
| **Total CSS** | ≤ 50 KB gzipped | CI Gate |
| **Fonts** | ≤ 100 KB (woff2, subset) | CI Gate |
| **Images** | ≤ 200 KB (above fold) | CI Gate |
| **Third-Party** | ≤ 50 KB total | CI Gate |
| **Total Page Weight** | ≤ 500 KB | CI Gate |

## JavaScript Budget Breakdown

| Category | Budget | Notes |
|----------|--------|-------|
| Framework (React) | ~45 KB | React 18 + concurrent features |
| Router (TanStack Router) | ~12 KB | Type-safe, tree-shakeable |
| State (TanStack Query) | ~15 KB | Server state only |
| UI Components | ≤ 60 KB | Lazy-loaded, code-split |
| Utilities | ≤ 15 KB | date-fns, zod (tree-shaken) |
| **Total** | **≤ 147 KB** | **Under 170 KB budget** |

## Optimization Strategies (Mandatory)

### 1. Code Splitting
- Route-level splitting (every page = separate chunk)
- Component-level splitting for heavy features (charts, editors)
- \`React.lazy()\` + \`Suspense\` for all non-critical UI

### 2. Font Optimization
- Self-hosted WOFF2 only
- Subset: Latin + Latin-Extended only
- \`font-display: swap\` + preload critical fonts
- Variable fonts where available

### 3. Image Optimization
- Next.js \`Image\` component mandatory
- AVIF/WebP with JPEG fallback
- Responsive sizes: 640, 750, 828, 1080, 1200, 1920w
- Blur placeholders (LQIP) for above-fold

### 4. CSS Strategy
- Tailwind CSS v4 (JIT, zero-runtime)
- PurgeCSS in production (automatic)
- Critical CSS inlined (Next.js automatic)
- No CSS-in-JS runtime

### 5. Third-Party Scripts
- **Allowed:** Analytics (GA4, < 20 KB), Error tracking (Sentry, < 30 KB)
- **Forbidden:** Chat widgets, A/B testing, tag managers
- All third-party: \`async\`, \`defer\`, \`preconnect\`

## CI/CD Enforcement

### Lighthouse CI (Every PR)
\`\`\`yaml
# .github/workflows/lighthouse.yml
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            https://staging.elevateflow.dev
            https://staging.elevateflow.dev/documents
            https://staging.elevateflow.dev/login
          budgetPath: ./performance-budget.json
          uploadArtifacts: true
\`\`\`

### Performance Budget JSON
\`\`\`json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
\`\`\`

## Monitoring (Production)
- **RUM:** Vercel Speed Insights + Web Vitals library
- **Alerting:** P95 LCP > 2.5s for 5min → PagerDuty
- **Dashboard:** Grafana - Frontend / Core Web Vitals
- **Weekly Review:** Performance regression report (every Monday)

## Exceptions Process
1. Submit RFC with business justification
2. Architecture review (performance + security)
3. VP Engineering approval required
4. Temporary waiver (max 30 days) with remediation plan
5. Automatic re-evaluation at waiver expiry

---
**Author:** Alice Author (alice@elevateflow.dev)
**Status:** Rejected - Requires Revision
**Reviewer:** Bob Reviewer (bob@elevateflow.dev)
**Rejection Reason:** Third-party budget too restrictive for Sentry + GA4 combined. Revise to 80 KB total with breakdown.`,

    status: "rejected" as const,
    authorEmail: "alice@elevateflow.dev",
  },
];

async function seedDocuments() {
  console.log("🧹 Clearing existing audit events and documents...\n");
  await db.delete(auditEvents);
  await db.delete(documents);
  console.log("✅ Cleared existing documents and audit events.\n");

  console.log("🌱 Seeding documents...\n");

  // Get all users
  const allUsers = await db.select().from(users);
  const userMap = new Map(allUsers.map((u) => [u.email, u.id]));

  for (const doc of DOCUMENTS) {
    const authorId = userMap.get(doc.authorEmail);
    if (!authorId) {
      console.log(`  ⚠️  Author not found: ${doc.authorEmail}`);
      continue;
    }

    const [insertedDoc] = await db
      .insert(documents)
      .values({
        title: doc.title,
        body: doc.body,
        status: doc.status,
        authorId,
      })
      .returning();

    if (insertedDoc) {
      await db.insert(auditEvents).values({
        documentId: insertedDoc.id,
        actorId: authorId,
        action: "created",
        prevStatus: null,
        newStatus: doc.status,
        comment: "Initial document seed",
      });
    }

    console.log(`  ✅ "${doc.title}" — status: ${doc.status}`);
  }

  console.log("\n🌱 Document seed complete!");
  await client.end();
}

seedDocuments().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});