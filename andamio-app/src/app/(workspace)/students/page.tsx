import Link from "next/link";
import { loadAppData } from "@/lib/app-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getSectionNameLabel } from "@/lib/section-labels";
import {
  formatDate,
  normalizeForSearch,
  studentStatusMeta,
} from "@/lib/utils";

export const metadata = {
  title: "Alumnos",
};

interface StudentsPageProps {
  searchParams?: Promise<{
    q?: string;
    studentId?: string;
  }>;
}

function buildStudentHref(studentId: string, query: string) {
  const params = new URLSearchParams();
  params.set("studentId", studentId);

  if (query) {
    params.set("q", query);
  }

  return `/students?${params.toString()}`;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const data = await loadAppData();
  const params = searchParams ? await searchParams : undefined;
  const query = params?.q?.trim() ?? "";
  const searchNeedle = normalizeForSearch(query);

  const visibleStudents =
    data.currentProfessional.role === "admin"
      ? data.students
      : data.students.filter((student) =>
          student.assignedProfessionalIds.includes(data.currentProfessional.id),
        );

  const filteredStudents = visibleStudents.filter((student) => {
    if (!searchNeedle) {
      return true;
    }

    const institution = data.institutions.find(
      (item) => item.id === student.institutionId,
    );
    const course = data.courses.find((item) => item.id === student.courseId);
    const haystack = [
      `${student.firstName} ${student.lastName}`,
      institution?.name,
      course?.name,
      student.supportFocus,
      student.professional,
    ]
      .filter(Boolean)
      .map((value) => normalizeForSearch(value ?? ""))
      .join(" ");

    return haystack.includes(searchNeedle);
  });

  const selectedStudent =
    filteredStudents.find((student) => student.id === params?.studentId) ??
    filteredStudents[0] ??
    null;

  const selectedInstitution = selectedStudent
    ? data.institutions.find((item) => item.id === selectedStudent.institutionId)
    : null;
  const selectedCourse = selectedStudent
    ? data.courses.find((item) => item.id === selectedStudent.courseId)
    : null;
  const selectedStatus = selectedStudent
    ? studentStatusMeta[selectedStudent.status]
    : null;
  const selectedEvaluations = selectedStudent
    ? data.evaluations
        .filter((evaluation) => evaluation.studentId === selectedStudent.id)
        .slice(0, 3)
    : [];
  const selectedFiles = selectedStudent
    ? data.libraryFiles.filter((file) => file.studentId === selectedStudent.id).slice(0, 6)
    : [];
  const selectedAssignments = selectedStudent
    ? data.assignments
        .filter(
          (assignment) =>
            assignment.studentId === selectedStudent.id ||
            (!!selectedStudent.courseId &&
              assignment.courseId === selectedStudent.courseId),
        )
        .sort((left, right) =>
          (left.dueAt ?? "9999-12-31").localeCompare(right.dueAt ?? "9999-12-31"),
        )
    : [];

  const studentsWithPendingTasks = visibleStudents.filter(
    (student) => student.pendingTasks > 0,
  ).length;
  const studentsNeedingFollowUp = visibleStudents.filter(
    (student) => student.status === "requiere-seguimiento",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref="/students/new"
        actionLabel="Agregar alumno"
        eyebrow="Seguimiento individual"
        title={data.currentProfessional.role === "admin" ? "Todos los alumnos" : "Mis alumnos"}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card p-6">
          <p className="eyebrow">Visibles ahora</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {visibleStudents.length}
          </p>
          <p className="mt-2 text-base muted-copy">
            alumnos dentro de tu panel.
          </p>
        </article>
        <article className="surface-card p-6">
          <p className="eyebrow">Con tareas</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {studentsWithPendingTasks}
          </p>
          <p className="mt-2 text-base muted-copy">
            alumnos con cosas pendientes para revisar.
          </p>
        </article>
        <article className="surface-card p-6">
          <p className="eyebrow">Seguimiento activo</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {studentsNeedingFollowUp}
          </p>
          <p className="mt-2 text-base muted-copy">
            chicos que conviene tener mas a mano.
          </p>
        </article>
      </section>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard
          eyebrow="Explorador"
          title={data.currentProfessional.role === "admin" ? "Listado general" : "Tu lista"}
        >
          <form className="mb-4" method="get">
            <input
              className="input-field"
              defaultValue={query}
              name="q"
              placeholder="Buscar por nombre, colegio, seccion o foco..."
              type="search"
            />
          </form>

          <div className="space-y-2">
            {filteredStudents.length ? (
              filteredStudents.map((student) => {
                const institution = data.institutions.find(
                  (item) => item.id === student.institutionId,
                );
                const course = data.courses.find(
                  (item) => item.id === student.courseId,
                );
                const status = studentStatusMeta[student.status];
                const active = selectedStudent?.id === student.id;

                return (
                  <Link
                    className={`block rounded-[24px] border px-4 py-4 transition ${
                      active
                        ? "border-[rgba(146,124,183,0.24)] bg-[rgba(146,124,183,0.12)]"
                        : "border-[rgba(76,63,97,0.08)] bg-white/82 hover:border-[rgba(146,124,183,0.18)] hover:bg-[rgba(255,255,255,0.9)]"
                    }`}
                    href={buildStudentHref(student.id, query)}
                    key={student.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-[var(--foreground)]">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="mt-1 text-sm muted-copy">
                          {institution?.name ?? "Sin colegio"} - {getSectionNameLabel(course?.name)}
                        </p>
                      </div>
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm muted-copy">
                      <span>{student.supportFocus}</span>
                      <span>•</span>
                      <span>{student.pendingTasks} tareas</span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-4 py-6 text-base muted-copy">
                No encontre alumnos con ese filtro.
              </div>
            )}
          </div>
        </SectionCard>

        {selectedStudent ? (
          <div className="space-y-6">
            <section className="surface-card p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="eyebrow">
                    {selectedInstitution?.name ?? "Sin colegio"} - {getSectionNameLabel(selectedCourse?.name)}
                  </p>
                  <h2 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h2>
                  <p className="mt-3 text-lg muted-copy">
                    {selectedStudent.age} anos - {selectedStudent.professional}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedStatus ? (
                    <StatusBadge tone={selectedStatus.tone}>
                      {selectedStatus.label}
                    </StatusBadge>
                  ) : null}
                  <Link
                    className="secondary-button text-base"
                    href={`/students/${selectedStudent.id}/edit`}
                  >
                    Editar alumno
                  </Link>
                  <Link
                    className="secondary-button text-base"
                    href={`/students/${selectedStudent.id}`}
                  >
                    Abrir ficha completa
                  </Link>
                  <Link
                    className="primary-button text-base"
                    href={`/upload?scope=Alumno&studentId=${selectedStudent.id}&institutionId=${selectedStudent.institutionId}&courseId=${selectedStudent.courseId}`}
                  >
                    Subir archivo
                  </Link>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <article className="rounded-[24px] bg-[rgba(188,203,79,0.18)] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                    Proxima sesion
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {formatDate(selectedStudent.nextSession, {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </article>
                <article className="rounded-[24px] bg-[rgba(146,124,183,0.12)] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                    Contacto
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {selectedStudent.familyContact}
                  </p>
                </article>
                <article className="rounded-[24px] bg-[rgba(227,170,157,0.22)] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                    Foco actual
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {selectedStudent.supportFocus}
                  </p>
                </article>
                <article className="rounded-[24px] bg-[rgba(255,255,255,0.82)] p-5 md:col-span-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                    Fecha de nacimiento
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {selectedStudent.birthDate
                      ? formatDate(selectedStudent.birthDate, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Sin cargar"}
                  </p>
                </article>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-3">
              <SectionCard
                eyebrow="Informe semanal"
                title="Resumen rapido"
              >
                <div className="space-y-3">
                  <article className="rounded-[24px] bg-[rgba(255,255,255,0.85)] p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                      Observacion general
                    </p>
                    <p className="mt-3 text-base leading-7 muted-copy">
                      {selectedStudent.notes}
                    </p>
                  </article>

                  {selectedEvaluations.length ? (
                    selectedEvaluations.map((evaluation) => (
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
                          <span className="rounded-full bg-[rgba(188,203,79,0.22)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                            {formatDate(evaluation.date, {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 muted-copy">
                          {evaluation.summary}
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-4 py-5 text-base muted-copy">
                      Todavia no hay informes cargados para este alumno.
                    </div>
                  )}
                </div>
              </SectionCard>

              <SectionCard
                eyebrow="Archivos"
                title="Biblioteca del alumno"
              >
                <div className="space-y-3">
                  {selectedFiles.length ? (
                    selectedFiles.map((file) => (
                      <article
                        className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5"
                        key={file.id}
                      >
                        <p className="text-base font-semibold text-[var(--foreground)]">
                          {file.title}
                        </p>
                        <p className="mt-1 text-sm muted-copy">
                          {file.kind} - {file.subject}
                        </p>
                        <p className="mt-2 text-sm muted-copy">
                          {file.sizeLabel} - {formatDate(file.uploadedAt, {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <a
                          className="secondary-button mt-4 inline-flex text-base"
                          href={`/api/files/${file.id}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Abrir o descargar
                        </a>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-4 py-5 text-base muted-copy">
                      Este alumno todavia no tiene archivos propios cargados.
                    </div>
                  )}
                </div>
              </SectionCard>

              <SectionCard
                eyebrow="Tareas"
                title="Pendientes y practica"
              >
                <div className="space-y-3">
                  {selectedAssignments.length ? (
                    selectedAssignments.map((assignment) => (
                      <article
                        className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5"
                        key={assignment.id}
                      >
                        <p className="text-base font-semibold text-[var(--foreground)]">
                          {assignment.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 muted-copy">
                          {assignment.description}
                        </p>
                        <p className="mt-3 text-sm text-[var(--foreground)]">
                          Entrega:{" "}
                          <span className="font-semibold">
                            {assignment.dueAt
                              ? formatDate(assignment.dueAt, {
                                  day: "numeric",
                                  month: "short",
                                })
                              : "Sin fecha"}
                          </span>
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-4 py-5 text-base muted-copy">
                      No hay tareas cargadas para este alumno por ahora.
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        ) : (
          <SectionCard
            eyebrow="Sin alumnos"
            title="Todavia no hay nada para mostrar"
          >
            <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-5 py-8 text-base muted-copy">
              Si queres, el siguiente paso es cargar alumnos reales y repartirlos por profesional.
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
