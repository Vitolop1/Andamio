import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Instagram,
  MapPin,
  Music2,
  UsersRound,
} from "lucide-react";
import {
  publicHighlights,
  publicLocations,
  publicNetworks,
  publicServices,
  publicTeam,
} from "@/lib/public-site";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="surface-card overflow-hidden px-6 py-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <Link className="flex items-center justify-center lg:justify-start" href="/">
              <Image
                alt="Logo de Andamio"
                className="h-auto w-[260px] sm:w-[320px]"
                height={120}
                priority
                src="/andamiologo.png"
                width={320}
              />
            </Link>

            <nav className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-[var(--muted)]">
              <a href="#quienes-somos">Quienes somos</a>
              <a href="#servicios">Que hacemos</a>
              <a href="#ubicacion">Ubicacion</a>
              <a href="#contacto">Contacto</a>
              <Link className="primary-button px-5 py-3 text-sm" href="/login">
                Ingresar
              </Link>
            </nav>
          </header>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_320px]">
            <article className="surface-card-strong p-8 sm:p-10">
              <p className="eyebrow">Consultorio y aula virtual</p>
              <h1 className="display-font mt-4 max-w-4xl text-5xl font-semibold leading-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                Andamio es un espacio profesional para acompanar a chicos y ordenar el trabajo del equipo.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 muted-copy">
                Reunimos informes, materiales, tareas, horarios y seguimiento en una sola plataforma privada para profesionales, familias y alumnos.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="primary-button text-base" href="/login">
                  Acceso profesional
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className="secondary-button text-base" href="/nosotros">
                  Sobre Andamio
                </Link>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  "Acompanamiento",
                  "Biblioteca privada",
                  "Portal alumno",
                ].map((item) => (
                  <div
                    className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/84 px-5 py-4 text-base font-semibold text-[var(--foreground)]"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <aside className="flex flex-col gap-6">
              <article className="surface-card p-6">
                <p className="eyebrow">Banner lateral</p>
                <div className="mt-4 rounded-[26px] border border-dashed border-[rgba(76,63,97,0.18)] bg-[rgba(188,203,79,0.12)] px-5 py-8">
                  <p className="text-lg font-semibold text-[var(--foreground)]">
                    Espacio para anuncios o informacion importante.
                  </p>
                  <p className="mt-3 text-base muted-copy">
                    Placeholder listo para sumar avisos del consultorio.
                  </p>
                </div>
              </article>

              <article className="surface-card p-6">
                <p className="eyebrow">Modo de trabajo</p>
                <div className="mt-4 space-y-4">
                  {publicHighlights.map((item) => (
                    <div className="flex items-start gap-3" key={item}>
                      <div className="mt-1 grid h-9 w-9 place-items-center rounded-2xl bg-[rgba(146,124,183,0.12)] text-[var(--primary-strong)]">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                      <p className="text-base leading-7 text-[var(--foreground)]">{item}</p>
                    </div>
                  ))}
                </div>
              </article>
            </aside>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" id="quienes-somos">
        <div className="surface-card p-8 sm:p-10">
          <p className="eyebrow">Quienes somos</p>
          <h2 className="display-font mt-4 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
            Un equipo profesional dedicado al acompanamiento y al aprendizaje.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {publicTeam.map((member) => (
              <article
                className="rounded-[28px] border border-[rgba(76,63,97,0.08)] bg-white/84 p-6"
                key={member.name}
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[rgba(146,124,183,0.12)] text-[var(--primary-strong)]">
                  <UsersRound className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xl font-semibold text-[var(--foreground)]">
                  {member.name}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  {member.role}
                </p>
                <p className="mt-4 text-base leading-7 muted-copy">
                  Equipo profesional de Andamio.
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="surface-card p-6" id="contacto">
          <p className="eyebrow">Nuestras redes</p>
          <h3 className="display-font mt-4 text-3xl font-semibold text-[var(--foreground)]">
            Instagram y TikTok
          </h3>
          <div className="mt-6 grid gap-3">
            {publicNetworks.map((network) => (
              <a
                className="secondary-button w-full justify-start gap-4 px-5 py-4 text-base"
                href={network.href}
                key={network.name}
              >
                {network.name === "Instagram" ? (
                  <Instagram className="h-7 w-7" />
                ) : (
                  <Music2 className="h-7 w-7" />
                )}
                {network.name}
              </a>
            ))}
          </div>
          <p className="mt-5 text-base leading-7 muted-copy">
            Bloque listo para conectar sus redes cuando definan los links finales.
          </p>
        </aside>
      </section>

      <section className="surface-card mt-6 p-8 sm:p-10" id="servicios">
        <p className="eyebrow">Que hacemos</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]" id="ubicacion">
        {publicLocations.map((location) => (
          <article className="surface-card p-8" key={location.href}>
            <p className="eyebrow">Ubicacion</p>
            <h3 className="display-font mt-4 text-3xl font-semibold text-[var(--foreground)]">
              {location.title}
            </h3>
            <p className="mt-4 text-base leading-7 muted-copy">{location.note}</p>
            <a
              className="secondary-button mt-6 text-base"
              href={location.href}
              rel="noreferrer"
              target="_blank"
            >
              <MapPin className="h-4 w-4" />
              Ver en Google Maps
            </a>
          </article>
        ))}
      </section>

      <section className="surface-card mt-6 p-8 text-center sm:p-10">
        <p className="eyebrow">Banner inferior</p>
        <div className="mt-4 rounded-[30px] border border-dashed border-[rgba(76,63,97,0.18)] bg-[rgba(227,170,157,0.12)] px-6 py-10">
          <p className="display-font text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Espacio reservado para avisos, novedades o informacion destacada.
          </p>
        </div>
      </section>
    </main>
  );
}
