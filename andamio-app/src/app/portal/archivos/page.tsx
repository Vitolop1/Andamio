import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { loadStudentPortalData } from "@/lib/student-portal-data";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Biblioteca",
};

export default async function StudentFilesPage() {
  const data = await loadStudentPortalData();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Portal alumno" title="Biblioteca" />

      <SectionCard eyebrow="Material" title="Archivos asignados">
        <div className="space-y-3">
          {data.files.length ? (
            data.files.map((file) => (
              <article
                className="rounded-[24px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5"
                key={file.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      {file.title}
                    </p>
                    <p className="mt-2 text-sm muted-copy">
                      {file.subject} - {file.kind} - {file.sizeLabel}
                    </p>
                    <p className="mt-2 text-sm muted-copy">
                      {formatDate(file.uploadedAt, {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge tone="neutral">{file.scope}</StatusBadge>
                    <a
                      className="secondary-button text-sm"
                      href={file.downloadUrl ?? `/api/files/${file.id}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Abrir
                    </a>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-[rgba(76,63,97,0.14)] bg-white/70 px-5 py-8 text-base muted-copy">
              No hay archivos cargados.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
