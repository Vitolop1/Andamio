import { createProfessionalAction } from "@/app/(workspace)/actions";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { hasSupabaseServiceRole } from "@/lib/env";

export const metadata = {
  title: "Nuevo profesional",
};

export default function NewProfessionalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Alta de equipo"
        title="Agregar maestra o profesional"
      />

      <SectionCard
        eyebrow="Formulario"
        title="Nuevo acceso"
      >
        {!hasSupabaseServiceRole ? (
          <div className="rounded-[26px] bg-[rgba(227,170,157,0.22)] p-5 text-base text-[var(--warm-strong)]">
            Falta `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`. Sin esa key no se
            pueden crear usuarios nuevos desde la web.
          </div>
        ) : null}

        <form action={createProfessionalAction} className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="form-label">Nombre completo</span>
            <input
              className="input-field"
              name="full_name"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="form-label">Email</span>
            <input
              className="input-field"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="block">
            <span className="form-label">Password temporal</span>
            <input
              className="input-field"
              minLength={8}
              name="password"
              required
              type="password"
            />
          </label>

          <label className="block">
            <span className="form-label">Rol</span>
            <select
              className="input-field"
              defaultValue="profesional"
              name="role"
            >
              <option value="profesional">Profesional</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="lg:col-span-2">
            <button
              className="primary-button text-base disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!hasSupabaseServiceRole}
              type="submit"
            >
              Guardar profesional
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
