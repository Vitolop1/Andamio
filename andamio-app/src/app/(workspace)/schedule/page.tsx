import { loadAppData } from "@/lib/app-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { eventStatusMeta, formatDate } from "@/lib/utils";

export const metadata = {
  title: "Agenda",
};

export default async function SchedulePage() {
  const data = await loadAppData();
  const groupedDates = [...new Set(data.scheduleEvents.map((event) => event.date))];

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref="/dashboard"
        actionLabel="Volver al resumen"
        description="La agenda tiene que dar contexto, no solo mostrar horarios. Idealmente cada evento deberia estar conectado con su alumno y sus materiales."
        eyebrow="Planificacion semanal"
        title="Agenda de seguimiento"
      />

      <SectionCard
        description="Vista semanal compacta para validar si la estructura de eventos y recordatorios nos sirve."
        eyebrow="Proximos dias"
        title="Semana activa"
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {groupedDates.map((date) => {
            const events = data.scheduleEvents.filter((event) => event.date === date);

            return (
              <article
                className="rounded-[30px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-6"
                key={date}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="eyebrow">Jornada</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                      {formatDate(date, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h2>
                  </div>
                  <span className="rounded-full bg-[rgba(188,203,79,0.22)] px-3.5 py-1.5 text-sm font-semibold text-[var(--accent-strong)]">
                    {events.length} eventos
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {events.map((event) => {
                    const student = event.studentId
                      ? data.students.find((item) => item.id === event.studentId)
                      : null;
                    const status = eventStatusMeta[event.status];

                    return (
                      <article
                        className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-[rgba(255,255,255,0.8)] p-5"
                        key={event.id}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-lg font-semibold text-[var(--foreground)]">
                                {event.title}
                              </p>
                              <p className="mt-1 text-base muted-copy">
                                {event.startTime} - {event.endTime}
                              </p>
                            </div>
                            <StatusBadge tone={status.tone}>
                              {status.label}
                            </StatusBadge>
                          </div>
                          <p className="text-base muted-copy">{event.location}</p>
                          {student ? (
                            <p className="text-base text-[var(--foreground)]">
                              Alumno asociado: {student.firstName} {student.lastName}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
