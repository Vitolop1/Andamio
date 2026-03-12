import Link from "next/link";
import { loadAppData } from "@/lib/app-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import {
  addDays,
  eventStatusMeta,
  formatDate,
  formatIsoDate,
  startOfWeekMonday,
  toTimeMinutes,
} from "@/lib/utils";

export const metadata = {
  title: "Agenda",
};

interface SchedulePageProps {
  searchParams?: Promise<{
    week?: string;
  }>;
}

function getWeekDates(weekStart: Date) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const data = await loadAppData();
  const params = searchParams ? await searchParams : undefined;

  const baseDate = params?.week ? new Date(`${params.week}T00:00:00`) : new Date();
  const safeBaseDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
  const weekStart = startOfWeekMonday(safeBaseDate);
  const weekDates = getWeekDates(weekStart);
  const nextWeek = formatIsoDate(addDays(weekStart, 7));
  const previousWeek = formatIsoDate(addDays(weekStart, -7));
  const weekRangeLabel = `${formatDate(formatIsoDate(weekDates[0]), {
    day: "numeric",
    month: "short",
  })} al ${formatDate(formatIsoDate(weekDates[6]), {
    day: "numeric",
    month: "short",
  })}`;

  const weekEvents = data.scheduleEvents
    .filter((event) => {
      const eventDate = new Date(`${event.date}T00:00:00`);
      return eventDate >= weekDates[0] && eventDate <= weekDates[6];
    })
    .sort((left, right) => {
      const leftStamp = `${left.date}-${left.startTime}`;
      const rightStamp = `${right.date}-${right.startTime}`;
      return leftStamp.localeCompare(rightStamp);
    });

  const hourLabels = Array.from({ length: 11 }, (_, index) => `${(8 + index)
    .toString()
    .padStart(2, "0")}:00`);

  const uniqueStudentsThisWeek = new Set(
    weekEvents
      .map((event) => event.studentId)
      .filter((studentId): studentId is string => Boolean(studentId)),
  ).size;

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref={`/schedule?week=${formatIsoDate(new Date())}`}
        actionLabel="Ir a esta semana"
        description="La agenda ahora se ve como una semana real: lunes a domingo, con varios alumnos el mismo dia y cambio de semana en una sola vista."
        eyebrow="Planificacion semanal"
        title="Agenda de seguimiento"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card p-6">
          <p className="eyebrow">Semana visible</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {weekRangeLabel}
          </p>
          <p className="mt-2 text-base muted-copy">
            Navega semana por semana sin perder el contexto.
          </p>
        </article>
        <article className="surface-card p-6">
          <p className="eyebrow">Eventos</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {weekEvents.length}
          </p>
          <p className="mt-2 text-base muted-copy">
            bloques cargados en esta semana.
          </p>
        </article>
        <article className="surface-card p-6">
          <p className="eyebrow">Alumnos</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {uniqueStudentsThisWeek}
          </p>
          <p className="mt-2 text-base muted-copy">
            alumnos distintos con seguimiento esta semana.
          </p>
        </article>
      </section>

      <SectionCard
        eyebrow="Semana completa"
        title="Horario semanal"
        description="Si tenes varios alumnos el mismo dia o en horarios cercanos, quedan uno debajo del otro dentro de la misma columna."
        action={
          <div className="flex flex-wrap gap-3">
            <Link className="secondary-button text-base" href={`/schedule?week=${previousWeek}`}>
              Semana anterior
            </Link>
            <Link className="secondary-button text-base" href={`/schedule?week=${nextWeek}`}>
              Semana siguiente
            </Link>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <div className="min-w-[1180px]">
            <div className="grid grid-cols-[92px_repeat(7,minmax(150px,1fr))] gap-3">
              <div className="rounded-[22px] bg-[rgba(146,124,183,0.1)] px-3 py-4 text-center text-sm font-semibold text-[var(--foreground)]">
                Hora
              </div>
              {weekDates.map((date) => {
                const isoDate = formatIsoDate(date);
                const dayEvents = weekEvents.filter((event) => event.date === isoDate);

                return (
                  <article
                    className="rounded-[22px] bg-[rgba(188,203,79,0.16)] px-4 py-4"
                    key={isoDate}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {formatDate(isoDate, { weekday: "short" })}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                      {formatDate(isoDate, { day: "numeric", month: "short" })}
                    </p>
                    <p className="mt-2 text-sm muted-copy">
                      {dayEvents.length} bloque{dayEvents.length === 1 ? "" : "s"}
                    </p>
                  </article>
                );
              })}

              {hourLabels.map((hourLabel) => {
                const hourMinutes = toTimeMinutes(hourLabel);

                return (
                  <div
                    className="contents"
                    key={hourLabel}
                  >
                    <div className="rounded-[22px] border border-[rgba(76,63,97,0.08)] bg-white/82 px-3 py-4 text-center text-sm font-semibold text-[var(--foreground)]">
                      {hourLabel}
                    </div>

                    {weekDates.map((date) => {
                      const isoDate = formatIsoDate(date);
                      const slotEvents = weekEvents.filter((event) => {
                        if (event.date !== isoDate) {
                          return false;
                        }

                        const startMinutes = toTimeMinutes(event.startTime);
                        return startMinutes >= hourMinutes && startMinutes < hourMinutes + 60;
                      });

                      return (
                        <div
                          className="min-h-[126px] rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-3"
                          key={`${isoDate}-${hourLabel}`}
                        >
                          {slotEvents.length ? (
                            <div className="space-y-3">
                              {slotEvents.map((event) => {
                                const student = event.studentId
                                  ? data.students.find((item) => item.id === event.studentId)
                                  : null;
                                const status = eventStatusMeta[event.status];

                                return (
                                  <article
                                    className="rounded-[20px] bg-[rgba(146,124,183,0.1)] p-3"
                                    key={event.id}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-semibold text-[var(--foreground)]">
                                          {event.startTime} - {event.endTime}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                                          {student
                                            ? `${student.firstName} ${student.lastName}`
                                            : event.title}
                                        </p>
                                      </div>
                                      <StatusBadge tone={status.tone}>
                                        {status.label}
                                      </StatusBadge>
                                    </div>
                                    <p className="mt-2 text-sm muted-copy">
                                      {event.location}
                                    </p>
                                    <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                                      {event.title}
                                    </p>
                                  </article>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex h-full min-h-[98px] items-center justify-center rounded-[18px] border border-dashed border-[rgba(76,63,97,0.08)] text-center text-sm muted-copy">
                              Libre
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
