# Лабораторија на вештини — Landing Page Implementation Plan

Single-page, single-CTA landing. Next.js App Router, prerendered. Language: Macedonian (`lang="mk"`).

---

## 1. Copy source — за нас only

**Rule: every word of body copy comes from `за нас.docx`.** No names, dates, course titles, venues, or figures from any other source, including details legible inside the supplied photos. Photos are still *shown* — they are the client's own gallery — but no copy asserts specifics read off them, and alt text stays descriptive rather than naming people or events.

One item is structural rather than copy, and is still needed:

| Item | Source | Impact |
|---|---|---|
| MK brand name is **Лабораторија на вештини — едукативен центар** | Screen in `image2.jpeg` | Site is Macedonian; the supplied logo is the **English** variant ("SKILLS LAB"). Need the Cyrillic logo file. Confirm the name before it ships. |

The About text is 12 dense paragraphs. It gets **distilled, not pasted**. Strongest lines to use verbatim:

- ~~`Ние не организираме само обуки. Создаваме искуства.`~~ — dropped: metaphorical, no offer in it.
  Hero now asks a direct question: `Дали сакате вашиот тим да работи побрзо и со подобри резултати?`
- `Најголемата вредност не се информациите, туку нивната примена.` → method section
- ~~`Знаењето е инвестиција што никогаш не ја губи својата вредност.`~~ — dropped for the same reason.
  Closing CTA now asks: `Дали сакате обука прилагодена на вашиот тим?`

---

## 2. Hard constraint: the photos

**All 11 images are 640×428px** (3:2), ~200KB each, and underexposed with a warm tungsten cast.

This dictates the layout more than any style preference:

- ❌ No full-bleed hero photo. At 1440px viewport that is a 2.25× upscale — visibly mushy.
  Still holds. `hero.jpg` was resupplied at 1533×1026 and a full-height bleed to the
  viewport edge **was** built on the strength of it — and rejected, see §5. The photo
  is contained at 460 CSS px; the master's value is that it is the one photo on the
  page that resolves at 2× DPR, not that it can run bigger.
- ✅ Max render width **600px CSS** per photo. In a 3-col grid inside a 1200px container each tile is ~380px — crisp, even at 1.5× DPR.
- ⚠️ At 2× DPR a 380px tile wants 760px source; we have 640. Mild softness on retina. Acceptable; the alternative is re-shooting.

**Pre-processing step (do once, before build):** brightness +10%, contrast +5%, pull the warm cast down slightly, export WebP q=82 → ~50–70KB each. Do this as a build-time script, *not* a CSS `filter:` — CSS filters cost paint time on every scroll and can't be tuned per image.

### Curation — 11 supplied, use 9

| File | Role | Verdict |
|---|---|---|
| `image8` | Wide room, trainer presenting, most participants, best exposure | **Hero image** |
| `image4` | Presenting, screen visible | Gallery |
| `image5` | Wide room, engaged group | Gallery |
| `image0` | Discussion around table | Gallery |
| `image1` | Small group discussion | Drop — near-dupe of `image0`, backs of heads |
| `image2` | Branded screen in the training room | Gallery |
| `image7` | Presentation screen | Gallery |
| `image6` | Certificates, close-up | Предавачи section — visual only |
| `image9` | Certificate on table | Предавачи section — visual only |
| `image10` | Signing, two people | Gallery |
| `image11` | Signing, close-up | Drop — same moment as `image10` |

⚠️ **Privacy:** participants' faces are identifiable. Confirm written consent before publishing (MK LPPD tracks GDPR). If consent is missing for some, `image2`, `image6`, `image7`, `image9` carry the story with no recognisable faces.

---

## 3. Design system

### Colour — near-monochrome

Revised at the client's direction: `#2B3761` for the CTA, the footer and deliberate
highlights. **No gold in the UI** — the logo keeps its own colours as a brand asset.
That still holds.

