import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { ThemeSettingsCard } from "@/components/theme-settings-card";
import { loadAppData } from "@/lib/app-data";

export const metadata = {
  title: "Configuracion",
};

export default async function SettingsPage() {
  const data = await loadAppData();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Configuracion" title="Ajustes" />

      <SectionCard eyebrow="Apariencia" title="Tema">
        <ThemeSettingsCard />
      </SectionCard>

      <SectionCard eyebrow="Sesion" title="Cuenta actual">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[24px] bg-[rgba(188,203,79,0.18)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
              Nombre
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              {data.currentProfessional.name}
            </p>
          </article>
          <article className="rounded-[24px] bg-[rgba(146,124,183,0.12)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
              Rol
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              {data.currentProfessional.roleLabel}
            </p>
          </article>
        </div>
      </SectionCard>
    </div>
  );
}
