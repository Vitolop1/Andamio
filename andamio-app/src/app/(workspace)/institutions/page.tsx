import Link from "next/link";
import { loadAppData } from "@/lib/app-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export const metadata = {
  title: "Instituciones",
};

export default async function InstitutionsPage() {
  const data = await loadAppData();

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref="/institutions/new"
        actionLabel="Agregar colegio"
        description="Las instituciones quedan mucho mas claras en formato lista: ves rapido quien lleva cada colegio, cuantos cursos tiene y cuantos archivos ya se cargaron."
        eyebrow="Base institucional"
        title="Colegios y consultorios"
      />

      <SectionCard
        description="Esta vista esta pensada para que scrollees una sola lista y ubiques al toque donde falta cargar alumnos, cursos o archivos."
        eyebrow="Lista general"
        title="Instituciones activas"
      >
        <div className="space-y-4">
          {data.institutions.map((institution) => {
            const relatedCourses = data.courses.filter(
              (course) => course.institutionId === institution.id,
            );
            const relatedFiles = data.libraryFiles.filter(
              (file) => file.institutionId === institution.id,
            );

            return (
              <article
                className="rounded-[30px] border border-[rgba(76,63,97,0.08)] bg-white/84 p-6"
                key={institution.id}
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="eyebrow">
                          {institution.city}, {institution.province}
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                          {institution.name}
                        </h2>
                      </div>
                      <span className="rounded-full bg-[rgba(188,203,79,0.22)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
                        {institution.lastUpdate}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                      <div className="rounded-[24px] bg-[rgba(188,203,79,0.18)] p-5">
                        <p className="text-3xl font-semibold text-[var(--foreground)]">
                          {institution.activeStudents}
                        </p>
                        <p className="mt-1 text-base muted-copy">alumnos</p>
                      </div>
                      <div className="rounded-[24px] bg-[rgba(146,124,183,0.12)] p-5">
                        <p className="text-3xl font-semibold text-[var(--foreground)]">
                          {institution.activeCourses}
                        </p>
                        <p className="mt-1 text-base muted-copy">cursos</p>
                      </div>
                      <div className="rounded-[24px] bg-[rgba(227,170,157,0.18)] p-5">
                        <p className="text-3xl font-semibold text-[var(--foreground)]">
                          {relatedFiles.length}
                        </p>
                        <p className="mt-1 text-base muted-copy">archivos subidos</p>
                      </div>
                      <div className="rounded-[24px] bg-[rgba(146,124,183,0.1)] p-5">
                        <p className="text-lg font-semibold text-[var(--foreground)]">
                          {institution.lead}
                        </p>
                        <p className="mt-1 text-base muted-copy">referente</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-base font-semibold text-[var(--foreground)]">
                        Cursos cargados
                      </p>
                      {relatedCourses.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {relatedCourses.map((course) => (
                            <span
                              className="rounded-full border border-[rgba(76,63,97,0.08)] bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--foreground)]"
                              key={course.id}
                            >
                              {course.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-base muted-copy">
                          Todavia no hay cursos cargados para este colegio.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full xl:max-w-[320px]">
                    <div className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-[rgba(255,255,255,0.8)] p-5">
                      <p className="text-base font-semibold text-[var(--foreground)]">
                        Ultimos archivos
                      </p>
                      <div className="mt-4 space-y-3">
                        {relatedFiles.length ? (
                          relatedFiles.slice(0, 3).map((file) => (
                            <article
                              className="rounded-[22px] bg-[rgba(146,124,183,0.08)] px-4 py-3"
                              key={file.id}
                            >
                              <p className="text-base font-semibold text-[var(--foreground)]">
                                {file.title}
                              </p>
                              <p className="mt-1 text-sm muted-copy">
                                {file.gradeLabel ?? file.scope} - {file.subject}
                              </p>
                            </article>
                          ))
                        ) : (
                          <p className="text-base muted-copy">
                            Todavia no hay archivos cargados para esta institucion.
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row xl:flex-col">
                        <Link
                          className="secondary-button text-base"
                          href={`/library?institutionId=${institution.id}`}
                        >
                          Ver archivos
                        </Link>
                        <Link
                          className="primary-button text-base"
                          href={`/upload?scope=Institucion&institutionId=${institution.id}`}
                        >
                          Subir a este colegio
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
