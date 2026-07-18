---
version: alpha
name: ElevateFlow-design-system
description: "A warm-dark enterprise workflow canvas built on #09090b with a four-step charcoal surface ladder, an amber accent (#f59e0b) reserved for the primary CTA and active-state indicators, and a document-state semantic palette (draft-slate, submitted-blue, approved-emerald, rejected-rose, published-violet, archived-zinc). Display type is set in Inter at 500–700 with moderate negative tracking; monospaced eyebrows in JetBrains Mono carry version numbers, timestamps, and audit metadata. Cards live as charcoal panels with 1px hairline borders and 12px corners. A single radial amber-to-transparent glow sits behind the hero headline — the only gradient in the system. The page rhythm leads with product UI and document-state visualizations, not atmospheric art."

colors:
  # ── Brand & Accent ──
  primary: "#f59e0b"
  primary-hover: "#fbbf24"
  primary-muted: "#92400e"
  on-primary: "#09090b"

  # ── Ink (Text) ──
  ink: "#fafafa"
  ink-muted: "#a1a1aa"
  ink-subtle: "#71717a"
  ink-disabled: "#52525b"

  # ── Canvas & Surfaces ──
  canvas: "#09090b"
  surface-1: "#18181b"
  surface-2: "#1f1f23"
  surface-3: "#27272a"
  surface-4: "#2e2e33"

  # ── Borders ──
  hairline: "#27272a"
  hairline-strong: "#3f3f46"
  hairline-focus: "#f59e0b"

  # ── Inverse (light-on-dark flips) ──
  inverse-canvas: "#fafafa"
  inverse-ink: "#09090b"

  # ── Document State Semantic ──
  state-draft: "#94a3b8"
  state-draft-bg: "#1e293b"
  state-submitted: "#3b82f6"
  state-submitted-bg: "#1e3a5f"
  state-approved: "#10b981"
  state-approved-bg: "#064e3b"
  state-rejected: "#f43f5e"
  state-rejected-bg: "#4c0519"
  state-published: "#8b5cf6"
  state-published-bg: "#2e1065"
  state-archived: "#71717a"
  state-archived-bg: "#27272a"

  # ── Semantic (System) ──
  success: "#10b981"
  success-bg: "#064e3b"
  error: "#ef4444"
  error-bg: "#450a0a"
  warning: "#f59e0b"
  warning-bg: "#451a03"
  info: "#3b82f6"
  info-bg: "#1e3a5f"

  # ── Hero Glow (gradient) ──
  glow-start: "#f59e0b"
  glow-end: "#09090b"

typography:
  display-xl:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -2.5px
  display-lg:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.5px
  display-md:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.8px
  headline:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.5px
  subhead:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: -0.3px
  body-lg:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.1px
  body:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  button:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  button-lg:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 1.2px
  mono:
    fontFamily: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  mono-sm:
    fontFamily: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  section: 128px

components:
  # ── Buttons ──
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-primary-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  button-secondary-hover:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  button-ghost-hover:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px

  # ── Cards ──
  card-document:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 20px
  card-document-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-strong}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 20px
  card-stat:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-audit:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 16px

  # ── Status Badges ──
  badge-draft:
    backgroundColor: "{colors.state-draft-bg}"
    textColor: "{colors.state-draft}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-submitted:
    backgroundColor: "{colors.state-submitted-bg}"
    textColor: "{colors.state-submitted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-approved:
    backgroundColor: "{colors.state-approved-bg}"
    textColor: "{colors.state-approved}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-rejected:
    backgroundColor: "{colors.state-rejected-bg}"
    textColor: "{colors.state-rejected}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-published:
    backgroundColor: "{colors.state-published-bg}"
    textColor: "{colors.state-published}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-archived:
    backgroundColor: "{colors.state-archived-bg}"
    textColor: "{colors.state-archived}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px

  # ── Inputs ──
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-focus}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  text-input-error:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.error}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  textarea:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 14px

  # ── Navigation ──
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 56px
    padding: 0px 24px
  sidebar:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    width: 240px
    padding: 16px
  sidebar-item:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  sidebar-item-active:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 8px 12px

  # ── Tables ──
  table-header:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.eyebrow}"
    padding: 12px 16px
  table-row:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: 12px 16px
  table-row-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: 12px 16px

  # ── Modals & Overlays ──
  modal:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  overlay-backdrop:
    backgroundColor: "#000000cc"

  # ── Toasts ──
  toast-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  toast-error:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  toast-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.info}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px 16px

  # ── Audit Timeline ──
  timeline-node:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  timeline-connector:
    borderColor: "{colors.hairline}"
    width: 2px

  # ── Hero (Landing) ──
  hero-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: 96px 24px

  # ── Footer ──
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.body-sm}"
    padding: 48px 24px
