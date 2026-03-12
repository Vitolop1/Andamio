"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FileStack, FileText } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { cx } from "@/lib/utils";

const studentNavigation = [
  {
    href: "/portal/informes",
    label: "Informes",
    icon: FileText,
  },
  {
    href: "/portal/tareas",
    label: "Tareas",
    icon: ClipboardList,
  },
  {
    href: "/portal/archivos",
    label: "Archivos",
    icon: FileStack,
  },
];

interface StudentShellProps {
  children: React.ReactNode;
  studentName: string;
}

export function StudentShell({ children, studentName }: StudentShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid min-h-screen max-w-[1480px] gap-6 px-4 py-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-6">
      <aside className="surface-card flex flex-col gap-6 p-5 lg:sticky lg:top-4 lg:h-fit">
        <Link
          className="flex flex-col items-center rounded-[24px] bg-white/86 px-5 py-5 text-center"
          href="/portal/informes"
        >
          <Image
            alt="Andamio"
            className="h-auto w-[200px]"
            height={110}
            priority
            src="/andamiologo.png"
            width={220}
          />
        </Link>

        <div className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 px-4 py-4">
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
            {studentName}
          </p>
        </div>

        <nav className="space-y-2">
          {studentNavigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={cx(
                  "flex items-center gap-3 rounded-[22px] border px-4 py-3.5 transition",
                  active
                    ? "border-[color:var(--border)] bg-[color:var(--primary-soft)]"
                    : "border-transparent hover:border-[color:var(--border)] hover:bg-white/74",
                )}
                href={item.href}
                key={item.href}
              >
                <div
                  className={cx(
                    "grid h-10 w-10 place-items-center rounded-2xl",
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-strong)] text-[var(--foreground)]",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <p className="text-base font-semibold text-[var(--foreground)]">
                  {item.label}
                </p>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      <main className="pb-10">{children}</main>
    </div>
  );
}
