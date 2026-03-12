import { createInstitutionAction } from "@/app/(workspace)/actions";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export const metadata = {
  title: "Nuevo colegio",
};

export default function NewInstitutionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Alta institucional"
        title="Agregar colegio"
      />

      <SectionCard
        eyebrow="Formulario"
        title="Nuevo colegio"
      >
        <form action={createInstitutionAction} className="grid gap-5 lg:grid-cols-2">
          <label className="block lg:col-span-2">
            <span className="form-label">Nombre del colegio</span>
            <input
              className="input-field"
              name="name"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="form-label">Ciudad</span>
            <input
              className="input-field"
              defaultValue="Salta"
              name="city"
              type="text"
            />
          </label>

          <label className="block">
            <span className="form-label">Provincia</span>
            <input
              className="input-field"
              defaultValue="Salta"
              name="province"
              type="text"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="form-label">Referente</span>
            <input
              className="input-field"
              name="lead_name"
              type="text"
            />
          </label>

          <div className="lg:col-span-2">
            <button className="primary-button text-base" type="submit">
              Guardar colegio
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
