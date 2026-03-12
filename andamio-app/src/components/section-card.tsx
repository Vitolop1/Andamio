import { cx } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({
  title,
  description,
  eyebrow,
  className,
  action,
  children,
}: SectionCardProps) {
  return (
    <section className={cx("surface-card p-7 sm:p-8", className)}>
      <div className="flex flex-col gap-5 border-b soft-divider pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="display-font mt-2 text-3xl font-semibold text-[var(--foreground)] sm:text-[2rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-base leading-7 muted-copy">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
