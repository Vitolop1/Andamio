import { notFound } from "next/navigation";
import {
  deleteStudentAction,
  updateStudentAction,
} from "@/app/(workspace)/actions";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { loadAppData } from "@/lib/app-data";
import { SECTION_LABEL } from "@/lib/section-labels";

interface EditStudentPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Editar alumno",
};

export default async function EditStudentPage({
  params,
}: EditStudentPageProps) {
  const { id } = await params;
  const data = await loadAppData();
  const student = data.students.find((item) => item.id === id);

  if (!student) {
    notFound();
  }

  const canAccessStudent =
    data.currentProfessional.role === "admin" ||
    student.assignedProfessionalIds.includes(data.currentProfessional.id);

  if (!canAccessStudent) {
    notFound();
  }

  const assignedProfessionalId =
    student.assignedProfessionalIds[0] ?? data.currentProfessional.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Edicion de alumno"
        title={`${student.firstName} ${student.lastName}`}
      />

      <SectionCard
        eyebrow="Datos"
        title="Modificar informacion"
      >
        <form action={updateStudentAction} className="grid gap-5 lg:grid-cols-2">
          <input name="student_id" type="hidden" value={student.id} />

          <label className="block">
            <span className="form-label">Nombre</span>
            <input
              className="input-field"
              defaultValue={student.firstName}
              name="first_name"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="form-label">Apellido</span>
            <input
              className="input-field"
              defaultValue={student.lastName}
              name="last_name"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="form-label">Fecha de nacimiento</span>
            <input
              className="input-field"
              defaultValue={student.birthDate ?? ""}
              name="birth_date"
              type="date"
            />
          </label>

          <label className="block">
            <span className="form-label">Estado</span>
            <select
              className="input-field"
              defaultValue={student.status}
              name="status"
            >
              <option value="nuevo-ingreso">Nuevo ingreso</option>
              <option value="requiere-seguimiento">Requiere seguimiento</option>
              <option value="al-dia">Al dia</option>
            </select>
          </label>

          <label className="block">
            <span className="form-label">Colegio</span>
            <select
              className="input-field"
              defaultValue={student.institutionId}
              name="institution_id"
              required
            >
              {data.institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="form-label">{SECTION_LABEL}</span>
            <select
              className="input-field"
              defaultValue={student.courseId}
              name="course_id"
            >
              <option value="">Sin {SECTION_LABEL.toLowerCase()}</option>
              {data.courses.map((course) => {
                const institution = data.institutions.find(
                  (item) => item.id === course.institutionId,
                );

                return (
                  <option key={course.id} value={course.id}>
                    {course.name} - {institution?.name}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="block">
            <span className="form-label">Profesional asignada</span>
            <select
              className="input-field"
              defaultValue={assignedProfessionalId}
              name="professional_id"
            >
              {data.professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="form-label">Foco de apoyo</span>
            <input
              className="input-field"
              defaultValue={student.supportFocus}
              name="support_focus"
              type="text"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="form-label">Contacto familiar</span>
            <input
              className="input-field"
              defaultValue={student.familyContact}
              name="family_contact"
              type="text"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="form-label">Observaciones</span>
            <textarea
              className="input-field min-h-36"
              defaultValue={student.notes}
              name="notes"
            />
          </label>

          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button className="primary-button text-base" type="submit">
              Guardar cambios
            </button>
            <a className="secondary-button text-base" href={`/students/${student.id}`}>
              Volver a la ficha
            </a>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        eyebrow="Accion sensible"
        title="Eliminar alumno"
      >
        <p className="text-base muted-copy">
          Esto quita al alumno del panel, sus tareas personales, evaluaciones y
          eventos vinculados.
        </p>
        <form action={deleteStudentAction} className="mt-5">
          <input name="student_id" type="hidden" value={student.id} />
          <button
            className="rounded-[18px] bg-[var(--warm-strong)] px-5 py-3 text-base font-semibold text-white transition hover:opacity-90"
            type="submit"
          >
            Eliminar alumno
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
