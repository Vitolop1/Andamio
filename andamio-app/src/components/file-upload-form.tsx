"use client";

import { useState } from "react";
import { createLibraryFileAction } from "@/app/(workspace)/actions";
import { schoolSubjects } from "@/lib/subjects";
import type { Course, FileScope, Institution, Student } from "@/lib/types";

interface FileUploadFormProps {
  institutions: Institution[];
  courses: Course[];
  students: Student[];
  defaultScope?: FileScope;
  defaultInstitutionId?: string;
  defaultCourseId?: string;
  defaultStudentId?: string;
}

export function FileUploadForm({
  institutions,
  courses,
  students,
  defaultScope = "Curso",
  defaultInstitutionId = "",
  defaultCourseId = "",
  defaultStudentId = "",
}: FileUploadFormProps) {
  const [scope, setScope] = useState<FileScope>(defaultScope);
  const [institutionId, setInstitutionId] = useState(defaultInstitutionId);
  const [courseId, setCourseId] = useState(defaultCourseId);
  const [studentId, setStudentId] = useState(defaultStudentId);
  const [fileName, setFileName] = useState("");

  const filteredCourses = institutionId
    ? courses.filter((course) => course.institutionId === institutionId)
    : courses;
  const filteredStudents = courseId
    ? students.filter((student) => student.courseId === courseId)
    : institutionId
      ? students.filter((student) => student.institutionId === institutionId)
      : students;

  if (!institutions.length) {
    return (
      <div className="rounded-[26px] bg-[rgba(227,170,157,0.22)] p-6 text-base leading-7 text-[var(--foreground)]">
        No hay colegios cargados todavia. Si estas usando Supabase real, corre
        `supabase/seed.sql` para cargar las instituciones base y despues volve a
        esta pantalla.
      </div>
    );
  }

  return (
    <form action={createLibraryFileAction} className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="form-label">Archivo</span>
          <input
            className="input-field file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(146,124,183,0.12)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--primary-strong)]"
            name="document"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
            required
            type="file"
          />
        </label>

        {fileName ? (
          <div className="rounded-[24px] bg-[rgba(188,203,79,0.18)] px-5 py-4 text-base text-[var(--foreground)] lg:col-span-2">
            Archivo listo: <span className="font-semibold">{fileName}</span>
          </div>
        ) : (
          <div className="rounded-[24px] bg-[rgba(146,124,183,0.12)] px-5 py-4 text-base text-[var(--foreground)] lg:col-span-2">
            Elegi primero el archivo y despues completa a quien o a que curso
            pertenece.
          </div>
        )}
      </div>

      {fileName ? (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="block lg:col-span-2">
              <span className="form-label">Titulo visible</span>
              <input
                className="input-field"
                name="title"
                placeholder="Ej: rutina de lectura 3ro A"
                required
                type="text"
              />
            </label>

            <label className="block">
              <span className="form-label">Tipo de archivo</span>
              <select className="input-field" defaultValue="Material" name="kind">
                <option value="Material">Material</option>
                <option value="Informe">Informe</option>
                <option value="Evaluacion">Evaluacion</option>
                <option value="Actividad">Actividad</option>
                <option value="Planilla">Planilla</option>
              </select>
            </label>

            <label className="block">
              <span className="form-label">Quien lo puede ver</span>
              <select className="input-field" defaultValue="Equipo" name="visibility">
                <option value="Equipo">Todo el equipo</option>
                <option value="Privado">Solo quien lo sube</option>
              </select>
            </label>

            <label className="block">
              <span className="form-label">Destino</span>
              <select
                className="input-field"
                name="scope"
                onChange={(event) => {
                  const nextScope = event.target.value as FileScope;
                  setScope(nextScope);

                  if (nextScope === "Institucion") {
                    setCourseId("");
                    setStudentId("");
                  }

                  if (nextScope === "Curso") {
                    setStudentId("");
                  }
                }}
                value={scope}
              >
                <option value="Curso">Curso o grado completo</option>
                <option value="Alumno">Alumno puntual</option>
                <option value="Institucion">Todo el colegio / institucion</option>
              </select>
            </label>

            <label className="block">
              <span className="form-label">Colegio o institucion</span>
              <select
                className="input-field"
                name="institution_id"
                onChange={(event) => {
                  setInstitutionId(event.target.value);
                  setCourseId("");
                  setStudentId("");
                }}
                required={scope !== "Alumno"}
                value={institutionId}
              >
                <option value="">Seleccionar</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </select>
            </label>

            {scope !== "Institucion" ? (
              <label className="block">
                <span className="form-label">Curso</span>
                <select
                  className="input-field"
                  name="course_id"
                  onChange={(event) => {
                    setCourseId(event.target.value);
                    setStudentId("");
                  }}
                  required={scope === "Curso"}
                  value={courseId}
                >
                  <option value="">Seleccionar</option>
                  {filteredCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {scope === "Alumno" ? (
              <label className="block lg:col-span-2">
                <span className="form-label">Alumno</span>
                <select
                  className="input-field"
                  name="student_id"
                  onChange={(event) => setStudentId(event.target.value)}
                  required
                  value={studentId}
                >
                  <option value="">Seleccionar alumno</option>
                  {filteredStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="block">
              <span className="form-label">Materia / area</span>
              <select className="input-field" defaultValue="General" name="subject">
                {schoolSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="form-label">Ano lectivo</span>
              <input
                className="input-field"
                defaultValue="2026"
                name="school_year"
                type="text"
              />
            </label>
          </div>

          <div className="rounded-[26px] bg-[rgba(227,170,157,0.18)] p-5 text-base leading-7 text-[var(--foreground)]">
            {scope === "Curso"
              ? "Si elegis un curso, este material queda etiquetado para todo ese grado o grupo."
              : scope === "Alumno"
                ? "Si elegis un alumno, el archivo queda directamente en su ficha."
                : "Si elegis institucion, el archivo queda disponible como material general del colegio o espacio."}
          </div>

          <button className="primary-button text-base" type="submit">
            Guardar archivo
          </button>
        </>
      ) : null}
    </form>
  );
}
