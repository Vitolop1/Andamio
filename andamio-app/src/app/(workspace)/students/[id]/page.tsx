import { notFound } from "next/navigation";
import { loadAppData } from "@/lib/app-data";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { eventStatusMeta, formatDate, studentStatusMeta } from "@/lib/utils";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;
  const data = await loadAppData();
  const student = data.students.find((item) => item.id === id);

  if (!student) {
    notFound();
  }

  const canAccessStudent =
    data.currentProfessional.role === "admin" ||
    student.assignedProfessionalIds.includes(data.currentProfessional.id);

  if (!canAccessStudent) {
    notFound();
  }

  const institution = data.institutions.find(
    (item) => item.id === student.institutionId,
  );
  const course = data.courses.find((item) => item.id === student.courseId);
  const evaluations = data.evaluations.filter(
    (evaluation) => evaluation.studentId === student.id,
  );
  const files = data.libraryFiles.filter((file) => file.studentId === student.id);
  const events = data.scheduleEvents.filter(
    (event) => event.studentId === student.id,
  );
  const status = studentStatusMeta[student.status];

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref={`/upload?scope=Alumno&studentId=${student.id}&institutionId=${student.institutionId}&courseId=${student.courseId}`}
        actionLabel="Subir material"
        description="La ficha reune contexto, agenda, archivos y evaluaciones en una sola pantalla para que el seguimiento no dependa de memoria o chats viejos."
        eyebrow={`${institution?.name ?? "Institucion"} - ${course?.name ?? "Sin curso"}`}
        title={`${student.firstName} ${student.lastName}`}
      />

      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <MetricCard
          helper="estado general del seguimiento"
          label="Situacion"
          value={status.label}
        />
        <MetricCard
          helper="cargadas en historial"
          label="Evaluaciones"
          tone="warm"
          value={`${evaluations.length}`}
        />
        <MetricCard
          helper="materiales, informes y tareas"
          label="Archivos"
          tone="neutral"
          value={`${files.length}`}
        />
        <MetricCard
          helper="proximos encuentros"
          label="Sesiones"
          value={`${events.length}`}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SectionCard
          description="La parte que mas ayuda en el dia a dia: entender rapido que esta pasando con este alumno."
          eyebrow="Resumen"
          title="Ficha actual"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[26px] bg-[rgba(188,203,79,0.18)] p-6">
              <p className="text-base font-semibold text-[var(--foreground)]">
                Datos base
              </p>
              <div className="mt-4 space-y-2 text-base muted-copy">
                <p>Edad: {student.age} anos</p>
                <p>Profesional: {student.professional}</p>
                <p>Contacto familiar: {student.familyContact}</p>
                <p>Foco principal: {student.supportFocus}</p>
              </div>
            </article>

            <article className="rounded-[26px] bg-[rgba(227,170,157,0.22)] p-6">
              <p className="text-base font-semibold text-[var(--foreground)]">
                Seguimiento
              </p>
              <div className="mt-4 space-y-3">
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                <p className="text-base muted-copy">
                  Proxima sesion:{" "}
                  {formatDate(student.nextSession, {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-base muted-copy">
                  Tareas pendientes: {student.pendingTasks}
                </p>
              </div>
            </article>
          </div>

          <article className="mt-4 rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-6">
            <p className="text-base font-semibold text-[var(--foreground)]">
              Observacion general
            </p>
            <p className="mt-3 text-base leading-8 muted-copy">{student.notes}</p>
          </article>
        </SectionCard>

        <SectionCard
          description="La agenda asociada al alumno deberia quedar siempre al alcance de la mano."
          eyebrow="Proximos encuentros"
          title="Agenda vinculada"
        >
          <div className="space-y-3">
            {events.map((event) => {
              const eventStatus = eventStatusMeta[event.status];

              return (
                <article
                  className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5"
                  key={event.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[var(--foreground)]">
                        {event.title}
                      </p>
                      <p className="mt-1 text-base muted-copy">
                        {formatDate(event.date, {
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        - {event.startTime} - {event.endTime}
                      </p>
                      <p className="mt-2 text-base muted-copy">{event.location}</p>
                    </div>
                    <StatusBadge tone={eventStatus.tone}>
                      {eventStatus.label}
                    </StatusBadge>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <SectionCard
          description="Evaluaciones, observaciones e hitos deberian contar una historia clara del proceso."
          eyebrow="Historial"
          title="Evaluaciones y seguimiento"
        >
          <div className="space-y-3">
            {evaluations.map((evaluation) => (
              <article
                className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5"
                key={evaluation.id}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-[var(--foreground)]">
                      {evaluation.title}
                    </p>
                    <p className="mt-1 text-base muted-copy">{evaluation.type}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(188,203,79,0.22)] px-3.5 py-1.5 text-sm font-semibold text-[var(--accent-strong)]">
                    {formatDate(evaluation.date, {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="mt-3 text-base leading-7 muted-copy">
                  {evaluation.summary}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          description="Todo archivo asociado deberia quedar disponible sin tener que recordar donde se guardo."
          eyebrow="Biblioteca personal"
          title="Archivos vinculados"
        >
          <div className="space-y-3">
            {files.map((file) => (
              <article
                className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5"
                key={file.id}
              >
                <p className="text-lg font-semibold text-[var(--foreground)]">
                  {file.title}
                </p>
                <p className="mt-1 text-base muted-copy">
                  {file.kind} - {file.subject} - {file.sizeLabel}
                </p>
                <p className="mt-3 text-base text-[var(--foreground)]">
                  Subido el{" "}
                  {formatDate(file.uploadedAt, {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                {file.gradeLabel ? (
                  <p className="mt-2 text-sm muted-copy">Grado: {file.gradeLabel}</p>
                ) : null}
                <a
                  className="secondary-button mt-4 inline-flex text-base"
                  href={`/api/files/${file.id}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Abrir o descargar
                </a>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
