import type { EventStatus, StudentStatus } from "@/lib/types";

export type BadgeTone = "success" | "warning" | "accent" | "neutral";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  },
) {
  return new Intl.DateTimeFormat("es-AR", options).format(new Date(value));
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(value));
}

export function addDays(value: Date, amount: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + amount);
  return next;
}

export function formatIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function startOfWeekMonday(value: Date) {
  const date = new Date(value);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function toTimeMinutes(value: string) {
  const [hours, minutes] = value.split(":").map((chunk) => Number(chunk));
  return hours * 60 + minutes;
}

export function initialsFromName(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

export function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export const studentStatusMeta: Record<
  StudentStatus,
  { label: string; tone: BadgeTone }
> = {
  "al-dia": { label: "Al dia", tone: "success" },
  "requiere-seguimiento": {
    label: "Requiere seguimiento",
    tone: "warning",
  },
  "nuevo-ingreso": { label: "Nuevo ingreso", tone: "accent" },
};

export const eventStatusMeta: Record<
  EventStatus,
  { label: string; tone: BadgeTone }
> = {
  confirmada: { label: "Confirmada", tone: "success" },
  pendiente: { label: "Pendiente", tone: "warning" },
  reprogramar: { label: "Reprogramar", tone: "accent" },
};
