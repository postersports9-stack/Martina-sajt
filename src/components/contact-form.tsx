"use client";

import type { FormEvent } from "react";

import { contact } from "@/lib/config";

/* Form field classes: white fill on navy keeps input text at 16.6:1 and survives
   browser autofill, which repaints translucent fills unpredictably. */
const polje =
  "mt-2 block w-full rounded-md border border-white/20 bg-white px-4 py-3 font-sans text-base text-ink " +
  "transition-shadow duration-200 ease-out-soft placeholder:text-muted " +
  "hover:shadow-md hover:shadow-black/20 motion-reduce:transition-none";
const etiketa =
  "block font-display text-xs font-bold tracking-[0.18em] text-white/70 uppercase";

/**
 * Composes a mailto: draft from the form. There is no backend and the page itself
 * collects nothing -- native validation runs first, so the required fields are
 * already filled by the time the handler fires.
 */
export default function ContactForm() {
  function onSubmit(nastan: FormEvent<HTMLFormElement>) {
    nastan.preventDefault();
    const podatoci = new FormData(nastan.currentTarget);
    const v = (ime: string) => (podatoci.get(ime) ?? "").toString().trim();

    const redovi = [`Име: ${v("ime")}`];
    if (v("kompanija")) redovi.push(`Компанија: ${v("kompanija")}`);
    redovi.push(`Е-пошта: ${v("email")}`);
    if (v("telefon")) redovi.push(`Телефон: ${v("telefon")}`);
    redovi.push("", v("poraka"));

    window.location.href =
      `mailto:${contact.email}` +
      `?subject=${encodeURIComponent(`Барање за обука: ${v("ime")}`)}` +
      `&body=${encodeURIComponent(redovi.join("\n"))}`;
  }

  return (
    <form
      id="kontakt-forma"
      onSubmit={onSubmit}
      className="mx-auto mt-12 hidden max-w-2xl text-left md:block"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={etiketa} htmlFor="f-ime">
            Име и презиме
          </label>
          <input className={polje} id="f-ime" name="ime" type="text" autoComplete="name" required />
        </div>
        <div>
          <label className={etiketa} htmlFor="f-kompanija">
            Компанија или институција (по избор)
          </label>
          <input
            className={polje}
            id="f-kompanija"
            name="kompanija"
            type="text"
            autoComplete="organization"
          />
        </div>
        <div>
          <label className={etiketa} htmlFor="f-email">
            Е-пошта
          </label>
          <input
            className={polje}
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className={etiketa} htmlFor="f-telefon">
            Телефон (по избор)
          </label>
          <input className={polje} id="f-telefon" name="telefon" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="mt-5">
        <label className={etiketa} htmlFor="f-poraka">
          Порака
        </label>
        <textarea className={polje} id="f-poraka" name="poraka" rows={4} required />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="submit"
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-white px-9 py-4 font-display text-base font-bold tracking-wide text-navy uppercase transition-[background-color,box-shadow,transform] duration-200 ease-out-soft hover:-translate-y-px hover:bg-paper hover:shadow-lg hover:shadow-black/25 active:translate-y-0 active:duration-75 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Испрати барање
        </button>
        <p className="text-sm text-white/70">
          Или директно на{" "}
          <a
            href={`mailto:${contact.email}`}
            className="font-semibold text-white underline underline-offset-4 hover:opacity-70"
          >
            {contact.email}
          </a>
        </p>
      </div>

      <p className="mt-5 text-sm text-white/60">
        Барањето се отвора како подготвена порака во вашиот клиент за е-пошта.
      </p>
    </form>
  );
}
