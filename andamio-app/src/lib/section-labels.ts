import type { FileScope } from "@/lib/types";

export const SECTION_LABEL = "Seccion / taller";
export const SECTION_PLURAL_LABEL = "Secciones";
export const NO_SECTION_LABEL = "Sin seccion / taller";

export function getSectionNameLabel(name?: string | null) {
  return name && name.trim() ? name : NO_SECTION_LABEL;
}

export function getFileScopeLabel(scope: FileScope) {
  switch (scope) {
    case "Curso":
      return "Grado / seccion";
    case "Institucion":
      return "Institucion";
    default:
      return "Alumno";
  }
}