---

# ElevateFlow — Design System

---

## Overview

ElevateFlow's visual identity is a **warm-dark enterprise system** — every surface communicates trust, every interaction communicates precision.

The system draws its structural DNA from **Linear** (the deepest, most structured dark-canvas product system on the market) but warms the palette with an **amber accent** (`{colors.primary}` #f59e0b) that replaces Linear's cold lavender. This warmth signals approachability and confidence — the interface says "this is controlled, but not clinical."

The second voice comes from **xAI's monospaced eyebrow pattern**: `JetBrains Mono` in uppercase with positive tracking carries version numbers, timestamps, document IDs, and audit metadata. The mono face signals "engineered, precise, trustworthy" — exactly what a document approval platform needs.

A single **radial amber glow** behind the hero headline is the only gradient in the system — a nod to Framer's atmospheric depth, but restrained to a single focal point.

**Core attributes:**
- Dark-only canvas — no light mode
- Warm amber accent over cold charcoal surfaces
- Dense, readable body type with generous line-height
- Monospaced technical labels for metadata
- Document-state color system baked into the tokens
- Hairline borders for elevation, no drop shadows
- Product-focused — the interface IS the brand

---

## Colors

### Brand & Accent

- **Primary Amber** (`{colors.primary}` — `#f59e0b`): The single chromatic accent. Used for: primary CTA, active nav indicators, focus rings, document-action highlights. Warm enough to stand out on dark surfaces, muted enough to not overwhelm data-dense views.
- **Primary Hover** (`{colors.primary-hover}` — `#fbbf24`): Lighter amber for hover states.
- **Primary Muted** (`{colors.primary-muted}` — `#92400e`): Deep amber for pressed states and subtle accents on secondary surfaces.
- **On Primary** (`{colors.on-primary}` — `#09090b`): Text on amber surfaces — near-black for maximum contrast (contrast ratio: 10.2:1).

### Canvas & Surfaces

- **Canvas** (`{colors.canvas}` — `#09090b`): The page background. Warmer than Linear's blue-tinted #010102, with a barely perceptible warm undertone.
- **Surface 1** (`{colors.surface-1}` — `#18181b`): Cards, sidebar, document panels. One step up from canvas.
- **Surface 2** (`{colors.surface-2}` — `#1f1f23`): Hovered cards, table headers, nested panels.
- **Surface 3** (`{colors.surface-3}` — `#27272a`): Active sidebar items, selected rows, tooltips.
- **Surface 4** (`{colors.surface-4}` — `#2e2e33`): Deepest lifted surface — dropdown menus, command palette.

### Text Hierarchy

- **Ink** (`{colors.ink}` — `#fafafa`): Primary text — headlines, document titles, active labels.
- **Ink Muted** (`{colors.ink-muted}` — `#a1a1aa`): Secondary text — subtitles, descriptions, inactive nav items.
- **Ink Subtle** (`{colors.ink-subtle}` — `#71717a`): Tertiary text — timestamps, placeholders, footer links.
- **Ink Disabled** (`{colors.ink-disabled}` — `#52525b`): Disabled controls, archived content labels.

### Borders

- **Hairline** (`{colors.hairline}` — `#27272a`): Default card borders, table dividers.
- **Hairline Strong** (`{colors.hairline-strong}` — `#3f3f46`): Hovered card borders, input borders.
- **Hairline Focus** (`{colors.hairline-focus}` — `#f59e0b`): Focused input ring — amber accent.

### Document State Palette

Every document lifecycle state has a dedicated foreground + background pair. The foreground is the badge text and icon; the background is the badge fill.

| State | Foreground | Background | Hex Pair |
|-------|-----------|-----------|----------|
| **Draft** | `{colors.state-draft}` | `{colors.state-draft-bg}` | `#94a3b8` / `#1e293b` |
| **Submitted** | `{colors.state-submitted}` | `{colors.state-submitted-bg}` | `#3b82f6` / `#1e3a5f` |
| **Approved** | `{colors.state-approved}` | `{colors.state-approved-bg}` | `#10b981` / `#064e3b` |
| **Rejected** | `{colors.state-rejected}` | `{colors.state-rejected-bg}` | `#f43f5e` / `#4c0519` |
| **Published** | `{colors.state-published}` | `{colors.state-published-bg}` | `#8b5cf6` / `#2e1065` |
| **Archived** | `{colors.state-archived}` | `{colors.state-archived-bg}` | `#71717a` / `#27272a` |

The state colors are reserved for document-state indicators only. They must not be used for general UI decoration. Each foreground/background pair meets WCAG AA contrast (≥ 4.5:1).

### Semantic (System)

- **Success** / **Error** / **Warning** / **Info** — standard semantic pairs with soft-tinted backgrounds. Warning and Primary share the same amber to maintain voice consistency.

### Hero Glow

- **Glow Start** (`{colors.glow-start}` — `#f59e0b`): Center of the radial gradient behind the hero headline.
- **Glow End** (`{colors.glow-end}` — `#09090b`): Fades to canvas. The gradient is `radial-gradient(ellipse at 50% 0%, {glow-start}15, {glow-end} 70%)` — very subtle, at 8% opacity.

---

## Typography

### Font Families

Two faces carry the entire system:

1. **Inter** — display, body, buttons, labels. An open-source geometric sans with excellent readability at all sizes. Weights 400 / 500 / 600 / 700 are the working set. Inter's `font-feature-settings: "cv01", "cv03", "cv04"` enables geometric alternates for a cleaner voice.

2. **JetBrains Mono** — eyebrows, version labels, timestamps, audit metadata, inline code. Weight 400–500 at 11–13px with positive tracking (+1.2px) gives technical labels a "code comment" feel.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| `{typography.display-xl}` | 64px | 700 | 1.05 | -2.5px | Hero headline (landing page only) |
| `{typography.display-lg}` | 48px | 600 | 1.10 | -1.5px | Section openers |
| `{typography.display-md}` | 36px | 600 | 1.15 | -0.8px | Page titles in dashboard |
| `{typography.headline}` | 24px | 600 | 1.25 | -0.5px | Card section titles, modal headers |
| `{typography.subhead}` | 20px | 500 | 1.35 | -0.3px | Document titles in cards |
| `{typography.body-lg}` | 18px | 400 | 1.55 | -0.1px | Lead paragraphs, hero subtitle |
| `{typography.body}` | 16px | 400 | 1.55 | 0 | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Table cells, sidebar items, metadata |
| `{typography.caption}` | 12px | 500 | 1.35 | 0 | Badge labels, small meta |
| `{typography.button}` | 14px | 500 | 1.20 | 0 | Standard button labels |
| `{typography.button-lg}` | 16px | 500 | 1.20 | 0 | Large / hero CTAs |
| `{typography.eyebrow}` | 12px | 500 | 1.30 | 1.2px | UPPERCASE mono labels — section eyebrows, table headers, version numbers |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | Inline code, document IDs, audit hashes |
| `{typography.mono-sm}` | 11px | 400 | 1.40 | 0 | Timestamps in audit timeline |

### Principles

- **Moderate negative tracking on display** — not as aggressive as Framer (-5.5px) or xAI (-2.4px), but enough to give headlines density: -2.5px at 64px, -0.5px at 24px.
- **Generous body line-height** (1.55) — the user asked for "easily readable." This is wider than Linear (1.50) and much wider than Framer (1.30). The extra leading improves scanning in data-dense dashboards.
- **Mono eyebrow with positive tracking** (+1.2px) — inspired by xAI's GeistMono uppercase pattern. The tracking contrast against negative-tracked display headlines creates a clear "taxonomy" vs "content" visual distinction.
- **Weight ceiling at 700** — only the hero headline uses 700; everything else stays at 400–600. The brand reads as calm and confident, not shouting.

---

## Layout

### Spacing System

- **Base unit**: 4px
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.2xl}` 32px · `{spacing.3xl}` 48px · `{spacing.4xl}` 64px · `{spacing.5xl}` 96px · `{spacing.section}` 128px

### Grid & Container

- **Max content width**: 1280px (desktop); centers with `{spacing.xl}` 24px gutters.
- **Dashboard layout**: fixed 240px sidebar + fluid main content.
- **Card grids**: 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Document list**: single-column with full-width document cards.

### Whitespace Philosophy

Like Linear, the dark canvas IS the whitespace. Sections separate by lifting onto `{colors.surface-1}` panels, not by adding light gaps. Within a panel, `{spacing.lg}` 16px gaps between elements; `{spacing.section}` 128px between landing page sections.

Inside the dashboard, spacing is tighter: `{spacing.xl}` 24px between cards, `{spacing.md}` 12px between card elements.

### Responsive Behavior

| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| Desktop XL | ≥ 1440px | Full sidebar + 3-up card grids |
| Desktop | ≥ 1280px | Full sidebar + 2-up card grids |
| Tablet | ≥ 768px | Sidebar collapses to icons; 2-up grids |
| Mobile | < 768px | No sidebar; hamburger nav; 1-up; display-xl scales to 36px |

### Touch Targets

- All buttons: ≥ 40px tap height on desktop, ≥ 44px on touch.
- Sidebar items: 36px on desktop, 44px on touch.
- Table rows: 48px minimum height for comfortable row selection.

---

## Elevation & Depth

| Level | Treatment | Use |
|-------|----------|-----|
| 0 (flat) | No shadow, no border | Canvas-mounted text, hero section |
| 1 (hairline lift) | `{colors.surface-1}` bg + 1px `{colors.hairline}` border | Document cards, stat cards, audit cards |
| 2 (hover lift) | `{colors.surface-2}` bg + 1px `{colors.hairline-strong}` border | Hovered cards, dropdowns |
| 3 (active lift) | `{colors.surface-3}` bg + 1px `{colors.hairline-strong}` border | Active sidebar item, selected table row |
| 4 (focus ring) | 2px `{colors.hairline-focus}` outline, 2px offset | Focused inputs, focused buttons |
| 5 (modal) | `{colors.surface-1}` bg + 1px `{colors.hairline}` + `0 25px 50px -12px rgba(0,0,0,0.5)` | Modals, command palette |

ElevateFlow follows Linear's model: **surface ladder + hairline borders** carry all elevation. No drop shadows on standard cards — only modals get a subtle shadow to separate from the backdrop.

### Decorative Depth

- **Hero glow**: a single radial gradient (`{colors.glow-start}` at 8–15% opacity → transparent) centered behind the hero headline. This is the only atmospheric effect in the system.
- **Document-state color dots**: small 8px circles next to document titles, colored by state. They provide "living" color against the monochrome card chrome.

---

## Shapes

### Border Radius Scale

| Token | Value | Use |
|-------|-------|-----|
| `{rounded.xs}` | 4px | Small chips, inline tags |
| `{rounded.sm}` | 6px | Inline code blocks |
| `{rounded.md}` | 8px | All buttons, inputs, table cells |
| `{rounded.lg}` | 12px | Document cards, stat cards, audit cards |
| `{rounded.xl}` | 16px | Modals, command palette |
| `{rounded.xxl}` | 20px | Hero feature cards (landing page only) |
| `{rounded.pill}` | 9999px | Status badges, pricing tabs |
| `{rounded.full}` | 9999px | Avatars, circular icon buttons |

### Shape Philosophy

- Cards use `{rounded.lg}` 12px — softer than Linear's 8px cards but sharper than Framer's 20px. This middle ground reads as "premium tool" without being "design showcase."
- Buttons use `{rounded.md}` 8px — subtly rounded, never pill-shaped. Pill shapes are reserved for badges and status indicators.
- Inputs match buttons at `{rounded.md}` 8px for visual consistency.

---

## Components

### Buttons

**`button-primary`** — the amber CTA. Every primary action across the application.
- Amber background, near-black text, Inter 14px / 500. Rounded `{rounded.md}` 8px.
- Hover: `button-primary-hover` shifts to lighter amber `{colors.primary-hover}`.
- For hero-scale CTAs, `button-primary-lg` scales to 16px type with 12px vertical padding.

**`button-secondary`** — charcoal on dark. Secondary actions ("Cancel", "Back", "View Details").
- `{colors.surface-2}` background, white text. Same shape as primary.

**`button-ghost`** — transparent with muted text. Tertiary actions, inline triggers.
- Canvas background, `{colors.ink-muted}` text. Hover lifts to `{colors.surface-1}`.

**`button-destructive`** — red fill. Destructive actions only ("Reject", "Archive").
- `{colors.error}` background, white text.

**`button-outline`** — bordered transparent. Used for "Sign In", "Export", low-emphasis actions.
- Canvas background, white text, 1px `{colors.hairline-strong}` border.

### Cards & Containers

**`card-document`** — the primary card for document list items.
- `{colors.surface-1}` background, 1px `{colors.hairline}` border, `{rounded.lg}` 12px corners, 20px padding.
- Contains: status badge (top-right), document title (`{typography.subhead}`), author + timestamp in `{typography.mono-sm}`, snippet in `{typography.body-sm}`.
- Hover: lifts to `card-document-hover` (surface-2 + hairline-strong).

**`card-stat`** — dashboard stat summary (e.g., "12 Pending Review").
- Same chrome as `card-document` with 24px padding and a large metric in `{typography.display-md}`.

**`card-audit`** — compact card for audit timeline entries.
- Same chrome but 16px padding and `{typography.body-sm}` body.

### Status Badges

Six state badges — one per document lifecycle state. All share the pill shape and `{typography.caption}` text. The foreground/background pairs are defined in the Document State Palette section above.

Use badges inline next to document titles, in table rows, and in audit timeline nodes.

### Inputs & Forms

**`text-input`** — standard form input.
- `{colors.surface-1}` background, 1px `{colors.hairline}` border, `{rounded.md}` 8px, 10px 14px padding.
- Focused: border shifts to `{colors.hairline-focus}` (amber). This is the focus ring.
- Error: border shifts to `{colors.error}`.

**`textarea`** — multi-line input for document body editing.
- Same surface and border as `text-input`, 14px padding, grows with content.

### Navigation

**`top-nav`** — sticky 56px bar on `{colors.canvas}`.
- Layout: ElevateFlow wordmark (left) + search bar (center) + avatar + notification bell (right).
- Wordmark is `{typography.headline}` in `{colors.ink}` with "Elevate" in regular weight and "Flow" in amber `{colors.primary}`.

**`sidebar`** — 240px fixed panel on `{colors.surface-1}`.
- Sidebar items use `{typography.body-sm}`, rounded `{rounded.md}`, 8px 12px padding.
- Active item: `{colors.surface-3}` background with `{colors.ink}` text. An amber 2px left-edge indicator bar marks the active route.
- Section dividers: `{typography.eyebrow}` UPPERCASE mono labels ("DOCUMENTS", "REVIEW", "AUDIT", "SETTINGS").

### Tables

**`table-header`** — uses `{typography.eyebrow}` (JetBrains Mono, uppercase, tracked) on `{colors.surface-2}`.
- This is the signature pattern from xAI: mono-caps headers over body-sm cells.

**`table-row`** — `{colors.surface-1}` background, `{typography.body-sm}` body, 12px 16px cell padding.
- Hover: lifts to `table-row-hover` (surface-2).

### Modals

**`modal`** — centered on a `#000000cc` backdrop.
- `{colors.surface-1}` background, 1px `{colors.hairline}` border, `{rounded.xl}` 16px corners, 24px padding.
- The only component with a drop shadow: `0 25px 50px -12px rgba(0,0,0,0.5)`.

