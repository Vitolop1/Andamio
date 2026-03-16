import { loadAppData } from "@/lib/app-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { SECTION_PLURAL_LABEL } from "@/lib/section-labels";

export const metadata = {
  title: SECTION_PLURAL_LABEL,
};

export default async function CoursesPage() {
  const data = await loadAppData();

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref="/students"
        actionLabel="Abrir alumnos"
        eyebrow="Grupos, talleres y apoyo"
        title="Secciones, talleres y clases de apoyo"
      />

      <SectionCard
        eyebrow="Vista general"
        title="Espacios activos"
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {data.courses.map((course) => {
            const institution = data.institutions.find(
              (item) => item.id === course.institutionId,
            );

            return (
              <article
                className="rounded-[30px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-6"
                key={course.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">
                        {course.schoolYear} - {course.level}
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                        {course.name}
                      </h2>
                      <p className="mt-2 text-base muted-copy">
                        {institution?.name} - Modalidad {course.shift.toLowerCase()}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-[rgba(188,203,79,0.18)] px-5 py-4 text-center">
                    <p className="text-3xl font-semibold text-[var(--foreground)]">
                      {course.studentCount}
                    </p>
                    <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      alumnos
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-[rgba(146,124,183,0.12)] p-5">
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      Referente
                    </p>
                    <p className="mt-2 text-base muted-copy">{course.teacher}</p>
                  </div>
                  <div className="rounded-[24px] bg-[rgba(227,170,157,0.2)] p-5">
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      Focos de trabajo
                    </p>
                    <p className="mt-2 text-base muted-copy">
                      {course.subjects.length} focos cargados
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {course.subjects.map((subject) => (
                    <span
                      className="rounded-full border border-[rgba(76,63,97,0.08)] bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--foreground)]"
                      key={subject}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
