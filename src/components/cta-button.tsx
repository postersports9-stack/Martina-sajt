import { cta } from "@/lib/config";

/**
 * The page's single call to action: a `tel:` anchor with the number rendered as
 * visible text, so a desktop visitor can read and dial it even though `tel:`
 * does nothing in most desktop browsers. Navy fill + white text = 11.6:1.
 */
interface Props {
  size?: "md" | "lg";
  /** Drops the number below `sm` so the button still fits a 375px header. */
  compact?: boolean;
  /** Inverted fill for use on a navy background. */
  onNavy?: boolean;
  className?: string;
}

export default function CtaButton({
  size = "md",
  compact = false,
  onNavy = false,
  className = "",
}: Props) {
  const sizing =
    size === "lg"
      ? "text-base sm:text-lg px-9 py-4 gap-3"
      : compact
        ? "text-sm px-5 py-2.5 gap-2 sm:px-6 sm:py-3"
        : "text-base px-6 py-3 gap-2.5";

  const colours = onNavy
    ? "bg-white text-navy hover:bg-paper hover:shadow-lg hover:shadow-black/25"
    : "bg-navy text-white hover:bg-navy-deep hover:shadow-lg hover:shadow-navy/30";

  /* 200ms on colour + shadow, and a 1px lift on hover. Deliberately no
     scale: the button sits inline with text on three bands and a scale
     transform on a pill that wide reads as a wobble, not a press. */
  const motion =
    "transition-[background-color,box-shadow,transform] duration-200 ease-out-soft " +
    "hover:-translate-y-px active:translate-y-0 active:duration-75 " +
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0";

  const base = `inline-flex min-h-12 items-center justify-center rounded-full font-display font-bold tracking-wide uppercase cursor-pointer [touch-action:manipulation] ${motion} ${sizing} ${colours} ${className}`;

  return (
    <a href={cta.href} className={base}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5 shrink-0"
        aria-hidden="true"
      >
        <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
      <span className="whitespace-nowrap">
        {cta.label}
        <span className={compact ? "hidden sm:inline" : ""}>: {cta.display}</span>
      </span>
    </a>
  );
}
