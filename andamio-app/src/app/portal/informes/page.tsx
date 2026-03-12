import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { loadStudentPortalData } from "@/lib/student-portal-data";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Informes",
};

export default async function StudentReportsPage() {
  const data = await loadStudentPortalData();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Portal alumno" title="Informes" />

      <SectionCard eyebrow="Alumno" title={`${data.student.firstName} ${data.student.lastName}`}>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[24px] bg-[rgba(188,203,79,0.18)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
              Colegio
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              {data.student.institutionName}
            </p>
          </article>
          <article className="rounded-[24px] bg-[rgba(146,124,183,0.12)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
              Curso
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              {data.student.courseName}
            </p>
          </article>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Historial" title="Informes cargados">
        <div className="space-y-3">
          {data.evaluations.length ? (
            data.evaluations.map((evaluation) => (
              <article
                className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5"
                key={evaluation.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      {evaluation.title}
                    </p>
                    <p className="mt-1 text-sm muted-copy">{evaluation.type}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(188,203,79,0.22)] px-3 py-1 text-sm font-semibold text-[var(--accent-strong)]">
                    {formatDate(evaluation.date, {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="mt-3 text-base muted-copy">{evaluation.summary}</p>
              </article>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-5 py-8 text-base muted-copy">
              Todavia no hay informes.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
