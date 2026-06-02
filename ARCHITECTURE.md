# Intellect Studio — Engineering Architecture

> **Document type:** Engineering blueprint  
> **Scope:** Full-stack front-end — component design, scroll architecture, GSAP lifecycle, z-index system, and stability contracts.  
> **Status:** Production-ready reference. Update this document whenever the rendering pipeline, plugin registration strategy, or scroll architecture changes.

---

## Table of Contents

1. [Core Technology Stack](#1-core-technology-stack)
2. [Project Directory Tree](#2-project-directory-tree)
3. [Scroll Architecture — Single Window-Scroll Model](#3-scroll-architecture--single-window-scroll-model)
4. [Component Architecture & Z-Index Layering](#4-component-architecture--z-index-layering)
5. [VRPortal — The Immersive Entry System](#5-vrportal--the-immersive-entry-system)
6. [Main Sections — Five-Stage Content Hub](#6-main-sections--five-stage-content-hub)
7. [Lifecycle & Stability Rules](#7-lifecycle--stability-rules)
8. [CSS Architecture & Design Tokens](#8-css-architecture--design-tokens)
9. [Build & Toolchain Configuration](#9-build--toolchain-configuration)

---

## 1. Core Technology Stack

| Library / Tool | Version | Role in Project |
| :--- | :---: | :--- |
| **React** | 19.2.6 | UI component tree, hooks (`useRef`, `useState`, `useEffect`, `useCallback`), StrictMode safety |
| **react-router-dom** | 7.x | Client-side routing — `BrowserRouter`, `Routes`, `Route`, `Link`, `useLocation` for three-route SPA (`/`, `/portfolio`, `/teams`) |
| **Vite** | 8.0.12 | Dev server with HMR, ESM-native bundling, production build optimisation |
| **Tailwind CSS** | 3.4.19 | Utility-first styling for layout, typography, spacing, and responsive breakpoints |
| **PostCSS + Autoprefixer** | 8.5 / 10.5 | CSS transform pipeline, vendor prefix injection |
| **GSAP Core** | 3.15.0 | Hardware-accelerated tweening for the portal mask zoom, text scale sync, magnetic button pull, and counter odometers |
| **GSAP ScrollTrigger** | 3.15.0 (bundled) | Window-scroll-driven scrub animation for the VRPortal runway (300 vh trigger) |
| **@gsap/react** | 2.1.2 | `useGSAP` hook — React-lifecycle-aware GSAP context wrapper; handles StrictMode double-invoke and auto-reverts on unmount |
| **Google Fonts** | CDN | Inter (sans-serif weights 300–900) · JetBrains Mono (monospace weights 400–800) |

> **Not installed:** Lucide React, Three.js, Framer Motion. All icon work is achieved via SVG inline or Unicode glyphs (e.g. `█` for terminal cursors).

---

## 2. Project Directory Tree

```
intellect-studio/
│
├── public/                         # Static assets — served verbatim at root URL
│   ├── vr-mask.png                 # ★ Core portal asset — monochrome VR headset PNG
│   │                               #   Must have transparent or white background.
│   │                               #   mix-blend-mode: multiply applied in CSS
│   │                               #   to neutralise white canvas exports.
│   ├── favicon.svg
│   ├── icons.svg
│   └── *.jpg                       # Portfolio project thumbnails (kaex, urbx, navirex, etc.)
│
├── src/
│   ├── main.jsx                    # ★ App entry — GSAP plugin registration lives HERE only
│   ├── App.jsx                     # Root router: BrowserRouter + ScrollToTop + three routes
│   ├── index.css                   # Tailwind directives + global resets + keyframe animations
│   ├── App.css                     # (Legacy Vite scaffold — unused, not imported)
│   │
│   ├── components/
│   │   ├── VRPortal.jsx            # ★ Portal system — 150vh runway, mask zoom, typewriter
│   │   │
│   │   └── sections/              # Five full-viewport content sections (window-scroll order)
│   │       ├── HeroSection.jsx     # Section 1 — Landing hub, magnetic links, Teams button
│   │       ├── AboutSection.jsx    # Section 2 — Editorial parallax, blur-reveal, marquee tags
│   │       ├── PortfolioSection.jsx # Section 3 — Dark triptych grid, 3D card tilt
│   │       ├── MetricsSection.jsx  # Section 4 — Odometer counters, crosshair intersections
│   │       └── FooterSection.jsx   # Section 5 — Terminal typewriter CTA, micro-typography
│   │
│   ├── pages/                      # Full-page route components (non-homepage routes)
│   │   ├── PortfolioPage.jsx        # /portfolio — full project listing
│   │   └── TeamsPage.jsx            # /teams — team roster
│   │
│   └── assets/                     # Bundled static assets (imported by JS modules)
│       ├── hero.png
│       ├── react.svg
│       └── vite.svg
│
├── index.html                      # Shell HTML — Google Fonts <link>, #root mount point
├── vite.config.js                  # Vite config — @vitejs/plugin-react
├── tailwind.config.js              # Tailwind content paths, font-family extensions
├── postcss.config.js               # tailwindcss + autoprefixer pipeline
├── eslint.config.js                # Flat ESLint config for React + hooks
├── package.json                    # Dependency manifest (see §1 for versions)
├── package-lock.json
├── ARCHITECTURE.md                 # This document
└── .gitignore
```

---

## 3. Scroll Architecture — Single Window-Scroll Model

The site uses a **single scroll context: the window**. There is no inner scroll container. Both the VRPortal animation and all section entry triggers read from `window.scrollY`.

```
┌─────────────────────────────────────────────────────────────────────┐
│  WINDOW SCROLL — drives portal animation AND section visibility     │
│                                                                     │
│  Approximate document height:                                       │
│    150 vh (portal runway) + 5 × 100 vh (sections) ≈ 650 vh         │
│                                                                     │
│  ╔═ 0 vh ══════════════════════════════════════════════════════╗   │
│  ║  VRPortal runway (150 vh, empty spacer)                     ║   │
│  ║  → GSAP ScrollTrigger fires from start:'top top'            ║   │
│  ║  → Animation compressed to first +=1100 px of this runway   ║   │
│  ║  → snap: 1/(N_SECTIONS-1) steps on the portal timeline      ║   │
│  ║  → Fixed overlay elements animate in viewport z-stack       ║   │
│  ╚═ 150 vh ═══════════════════════════════════════════════════╝   │
│                                                                     │
│  ╔═ ~150 vh ════════════════════════════════════════════════════╗  │
│  ║  HeroSection (100 vh)  ← portal onLeave fires here          ║  │
│  ╠═ ~250 vh ════════════════════════════════════════════════════╣  │
│  ║  AboutSection (100 vh)                                       ║  │
│  ╠═ ~350 vh ════════════════════════════════════════════════════╣  │
│  ║  PortfolioSection (min-h-screen)                             ║  │
│  ╠═ ~450+ vh ═══════════════════════════════════════════════════╣  │
│  ║  MetricsSection (100 vh)                                     ║  │
│  ╠═ ~550+ vh ═══════════════════════════════════════════════════╣  │
│  ║  FooterSection (100 vh)                                      ║  │
│  ╚═ ~650+ vh ════════════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────────────────────┘
```

### Why the dual-scroll model was removed

The original architecture used a `#main-content` inner scroll container (`overflow-y: scroll`, `height: 100vh`) with `scroll-snap-type: y mandatory`. This was replaced for three reasons:

1. **GSAP scroller conflict** — GSAP ScrollTrigger's `_getScrollFunc()` accesses `element._gsap` during scroll-metric initialisation. On a native `overflow-y: scroll` container it runs before GSAP has initialised its internal data store, producing `TypeError: Cannot read properties of undefined (reading '_gsap')`.
2. **IntersectionObserver root leaks** — Sections using `root: document.querySelector('#main-content')` would silently degrade to `root: null` (window) if the container was ever renamed or removed, breaking visibility detection invisibly.
3. **Router integration** — Page transitions via `react-router-dom` unmount `HomePage` entirely. Killing all ScrollTrigger instances on unmount (in `HomePage`'s cleanup `useEffect`) is clean and reliable on a window scroller; it was error-prone when a secondary scroll container held its own scroll offset across mounts.

### Route change scroll reset

`<ScrollToTop />` is a utility component mounted inside `<BrowserRouter>` (sibling to `<Routes>`). It watches `useLocation().pathname` and on every change fires `window.scrollTo(0, 0)` and clears any `overflow` lock GSAP may have pinned to `document.body`. This ensures every page transition starts at the top with no leftover body-scroll state from the previous route.

---

## 4. Component Architecture & Z-Index Layering

### `App.jsx` — Router and orchestration layer

`App.jsx` owns routing and the top-level document structure. It defines three components:

- **`ScrollToTop`** — reads `useLocation().pathname`, resets `window.scrollTo(0,0)` and clears `document.body.style.overflow` on every route change.
- **`HomePage`** — mounts the portal + five sections in a single `position: relative` wrapper; kills all ScrollTrigger instances on unmount to prevent leaks when routing away.
- **`App`** — renders `BrowserRouter > ScrollToTop + Routes` with three routes: `/`, `/portfolio`, `/teams`.

The `HomePage` wrapper imposes two hard rules:

1. **No `overflow-x: hidden`** — Setting `overflow-x: hidden` on a `position: relative` div implicitly sets `overflow-y: auto` in most browsers, creating an unintended scroll container. Fixed descendants inside that container get re-parented relative to it rather than the viewport. `overflow-x: hidden` lives only on `<body>` in `index.css`, which does not carry this side-effect.

2. **`position: relative` only** — No `transform`, `filter`, `perspective`, or `will-change: transform`. Any of these properties would create a new CSS containing block, causing all `position: fixed` children in `VRPortal` to be positioned relative to the App div instead of the viewport.

```
BrowserRouter
 ├── ScrollToTop              — pathname watcher, no DOM output
 └── Routes
      ├── / → HomePage (position: relative)
      │         ├── VRPortal (Fragment — multiple root nodes)
      │         │    ├── <div>  runway spacer  — 150 vh, empty, no children
      │         │    ├── <div>  heroPreview    — position:fixed, z-index: 5
      │         │    ├── <div>  overlayRef     — position:fixed, z-index: 20
      │         │    ├── <div>  brandRef       — position:fixed, z-index: 30
      │         │    └── <div>  typeUIRef      — position:fixed, z-index: 30
      │         │
      │         ├── HeroSection          — 100 vh, window scroll
      │         ├── AboutSection         — 100 vh, window scroll
      │         ├── PortfolioSection     — min-h-screen, window scroll
      │         ├── MetricsSection       — 100 vh, window scroll
      │         └── FooterSection        — 100 vh, window scroll
      │
      ├── /portfolio → PortfolioPage
      └── /teams     → TeamsPage
```

### Z-Index reference table

| Layer | Element | `z-index` | `position` | Description |
| :--- | :--- | :---: | :--- | :--- |
| Base document | `<body>` bg, `HomePage` wrapper | `1` | `relative` | Sand background; sections flow in normal document order |
| Hero preview | `heroPreviewRef` | `5` | `fixed` | Sand canvas + INTELLECT/STUDIO text. Visible through VR lens. |
| VR mask overlay | `overlayRef` (img) | `20` | `fixed` | VR headset PNG with `mix-blend-mode: multiply` |
| Portal UI | `brandRef`, `typeUIRef` | `30` | `fixed` | Brand tag + terminal typewriter. Fade on first scroll. |
| Section content | Internal section elements | `10` | `relative` | Cards, text, buttons within each section |

### Fragment return in `VRPortal`

`VRPortal` returns a React Fragment (`<>…</>`), not a single wrapper div. This is deliberate:

```jsx
return (
  <>
    <div ref={runwayRef} style={{ height: '150vh' }} />   {/* scroll trigger only */}
    <div ref={heroPreviewRef} style={{ position: 'fixed', zIndex: 5 }} />
    <div ref={overlayRef}    style={{ position: 'fixed', zIndex: 20 }} />
    <div ref={brandRef}      style={{ position: 'fixed', zIndex: 30 }} />
    <div ref={typeUIRef}     style={{ position: 'fixed', zIndex: 30 }} />
  </>
);
```

If the fixed elements were children of `runwayRef`, GSAP's `pin: true` mechanism — which applies `position: fixed` (and in some configurations transforms) to the pinned element — would make `runwayRef` a CSS containing block. All `position: fixed` grandchildren would then be positioned relative to the pinned div rather than the viewport, causing them to appear at the wrong coordinates or disappear entirely.

---

## 5. VRPortal — The Immersive Entry System

### Conceptual model

```
Page load (scroll = 0)
┌────────────────────────────────────────────────┐
│  heroPreview (z:5)  ← sand bg + INTELLECT text │
│  ████████████████████████████████████████████  │
│  ██  VR mask (z:20) — headset wireframe      ██│
│  ██  [  lens transparent area — text shows  ]██│
│  ██  [  INTELLECT visible at scale 0.7      ]██│
│  ████████████████████████████████████████████  │
│  INTELLECT STUDIO  (brand tag, z:30)           │
│  CREATE. █           (typewriter, z:30)         │
└────────────────────────────────────────────────┘

User scrolls over first +=1100px of runway  (GSAP scrub drives timeline progress 0 → 1)
  ├─ mask img:      scale  1.0  → 35.0   (zooms off-screen from centre)
  ├─ heroText h1:   scale  0.7  → 1.0    (grows into full-size layout position)
  ├─ studioText h2: scale  0.7  → 1.0    (same, in sync)
  ├─ heroPreview:   opacity 1   → 0      (fades at progress 0.88)
  ├─ brandRef + typeUIRef: opacity 1 → 0  (instant on progress > 0.02)
  └─ snap: fires at 1/(N_SECTIONS-1) intervals for tactile step feel

scroll exits runway (onLeave fires)
  ├─ overlayRef.style.visibility  = 'hidden'
  ├─ heroPreview.style.visibility = 'hidden'
  └─ HeroSection enters the viewport via normal window scroll
```

### GSAP timeline construction

```js
// Inside useGSAP — runs once after first mount
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: runwayRef.current,   // empty 150 vh spacer
    start:   'top top',           // animation starts when spacer top = viewport top
    end:     '+=1100',            // compressed to ~1100px of scroll (not full runway height)
    scrub:   1,                   // 1s lag between scroll and animation playhead
    snap: {                       // tactile step feedback between portal frames
      snapTo:   1 / (N_SECTIONS - 1),
      duration: { min: 0.2, max: 0.6 },
      ease:     'power1.inOut',
    },
    // pin: true is INTENTIONALLY ABSENT — see §4 Fragment rationale
  }
});

// Each target is individually null-guarded before being added:
if (maskImgRef.current)    tl.to(maskImgRef.current,    { scale: 35, ease: 'power2.in' }, 0);
if (heroTextRef.current)   tl.fromTo(heroTextRef.current,   { scale: 0.7 }, { scale: 1.0 }, 0);
if (studioTextRef.current) tl.fromTo(studioTextRef.current, { scale: 0.7 }, { scale: 1.0 }, 0);
if (heroPreviewRef.current) tl.to(heroPreviewRef.current, { opacity: 0 }, 0.88);
```

### VR mask PNG compatibility

The mask asset (`public/vr-mask.png`) is applied with `mix-blend-mode: multiply` on the `<img>` element. This handles two PNG export types:

| PNG type | Behaviour without multiply | Behaviour with multiply |
| :--- | :--- | :--- |
| Transparent background | Already correct; text shows through transparent areas | No change — transparent pixels have no colour to multiply |
| White / opaque background | White fills entire viewport → white screen | White (255,255,255) × destination ÷ 255 = destination colour → effectively transparent |

The `mix-blend-mode: multiply` also means the dark wireframe lines of the headset remain fully visible against any background.

### Typewriter (self-contained, no GSAP)

`PortalTypewriter` is a standalone React component using `useState` + recursive `setTimeout`. It is deliberately kept free of GSAP to avoid plugin dependencies on a component that runs from page load before any scroll occurs. Cleanup is handled by storing the current timer in a `useRef` and calling `clearTimeout` on unmount.

---

## 6. Main Sections — Five-Stage Content Hub

### Render order (top → bottom, window scroll)

1. HeroSection — 100 vh
2. AboutSection — 100 vh
3. PortfolioSection — min-h-screen
4. MetricsSection — 100 vh
5. FooterSection — 100 vh

### Trigger strategy per section

| Section | Entry trigger | Animation engine | Notes |
| :--- | :--- | :--- | :--- |
| **HeroSection** | Immediate (always visible on mount) | GSAP `gsap.to` | Magnetic pull via `mousemove`; links (Email/Call/Register) are plain text; Teams is solid black box |
| **AboutSection** | `IntersectionObserver` (threshold 0.15) | GSAP `fromTo` | Blur+opacity reveal per line; dual-speed parallax via `scroll` on `window`; category tags run as infinite CSS marquee (`marquee-scroll` keyframe), pause on hover |
| **PortfolioSection** | Immediate | Vanilla `mousemove` + GSAP `gsap.to` | 3D card tilt, cursor-tracking glow, thumbnail scale |
| **MetricsSection** | `IntersectionObserver` (threshold 0.30) | GSAP `gsap.to` on plain JS object | Odometer: animates `{val: 0}` → target; `+` crosshairs injected at column-divider × top/bottom-border intersections |
| **FooterSection** | `IntersectionObserver` (threshold 0.30) | `setTimeout` chain (no GSAP) | Typewriter writes directly to `textSpanRef.current.textContent`; bottom meta row uses micro-typography (`text-[10px] tracking-[0.2em]`) |

### IntersectionObserver scoping

All `IntersectionObserver` instances use `root: null`, which scopes detection to the **window viewport**. This is the correct target now that sections scroll with the global window — there is no inner scroll container.

```js
const observer = new IntersectionObserver(
  (entries) => { /* ... */ },
  {
    threshold: 0.15,
    root: null,   // ← window viewport; was root: '#main-content' in old dual-scroll model
  }
);
observer.observe(sectionRef.current);
```

### Portfolio card 3D tilt

Each `ProjectCard` tracks `mousemove` relative to the card's bounding rectangle, computes normalised `dx` / `dy` offsets (range –1 → +1), and feeds them directly to GSAP for zero-jank rotation:

```js
gsap.to(innerRef.current, {
  rotateY:  dx * 8,    // max ±8 degrees on X axis drag
  rotateX: -dy * 8,   // max ±8 degrees on Y axis drag
  duration: 0.3,
  ease: 'power2.out',
});
```

`transform-style: preserve-3d` is set on the card inner wrapper via the `.card-3d` CSS class.

---

## 7. Lifecycle & Stability Rules

These rules were derived from production failures encountered during development. **Do not bypass them.**

---

### Rule 1 — Single registration point for GSAP plugins

```js
// src/main.jsx  — runs before any React component module evaluates
import { gsap }          from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP }       from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
```

**Why:** Vite's dependency graph can split `gsap` and `gsap/ScrollTrigger` into separate chunks under certain import resolution conditions. If `registerPlugin` is called only inside a component file, Vite may bind that call to a different module instance than the one used by another component's `import { gsap }`. The result is the crash `TypeError: Cannot read properties of undefined (reading '_gsap')` — GSAP's internal element-data store was never initialised on the second instance.

**Belt-and-suspenders:** Each component file that imports GSAP also calls `gsap.registerPlugin(ScrollTrigger, useGSAP)` at the module top level. These calls are idempotent — GSAP ignores re-registration of an already-registered plugin. They serve as a fallback if the chunk split does occur.

---

### Rule 2 — Every `useRef` must be attached to a JSX element

**Failure mode:** A `useRef` that is declared but never assigned to a DOM element via `ref={...}` will have `.current = null` forever. Any GSAP call using it as a target passes `null` (or worse, the stale return from a previous mount cycle), producing the `_gsap` error.

**Verification checklist:**

```jsx
// ✅ CORRECT — ref is declared AND attached
const sectionRef = useRef(null);
// ...
<section ref={sectionRef}>...</section>

// ✅ CORRECT — array ref populated via callback, per-element
const linesRef = useRef([]);
// ...
<div ref={(el) => { linesRef.current[i] = el; }}>{line}</div>

// ❌ WRONG — ref declared but never connected
const orphanRef = useRef(null);
// ... no ref={orphanRef} anywhere in JSX
gsap.to(orphanRef.current, { ... });  // passes null → crash
```

---

### Rule 3 — Top-level null check before any GSAP call

Every `useGSAP` and `useEffect` that creates GSAP animations must open with a guard:

```js
useGSAP(() => {
  // ── Hard stop if primary container isn't mounted ──────────────────
  if (!sectionRef.current) return;

  // ── Per-target guards before adding to timeline or calling gsap.to ─
  if (indexRef.current) {
    gsap.to(indexRef.current, { y: -35, ... });
  }

  linesRef.current.forEach((el) => {
    if (!el) return;  // sparse-array holes and null-on-unmount both caught
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1 });
  });

}, { scope: sectionRef, dependencies: [] });
```

**Why:** In React 18+ StrictMode, effects deliberately run twice (mount → cleanup → remount). Between the cleanup call and the remount, refs are briefly `null`. If an `onUpdate` or `onEnter` callback from a surviving ScrollTrigger fires in this window and calls `gsap.set(ref.current, ...)` where `ref.current` is `null`, it passes `null` as the GSAP target, producing `Cannot read properties of null (reading '_gsap')`.

---

### Rule 4 — Use `useGSAP` from `@gsap/react`, not bare `useEffect`

```js
import { useGSAP } from '@gsap/react';

useGSAP(() => {
  // All GSAP calls here
  // gsap.context() is created internally
  // ctx.revert() is called automatically on cleanup
}, { scope: containerRef, dependencies: [] });
```

**Why `useGSAP` over `useEffect + gsap.context()`:**

| Concern | `useEffect + gsap.context()` | `useGSAP` |
| :--- | :--- | :--- |
| StrictMode double-invoke | Manual `ctx.revert()` cleanup required | Handled automatically by the hook |
| Cleanup timing | Developer must return `() => ctx.revert()` | Built-in |
| Scope for selector queries | Manual `gsap.context(fn, scope)` | `{ scope: ref }` option |
| React 18 concurrent features | Potential timing issues | Designed for React 18+ |

---

### Rule 5 — Never use a custom `scroller` option in GSAP ScrollTrigger for content sections

**Symptom:** `TypeError: Cannot read properties of undefined (reading '_gsap')` thrown from inside ScrollTrigger's `_getScrollFunc`.

**Root cause:** When ScrollTrigger resolves a native `overflow-y: scroll` element as a custom scroller, it calls `_getScrollFunc(element)` which accesses `element._gsap` before GSAP has had a chance to initialise its internal property store on that DOM node. The result is `undefined._gsap`.

**Current pattern — sections use `IntersectionObserver` with `root: null`:**

```js
// ❌ DO NOT DO THIS in section components (old dual-scroll pattern)
ScrollTrigger.create({
  trigger: sectionRef.current,
  scroller: '#main-content',   // ← causes _gsap crash
  start: 'top 80%',
});

// ✅ DO THIS INSTEAD — IntersectionObserver against the window viewport
const observer = new IntersectionObserver(
  (entries) => { entries.forEach(e => { if (e.isIntersecting) { /* animate */ } }); },
  { threshold: 0.15, root: null }   // null = window viewport
);
observer.observe(sectionRef.current);
```

**Exception:** GSAP ScrollTrigger IS used for the VRPortal animation. Its trigger is `runwayRef.current` (a plain div), and the scroller is the **window** (default — no `scroller` option specified). This path does not hit the `_gsap` bug.

---

### Rule 6 — Never put `position: fixed` children inside the GSAP-pinned element

If `pin: true` is used on a ScrollTrigger, GSAP applies `position: fixed` (and potentially transforms) to the pinned element. This makes it a **CSS containing block**. Any descendant with `position: fixed` will then be positioned relative to the pinned element — not the viewport — causing them to appear in the wrong location or not at all.

**Correct:** VRPortal returns a Fragment. The 300 vh runway spacer has **zero children**. All fixed elements (`heroPreview`, `overlay`, `brand`, `typewriter`) are Fragment siblings, not children of the spacer.

**Note:** `pin: true` is currently not used in this project. The portal animation works without it because the fixed overlay elements are already viewport-locked. This rule exists as a guard for future additions.

---

## 8. CSS Architecture & Design Tokens

### Global reset (`src/index.css`)

```css
@tailwind base;        /* Preflight reset — box-sizing, margin removal, etc. */
@tailwind components;  /* Component layer — currently empty, reserved */
@tailwind utilities;   /* Utility classes — the primary styling mechanism */
```

### Core design tokens

| Token | Value | Usage |
| :--- | :--- | :--- |
| Sand background | `#FDFBF7` | Body, HeroSection, AboutSection, portal preview |
| Dark charcoal | `#09090B` | FooterSection |
| Pure black | `#0D0D10` | PortfolioSection |
| Metric black | `#000000` | MetricsSection |
| Grey (STUDIO) | `#9CA3AF` | Hero "STUDIO" heading |
| Accent — Cyan | `#00FFFF` | Portfolio card 01 |
| Accent — Purple | `#A855F7` | Portfolio card 02 |
| Accent — Green | `#22C55E` | Portfolio card 03 |

### Critical animation keyframes

```css
/* Terminal cursor — binary blink */
@keyframes cursor-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Footer CTA cursor — glowing blink */
@keyframes cursor-glow {
  0%, 100% { text-shadow: 0 0 6px rgba(255,255,255,0.8); opacity: 1; }
  50%       { text-shadow: 0 0 24px rgba(255,255,255,0.6); opacity: 0; }
}

/* About section category tag marquee — injected via <style> inside AboutSection */
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
/* .marquee-animate runs at 24s, pauses when .marquee-group is hovered */
```

### `scroll-behavior` must remain `auto`

`scroll-behavior: smooth` is explicitly NOT set on `<html>`. GSAP ScrollTrigger's `scrub` mechanism programmatically sets the scroll position; if the browser's native smooth-scroll intercepts these changes, the animation desynchronises from the scroll position.

---

## 9. Build & Toolchain Configuration

### Vite (`vite.config.js`)

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],   // Babel-based Fast Refresh; JSX transform
});
```

No custom aliases, no manual chunks. GSAP is bundled as a single chunk by Vite's default rollup strategy. If bundle splitting is ever added, ensure `gsap` and `gsap/ScrollTrigger` land in the **same chunk** — or pre-registration in `main.jsx` becomes insufficient.

### Tailwind (`tailwind.config.js`)

```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
};
```

### npm scripts

| Script | Command | Use |
| :--- | :--- | :--- |
| `dev` | `vite` | Local dev server with HMR on `localhost:5173` |
| `build` | `vite build` | Production bundle into `dist/` |
| `preview` | `vite preview` | Serve production build locally |
| `lint` | `eslint .` | Flat ESLint config with React hooks rules |

---

*Last updated: 2026-06-02 — reflects single window-scroll model, react-router-dom routing (/, /portfolio, /teams), ScrollToTop utility, 150vh portal runway, root:null IntersectionObserver, marquee tags (AboutSection), crosshair intersections (MetricsSection), and micro-typography footer.*
