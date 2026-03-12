import { normalizeForSearch } from "@/lib/utils";

export const schoolGrades = [
  "1er grado",
  "2do grado",
  "3er grado",
  "4to grado",
  "5to grado",
  "6to grado",
  "7mo grado",
] as const;

export type SchoolGrade = (typeof schoolGrades)[number];

const gradePatterns: Array<{ label: SchoolGrade; patterns: string[] }> = [
  { label: "1er grado", patterns: ["1er", "1ro", "primer", "primero"] },
  { label: "2do grado", patterns: ["2do", "segundo"] },
  { label: "3er grado", patterns: ["3er", "3ro", "tercer", "tercero"] },
  { label: "4to grado", patterns: ["4to", "cuarto"] },
  { label: "5to grado", patterns: ["5to", "quinto"] },
  { label: "6to grado", patterns: ["6to", "sexto"] },
  { label: "7mo grado", patterns: ["7mo", "7to", "septimo", "séptimo"] },
];

export function inferGradeLabel(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = normalizeForSearch(value);

  for (const grade of gradePatterns) {
    if (grade.patterns.some((pattern) => normalized.includes(pattern))) {
      return grade.label;
    }
  }

  return null;
}
