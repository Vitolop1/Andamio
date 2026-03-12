import Link from "next/link";
import { ArrowLeft, BookOpenText, MapPin, UsersRound } from "lucide-react";
import {
  publicLocations,
  publicServices,
  publicTeam,
} from "@/lib/public-site";

export const metadata = {
  title: "Sobre Andamio",
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="surface-card space-y-8 p-8 sm:p-10">
        <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Sobre Andamio</p>
            <h1 className="display-font mt-4 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
              Un espacio profesional para acompanar aprendizajes.
            </h1>
          </div>
          <Link className="secondary-button text-base" href="/">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {publicTeam.map((member) => (
            <article
              className="rounded-[28px] border border-[rgba(76,63,97,0.08)] bg-white/84 p-6"
              key={member.name}
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(146,124,183,0.12)] text-[var(--primary-strong)]">
                <UsersRound className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xl font-semibold text-[var(--foreground)]">
                {member.name}
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                {member.role}
              </p>
              <p className="mt-4 text-base leading-7 muted-copy">{member.bio}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {publicServices.map((service) => (
            <article
              className="rounded-[28px] border border-[rgba(76,63,97,0.08)] bg-white/84 p-6"
              key={service}
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(188,203,79,0.18)] text-[var(--accent-strong)]">
                <BookOpenText className="h-5 w-5" />
              </div>
              <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                {service}
              </p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {publicLocations.map((location) => (
            <article
              className="rounded-[28px] border border-[rgba(76,63,97,0.08)] bg-white/84 p-6"
              key={location.href}
            >
              <p className="text-xl font-semibold text-[var(--foreground)]">
                {location.title}
              </p>
              <p className="mt-3 text-base leading-7 muted-copy">{location.note}</p>
              <a
                className="secondary-button mt-5 text-base"
                href={location.href}
                rel="noreferrer"
                target="_blank"
              >
                <MapPin className="h-4 w-4" />
                Ver ubicacion
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
