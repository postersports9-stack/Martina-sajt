import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { preload } from "react-dom";

import "./globals.css";
import SiteMotion from "@/components/site-motion";
import { site } from "@/lib/config";

const title = `${site.name} | ${site.tagline}`;

export const metadata: Metadata = {
  title,
  description: site.description,
  icons: { icon: "/favicon.svg" },
  /* Suppresses the browser's "translate this page?" prompt: the page is
     Macedonian on purpose, and Chrome offers to translate it away on every visit. */
  other: { google: "notranslate" },
  openGraph: {
    title,
    description: site.description,
    locale: "mk_MK",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b3761",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  /* Only the two above-the-fold faces are preloaded. Cyrillic first: this is a
     Macedonian page, so the Latin subsets are rarely the critical path. These are
     hand-rolled rather than `next/font/local` because the woff2 files are split by
     `unicode-range`, which next/font has no way to express per source file.

     `preload()` rather than a rendered <link>: React hoists a rendered preload
     element *and* keeps the element, which emits the tag twice. */
  preload("/fonts/manrope-800-cyrillic.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  preload("/fonts/source-sans-3-400-cyrillic.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <html lang="mk" translate="no">
      <body id="top">
        {/* Parser-blocking and first in the body, so `.js` lands before the first
            paint. Everything the reveal CSS hides is hidden only under `.js`,
            which means no-JS readers -- and the pre-hydration frame -- get the
            fully visible page instead of a flash of empty sections. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.className='js'" }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-sm focus:bg-navy focus:px-4 focus:py-2 focus:font-display focus:font-bold focus:text-white"
        >
          Кон главната содржина
        </a>

        {/* Watched instead of a scroll listener; drives the header shadow. */}
        <div id="scroll-sentinel" aria-hidden="true" className="absolute top-0 h-px w-px" />

        {children}
        <SiteMotion />
      </body>
    </html>
  );
}
