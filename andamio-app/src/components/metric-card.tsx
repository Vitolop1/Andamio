import { cx } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  tone?: "accent" | "warm" | "neutral";
}

const toneClasses = {
  accent: "from-[rgba(188,203,79,0.28)] to-transparent",
  warm: "from-[rgba(227,170,157,0.26)] to-transparent",
  neutral: "from-[rgba(146,124,183,0.18)] to-transparent",
};

export function MetricCard({
  label,
  value,
  helper,
  tone = "accent",
}: MetricCardProps) {
  return (
    <article className="surface-card relative overflow-hidden p-6 sm:p-7">
      <div
        className={cx(
          "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b",
          toneClasses[tone],
        )}
      />
      <p className="eyebrow relative">{label}</p>
      <p className="relative mt-7 text-4xl font-semibold text-[var(--foreground)] sm:text-[2.75rem]">
        {value}
      </p>
      <p className="relative mt-3 text-base leading-7 muted-copy">{helper}</p>
    </article>
  );
}
