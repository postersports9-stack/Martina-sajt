/**
 * Numbered editorial section label: 01 ── ЛАБЕЛА
 * The numeral is navy now rather than muted grey -- it was the one recurring
 * element on every band and it read as disabled text. The label itself stays ink.
 */
interface Props {
  number: string;
  label: string;
  onNavy?: boolean;
  /** A few sections still centre their heading block; most are left-aligned. */
  center?: boolean;
}

export default function SectionLabel({
  number,
  label,
  onNavy = false,
  center = false,
}: Props) {
  return (
    <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      <span
        className={`font-display text-xs font-bold tabular-nums ${
          onNavy ? "text-white/70" : "text-navy"
        }`}
      >
        {number}
      </span>
      <span
        className={`h-px w-8 shrink-0 ${onNavy ? "bg-white/30" : "bg-navy-200"}`}
        aria-hidden="true"
      />
      <span
        className={`font-display text-xs font-bold tracking-[0.18em] uppercase ${
          onNavy ? "text-white/80" : "text-ink/70"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
