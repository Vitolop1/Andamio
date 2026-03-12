function normalizeChunk(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function capitalize(value: string) {
  if (!value) {
    return "Alumno";
  }

  return value[0].toUpperCase() + value.slice(1).toLowerCase();
}

export function buildStudentPortalEmail(
  firstName: string,
  lastName: string,
  studentId: string,
) {
  const first = normalizeChunk(firstName) || "alumno";
  const last = normalizeChunk(lastName) || "andamio";
  const suffix = studentId.replace(/-/g, "").slice(0, 6);
  const lastInitial = last[0] ?? "a";
  return `${first}.${lastInitial}${suffix}@andamiosaltas.com`;
}

export function buildStudentPortalPassword(firstName: string) {
  return `${capitalize(normalizeChunk(firstName) || "alumno")}2026`;
}

export function buildStudentPortalFullName(firstName: string, lastName: string) {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}
