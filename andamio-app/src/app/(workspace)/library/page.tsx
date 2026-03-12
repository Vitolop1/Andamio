import { shareLibraryFileAction } from "@/app/(workspace)/actions";
import { LibrarySearchPanel } from "@/components/library-search-panel";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { loadAppData } from "@/lib/app-data";
import { NONE_FILTER_VALUE } from "@/lib/library-filters";
import { getFileScopeLabel } from "@/lib/section-labels";
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
    sort?: string;
    shared?: string;
  }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const data = await loadAppData();
  const filters = searchParams ? await searchParams : undefined;
  const normalizedQuery = normalizeForSearch(filters?.q ?? "");
  const uploadedAtFormatter = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const visibleStudents =
    data.currentProfessional.role === "admin"
      ? data.students
      : data.students.filter((student) =>
          student.assignedProfessionalIds.includes(data.currentProfessional.id),
        );

  const filteredFiles = data.libraryFiles
    .filter((file) => {
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
    })
    .sort((left, right) => {
      switch (filters?.sort) {
        case "oldest":
          return (
            new Date(left.uploadedAt).getTime() - new Date(right.uploadedAt).getTime()
          );
        case "name":
          return left.title.localeCompare(right.title);
        default:
          return (
            new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime()
          );
      }
    });

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref="/upload"
        actionLabel="Subir archivo"
        eyebrow="Archivos privados"
        title="Biblioteca"
      />

      <SectionCard eyebrow="Busqueda" title="Buscar archivos">
        <LibrarySearchPanel
          action="/library"
          courses={data.courses}
          institutions={data.institutions}
          values={filters}
        />
        {filters?.shared ? (
          <div className="mt-4 rounded-[24px] bg-[rgba(188,203,79,0.18)] px-5 py-4 text-base text-[var(--foreground)]">
            Archivo compartido con {filters.shared}.
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        eyebrow="Explorador"
        title={`${filteredFiles.length} archivo${filteredFiles.length === 1 ? "" : "s"}`}
      >
        {filteredFiles.length ? (
          <div className="explorer-shell bg-white/80">
            <div className="explorer-header hidden gap-4 px-5 py-4 text-sm font-semibold text-[var(--foreground)] md:grid md:grid-cols-[minmax(0,2.5fr)_0.85fr_0.95fr_1fr_auto]">
              <p>Archivo</p>
              <p>Tipo</p>
              <p>Materia</p>
              <p>Subido</p>
              <p className="text-right">Accion</p>
            </div>

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
                <article className="explorer-row relative px-4 py-4 md:px-5" key={file.id}>
                  <div className="grid gap-4 md:grid-cols-[minmax(0,2.5fr)_0.85fr_0.95fr_1fr_auto] md:items-center">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-[var(--foreground)]">
                        {file.title}
                      </p>
                      <p className="mt-1 text-sm muted-copy">
                        {file.sizeLabel} - {file.visibility} - {file.uploadedBy}
                      </p>
                      <p className="mt-2 text-sm muted-copy">
                        {institution?.name ?? "Sin colegio / general"}
                        {course ? ` - ${course.name}` : ""}
                        {file.gradeLabel ? ` - ${file.gradeLabel}` : ""}
                        {student
                          ? ` - ${student.firstName} ${student.lastName}`
                          : ` - ${getFileScopeLabel(file.scope)}`}
                      </p>
                    </div>

                    <div className="text-sm text-[var(--foreground)]">
                      <span className="font-semibold md:hidden">Tipo: </span>
                      {file.kind}
                    </div>

                    <div className="text-sm text-[var(--foreground)]">
                      <span className="font-semibold md:hidden">Materia: </span>
                      {file.subject}
                    </div>

                    <div className="text-sm text-[var(--foreground)]">
                      <span className="font-semibold md:hidden">Subido: </span>
                      {uploadedAtFormatter.format(new Date(file.uploadedAt))}
                    </div>

                    <div className="flex justify-start md:justify-end">
                      <div className="flex flex-wrap justify-start gap-2 md:justify-end">
                        <a
                          className="secondary-button px-4 py-2.5 text-sm"
                          href={file.downloadUrl ?? `/api/files/${file.id}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Abrir
                        </a>

                        <details className="group">
                          <summary className="secondary-button cursor-pointer list-none px-4 py-2.5 text-sm">
                            Compartir con
                          </summary>
                          <div className="mt-2 w-[280px] rounded-[24px] border border-[rgba(76,63,97,0.1)] bg-white p-4 shadow-[0_18px_44px_rgba(76,63,97,0.14)]">
                            <form action={shareLibraryFileAction} className="space-y-3">
                              <input name="file_id" type="hidden" value={file.id} />
                              <label className="block">
                                <span className="form-label">Alumno</span>
                                <select className="input-field" defaultValue="" name="student_id">
                                  <option value="">Seleccionar alumno</option>
                                  {visibleStudents.map((shareStudent) => (
                                    <option key={shareStudent.id} value={shareStudent.id}>
                                      {shareStudent.firstName} {shareStudent.lastName}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <button className="primary-button w-full text-sm" type="submit">
                                Compartir
                              </button>
                            </form>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-5 py-8 text-base muted-copy">
            No encontramos archivos con esos filtros.
          </div>
        )}
      </SectionCard>
    </div>
  );
}
