import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarRange,
  FileUp,
  GraduationCap,
} from "lucide-react";
import { LibrarySearchPanel } from "@/components/library-search-panel";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { loadAppData } from "@/lib/app-data";
import { formatDate, formatIsoDate } from "@/lib/utils";

const quickActions = [
  {
    href: "/upload",
    label: "Subir archivo",
    icon: FileUp,
    toneClass: "bg-[rgba(188,203,79,0.2)] text-[var(--accent-strong)]",
  },
  {
    href: "/students/new",
    label: "Agregar alumno",
    icon: GraduationCap,
    toneClass: "bg-[rgba(146,124,183,0.14)] text-[var(--primary-strong)]",
  },
  {
    href: "/institutions/new",
    label: "Agregar colegio",
    icon: Building2,
    toneClass: "bg-[rgba(227,170,157,0.22)] text-[var(--warm-strong)]",
  },
  {
    href: "/schedule",
    label: "Ver horarios",
    icon: CalendarRange,
    toneClass: "bg-[rgba(146,124,183,0.14)] text-[var(--primary-strong)]",
  },
];

export default async function DashboardPage() {
  const data = await loadAppData();
  const todayIso = formatIsoDate(new Date());
  const sessionsToday = data.scheduleEvents
    .filter((event) => event.date === todayIso)
    .slice(0, 4);
  const recentFiles = data.libraryFiles.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="surface-card px-7 py-8 text-center sm:px-10 sm:py-10">
        <Link className="mx-auto flex w-fit justify-center" href="/">
          <Image
            alt="Logo de Andamio"
            className="h-auto w-[220px] sm:w-[280px]"
            height={150}
            priority
            src="/andamiologo.png"
            width={280}
          />
        </Link>
        <p className="eyebrow mt-6">Dashboard principal</p>
        <h1 className="display-font mt-4 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
          Inicio
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              className="surface-card block p-6 transition hover:-translate-y-0.5"
              href={action.href}
              key={action.href}
            >
              <div
                className={`grid h-[52px] w-[52px] place-items-center rounded-[22px] ${action.toneClass}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-[var(--foreground)]">
                {action.label}
              </h2>
            </Link>
          );
        })}
      </section>

      <SectionCard
        eyebrow="Busqueda de archivos"
        title="Encontrar material rapido"
      >
        <LibrarySearchPanel
          action="/library"
          compact
          courses={data.courses}
          institutions={data.institutions}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <SectionCard
          eyebrow="Hoy"
          title="Horarios de hoy"
          action={
            <Link className="secondary-button text-base" href="/schedule">
              Ver agenda completa
            </Link>
          }
        >
          <div className="space-y-3">
            {sessionsToday.length ? (
              sessionsToday.map((event) => {
                const student = event.studentId
                  ? data.students.find((item) => item.id === event.studentId)
                  : null;

                return (
                  <article
                    className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5"
                    key={event.id}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[var(--foreground)]">
                          {event.title}
                        </p>
                        <p className="mt-1 text-base muted-copy">
                          {event.startTime} - {event.endTime} - {event.location}
                        </p>
                        {student ? (
                          <p className="mt-3 text-base text-[var(--foreground)]">
                            Alumno: {student.firstName} {student.lastName}
                          </p>
                        ) : null}
                      </div>
                      <StatusBadge tone="neutral">{event.status}</StatusBadge>
                    </div>
                  </article>
                );
              })
            ) : (
              <article className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5 text-base muted-copy">
                No hay horarios cargados para hoy todavia.
              </article>
            )}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Accesos"
          title="Administracion rapida"
        >
          <div className="grid gap-3">
            <Link
              className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5 text-base font-semibold text-[var(--foreground)] transition hover:bg-[rgba(146,124,183,0.08)]"
              href="/professionals/new"
            >
              Crear acceso de profesional
            </Link>
            <Link
              className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5 text-base font-semibold text-[var(--foreground)] transition hover:bg-[rgba(146,124,183,0.08)]"
              href="/library"
            >
              Ir a biblioteca
            </Link>
            <Link
              className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5 text-base font-semibold text-[var(--foreground)] transition hover:bg-[rgba(146,124,183,0.08)]"
              href="/courses"
            >
              Ver secciones y grados
            </Link>
            <div className="rounded-[24px] bg-[rgba(188,203,79,0.18)] p-5">
              <p className="text-base font-semibold text-[var(--foreground)]">
                Resumen rapido
              </p>
              <p className="mt-2 text-base muted-copy">
                {data.students.length} alumnos, {data.institutions.length} colegios y{" "}
                {data.professionals.length} accesos activos.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        eyebrow="Biblioteca"
        title="Ultimos archivos"
        action={
          <Link className="primary-button text-base" href="/upload">
            Subir archivo
          </Link>
        }
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {recentFiles.map((file) => (
            <article
              className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5"
              key={file.id}
            >
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {file.title}
              </p>
              <p className="mt-2 text-base muted-copy">
                {file.kind} - {file.gradeLabel ?? file.scope}
              </p>
              <p className="mt-3 text-base text-[var(--foreground)]">
                {file.subject} - {file.year}
              </p>
              <p className="mt-2 text-sm muted-copy">
                {formatDate(file.uploadedAt, {
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