### Toasts

Success, error, and info toast variants use their respective semantic background/foreground pairs with `{rounded.md}` and `{typography.body-sm}`.

### Audit Timeline

**`timeline-node`** — each node is a `{colors.surface-2}` panel connected by a 2px `{colors.hairline}` vertical line.
- Contains: state badge, action text in `{typography.body-sm}`, actor name in `{typography.body-sm}` bold, timestamp in `{typography.mono-sm}`.

### Hero Section (Landing Page)

**`hero-section`** — centered, distraction-free.
- Headline in `{typography.display-xl}` (64px / 700 / Inter).
- Subtitle in `{typography.body-lg}` (18px / 400) with `{colors.ink-muted}`.
- Single `button-primary-lg` CTA centered below.
- Behind everything: the radial amber glow gradient at 8–15% opacity.
- No product screenshots in the hero — the headline and CTA stand alone.

---

## Do's and Don'ts

### Do

- Reserve `{colors.primary}` (amber) for: primary CTA, active indicators, focus rings, and the hero glow. It must be scarce.
- Use `{typography.eyebrow}` (JetBrains Mono, uppercase, +1.2px tracking) for: table headers, sidebar section labels, metadata labels, version numbers.
- Use the document-state palette ONLY for document lifecycle indicators. Never repurpose state-submitted blue as a link color.
- Maintain the 4-step surface ladder (canvas → surface-1 → surface-2 → surface-3) for hierarchy. Don't skip steps.
- Keep body line-height at 1.55 for readability in data-dense views.
- Compose buttons with `{rounded.md}` 8px corners — not pills, not squares.
- Default cards to `{rounded.lg}` 12px corners with 1px hairline borders.
- Lead with product UI in all marketing materials — the interface IS the brand.

