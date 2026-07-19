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
