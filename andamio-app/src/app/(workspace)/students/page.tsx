import Link from "next/link";
import { loadAppData } from "@/lib/app-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, studentStatusMeta } from "@/lib/utils";

export const metadata = {
  title: "Alumnos",
};

export default async function StudentsPage() {
  const data = await loadAppData();
  const supportSummary = Object.entries(
    data.students.reduce<Record<string, number>>((accumulator, student) => {
      accumulator[student.supportFocus] =
        (accumulator[student.supportFocus] ?? 0) + 1;
      return accumulator;
    }, {}),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref="/students/new"
        actionLabel="Agregar alumno"
        description="El centro real del producto esta aca: ficha clara, historial accesible y contexto suficiente para actuar sin revisar veinte conversaciones previas."
        eyebrow="Seguimiento individual"
        title="Alumnos activos"
      />

      <SectionCard
        description="Una lectura rapida de donde esta puesto el foco profesional en este momento."
        eyebrow="Panorama"
        title="Areas de apoyo mas frecuentes"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {supportSummary.map(([focus, count]) => (
            <article
              className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5"
              key={focus}
            >
              <p className="text-lg font-semibold text-[var(--foreground)]">{focus}</p>
              <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
                {count}
              </p>
              <p className="text-base muted-copy">alumnos en seguimiento</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        description="Cada tarjeta deberia permitir entrar al historial del alumno sin perder el contexto de institucion, curso ni foco de trabajo."
        eyebrow="Listado operativo"
        title="Fichas activas"
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {data.students.map((student) => {
            const institution = data.institutions.find(
              (item) => item.id === student.institutionId,
            );
            const course = data.courses.find((item) => item.id === student.courseId);
            const status = studentStatusMeta[student.status];

            return (
              <article
                className="rounded-[30px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-6"
                key={student.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="eyebrow">
                      {institution?.name} - {course?.name}
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                      {student.firstName} {student.lastName}
                    </h2>
                    <p className="mt-2 text-base muted-copy">
                      {student.age} anos - {student.professional}
                    </p>
                  </div>
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-[rgba(188,203,79,0.18)] p-5">
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      Foco actual
                    </p>
                    <p className="mt-2 text-base muted-copy">
                      {student.supportFocus}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[rgba(227,170,157,0.2)] p-5">
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      Proxima sesion
                    </p>
                    <p className="mt-2 text-base muted-copy">
                      {formatDate(student.nextSession, {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-base leading-7 muted-copy">{student.notes}</p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-base text-[var(--foreground)]">
                    Contacto familiar:{" "}
                    <span className="font-semibold">{student.familyContact}</span>
                  </p>
                  <Link className="primary-button text-base" href={`/students/${student.id}`}>
                    Abrir ficha
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