**Revised again (bland-page pass).** The original alternation was `#efefee` / white.
Measured, those sit **1.15:1 apart** — below the threshold where an eye registers a
band edge at all, so seven "alternating" sections read as one flat white sheet. The
band is now `#E9EBF2`, a navy-tinted paper: still light, but the *hue* shift does the
separating that luminance alone could not. A tint ramp (`navy-50/100/200`) replaces
the ink-opacity hairlines, and `Како работиме` became a full navy field — see §5,
which specified that from the start. `muted` darkened `#6B6B70` → `#5E5E66` so it
stays AA on the darker band.

| Token | Hex | Use |
|---|---|---|
| `--color-ink` | `#17171F` | Headings and body text |
| `--color-paper` | `#E9EBF2` | Alternating section background (navy-tinted) |
| (white) | `#FFFFFF` | Alternating section background |
| `--color-navy` | `#2B3761` | CTA fill, section 04 + 07 fields, numerals |
| `--color-navy-deep` | `#212A4A` | Footer |
| `--color-navy-50` | `#F4F6FA` | Reserved tint |
| `--color-navy-100` | `#DFE4EF` | Panel fill, photo-frame backing |
| `--color-navy-200` | `#C2CADD` | Hairline rules, borders, on-navy emphasis text |
| `--color-muted` | `#5E5E66` | Secondary text |

**Computed contrast:**

- ✅ Ink on paper — **15.0:1** (AAA)
- ✅ Ink on white — **16.6:1** (AAA)
- ✅ White on navy — **11.6:1** (AAA) → **the CTA pairing**
- ✅ Navy on paper — **9.8:1** (AAA)
- ✅ Muted on paper — **5.3:1** / on white **6.3:1** (AA, secondary text only)
- ✅ White/75 on navy — **8.7:1** (AAA) → body copy on the 04 and 07 fields

Section order: hero paper → теми white → мисија paper → **како работиме navy** →
предавачи paper → галерија white → closing navy → footer navy-deep.

⚠️ On the navy closing block the CTA must use the inverted variant (`onNavy`: white
fill, navy text). A default navy-filled button there is invisible.

### Typography — engine recommendation rejected

The design engine returned **Poppins** for headings. **Poppins has no Cyrillic subset** — every Macedonian headline would silently fall back to a system font. Verified against `google-fonts.csv`.

Replacement, both Cyrillic-verified and both variable:

- **Headings — Manrope** 700/800, tight tracking. Semi-geometric, squarish curves that echo the logo's book/star mark. Cyrillic-native design.
- **Body — Source Sans 3** 400/600, 17–18px, line-height 1.6. High x-height, excellent Cyrillic legibility at small sizes.

Deliberately *not* Inter + huge gradient headline — that is the default AI-landing signature.

⚠️ **Macedonian italics:** Macedonian shares Serbian localised italic Cyrillic forms (б, г, д, п, т). Set `<html lang="mk">` and avoid italic Cyrillic body text — use weight and colour for emphasis instead.

### Visual direction — editorial / institutional

Reads like a university prospectus, not a SaaS template.

**Explicitly avoiding (the "AI-generated pattern" list):** gradient mesh blobs and floating orbs, glassmorphism, purple/violet, emoji as icons, the rounded-3xl pastel three-card feature grid, fake dashboard mockups, gradient text, everything-centred `max-w-7xl`.

⚠️ The first build shipped with every one of its seven sections using the same centred
`label / h2 / intro` block — the exact "everything-centred" pattern this list rules out.
Headings are left-aligned and asymmetric now; only the closing CTA band (07) is centred.

