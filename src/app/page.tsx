import type { CSSProperties } from "react";
import type { StaticImageData } from "next/image";

import ContactForm from "@/components/contact-form";
import CtaButton from "@/components/cta-button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Photo from "@/components/photo";
import SectionLabel from "@/components/section-label";
import { contact, site } from "@/lib/config";

import heroImg from "@/assets/gallery/hero.jpg";
import certImg from "@/assets/gallery/image6.jpg";
import certDeskImg from "@/assets/gallery/image9.jpg";
import g4 from "@/assets/gallery/image4.jpg";
import g5 from "@/assets/gallery/image5.jpg";
import g0 from "@/assets/gallery/image0.jpg";
import g2 from "@/assets/gallery/image2.jpg";
import g7 from "@/assets/gallery/image7.jpg";
import g10 from "@/assets/gallery/image10.jpg";

/*
  All copy below is taken from `за нас.docx`, verbatim or distilled. No names, dates,
  venues or figures from any other source -- including details legible inside the
  photos. Alt text stays descriptive and does not identify people or events.

  Layout revision -- the page used to run the same centred `label / h2 / intro`
  block seven times, which is the pattern PLAN.md section 3 explicitly listed as
  something to avoid. Headings are left-aligned and asymmetric now; only the closing
  CTA band (07) stays centred, because a closing call to action should.

  Photo budget: the gallery and Предавачи sources are still 640x428, so nothing in
  those sections renders wider than 600 CSS px and the optimizer never upscales. The
  hero is the exception -- `hero.jpg` is 1533x1026, so it is the one photo on the page
  that can actually serve a 2x screen at its rendered width. Section 01 spends one
  photo on the hero, so the old three-photo proof band under Теми is gone; that band
  existed only because the hero had no image. Every curated photo is used exactly
  once, with no repeats anywhere on the page.

  Bands: paper -> white -> paper -> navy -> paper -> white -> navy-deep.
  The navy field at 04 is what PLAN.md section 5 always specified for Како работиме;
  it also breaks up what was otherwise six near-white bands in a row.
*/

const temi = [
  "Лидерство",
  "Менаџмент",
  "Комуникациски вештини",
  "Продажба",
  "Личен и професионален развој",
  "Емоционална интелигенција",
  "Дигитална трансформација",
];

const pristap = [
  {
    naslov: "Веднаш применливо",
    tekst:
      "Секоја наша програма е внимателно осмислена за да понуди конкретни знаења кои можат веднаш да се применат во секојдневната работа.",
  },
  {
    naslov: "Интеракција и размена",
    tekst:
      "Вистинското знаење се стекнува преку интеракција, практична работа, дискусии и размена на идеи.",
  },
  {
    naslov: "Реални ситуации",
    tekst:
      "Практични примери, реални ситуации, студии на случај и активности кои им овозможуваат на учесниците активно да бидат вклучени во процесот на учење.",
  },
];

type Foto = { src: StaticImageData; alt: string; ratio: string };

/* Mixed ratios drive the masonry in section 06. Sources are 3:2, so 6/5 and 1/1
   crop inwards -- never outwards, so no tile ever asks for pixels that aren't there.
   Order matters: the ratios are paired so every column sums to the same height at
   both 2-up (3+3) and 3-up (2+2+2), which lands the whole block on one flush
   bottom edge instead of a ragged one. Reordering these breaks that. */
const galerija: Foto[] = [
  {
    src: g4,
    alt: "Предавач пред учесници на обука во конференциска сала.",
    ratio: "aspect-[3/2]",
  },
  { src: g5, alt: "Учесници седат околу маси во сала за обуки.", ratio: "aspect-square" },
  { src: g0, alt: "Група учесници разговара за време на работилница.", ratio: "aspect-[6/5]" },
  { src: g2, alt: "Екран со презентација во сала за обуки.", ratio: "aspect-[6/5]" },
  { src: g7, alt: "Презентација прикажана на екран во сала за обуки.", ratio: "aspect-square" },
  { src: g10, alt: "Учесници потпишуваат документи на маса.", ratio: "aspect-[3/2]" },
];

/** Stagger helper -- keeps the `as CSSProperties` cast out of the markup. */
const delay = (ms: number) => ({ "--reveal-delay": ms + "ms" }) as CSSProperties;

