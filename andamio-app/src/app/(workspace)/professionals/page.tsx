import Link from "next/link";
import { loadAppData } from "@/lib/app-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";

export const metadata = {
  title: "Profesionales",
};

export default async function ProfessionalsPage() {
  const data = await loadAppData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Equipo"
        title="Accesos del equipo"
        actionHref="/professionals/new"
        actionLabel="Agregar profesional"
      />

      <SectionCard
        eyebrow="Listado"
        title="Accesos activos"
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {data.professionals.map((professional) => (
            <article
              className="rounded-[30px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-6"
              key={professional.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold text-[var(--foreground)]">
                    {professional.name}
                  </p>
                  <p className="mt-2 text-base muted-copy">{professional.email}</p>
                </div>
                <StatusBadge
                  tone={professional.role === "admin" ? "warning" : "success"}
                >
                  {professional.role}
                </StatusBadge>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Atajo"
        title="Altas rapidas"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5 text-base font-semibold text-[var(--foreground)] transition hover:border-[rgba(146,124,183,0.22)] hover:bg-[rgba(146,124,183,0.1)]"
            href="/institutions/new"
          >
            Agregar colegio
          </Link>
          <Link
            className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5 text-base font-semibold text-[var(--foreground)] transition hover:border-[rgba(146,124,183,0.22)] hover:bg-[rgba(146,124,183,0.1)]"
            href="/students/new"
          >
            Agregar alumno
          </Link>
          <Link
            className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/80 p-5 text-base font-semibold text-[var(--foreground)] transition hover:border-[rgba(146,124,183,0.22)] hover:bg-[rgba(146,124,183,0.1)]"
            href="/professionals/new"
          >
            Agregar profesional
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
