import { createStudentAction } from "@/app/(workspace)/actions";
import { loadAppData } from "@/lib/app-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { SECTION_LABEL } from "@/lib/section-labels";

export const metadata = {
  title: "Nuevo alumno",
};

export default async function NewStudentPage() {
  const data = await loadAppData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Alta de alumno"
        title="Agregar alumno"
      />

      <SectionCard
        eyebrow="Formulario"
        title="Ficha inicial"
      >
        <form action={createStudentAction} className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="form-label">Nombre</span>
            <input
              className="input-field"
              name="first_name"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="form-label">Apellido</span>
            <input
              className="input-field"
              name="last_name"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="form-label">Fecha de nacimiento</span>
            <input
              className="input-field"
              name="birth_date"
              type="date"
            />
          </label>

          <label className="block">
            <span className="form-label">Estado inicial</span>
            <select
              className="input-field"
              defaultValue="nuevo-ingreso"
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
              name="institution_id"
              required
            >
              <option value="">Seleccionar colegio</option>
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
              name="course_id"
            >
              <option value="">Sin {SECTION_LABEL.toLowerCase()} por ahora</option>
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
              name="professional_id"
            >
              <option value="">Usar mi perfil actual</option>
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
              name="support_focus"
              placeholder="Lectoescritura, organizacion, lenguaje..."
              type="text"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="form-label">Contacto familiar</span>
            <input
              className="input-field"
              name="family_contact"
              type="text"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="form-label">Observaciones iniciales</span>
            <textarea
              className="input-field min-h-36"
              name="notes"
            />
          </label>

          <div className="lg:col-span-2">
            <button className="primary-button text-base" type="submit">
              Guardar alumno
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
