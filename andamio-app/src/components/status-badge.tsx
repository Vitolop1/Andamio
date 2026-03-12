import { cx, type BadgeTone } from "@/lib/utils";

const toneClasses: Record<BadgeTone, string> = {
  success:
    "bg-[rgba(188,203,79,0.22)] text-[var(--accent-strong)] border-[rgba(188,203,79,0.3)]",
  warning:
    "bg-[rgba(227,170,157,0.22)] text-[var(--warm-strong)] border-[rgba(227,170,157,0.28)]",
  accent:
    "bg-[rgba(146,124,183,0.14)] text-[var(--foreground)] border-[rgba(146,124,183,0.22)]",
  neutral:
    "bg-white/80 text-[var(--muted)] border-[rgba(76,63,97,0.12)]",
};

interface StatusBadgeProps {
  tone: BadgeTone;
  children: React.ReactNode;
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
