"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import {
  primaryNavigationItems,
  secondaryNavigationItems,
} from "@/lib/navigation";
import type { ProfessionalProfile } from "@/lib/types";
import { cx } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  currentProfessional: ProfessionalProfile;
  sessionsToday: number;
  studentCount: number;
  dataSource: "mock" | "supabase";
}

export function AppShell({
  children,
  currentProfessional,
  sessionsToday,
  studentCount,
  dataSource,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid min-h-screen max-w-[1640px] gap-6 px-4 py-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-6">
      <aside className="surface-card flex flex-col gap-6 p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <Link
          className="flex flex-col items-center rounded-[24px] bg-white/86 px-5 py-5 text-center shadow-[0_18px_46px_rgba(121,98,162,0.1)]"
          href="/"
        >
          <Image
            alt="Andamio"
            className="h-auto w-[220px] sm:w-[250px]"
            height={120}
            priority
            src="/andamiologo.png"
            width={250}
          />
        </Link>

        <div className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Sesion activa
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
            {currentProfessional.name}
          </p>
          <p className="mt-1 text-sm muted-copy">{currentProfessional.roleLabel}</p>
        </div>

        <nav className="space-y-2">
          {primaryNavigationItems.map((item) => {
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

        <div className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Mas opciones
          </p>
          <div className="mt-3 space-y-2">
            {secondaryNavigationItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  className={cx(
                    "flex items-center gap-3 rounded-[18px] px-3 py-2.5 transition",
                    active
                      ? "bg-[color:var(--primary-soft)] text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-[color:var(--primary-soft)] hover:text-[var(--foreground)]",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <Link className="primary-button w-full text-base" href="/upload">
            Subir archivo
          </Link>
          <div className="rounded-[22px] border border-[rgba(76,63,97,0.08)] bg-white/82 px-4 py-3">
            <p className="text-sm text-[var(--muted)]">
              {dataSource === "supabase" ? "Plataforma conectada" : "Conexion de respaldo"}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {studentCount} alumnos y {sessionsToday} horarios hoy
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-6">
        <header className="surface-card grid gap-4 px-5 py-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div />

          <div className="flex justify-center">
            <Link className="rounded-[22px] bg-white/84 px-5 py-3" href="/">
              <Image
                alt="Andamio"
                className="h-auto w-[210px] sm:w-[240px]"
                height={96}
                src="/andamiologo.png"
                width={240}
              />
            </Link>
          </div>

          <div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-end">
            <div className="flex items-center gap-3 rounded-full border border-[rgba(76,63,97,0.08)] bg-white/82 px-4 py-2.5">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--primary)] font-semibold text-white">
                {currentProfessional.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {currentProfessional.name}
                </p>
                <p className="text-xs muted-copy">{currentProfessional.roleLabel}</p>
              </div>
            </div>

            {dataSource === "supabase" ? <LogoutButton /> : null}
          </div>
        </header>

        <main className="pb-10">{children}</main>
      </div>
    </div>
  );
}
