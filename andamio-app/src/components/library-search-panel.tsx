"use client";

import Link from "next/link";
import { useState } from "react";
import { schoolGrades } from "@/lib/grades";
import { NONE_FILTER_VALUE } from "@/lib/library-filters";
import { schoolSubjects } from "@/lib/subjects";
import type { Course, Institution } from "@/lib/types";

interface LibrarySearchPanelProps {
  action: string;
  institutions: Institution[];
  courses: Course[];
  values?: {
    q?: string;
    institutionId?: string;
    courseId?: string;
    gradeLabel?: string;
    subject?: string;
    kind?: string;
    scope?: string;
    visibility?: string;
  };
  compact?: boolean;
}

export function LibrarySearchPanel({
  action,
  institutions,
  courses,
  values,
  compact = false,
}: LibrarySearchPanelProps) {
  const [institutionId, setInstitutionId] = useState(values?.institutionId ?? "");
  const [courseId, setCourseId] = useState(values?.courseId ?? "");
  const institutionsById = new Map(
    institutions.map((institution) => [institution.id, institution.name]),
  );

  return (
    <form action={action} className="space-y-4">
      <div className={`grid gap-4 ${compact ? "lg:grid-cols-2" : "lg:grid-cols-4"}`}>
        <label className={compact ? "block lg:col-span-2" : "block lg:col-span-4"}>
          <span className="form-label">Buscar archivo</span>
          <input
            className="input-field"
            defaultValue={values?.q ?? ""}
            name="q"
            placeholder="Ej: 1er grado, Santa Maria, lectura, informe..."
            type="text"
          />
        </label>

        <label className="block">
          <span className="form-label">Colegio</span>
          <select
            className="input-field"
            name="institutionId"
            onChange={(event) => {
              setInstitutionId(event.target.value);
              setCourseId("");
            }}
            value={institutionId}
          >
            <option value="">Todos</option>
            <option value={NONE_FILTER_VALUE}>Sin colegio / general</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="form-label">Curso puntual</span>
          <select
            className="input-field"
            name="courseId"
            onChange={(event) => setCourseId(event.target.value)}
            value={courseId}
          >
            <option value="">Todos</option>
            <option value={NONE_FILTER_VALUE}>Sin curso puntual</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} -{" "}
                {institutionsById.get(course.institutionId) ?? "Sin colegio"}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="form-label">Grado compartido</span>
          <select
            className="input-field"
            defaultValue={values?.gradeLabel ?? ""}
            name="gradeLabel"
          >
            <option value="">Todos</option>
            <option value={NONE_FILTER_VALUE}>Sin grado</option>
            {schoolGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="form-label">Materia</span>
          <select
            className="input-field"
            defaultValue={values?.subject ?? ""}
            name="subject"
          >
            <option value="">Todas</option>
            {schoolSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="form-label">Tipo</span>
          <select className="input-field" defaultValue={values?.kind ?? ""} name="kind">
            <option value="">Todos</option>
            <option value="Material">Material</option>
            <option value="Informe">Informe</option>
            <option value="Evaluacion">Evaluacion</option>
            <option value="Actividad">Actividad</option>
            <option value="Planilla">Planilla</option>
          </select>
        </label>

        <label className="block">
          <span className="form-label">Destino</span>
          <select className="input-field" defaultValue={values?.scope ?? ""} name="scope">
            <option value="">Todos</option>
            <option value="Alumno">Alumno</option>
            <option value="Curso">Curso o grado</option>
            <option value="Institucion">Institucion</option>
          </select>
        </label>

        <label className="block">
          <span className="form-label">Visibilidad</span>
          <select
            className="input-field"
            defaultValue={values?.visibility ?? ""}
            name="visibility"
          >
            <option value="">Todas</option>
            <option value="Equipo">Todo el equipo</option>
            <option value="Privado">Solo quien lo sube</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="primary-button text-base" type="submit">
          Buscar archivos
        </button>
        <Link className="secondary-button text-base" href={action}>
          Limpiar filtros
        </Link>
      </div>
    </form>
  );
}
