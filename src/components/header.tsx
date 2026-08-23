import Image from "next/image";

import logo from "@/assets/logo.png";
import { nav, site } from "@/lib/config";
import CtaButton from "./cta-button";

/**
 * Stays a server component. The scroll-linked shadow is pure CSS, keyed off
 * `html[data-scrolled]` which SiteMotion sets from a sentinel observer -- see
 * globals.css. Nothing here needs to hydrate.
 */
export default function Header() {
  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-50 border-b border-navy-100 bg-white/90 backdrop-blur-md"
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="group flex items-center gap-3"
          aria-label={`${site.name}, почетна`}
        >
          <Image
            src={logo}
            alt=""
            width={44}
            height={44}
            quality={82}
            priority
            className="h-11 w-11 object-contain object-center"
          />
          <span className="hidden font-display text-sm leading-tight font-bold text-ink transition-colors duration-200 group-hover:text-navy sm:block">
            {site.name}
            <span className="block text-[0.65rem] font-normal tracking-[0.16em] text-muted uppercase">
              {site.tagline}
            </span>
          </span>
        </a>

        <div className="flex items-center gap-6">
          <nav aria-label="Главна навигација" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => (
                <li key={item.href}>
                  {/* The rule under each link grows from the left on hover --
                      the one place a nav item can show state without shifting
                      the layout around it. */}
                  <a
                    href={item.href}
                    className="group relative inline-flex min-h-11 items-center font-display text-sm font-bold text-ink/75 transition-colors duration-200 hover:text-navy"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-3 h-0.5 origin-left scale-x-0 bg-navy transition-transform duration-200 ease-out-soft group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <CtaButton compact />
        </div>
      </div>
    </header>
  );
}
