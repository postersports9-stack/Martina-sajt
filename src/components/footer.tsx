import Image from "next/image";

import logo from "@/assets/logo.png";
import { contact, site } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="shell py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={logo}
              alt=""
              width={56}
              height={56}
              quality={82}
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="font-display text-base leading-tight font-bold text-white">
                {site.name}
              </p>
              <p className="text-[0.7rem] tracking-[0.16em] text-white/55 uppercase">
                {site.tagline}
              </p>
            </div>
          </div>

          <div className="text-sm">
            <p className="mb-3 font-display text-xs font-bold tracking-[0.18em] text-white/60 uppercase">
              Контакт
            </p>
            <ul className="space-y-1.5">
              <li>
                <a
                  href={contact.phoneHref}
                  className="inline-flex min-h-11 items-center text-white transition-opacity duration-200 hover:opacity-70"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex min-h-11 items-center transition-opacity duration-200 hover:opacity-70"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.address && <li>{contact.address}</li>}
            </ul>
          </div>
        </div>

        <hr className="rule rule-on-navy my-10" />

        <p className="text-xs text-white/50">
          © {year} {site.name}. Сите права задржани.
        </p>
      </div>
    </footer>
  );
}
