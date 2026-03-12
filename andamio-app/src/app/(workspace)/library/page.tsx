import { LibrarySearchPanel } from "@/components/library-search-panel";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { loadAppData } from "@/lib/app-data";
import { NONE_FILTER_VALUE } from "@/lib/library-filters";
import { normalizeForSearch } from "@/lib/utils";

export const metadata = {
  title: "Biblioteca",
};

interface LibraryPageProps {
  searchParams?: Promise<{
    q?: string;
    institutionId?: string;
    courseId?: string;
    gradeLabel?: string;
    subject?: string;
    kind?: string;
    scope?: string;
    visibility?: string;
  }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const data = await loadAppData();
  const filters = searchParams ? await searchParams : undefined;
  const normalizedQuery = normalizeForSearch(filters?.q ?? "");

  const filteredFiles = data.libraryFiles.filter((file) => {
    const institution = file.institutionId
      ? data.institutions.find((item) => item.id === file.institutionId)
      : null;
    const course = file.courseId
      ? data.courses.find((item) => item.id === file.courseId)
      : null;
    const student = file.studentId
      ? data.students.find((item) => item.id === file.studentId)
      : null;

    if (filters?.institutionId) {
      if (filters.institutionId === NONE_FILTER_VALUE) {
        if (file.institutionId) {
          return false;
        }
      } else if (file.institutionId !== filters.institutionId) {
        return false;
      }
    }

    if (filters?.courseId) {
      if (filters.courseId === NONE_FILTER_VALUE) {
        if (file.courseId) {
          return false;
        }
      } else if (file.courseId !== filters.courseId) {
        return false;
      }
    }

    if (filters?.gradeLabel) {
      if (filters.gradeLabel === NONE_FILTER_VALUE) {
        if (file.gradeLabel) {
          return false;
        }
      } else if (file.gradeLabel !== filters.gradeLabel) {
        return false;
      }
    }

    if (filters?.subject && file.subject !== filters.subject) {
      return false;
    }

    if (filters?.kind && file.kind !== filters.kind) {
      return false;
    }

    if (filters?.scope && file.scope !== filters.scope) {
      return false;
    }

    if (filters?.visibility && file.visibility !== filters.visibility) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchText = normalizeForSearch(
      [
        file.title,
        file.subject,
        file.kind,
        file.scope,
        file.visibility,
        file.gradeLabel,
        file.year,
        institution?.name,
        course?.name,
        student ? `${student.firstName} ${student.lastName}` : "",
        file.uploadedBy,
      ]
        .filter(Boolean)
        .join(" "),
    );

    return searchText.includes(normalizedQuery);
  });

  const filesByKind = Object.entries(
    filteredFiles.reduce<Record<string, number>>((accumulator, file) => {
      accumulator[file.kind] = (accumulator[file.kind] ?? 0) + 1;
      return accumulator;
    }, {}),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref="/upload"
        actionLabel="Subir archivo"
        description="Busca por colegio, grado, curso puntual, materia, nombre, tipo o visibilidad para encontrar cualquier archivo rapido."
        eyebrow="Archivos privados"
        title="Biblioteca organizada"
      />

      <SectionCard
        eyebrow="Busqueda"
        title="Buscar archivos"
        description="Esta es la parte mas importante del sistema para el dia a dia: encontrar todo en segundos."
      >
        <LibrarySearchPanel
          action="/library"
          courses={data.courses}
          institutions={data.institutions}
          values={filters}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
        <SectionCard
          description="Una vista rapida del resultado actual para saber si los filtros estan bien."
          eyebrow="Resumen"
          title={`${filteredFiles.length} archivo${filteredFiles.length === 1 ? "" : "s"} encontrado${filteredFiles.length === 1 ? "" : "s"}`}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {filesByKind.length ? (
              filesByKind.map(([kind, count]) => (
                <article
                  className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-6"
                  key={kind}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[var(--foreground)]">
                        {kind}
                      </p>
                      <p className="mt-2 text-base muted-copy">
                        archivos filtrados
                      </p>
                    </div>
                    <span className="text-4xl font-semibold text-[var(--foreground)]">
                      {count}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <article className="rounded-[26px] bg-[rgba(227,170,157,0.2)] p-6 text-base leading-7 text-[var(--foreground)] md:col-span-2">
                No encontramos archivos con esos filtros. Proba cambiando el
                colegio, el grado, la materia o el texto de busqueda.
              </article>
            )}
          </div>
        </SectionCard>

        <SectionCard
          description="Cada archivo muestra a quien pertenece, de que tipo es y si es privado o compartido."
          eyebrow="Resultados"
          title="Archivos encontrados"
        >
          <div className="space-y-3">
            {filteredFiles.map((file) => {
              const institution = file.institutionId
                ? data.institutions.find((item) => item.id === file.institutionId)
                : null;
              const course = file.courseId
                ? data.courses.find((item) => item.id === file.courseId)
                : null;
              const student = file.studentId
                ? data.students.find((item) => item.id === file.studentId)
                : null;

              return (
                <article
                  className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5"
                  key={file.id}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[var(--foreground)]">
                        {file.title}
                      </p>
                      <p className="mt-2 text-base muted-copy">
                        {file.subject} - {file.year} - {file.sizeLabel}
                      </p>
                      <p className="mt-3 text-base text-[var(--foreground)]">
                        {institution?.name ?? "Sin colegio / general"}{" "}
                        {course ? `- ${course.name}` : ""}
                      </p>
                      <p className="mt-2 text-sm muted-copy">
                        {file.gradeLabel ? `Grado: ${file.gradeLabel} - ` : ""}
                        {student
                          ? `Alumno: ${student.firstName} ${student.lastName}`
                          : `Alcance: ${file.scope}`}{" "}
                        - Subido por {file.uploadedBy}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <div className="flex flex-wrap items-center gap-2">
                        {file.gradeLabel ? (
                          <StatusBadge tone="neutral">{file.gradeLabel}</StatusBadge>
                        ) : null}
                        <StatusBadge tone="neutral">{file.kind}</StatusBadge>
                        <StatusBadge tone="success">{file.scope}</StatusBadge>
                        <StatusBadge
                          tone={file.visibility === "Privado" ? "warning" : "accent"}
                        >
                          {file.visibility}
                        </StatusBadge>
                      </div>

                      <a
                        className="secondary-button text-base"
                        href={`/api/files/${file.id}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Abrir o descargar
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
