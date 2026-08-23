# Лабораторија на вештини — landing page

Single-page, single-CTA landing for the education center. Next.js (App Router) +
Tailwind CSS v4. Design decisions and their rationale live in [PLAN.md](PLAN.md).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build into `.next/` (type-checks and prerenders) |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run images` | Re-run the photo exposure pass into `src/assets/gallery/` |
| `node scripts/shoot.mjs <url> <outDir> 375x812 1440x900` | Responsive screenshots at real layout viewports |
| `node scripts/audit.mjs <url>` | Accessibility + layout audit (alt text, heading order, touch targets, overflow) |

## Layout

```
src/app/          layout.tsx (metadata, font preloads), page.tsx (all seven sections), globals.css
src/components/   header, footer, cta-button, section-label, photo, contact-form
src/lib/config.ts brand + contact data, the only place with TODO(client) placeholders
src/assets/       gallery photos + logo, imported statically so next/image gets intrinsic sizes
public/fonts/     self-hosted woff2 subsets
```

`/` is fully prerendered — the build reports it as `○ (Static)`. The only runtime
endpoint is `/_next/image`.

## Hosting

The default build expects a Node host (Vercel, or `npm start` behind a proxy). To
go back to a "drop it on any static host" build, set `output: "export"` and
`images.unoptimized: true` in [next.config.ts](next.config.ts) and serve `out/`.
That trades away WebP conversion and srcset: every photo then ships as its
original 640px JPEG, so expect the page weight to roughly double.

## Toolchain pins

`npm run build` and `npm run dev` are on the current release of everything. Two
dev-only packages are held back on purpose — bumping either breaks `npm run lint`:

- **`typescript` 6.0.3, not 7.0.2.** `typescript-eslint` (bundled inside
  `eslint-config-next`) declares `typescript: ">=4.8.4 <6.1.0"` and hard-errors on
  TS 7: *"typescript-eslint does not support TS 7.0."* Tracking issue:
  [typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940).
  TS 6.0.3 builds and type-checks this project cleanly.
- **`eslint` 9.39.5, not 10.9.0.** `eslint-plugin-react`, also bundled inside
  `eslint-config-next`, still calls the ESLint 9 rule-context API and throws
  *"contextOrFilename.getFilename is not a function"* under ESLint 10.

## Before this goes live

Placeholders are marked `TODO(client)` in [src/lib/config.ts](src/lib/config.ts):

1. **Cyrillic logo** — the bundled `src/assets/logo.png` is the English "SKILLS LAB" lockup
2. **Footer address and social links** (phone and email are wired in)
3. **Photo consent** — participants are identifiable in several gallery photos

## Notes worth knowing

- **Copy source.** Every word comes from `за нас.docx`. No names, dates, venues or
  figures from anywhere else, including text legible inside the photos.
- **Photos are 640×428.** Nothing renders wider than 600 CSS px so the image optimizer
  never upscales — it caps candidate widths at a file's native size. Do not add a
  full-bleed photo without new source files.
- **Fonts are self-hosted** in `public/fonts` (Manrope + Source Sans 3), split by
  `unicode-range` so a Macedonian visitor downloads only the Cyrillic faces. They stay
  as hand-written `@font-face` rules in `src/app/fonts.css` rather than `next/font/local`,
  which has no way to express a per-source `unicode-range`. The two above-the-fold
  faces are preloaded from `src/app/layout.tsx`. Poppins was rejected — no Cyrillic subset.
- **Near-monochrome palette.** Sections alternate `#efefee` and white. `#2B3761` is
  reserved for the CTA, the footer, and the closing highlight — no gold in the UI.
  On the navy closing block the CTA needs the `onNavy` variant or it is invisible.
  Full contrast table in `src/app/globals.css`.
- **Macedonian italics** are avoided; `em` renders as weight, not slant.
- **One client component.** `contact-form.tsx` is the only `"use client"` file — it
  composes a `mailto:` draft. Everything else is a Server Component and ships no JS.
