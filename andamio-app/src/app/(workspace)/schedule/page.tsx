import Link from "next/link";
import {
  deleteScheduleEventAction,
  upsertScheduleEventAction,
} from "@/app/(workspace)/actions";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { loadAppData } from "@/lib/app-data";
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

const repeatDayOptions = [
  { label: "Lun", value: "1" },
  { label: "Mar", value: "2" },
  { label: "Mie", value: "3" },
  { label: "Jue", value: "4" },
  { label: "Vie", value: "5" },
  { label: "Sab", value: "6" },
  { label: "Dom", value: "0" },
];

interface SchedulePageProps {
  searchParams?: Promise<{
    view?: string;
    week?: string;
    month?: string;
    date?: string;
    time?: string;
    eventId?: string;
  }>;
}

function getWeekDates(weekStart: Date) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

function startOfMonth(value: Date) {
  const date = new Date(value);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getMonthDates(monthStart: Date) {
  const gridStart = startOfWeekMonday(monthStart);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function addMinutesToClock(value: string, amount: number) {
  const total = toTimeMinutes(value) + amount;
  const hours = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (total % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatMonthLabel(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(value);
}

function buildScheduleHref(options: {
  view: "week" | "month";
  week?: string;
  month?: string;
  date?: string;
  time?: string;
  eventId?: string;
  anchor?: string;
}) {
  const params = new URLSearchParams();
  params.set("view", options.view);

  if (options.view === "month") {
    params.set("month", options.month ?? options.date ?? formatIsoDate(new Date()));
  } else if (options.week) {
    params.set("week", options.week);
  }

  if (options.date) {
    params.set("date", options.date);
  }

  if (options.time) {
    params.set("time", options.time);
  }

  if (options.eventId) {
    params.set("eventId", options.eventId);
  }

  const suffix = options.anchor ? `#${options.anchor}` : "";
  return `/schedule?${params.toString()}${suffix}`;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const data = await loadAppData();
  const params = searchParams ? await searchParams : undefined;
  const view = params?.view === "month" ? "month" : "week";
  const referenceValue = params?.date ?? params?.week ?? params?.month;
  const referenceDate = referenceValue
    ? new Date(`${referenceValue}T00:00:00`)
    : new Date();
  const safeReferenceDate = Number.isNaN(referenceDate.getTime())
    ? new Date()
    : referenceDate;

  const weekStart = startOfWeekMonday(
    params?.week ? new Date(`${params.week}T00:00:00`) : safeReferenceDate,
  );
  const weekStartIso = formatIsoDate(weekStart);
  const weekDates = getWeekDates(weekStart);
  const previousWeek = formatIsoDate(addDays(weekStart, -7));
  const nextWeek = formatIsoDate(addDays(weekStart, 7));

  const monthStart = startOfMonth(
    params?.month ? new Date(`${params.month}T00:00:00`) : safeReferenceDate,
  );
  const monthStartIso = formatIsoDate(monthStart);
  const previousMonth = formatIsoDate(
    new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1),
  );
  const nextMonth = formatIsoDate(
    new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1),
  );
  const monthDates = getMonthDates(monthStart);

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
  const selectedDate =
    selectedEvent?.date ??
    params?.date ??
    (view === "month" ? formatIsoDate(safeReferenceDate) : weekStartIso);
  const selectedTime = selectedEvent?.startTime ?? params?.time ?? "15:00";
  const selectedEndTime = selectedEvent?.endTime ?? addMinutesToClock(selectedTime, 45);
  const defaultRepeatDay = new Date(`${selectedDate}T00:00:00`).getDay().toString();

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

  const monthEvents = visibleEvents
    .filter((event) => event.date.startsWith(monthStartIso.slice(0, 7)))
    .sort((left, right) => {
      const leftStamp = `${left.date}-${left.startTime}`;
      const rightStamp = `${right.date}-${right.startTime}`;
      return leftStamp.localeCompare(rightStamp);
    });

  const visibleEventsForSummary = view === "month" ? monthEvents : weekEvents;
  const uniqueStudentsInView = new Set(
    visibleEventsForSummary
      .map((event) => event.studentId)
      .filter((studentId): studentId is string => Boolean(studentId)),
  ).size;
  const hourLabels = Array.from({ length: 11 }, (_, index) => `${(8 + index)
    .toString()
    .padStart(2, "0")}:00`);

  return (
    <div className="space-y-6">
      <PageHeader
        actionHref={buildScheduleHref({
          view,
          week: formatIsoDate(startOfWeekMonday(new Date())),
          month: formatIsoDate(startOfMonth(new Date())),
          date: formatIsoDate(new Date()),
        })}
        actionLabel="Hoy"
        eyebrow="Agenda"
        title="Horarios"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card p-6">
          <p className="eyebrow">Vista</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {view === "month" ? "Mensual" : "Semanal"}
          </p>
        </article>
        <article className="surface-card p-6">
          <p className="eyebrow">Bloques</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {visibleEventsForSummary.length}
          </p>
        </article>
        <article className="surface-card p-6">
          <p className="eyebrow">Alumnos</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {uniqueStudentsInView}
          </p>
        </article>
      </section>

      <SectionCard
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              className={view === "week" ? "primary-button text-base" : "secondary-button text-base"}
              href={buildScheduleHref({
                view: "week",
                week: weekStartIso,
                date: selectedDate,
              })}
            >
              Semana
            </Link>
            <Link
              className={view === "month" ? "primary-button text-base" : "secondary-button text-base"}
              href={buildScheduleHref({
                view: "month",
                month: monthStartIso,
                date: selectedDate,
              })}
            >
              Mes
            </Link>
          </div>
        }
        eyebrow={selectedEvent ? "Editar" : "Nuevo"}
        title={selectedEvent ? "Editar evento" : "Agregar evento"}
      >
        <form
          action={upsertScheduleEventAction}
          className="grid scroll-mt-28 gap-5 xl:grid-cols-4"
          id="calendar-editor"
        >
          <input name="event_id" type="hidden" value={selectedEvent?.id ?? ""} />
          <input
            name="professional_id"
            type="hidden"
            value={selectedEvent?.professionalId ?? data.currentProfessional.id}
          />
          <input name="view" type="hidden" value={view} />
          <input name="week" type="hidden" value={weekStartIso} />
          <input name="month" type="hidden" value={monthStartIso} />

          <label className="block">
            <span className="form-label">Fecha</span>
            <input
              className="input-field"
              defaultValue={selectedDate}
              name="date"
              required
              type="date"
            />
          </label>

          <label className="block">
            <span className="form-label">Inicio</span>
            <input
              className="input-field"
              defaultValue={selectedTime}
              name="start_time"
              required
              type="time"
            />
          </label>

          <label className="block">
            <span className="form-label">Fin</span>
            <input
              className="input-field"
              defaultValue={selectedEndTime}
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
              type="text"
            />
          </label>

          <label className="block xl:col-span-2">
            <span className="form-label">Lugar</span>
            <input
              className="input-field"
              defaultValue={selectedEvent?.location ?? "Andamio"}
              name="location"
              type="text"
            />
          </label>

          {!selectedEvent ? (
            <>
              <label className="block xl:col-span-2">
                <span className="form-label">Repetir</span>
                <select className="input-field" defaultValue="none" name="repeat_window">
                  <option value="none">Solo este dia</option>
                  <option value="week">Toda la semana</option>
                  <option value="month">Todo el mes</option>
                  <option value="year">Todo el ano</option>
                </select>
              </label>

              <div className="xl:col-span-2">
                <p className="form-label">Dias</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {repeatDayOptions.map((option) => (
                    <label
                      className="rounded-full border border-[rgba(76,63,97,0.1)] bg-white/82 px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
                      key={option.value}
                    >
                      <input
                        className="mr-2 accent-[var(--primary)]"
                        defaultChecked={option.value === defaultRepeatDay}
                        name="repeat_days"
                        type="checkbox"
                        value={option.value}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : null}

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
                          {institution?.name ?? "Sin colegio"}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="xl:col-span-4 flex flex-wrap gap-3">
            <button className="primary-button text-base" type="submit">
              {selectedEvent ? "Guardar" : "Agregar"}
            </button>

            {(selectedEvent || params?.date || params?.time) ? (
              <Link
                className="secondary-button text-base"
                href={buildScheduleHref({
                  view,
                  week: weekStartIso,
                  month: monthStartIso,
                })}
              >
                Limpiar
              </Link>
            ) : null}
          </div>
        </form>

        {selectedEvent ? (
          <form action={deleteScheduleEventAction} className="mt-4">
            <input name="event_id" type="hidden" value={selectedEvent.id} />
            <input name="student_id" type="hidden" value={selectedEvent.studentId ?? ""} />
            <input name="view" type="hidden" value={view} />
            <input name="week" type="hidden" value={weekStartIso} />
            <input name="month" type="hidden" value={monthStartIso} />
            <input name="date" type="hidden" value={selectedDate} />
            <button className="secondary-button text-base" type="submit">
              Eliminar
            </button>
          </form>
        ) : null}
      </SectionCard>

      {view === "week" ? (
        <SectionCard
          action={
            <div className="flex flex-wrap gap-3">
              <Link
                className="secondary-button text-base"
                href={buildScheduleHref({
                  view: "week",
                  week: previousWeek,
                  date: previousWeek,
                })}
              >
                Semana anterior
              </Link>
              <Link
                className="secondary-button text-base"
                href={buildScheduleHref({
                  view: "week",
                  week: nextWeek,
                  date: nextWeek,
                })}
              >
                Semana siguiente
              </Link>
            </div>
          }
          eyebrow="Semana"
          title={`${formatDate(formatIsoDate(weekDates[0]), {
            day: "numeric",
            month: "short",
          })} al ${formatDate(formatIsoDate(weekDates[6]), {
            day: "numeric",
            month: "short",
          })}`}
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
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                            {formatDate(isoDate, { weekday: "short" })}
                          </p>
                          <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                            {formatDate(isoDate, { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <Link
                          className="secondary-button px-3 py-2 text-sm"
                          href={buildScheduleHref({
                            view: "week",
                            week: weekStartIso,
                            date: isoDate,
                            time: "15:00",
                            anchor: "calendar-editor",
                          })}
                        >
                          +
                        </Link>
                      </div>
                      <p className="mt-2 text-sm muted-copy">{dayEvents.length}</p>
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
                                      <Link
                                        className="secondary-button mt-3 inline-flex text-sm"
                                        href={buildScheduleHref({
                                          view: "week",
                                          week: weekStartIso,
                                          date: event.date,
                                          eventId: event.id,
                                          anchor: "calendar-editor",
                                        })}
                                      >
                                        Editar
                                      </Link>
                                    </article>
                                  );
                                })}
                              </div>
                            ) : (
                              <Link
                                className="flex h-full min-h-[98px] items-center justify-center rounded-[18px] border border-dashed border-[rgba(76,63,97,0.08)] text-center text-sm muted-copy transition hover:bg-[rgba(146,124,183,0.06)]"
                                href={buildScheduleHref({
                                  view: "week",
                                  week: weekStartIso,
                                  date: isoDate,
                                  time: hourLabel,
                                  anchor: "calendar-editor",
                                })}
                              >
                                Agregar
                              </Link>
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
      ) : (
        <SectionCard
          action={
            <div className="flex flex-wrap gap-3">
              <Link
                className="secondary-button text-base"
                href={buildScheduleHref({
                  view: "month",
                  month: previousMonth,
                  date: previousMonth,
                })}
              >
                Mes anterior
              </Link>
              <Link
                className="secondary-button text-base"
                href={buildScheduleHref({
                  view: "month",
                  month: nextMonth,
                  date: nextMonth,
                })}
              >
                Mes siguiente
              </Link>
            </div>
          }
          eyebrow="Mes"
          title={formatMonthLabel(monthStart)}
        >
          <div className="overflow-x-auto">
            <div className="min-w-[1080px]">
              <div className="mb-3 grid grid-cols-7 gap-3">
                {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day) => (
                  <div
                    className="rounded-[18px] bg-[rgba(146,124,183,0.1)] px-3 py-3 text-center text-sm font-semibold text-[var(--foreground)]"
                    key={day}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3">
                {monthDates.map((date) => {
                  const isoDate = formatIsoDate(date);
                  const dayEvents = visibleEvents
                    .filter((event) => event.date === isoDate)
                    .sort((left, right) => left.startTime.localeCompare(right.startTime));
                  const isCurrentMonth = date.getMonth() === monthStart.getMonth();
                  const isSelected = selectedDate === isoDate;

                  return (
                    <article
                      className={`min-h-[180px] rounded-[24px] border p-4 ${
                        isSelected
                          ? "border-[rgba(146,124,183,0.3)] bg-[rgba(146,124,183,0.08)]"
                          : isCurrentMonth
                            ? "border-[rgba(76,63,97,0.08)] bg-white/82"
                            : "border-[rgba(76,63,97,0.06)] bg-white/50"
                      }`}
                      key={isoDate}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-lg font-semibold text-[var(--foreground)]">
                          {date.getDate()}
                        </p>
                        <Link
                          className="secondary-button px-3 py-2 text-sm"
                          href={buildScheduleHref({
                            view: "month",
                            month: monthStartIso,
                            date: isoDate,
                            time: "15:00",
                            anchor: "calendar-editor",
                          })}
                        >
                          +
                        </Link>
                      </div>

                      <div className="mt-3 space-y-2">
                        {dayEvents.length ? (
                          <>
                            {dayEvents.slice(0, 3).map((event) => {
                              const student = event.studentId
                                ? data.students.find((item) => item.id === event.studentId)
                                : null;
                              const status = eventStatusMeta[event.status];

                              return (
                                <Link
                                  className="block rounded-[18px] bg-[rgba(188,203,79,0.14)] px-3 py-3 transition hover:bg-[rgba(188,203,79,0.22)]"
                                  href={buildScheduleHref({
                                    view: "month",
                                    month: monthStartIso,
                                    date: event.date,
                                    eventId: event.id,
                                    anchor: "calendar-editor",
                                  })}
                                  key={event.id}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-semibold text-[var(--foreground)]">
                                      {event.startTime}
                                    </p>
                                    <StatusBadge tone={status.tone}>
                                      {status.label}
                                    </StatusBadge>
                                  </div>
                                  <p className="mt-2 text-sm text-[var(--foreground)]">
                                    {student
                                      ? `${student.firstName} ${student.lastName}`
                                      : event.title}
                                  </p>
                                </Link>
                              );
                            })}
                            {dayEvents.length > 3 ? (
                              <p className="text-sm muted-copy">
                                +{dayEvents.length - 3} mas
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <Link
                            className="flex min-h-[110px] items-center justify-center rounded-[18px] border border-dashed border-[rgba(76,63,97,0.08)] text-center text-sm muted-copy transition hover:bg-[rgba(146,124,183,0.06)]"
                            href={buildScheduleHref({
                              view: "month",
                              month: monthStartIso,
                              date: isoDate,
                              time: "15:00",
                              anchor: "calendar-editor",
                            })}
                          >
                            Agregar
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
