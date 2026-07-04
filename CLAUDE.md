# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

GENSETS is a static marketing/lead-generation website for an industrial generator
spare-parts supplier (Coimbatore, Tamil Nadu). It is pure HTML/CSS/JS with **no build
step, no package manager, and no backend**.

## Running & developing

- **No build/compile/test commands exist.** Edit files and reload the browser.
- Serve locally with any static server, e.g. `python3 -m http.server` from the repo root,
  then open `index.html`. Files also open directly via `file://`.
- Deployment is static hosting (the HTML/CSS/JS are the deliverable as-is).

## Architecture

Every page is a standalone `.html` file that links the same two shared assets:
`styles.css` (all styling) and `main.js` (all behavior). There is no templating — the
navbar, footer, floating WhatsApp/back-to-top buttons, and mobile sticky bar are
**duplicated as literal HTML in each page**. Editing shared chrome means editing every
page, or doing a find/replace across all `.html` files.

Pages: `index.html`, `about.html`, `products.html`, `services.html`, `industries.html`,
`contact.html`, `enquiry.html`.

`main.js` is one file wiring ~10 independent features by querying the DOM on load:
sticky header (`.scrolled` at 60px scroll), mobile drawer (`.hamburger`/`.mobile-drawer`,
toggled with `.open`, closes on Escape/outside-click), active-nav-link detection from the
URL, IntersectionObserver scroll-reveal (`.reveal` → `.visible`), animated stats counter,
product filter (`.filter-btn` show/hide cards by `data-category` on `products.html`),
auto-rotating testimonial slider, back-to-top, and **client-side-only** validation for the
contact and enquiry forms. Features no-op gracefully when their elements aren't on the page.

## Styling system

`styles.css` is design-token driven: all colors, spacing, type scale, and radii are CSS
custom properties in `:root`. **Change the theme by editing `:root` variables, not
scattered values.** Key tokens: `--color-blue-primary` (#1B4FD8), `--color-orange`
(#EA580C), `--color-whatsapp` (#25D366), `--color-text-dark`/`--color-text-body`,
`--space-xs`…`--space-3xl`, `--text-xs`…`--text-hero`, `--radius-sm`…`--radius-xl`.
Fonts: `--font-display` (Barlow Condensed, headings) and `--font-body` (Inter).

The site is a **light theme** by deliberate design (recent git history removed all dark
theme); only the hero and footer remain dark. Reusable building blocks: `.section` /
`.section-dark` / `.section-alt` / `.section-gray`, `.card` (+ `.card-orange`), `.btn`
variants (`.btn-primary`, `.btn-whatsapp`, `.btn-orange`, `.btn-outline`), `.icon-box`,
and grid classes `.grid-2`/`.grid-3`/`.grid-4`. Layout uses CSS Grid; responsive
breakpoints at 1100/900/768/480px (hamburger appears at 900px; sticky bottom bar at 768px).

## Conventions & gotchas

- **Images are placeholders.** All `<img>` use Unsplash URLs tagged with a
  `data-replace="..."` attribute marking what real photo belongs there. Grep
  `data-replace` to find every image needing replacement.
- **Forms are lead-capture only** — vanilla JS validation, no submission to any backend.
  On valid submit the form hides and a `.form-success` message shows. Wiring real
  submission means adding a backend and editing the submit handler in `main.js`.
- **Contact info is hardcoded in many places** across all pages (phones
  `+91 93632 08579` / `+91 63839 91815`, `wa.me/91...` WhatsApp links). Changing it
  requires a repo-wide find/replace.
- Adding a page: copy an existing `.html`, keep the `styles.css` link and `main.js`
  script tag, and update the duplicated navbar/footer links across all pages.