**Using instead:** 1px hairline rules as the primary divider, muted section numerals `01`–`06`, asymmetric 12-column grid, generous whitespace, near-zero drop shadows, SVG icons from Lucide at a single 1.5px stroke weight. (The logo's four-point star was tried as a divider glyph and pulled: at small sizes on a plain field it reads as the Gemini sparkle, not as brand.) The hero and closing statement are set in oversized uppercase Manrope 800.

**Motion:** restrained. *(Reinstated. The zero-motion revision left every element on
the page without a single interaction state, which was a measurable part of why the
finished page read as inert — a two-column list of eight bold words with no hover
response is a screenshot, not an interface.)*

- 150–200ms on hover and press: CTA colour + 1px lift, nav underline growing from the
  left, Теми row rule going navy, photo tile push-in at 600ms.
- One fade-up per group on first scroll entry — `opacity 0→1`, `translateY 14px→0`,
  520ms, 40–140ms stagger. Fires once, then the element is unobserved.
- Smooth anchor scrolling.
- **No** parallax, no counters, no page transitions, no entrance choreography.

Implementation: `src/components/site-motion.tsx` — one mount, two IntersectionObservers,
zero scroll listeners. The hidden start state is gated behind `.js` on `<html>` (set by a
blocking inline script in the layout) so no-JS readers and the pre-hydration frame get the
fully visible page. Everything is off under `prefers-reduced-motion`.

---

## 4. The single CTA

**Action: phone / Viber** (your choice).

- Primary button, appearing 3× — sticky header, hero, closing section. Same action, same label, same styling. One CTA, three placements.
- Label renders the number as text: `ЈАВИ СЕ: 071 388 876` → `href="tel:+38971388876"`
- Style: navy pill `#2B3761`, white text, 11.6:1, fully rounded, min-height 48px, `touch-action: manipulation`.
- Viber as a **subordinate** text link directly beneath, muted, smaller: `viber://chat?number=%2B38971388876`. Same goal, alternate channel — it does not compete as a second CTA.
- ⚠️ Viber deep links often fail on desktop. The visible `tel:` number is the fallback and must always be readable as plain text.

---

## 5. Page structure

| # | Section | Content | Notes |
|---|---|---|---|
| 0 | Sticky header | Logo + 3 anchor links + CTA button | White, 64px, hairline border, shadow on scroll (CSS keyed off `html[data-scrolled]`, driven by a 1px sentinel observer — no scroll listener) |
| 1 | Hero | Question headline (⚠️ `Дали сакате да научите нови практични вештини?` — supplied by the client directly, **not** from `за нас.docx`; §1's no-invented-copy rule still holds for everything else) + subhead + CTA | **Asymmetric 7/5 split**, left-aligned oversized uppercase, one pill CTA. `hero.jpg` sits in the right column inside an offset hairline frame, capped at 460 CSS px desktop / 560 tablet. Does not fill the viewport. The old 3-photo proof band is gone; it existed only to compensate for a photo-less hero.

⚠️ **Two bolder heroes were built and rejected. Do not re-propose them.**

1. *Photo bleeding to the right viewport edge at full fold height (44vw, `100svh`).* Failed for a reason that generalises: the hero photo is **of a presentation** — projector, presenter, rows of seats — so running it at half the screen made the entire site read as a slide deck. The room photos in this set document well at gallery size and overclaim at hero size.
2. *Type-led, no photo, the eight topics promoted into the fold as a large index.* Clean and genuinely prospectus-like, but it left the top of the site with no image at all.

The brief that produced both was "the fold is boring". The measured complaint underneath it was real — at 1440×900 the fold ended ~290px short — but neither fix was the right one. Anything tried here should keep the photo contained and subordinate to the type.
| 2 | Мисија / визија | Mission + vision paragraphs, distilled | Two white panels with a navy left edge, on the tinted band. Replaces the stats strip — за нас contains no figures, and none get invented. **A stats strip is still the single biggest thing missing from this page**; it needs real numbers from the client (§7). |
| 3 | Теми | The 7 areas: лидерство, менаџмент, комуникациски вештини, продажба, личен и професионален развој, емоционална интелигенција, дигитална трансформација | Numbered editorial list, two columns, hairline rules — **not** an icon-card grid. Numerals are oversized navy ghost figures, and each row has a hover state (rule → navy, 2px shift). |
| 4 | Како работиме | `Најголемата вредност не се информациите, туку нивната примена.` + interactive/case-study/practical points | Asymmetric, navy field. **Now actually built as one** — the first build shipped it white, which is what left six consecutive near-white bands with nothing to break them. |
| 5 | Предавачи | `Работиме со искусни предавачи, докажани професионалци и експерти…` — verbatim from за нас, no names | Photos `image6`, `image9` sit here as visual support only; no claims made about them |
| 6 | Галерија | 6 curated photos | CSS-columns masonry, three tile ratios (3:2, 4:3, 1:1), ≤600px per tile, lazy. Crops run **inward** from the 3:2 source, never outward. A uniform grid of six identical rectangles was accurate and completely flat. |
| 7 | Closing CTA | `Дали сакате обука прилагодена на вашиот тим?` + CTA | Navy field. The one block on the page that stays centred. |
| 8 | Footer | Logo, contact, social | ⚠️ Needs real contact details |

---

## 6. Build

**Next.js (App Router) + Tailwind v4.** `/` has no dynamic server work, so `next build`
prerenders it to static HTML — the build reports it as `○ (Static)`. The one runtime
endpoint is `/_next/image`.

> Originally built on Astro and ported to Next.js. Section 10 records what the port
> changed.

```
npx create-next-app@latest
```

Key mechanics:

- `next/image` for every photo, via the `Photo` wrapper — auto WebP, intrinsic
  `width`/`height` from the static import (kills CLS), and it **will not upscale past
  the 640px native width**, which is exactly the guard this image set needs.
- Self-host Manrope + Source Sans 3 woff2 with `font-display: swap`; `preload()` only
  the two above-the-fold weights. Hand-written `@font-face` rather than
  `next/font/local`, which cannot express a per-source `unicode-range`.
- Two client components: `contact-form.tsx` and `site-motion.tsx`. The second is the
  page's entire motion layer — two IntersectionObservers, no scroll listeners.
- Colours as CSS custom properties in Tailwind's `@theme` — no raw hex in markup.

Target: Lighthouse 95+ across the board, LCP < 1.5s, CLS < 0.05.

**Breakpoints:** 375 / 768 / 1024 / 1440. Mobile-first. Verify at 375px and in landscape.

---

## 7. Blocked on you

Everything else can be built now with placeholders. These cannot be invented:

1. **Cyrillic logo** — ideally SVG. The supplied PNG is the English "SKILLS LAB" lockup; the site is Macedonian
2. **Address and social links** for the footer (phone and email are in)
3. **Photo consent** confirmation for identifiable participants. ⚠️ Note that
   `image6` now renders at 440 CSS px rather than as a small tile, which makes the
   certificate text — including a mentor name and a date — legible on a desktop
   screen. §1 rules out publishing names and dates that are only legible *inside*
   a photo. Either confirm that is fine, or that photo needs a tighter crop.
4. **Higher-resolution photo masters.** Every source is 640×428, which is the single
   hardest constraint on this page: it is why there was no hero photo, why nothing
   renders past 600 CSS px, and why retina screens see mild softness. Supplying
   **1280×856** masters (a straight 2× of what exists) covers every slot on the page
   at 2× DPR with nothing to spare and nothing wasted:

   | File | Slot | Renders at | Wants at 2× | Status |
   |---|---|---|---|---|
   | ~~`image8`~~ → `hero.jpg` | Hero | 460 / 560 CSS px | 1120 | ✅ **supplied at 1533×1026** |
   | `image6` | Предавачи, upper | 440 CSS px | **880** | outstanding |
   | `image9` | Предавачи, lower | 350 CSS px | **700** | outstanding |
   | `image4` `image5` `image0` `image2` `image7` `image10` | Галерија tiles | ~360 CSS px | **720** | outstanding |

   ⚠️ `image0` and `image7` are cropped to 1:1 and `image5` / `image10` to 4:3, so
   those need the *height* too — 856px covers them.
   ⚠️ `imageSizes` in `next.config.ts` stops at 600, but `deviceSizes` already runs to
   1920, and Next merges both lists whenever `sizes` is present — so a `sizes` value
   containing a `vw` term (which all of them do) already reaches the larger widths. No
   config change was needed for the hero. Revisit only if a photo ever gets a
   `sizes` with fixed px and no `vw` fallback.
   ⚠️ Re-run `npm run images` after replacing them — the exposure/white-balance pass
   in `scripts/process_images.py` is not optional, the originals are underexposed
   with a warm tungsten cast. **`hero.jpg` is exempt** and is not in that script's
   `KEEP` list: it arrived already corrected, and a second pass would double-apply.

Supplied and wired in: phone `071 388 876`, email `vestini.lab@gmail.com`.

---

## 8. Status — built and verified

All nine steps below are done. Verified with `scripts/shoot.mjs` (real layout viewports)
and `scripts/audit.mjs`:

| Check | Result |
|---|---|
| Horizontal overflow @ 375 / 768 / 1440 | `0` at every width |
| Images missing `alt` | none |
| Images missing intrinsic `width`/`height` (CLS) | none |
| Heading order | one `h1`, no level skips |
| `lang` | `mk` |
| Console errors | none |
| Touch targets | all ≥44px tall; remaining flags are inline text links at 31–34px wide, which clear WCAG 2.5.8's 24×24 |
| Largest generated image width | 600px — never upscaled past the 640px source |
| Build output | `/` prerendered static; ~180KB gzip of JS+CSS, 14KB gzip HTML |

Three bugs were found and fixed during verification:

1. **Content stuck invisible.** The reveal used `threshold: 0.1`; an element taller than
   the viewport can never reach a 10% ratio, so it stayed armed at `opacity: 0` forever.
   Now `threshold: 0` plus a failsafe sweep on `load` that reveals anything already in
   view. Confirmed `stuckReveals: 0` after scrolling.
2. **`тукунивната`** — the template collapsed the newline before a `<span>`, joining two
   words. Same bug on the mobile hero where the `<br>` is hidden (`обуки.Создаваме`).
3. **No CTA in the mobile header.** Phone users had no way to call between the hero and
   the page footer. The header CTA is now `compact` rather than hidden below `sm`.

One caveat on tooling: Chrome's `--screenshot` CLI flag does not apply `--window-size` to
the *layout* viewport, which produced a convincing but false "mobile is broken" result.
`scripts/shoot.mjs` drives `Emulation.setDeviceMetricsOverride` over CDP instead — use it,
not the CLI flag, for any responsive check.

## 9. Order of work

1. Scaffold Next.js + Tailwind, tokens, fonts, `lang="mk"`
2. Image pre-process script → WebP, corrected exposure
3. Header + hero + CTA component
4. Sections 3–5 (topics, method, trainer/certificates)
5. Gallery
6. Closing CTA + footer
7. Responsive pass @ 375/768/1024/1440 + landscape
8. A11y pass: contrast, focus rings, keyboard order, alt text in Macedonian, reduced-motion
9. Lighthouse + swap placeholders for real client data

---

## 10. Port to Next.js

Astro → Next.js 16 App Router. The design, the copy and the markup are unchanged; what
moved is the framework underneath.

| Astro | Next.js |
|---|---|
| `src/pages/index.astro` | `src/app/page.tsx` |
| `src/layouts/Layout.astro` | `src/app/layout.tsx` + the `metadata` / `viewport` exports |
| `src/styles/global.css` | `src/app/globals.css` (unchanged content) |
| `astro:assets` `<Image />` | `next/image` behind `src/components/photo.tsx` |
| `<script is:inline>` mailto handler | `src/components/contact-form.tsx` (`"use client"`) |
| `@tailwindcss/vite` | `@tailwindcss/postcss` |

**What the port cost.** Astro shipped zero client JS. Next.js App Router always ships
its React runtime, so the page now carries ~180KB gzip of JS+CSS. That is inherent to
the framework, not to this page — the one client component only accounts for a sliver
of it. Everything else is a Server Component.

**What the port fixed.** Both CTA anchors rendered at 375px: the shared class string put
`inline-flex` on the desktop anchor alongside its `hidden`, and Tailwind emits `.hidden`
*before* `.inline-flex`, so `hidden` lost. Class order in the attribute is irrelevant —
only the order in the generated stylesheet decides. Each anchor now owns its display
pair and `base` carries none. The bug predates the port; it was in the Astro build too.

**Toolchain pins.** `typescript` is held at 6.0.3 and `eslint` at 9.39.5 — both newer
majors exist, and both break `eslint-config-next`. Details in README.md.
