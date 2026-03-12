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
        description="Las instituciones son la puerta de entrada para ordenar colegios, consultorios y todo lo que despues cuelga de cada curso o alumno."
        eyebrow="Base institucional"
        title="Colegios y consultorios"
      />

      <SectionCard
        description="Cada institucion concentra responsables, cursos asociados y cantidad de alumnos activos. Este es el nivel mas alto del orden interno."
        eyebrow="Mapa general"
        title="Instituciones activas"
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {data.institutions.map((institution) => {
            const relatedCourses = data.courses.filter(
              (course) => course.institutionId === institution.id,
            );

            return (
              <article
                className="rounded-[30px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-6"
                key={institution.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">{institution.city}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                      {institution.name}
                    </h2>
                  </div>
                  <span className="rounded-full bg-[rgba(188,203,79,0.22)] px-3.5 py-1.5 text-sm font-semibold text-[var(--accent-strong)]">
                    {institution.lastUpdate}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] bg-[rgba(188,203,79,0.18)] p-5">
                    <p className="text-3xl font-semibold text-[var(--foreground)]">
                      {institution.activeStudents}
                    </p>
                    <p className="mt-1 text-base muted-copy">alumnos activos</p>
                  </div>
                  <div className="rounded-[24px] bg-[rgba(146,124,183,0.12)] p-5">
                    <p className="text-3xl font-semibold text-[var(--foreground)]">
                      {institution.activeCourses}
                    </p>
                    <p className="mt-1 text-base muted-copy">cursos vinculados</p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    Referente
                  </p>
                  <p className="mt-1 text-base muted-copy">{institution.lead}</p>
                </div>

                <div className="mt-5">
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    Cursos cargados
                  </p>
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
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        action={
          <Link className="secondary-button text-base" href="/institutions/new">
            Nuevo colegio
          </Link>
        }
        description="Un buen orden institucional permite que despues la carga de archivos sea guiada y consistente."
        eyebrow="Buenas practicas"
        title="Que deberia resolverse desde esta pantalla"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Crear colegios y consultorios con datos base y referente principal.",
            "Vincular cursos por ano, nivel y turno para que la clasificacion sea automatica.",
            "Tener una vista clara de que institucion necesita seguimiento o carga nueva.",
          ].map((item) => (
            <article
              className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5 text-base leading-7 muted-copy"
              key={item}
            >
              {item}
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
