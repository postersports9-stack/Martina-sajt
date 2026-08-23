"use client";

import { useEffect } from "react";

/**
 * The page's entire client-side JS. One mount, two IntersectionObservers, no
 * scroll listeners -- scroll handlers on a page this long are the one thing that
 * would actually cost frames.
 *
 *   1. Reveal    -- fades `[data-reveal]` groups up on first entry, then stops
 *                   observing them. Stagger comes from `--reveal-delay` set in
 *                   the markup, so the observer stays a single generic pass.
 *   2. Scrolled  -- a 1px sentinel at the top of the document. When it leaves
 *                   the viewport the header has something above it to sit on, so
 *                   `data-scrolled` on <html> lights the header shadow.
 *
 * Both are skipped entirely under prefers-reduced-motion; the CSS start state is
 * gated behind the same query, so skipping leaves everything visible.
 */
export default function SiteMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Header shadow is a state change, not an animation -- it runs either way. */
    const root = document.documentElement;
    const sentinel = document.getElementById("scroll-sentinel");
    let topObserver: IntersectionObserver | undefined;

    if (sentinel) {
      topObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) root.removeAttribute("data-scrolled");
          else root.setAttribute("data-scrolled", "");
        },
        { threshold: 0 },
      );
      topObserver.observe(sentinel);
    }

    if (reduced) return () => topObserver?.disconnect();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      },
      /* Fires a little before the group is fully on screen, so the fade has
         finished by the time the reader's eye arrives. */
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    for (const el of document.querySelectorAll("[data-reveal]")) {
      revealObserver.observe(el);
    }

    return () => {
      topObserver?.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  return null;
}
