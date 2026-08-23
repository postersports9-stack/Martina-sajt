/**
 * Single source of truth for brand + contact data.
 *
 * Everything marked TODO is a placeholder the client still has to supply -- see
 * PLAN.md section 7. Nothing here is invented; blanks stay blank until confirmed.
 */

export const site = {
  name: "Лабораторија на вештини",
  tagline: "едукативен центар",
  // TODO(client): confirm the Cyrillic brand name and supply the Cyrillic logo (ideally SVG).
  // The bundled logo is the English "SKILLS LAB" lockup.
  description:
    "Едукативен центар за обуки, работилници и мастер-класови од областа на лидерството, менаџментот, комуникациските вештини и професионалниот развој.",
} as const;

export const contact = {
  phoneDisplay: "071 388 876",
  phoneHref: "tel:+38971388876",
  viberHref: "viber://chat?number=%2B38971388876",
  email: "vestini.lab@gmail.com",
  // TODO(client): address and social links for the footer.
  address: "",
  social: [] as { label: string; href: string }[],
} as const;

/**
 * The one call to action on the page.
 *
 * Phone on touch devices, contact form on desktop: `tel:` is a dead link in most
 * desktop browsers, so above `md` every CTA points at the form in section 07.
 */
export const cta = {
  label: "Јави се",
  href: contact.phoneHref,
  display: contact.phoneDisplay,
  formLabel: "Контактирајте не",
  formLabelShort: "Контакт",
  formHref: "#kontakt",
} as const;

export const nav = [
  { label: "Теми", href: "#temi" },
  { label: "Мисија", href: "#misija" },
  { label: "Галерија", href: "#galerija" },
] as const;
