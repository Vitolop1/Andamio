import Link from "next/link";
import {
  deleteScheduleEventAction,
  upsertScheduleEventAction,
} from "@/app/(workspace)/actions";
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
    eventId?: string;
  }>;
}

function getWeekDates(weekStart: Date) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

function buildWeekHref(week: string, eventId?: string) {
  if (!eventId) {
    return `/schedule?week=${week}`;
  }

  const params = new URLSearchParams();
  params.set("week", week);
  params.set("eventId", eventId);
  return `/schedule?${params.toString()}`;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const data = await loadAppData();
  const params = searchParams ? await searchParams : undefined;

  const baseDate = params?.week ? new Date(`${params.week}T00:00:00`) : new Date();
  const safeBaseDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
  const weekStart = startOfWeekMonday(safeBaseDate);
  const weekStartIso = formatIsoDate(weekStart);
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

  const visibleStudents =
    data.currentProfessional.role === "admin"
      ? data.students
      : data.students.filter((student) =>
          student.assignedProfessionalIds.includes(data.currentProfessional.id),
        );
  const visibleStudentIds = new Set(visibleStudents.map((student) => student.id));

  const visibleEvents =
    data.currentProfessional.role === "admin"
      ? data.scheduleEvents
      : data.scheduleEvents.filter(
          (event) =>
            event.professionalId === data.currentProfessional.id ||
            (!!event.studentId && visibleStudentIds.has(event.studentId)),
        );

  const selectedEvent =
    visibleEvents.find((event) => event.id === params?.eventId) ?? null;

  const weekEvents = visibleEvents
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
        description="Ahora la agenda no queda solo para mirar: podes cargar bloques nuevos, editar los ya creados y dejar una misma franja para varios alumnos a la vez."
        eyebrow="Planificacion semanal"
        title="Horarios y agenda"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card p-6">
          <p className="eyebrow">Semana visible</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {weekRangeLabel}
          </p>
          <p className="mt-2 text-base muted-copy">
            Cambia de semana sin perder lo que ya cargaste.
          </p>
        </article>
        <article className="surface-card p-6">
          <p className="eyebrow">Bloques</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {weekEvents.length}
          </p>
          <p className="mt-2 text-base muted-copy">
            horarios cargados para esta semana.
          </p>
        </article>
        <article className="surface-card p-6">
          <p className="eyebrow">Alumnos involucrados</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {uniqueStudentsThisWeek}
          </p>
          <p className="mt-2 text-base muted-copy">
            chicos distintos con seguimiento.
          </p>
        </article>
      </section>

      <SectionCard
        eyebrow={selectedEvent ? "Editar bloque" : "Cargar horario"}
        title={selectedEvent ? "Modificar bloque semanal" : "Agregar bloque al horario"}
        description={
          selectedEvent
            ? "Cambia dia, hora, estado o alumno sin salir de la semana que estas viendo."
            : "Si marcas varios alumnos, Andamio crea un bloque para cada uno en el mismo rango horario."
        }
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
        <form action={upsertScheduleEventAction} className="grid gap-5 xl:grid-cols-4">
          <input name="event_id" type="hidden" value={selectedEvent?.id ?? ""} />
          <input
            name="professional_id"
            type="hidden"
            value={selectedEvent?.professionalId ?? data.currentProfessional.id}
          />
          <input name="week" type="hidden" value={weekStartIso} />

          <label className="block">
            <span className="form-label">Fecha</span>
            <input
              className="input-field"
              defaultValue={selectedEvent?.date ?? weekStartIso}
              name="date"
              required
              type="date"
            />
          </label>

          <label className="block">
            <span className="form-label">Hora inicio</span>
            <input
              className="input-field"
              defaultValue={selectedEvent?.startTime ?? "15:00"}
              name="start_time"
              required
              type="time"
            />
          </label>

          <label className="block">
            <span className="form-label">Hora fin</span>
            <input
              className="input-field"
              defaultValue={selectedEvent?.endTime ?? "15:45"}
              name="end_time"
              required
              type="time"
            />
          </label>

          <label className="block">
            <span className="form-label">Estado</span>
            <select
              className="input-field"
              defaultValue={selectedEvent?.status ?? "confirmada"}
              name="status"
            >
              <option value="confirmada">Confirmada</option>
              <option value="pendiente">Pendiente</option>
              <option value="reprogramar">Reprogramar</option>
            </select>
          </label>

          <label className="block xl:col-span-2">
            <span className="form-label">Titulo</span>
            <input
              className="input-field"
              defaultValue={selectedEvent?.title ?? ""}
              name="title"
              placeholder="Opcional si elegis alumnos"
              type="text"
            />
          </label>

          <label className="block xl:col-span-2">
            <span className="form-label">Lugar</span>
            <input
              className="input-field"
              defaultValue={selectedEvent?.location ?? "Andamio"}
              name="location"
              placeholder="Andamio, colegio, llamada virtual..."
              type="text"
            />
          </label>

          {selectedEvent ? (
            <label className="block xl:col-span-4">
              <span className="form-label">Alumno</span>
              <select
                className="input-field"
                defaultValue={selectedEvent.studentId ?? ""}
                name="student_id"
              >
                <option value="">Bloque general</option>
                {visibleStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="xl:col-span-4">
              <p className="form-label">Alumnos</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {visibleStudents.map((student) => {
                  const institution = data.institutions.find(
                    (item) => item.id === student.institutionId,
                  );

                  return (
                    <label
                      className="flex items-start gap-3 rounded-[22px] border border-[rgba(76,63,97,0.08)] bg-white/82 px-4 py-4"
                      key={student.id}
                    >
                      <input
                        className="mt-1 h-4 w-4 accent-[var(--primary)]"
                        name="student_ids"
                        type="checkbox"
                        value={student.id}
                      />
                      <span>
                        <span className="block text-base font-semibold text-[var(--foreground)]">
                          {student.firstName} {student.lastName}
                        </span>
                        <span className="mt-1 block text-sm muted-copy">
                          {institution?.name ?? "Sin colegio"} - {student.supportFocus}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 text-sm muted-copy">
                Si no marcas alumnos, el bloque queda general y necesita titulo.
              </p>
            </div>
          )}

          <div className="xl:col-span-4 flex flex-wrap gap-3">
            <button className="primary-button text-base" type="submit">
              {selectedEvent ? "Guardar cambios" : "Agregar al horario"}
            </button>

            {selectedEvent ? (
              <Link className="secondary-button text-base" href={`/schedule?week=${weekStartIso}`}>
                Cancelar edicion
              </Link>
            ) : null}
          </div>
        </form>

        {selectedEvent ? (
          <form action={deleteScheduleEventAction} className="mt-4">
            <input name="event_id" type="hidden" value={selectedEvent.id} />
            <input name="student_id" type="hidden" value={selectedEvent.studentId ?? ""} />
            <input name="week" type="hidden" value={weekStartIso} />
            <button className="secondary-button text-base" type="submit">
              Eliminar bloque
            </button>
          </form>
        ) : null}
      </SectionCard>

      <SectionCard
        eyebrow="Semana completa"
        title="Vista semanal"
        description="Lunes a domingo en columnas, con varios alumnos en el mismo dia y acceso directo para editar cada bloque."
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
                  <div className="contents" key={hourLabel}>
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
                                const isSelected = selectedEvent?.id === event.id;

                                return (
                                  <article
                                    className={`rounded-[20px] p-3 ${
                                      isSelected
                                        ? "bg-[rgba(146,124,183,0.18)] ring-1 ring-[rgba(146,124,183,0.28)]"
                                        : "bg-[rgba(146,124,183,0.1)]"
                                    }`}
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
                                    <p className="mt-2 text-sm muted-copy">{event.location}</p>
                                    <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                                      {event.title}
                                    </p>
                                    <Link
                                      className="secondary-button mt-3 inline-flex text-sm"
                                      href={buildWeekHref(weekStartIso, event.id)}
                                    >
                                      Editar
                                    </Link>
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
