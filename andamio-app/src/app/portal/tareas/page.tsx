import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { loadStudentPortalData } from "@/lib/student-portal-data";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Tareas",
};

export default async function StudentTasksPage() {
  const data = await loadStudentPortalData();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Portal alumno" title="Tareas" />

      <SectionCard eyebrow="Pendientes" title="Actividades">
        <div className="space-y-3">
          {data.assignments.length ? (
            data.assignments.map((assignment) => (
              <article
                className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5"
                key={assignment.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      {assignment.title}
                    </p>
                    <p className="mt-2 text-sm muted-copy">{assignment.description}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(188,203,79,0.22)] px-3 py-1 text-sm font-semibold text-[var(--accent-strong)]">
                    {assignment.dueAt
                      ? formatDate(assignment.dueAt, {
                          day: "numeric",
                          month: "short",
                        })
                      : "Sin fecha"}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-5 py-8 text-base muted-copy">
              No hay tareas cargadas.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
