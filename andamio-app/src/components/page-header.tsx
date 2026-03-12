import Link from "next/link";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-font mt-3 text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-8 muted-copy">
            {description}
          </p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link className="primary-button text-base" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </header>
  );
}