export default function Home() {
  return (
    <>
      <Header />

      <main id="main">
        {/* ── 01 Hero ─────────────────────────────────────────────────
            Asymmetric 7/5 split, photo contained in an offset hairline frame.

            Two bolder heroes were tried and rejected, and both are worth recording
            so they do not get proposed again:

              1. Photo bleeding to the right viewport edge at full fold height. The
                 photo is *of* a presentation -- projector, presenter, rows of seats
                 -- so at half the screen the whole page read as a slide deck.
              2. Type-led, no photo, the eight topics promoted into the fold. Clean,
                 but it left the top of the site without an image at all.

            The photo caps at 460 CSS px on desktop and 560 on tablet. The 1533px
            master covers both at 2x DPR -- this is the only photo on the page that
            does. It stacks under the copy below `lg`. */}
        <section className="overflow-hidden bg-paper pt-16">
          <div className="shell grid items-center gap-x-16 gap-y-12 pt-14 pb-16 sm:pt-16 lg:grid-cols-12 lg:pt-20 lg:pb-24">
            <div className="lg:col-span-7" data-reveal>
              <SectionLabel number="01" label={site.tagline} />

              {/* Shorter line than the one this replaced, so it sets larger: the
                  measure tightens 20ch -> 18ch and the ceiling goes 2.9rem -> 3.25rem,
                  which keeps it filling the column instead of floating in it. */}
              <h1 className="headline headline-heavy mt-7 max-w-[18ch] text-[clamp(1.85rem,4vw,3.25rem)] text-ink">
                Дали сакате да научите нови практични вештини?
              </h1>

              <p className="mt-6 max-w-[52ch] text-lg text-muted sm:text-xl">
                Практични обуки за поединци, компании и институции: лидерство, менаџмент,
                комуникација и продажба. Знаења што се применуваат
                веднаш.
              </p>

              <div className="mt-9">
                <CtaButton size="lg" />
                <p className="mt-5 text-sm text-muted">
                  Или преку{" "}
                  <a
                    href={contact.viberHref}
                    className="inline-block -my-3 py-3 font-semibold text-navy underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                  >
                    Viber
                  </a>
                </p>
              </div>
            </div>

            <div className="lg:col-span-5" data-reveal style={delay(120)}>
              <div className="relative mx-auto max-w-[560px] lg:mx-0">
                {/* Offset hairline rather than a drop shadow -- PLAN.md section 3
                    asks for near-zero shadows and 1px rules as the divider. */}
                <span
                  aria-hidden="true"
                  className="absolute -right-4 -bottom-4 hidden h-full w-full border border-navy-200 sm:block"
                />
                <Photo
                  src={heroImg}
                  alt="Учесници следат обука во конференциска сала."
                  sizes="(min-width: 1024px) 460px, (min-width: 640px) 560px, 92vw"
                  priority
                  className="relative"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 Теми ──────────────────────────────────────────────────
            Back to its own band. Still the numbered editorial list PLAN.md section 5
            calls for -- not an icon-card grid. The numeral is an oversized navy ghost
            figure and each row has a hover state, which is what a two-column list of
            eight bold words needed to stop reading as inert. */}
        <section id="temi" className="scroll-mt-20 bg-white py-(--spacing-section)">
          <div className="shell">
            <div className="grid gap-x-16 gap-y-6 lg:grid-cols-12" data-reveal>
              <div className="lg:col-span-7">
                <SectionLabel number="02" label="Теми" />
                <h2 className="mt-7 text-[clamp(1.8rem,3.6vw,2.6rem)] text-balance">
                  Теми кои го обликуваат современиот начин на работење
                </h2>
              </div>
              <p className="text-muted lg:col-span-5 lg:self-end">
                Области кои се клучни за успехот на поединците и организациите.
              </p>
            </div>

            <ul className="mt-14 grid gap-x-16 sm:grid-cols-2">
              {temi.map((tema, i) => (
                <li
                  key={tema}
                  className="group border-t border-navy-200 transition-colors duration-200 hover:border-navy"
                  data-reveal
                  style={delay(i * 45)}
                >
                  <div className="flex items-center gap-5 py-6 transition-[padding] duration-200 ease-out-soft group-hover:pl-2 motion-reduce:transition-none motion-reduce:group-hover:pl-0">
                    <span className="ghost-num w-[2ch] shrink-0 text-[1.75rem] leading-none transition-opacity duration-200 group-hover:opacity-100">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(1.05rem,2vw,1.3rem)] font-bold text-balance">
                      {tema}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <hr className="rule" />
          </div>
        </section>

        {/* ── 03 Мисија и визија ────────────────────────────────────────
            Two white panels on the tinted band, each with a navy edge, so the pair
            reads as a pair. Previously two untethered centred columns of grey text. */}
        <section id="misija" className="scroll-mt-20 bg-paper py-(--spacing-section)">
          <div className="shell">
            <div data-reveal>
              <SectionLabel number="03" label="Мисија и визија" />
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div
                className="border-l-2 border-navy bg-white p-8 sm:p-10"
                data-reveal
                style={delay(60)}
              >
                <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] text-balance">
                  Знаењето е највредната инвестиција
                </h2>
                <p className="mt-5 text-muted">
                  Во време кога знаењето станува највредната инвестиција, а промените се
                  случуваат побрзо од кога било, нашата мисија е едноставна: да создадеме
                  простор каде што луѓето, компаниите и институциите ќе можат постојано да
                  растат, да учат и да се развиваат.
                </p>
              </div>

              <div
                className="border-l-2 border-navy bg-white p-8 sm:p-10"
                data-reveal
                style={delay(140)}
              >
                <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] text-balance">
                  Место каде што се среќаваат луѓето и иновациите
                </h2>
                <p className="mt-5 text-muted">
                  Нашата визија е да бидеме препознатлив центар за едукација, професионален
                  развој и лидерство, место каде што се среќаваат знаењето, иновациите и
                  луѓето кои сакаат да направат чекор повеќе.
                </p>
              </div>
            </div>

            <div className="mt-16" data-reveal style={delay(80)}>
              <hr className="rule mx-auto max-w-[18rem]" />
              <p className="mx-auto mt-12 max-w-[54ch] text-center font-display text-[clamp(1.3rem,2.5vw,1.85rem)] leading-snug font-bold text-balance">
                Веруваме дека секој професионалец, без разлика дали е на почетокот од својата
                кариера или зад себе има долгогодишно искуство, заслужува пристап до современи
                знаења, практични вештини и врвни предавачи.
              </p>
            </div>
          </div>
        </section>

        {/* ── 04 Пристап ──────────────────────────────────────────────
            The navy field PLAN.md section 5 specified for this section but the
            build never applied. It is the page's structural anchor: without it the
            first six bands all sit within 1.2:1 of white and the page scrolls as
            one undifferentiated sheet. */}
        <section className="bg-navy py-(--spacing-section) text-white">
          <div className="shell">
            <div className="grid gap-x-16 gap-y-6 lg:grid-cols-12" data-reveal>
              <div className="lg:col-span-7">
                <SectionLabel number="04" label="Како работиме" onNavy />
                <h2 className="mt-7 text-[clamp(1.8rem,3.6vw,2.6rem)] text-balance text-white">
                  Најголемата вредност не се информациите, туку{" "}
                  <span className="text-navy-200">нивната примена.</span>
                </h2>
              </div>
              <p className="text-white/75 lg:col-span-5 lg:self-end">
                Токму затоа нашите обуки се интерактивни, исполнети со практични примери,
                реални ситуации, студии на случај и активности.
              </p>
            </div>

            <dl className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-3">
              {pristap.map((item, i) => (
                <div
                  key={item.naslov}
                  className="border-t border-white/25 pt-7"
                  data-reveal
                  style={delay(i * 90)}
                >
                  <dt>
                    <span className="block font-display text-[1.75rem] leading-none font-bold tabular-nums text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-4 block font-display text-lg font-bold text-white">
                      {item.naslov}
                    </span>
                  </dt>
                  <dd className="mt-3 text-white/75">{item.tekst}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── 05 Предавачи ────────────────────────────────────────── */}
        <section className="bg-paper py-(--spacing-section)">
          <div className="shell">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6" data-reveal>
                <SectionLabel number="05" label="Предавачи" />
                <h2 className="mt-7 max-w-[18ch] text-[clamp(1.8rem,3.4vw,2.4rem)] text-balance">
                  Луѓе кои знаат како теоријата да ја претворат во реална примена
                </h2>
                <p className="mt-7 max-w-[58ch] text-muted">
                  Работиме со искусни предавачи, докажани професионалци и експерти кои не
                  само што ја познаваат својата област, туку знаат како да го пренесат
                  знаењето на јасен, практичен и инспиративен начин.
                </p>
                <p className="mt-4 max-w-[58ch] text-muted">
                  Секоја завршена обука претставува нова приказна, ново искуство и уште една
                  потврда дека вистинското знаење се стекнува преку интеракција и практична
                  работа.
                </p>
              </div>

              <div className="lg:col-span-5 lg:col-start-8" data-reveal style={delay(120)}>
                {/* Native 3:2 both. A portrait crop cut the certificates in half
                    -- these two sources are close-ups where the subject already
                    fills the frame, so there is nothing to crop away. The second
                    tile insets from the left instead, which is where the stagger
                    comes from now. */}
                <div className="mx-auto max-w-[520px] lg:mx-0">
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -top-4 -left-4 hidden h-full w-full border border-navy-200 sm:block"
                    />
                    <Photo
                      src={certImg}
                      alt="Сертификати за учество на обука."
                      sizes="(min-width: 1024px) 440px, (min-width: 640px) 520px, 92vw"
                      className="relative"
                    />
                  </div>
                  <Photo
                    src={certDeskImg}
                    alt="Сертификат поставен на маса."
                    sizes="(min-width: 1024px) 350px, (min-width: 640px) 416px, 74vw"
                    className="mt-5 ml-auto w-4/5"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 06 Галерија ─────────────────────────────────────────────
            CSS-columns masonry with three tile ratios. A uniform 3-up grid of
            identical 3:2 rectangles was accurate to the sources and completely
            flat; mixed heights give the section a shape. Column order runs
            top-to-bottom per column, which is fine for a gallery. */}
        <section id="galerija" className="scroll-mt-20 bg-white py-(--spacing-section)">
          <div className="shell">
            <div className="grid gap-x-16 gap-y-6 lg:grid-cols-12" data-reveal>
              <div className="lg:col-span-7">
                <SectionLabel number="06" label="Галерија" />
                <h2 className="mt-7 text-[clamp(1.8rem,3.6vw,2.6rem)] text-balance">
                  Обуки, работилници и мастер-класови
                </h2>
              </div>
              <p className="text-muted lg:col-span-5 lg:self-end">
                Во изминатиот период успешно реализиравме обуки, работилници и
                мастер-класови со учесници од различни компании, институции и професии.
              </p>
            </div>

            <ul className="mt-14 gap-5 sm:columns-2 lg:columns-3">
              {galerija.map((foto, i) => (
                <li
                  key={foto.alt}
                  className="mb-5 break-inside-avoid"
                  data-reveal
                  style={delay((i % 3) * 70)}
                >
                  <Photo
                    src={foto.src}
                    alt={foto.alt}
                    ratio={foto.ratio}
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
                  />
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-10 max-w-[58ch] text-center text-muted" data-reveal>
              Најголемото признание за нас се задоволните учесници кои си заминуваат со нова
              перспектива, нови алатки и поголема самодоверба во својата работа.
            </p>
          </div>
        </section>

        {/* ── 07 Заклучна покана ──────────────────────────────────────
            Stays centred -- a closing call to action is the one block on the page
            that earns it. Touch devices keep the phone CTA. Desktop gets the form
            instead: `tel:` is a dead link in most desktop browsers, so the form is
            the one thing a desktop visitor can act on. It composes a mailto: draft
            -- no backend, and the page itself collects nothing. */}
        <section id="kontakt" className="scroll-mt-20 bg-navy py-(--spacing-section)">
          <div className="shell text-center">
            <div data-reveal>
              <h2 className="headline mx-auto max-w-[20ch] text-[clamp(1.9rem,4.6vw,3rem)] text-white">
                Дали сакате обука прилагодена на вас или на вашиот тим?
              </h2>

              <p className="mx-auto mt-6 max-w-[52ch] text-lg text-balance text-white/75">
                Јавете се и заедно ќе ги дефинираме темите, форматот и терминот што ви
                одговараат.
              </p>
            </div>

            <div className="mt-11 md:hidden" data-reveal style={delay(80)}>
              <CtaButton size="lg" onNavy />
              <p className="mt-5 text-sm text-white/70">
                Или преку{" "}
                <a
                  href={contact.viberHref}
                  className="inline-block -my-3 py-3 font-semibold text-white underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                >
                  Viber
                </a>
              </p>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