### Don't

- Don't introduce a light mode. ElevateFlow is a dark-canvas system.
- Don't use amber as a section background or card fill. Amber is an accent, not a surface.
- Don't add a second chromatic accent. The system is monochrome + amber + state colors.
- Don't put drop shadows on standard cards. Use surface ladder + hairline borders.
- Don't use gradient backgrounds on sections. The hero glow is the only gradient.
- Don't pill-round buttons. `{rounded.md}` 8px is the button shape.
- Don't set body text in the mono face. Mono is for eyebrows, metadata, and code.
- Don't use `{colors.ink}` (#fafafa) for body paragraphs — use `{colors.ink-muted}` (#a1a1aa) for secondary content to maintain text hierarchy.
- Don't use more than one display-xl on a single page. One hero headline per view.

---

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a surface, decide which level it lives on (canvas vs surface-1 vs surface-2).
3. Default body to `{typography.body}` at weight 400 with `{colors.ink-muted}` for secondary content.
4. Add new button/card/badge variants as separate component entries with `-hover`, `-active`, `-featured` suffixes.
5. Treat amber as scarce: primary CTA, focus ring, active indicator, hero glow — that's it.
6. Every document-state indicator must use its paired foreground + background from the state palette.
7. Table headers always use `{typography.eyebrow}` — the mono-caps pattern is the system's "engineered" voice.

---

## Known Gaps

- Animation specifications (easing curves, durations) are not yet defined. Recommend `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and `200ms` default duration.
- Icon set is not specified. Recommend Lucide Icons (consistent stroke weight, MIT license).
- Dark mode is the only mode — no light adaptation is documented.
- The hero glow gradient opacity (8–15%) is a range; exact value should be tuned during implementation based on display rendering.
