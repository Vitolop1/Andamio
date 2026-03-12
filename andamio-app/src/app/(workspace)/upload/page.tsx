import { FileUploadForm } from "@/components/file-upload-form";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { loadAppData } from "@/lib/app-data";
import { formatStorageBytes, loadStorageQuotaSummary } from "@/lib/storage-quota";
import type { FileScope } from "@/lib/types";

export const metadata = {
  title: "Subir archivo",
};

interface UploadPageProps {
  searchParams?: Promise<{
    scope?: string;
    institutionId?: string;
    courseId?: string;
    studentId?: string;
    gradeLabel?: string;
    error?: string;
  }>;
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const data = await loadAppData();
  const params = searchParams ? await searchParams : undefined;
  const quota = await loadStorageQuotaSummary();

  const safeScope = (() => {
    if (
      params?.scope === "Alumno" ||
      params?.scope === "Curso" ||
      params?.scope === "Institucion"
    ) {
      return params.scope as FileScope;
    }

    return "Institucion" as FileScope;
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Carga simple"
        title="Subir archivo"
      />

      <SectionCard
        eyebrow="Almacenamiento"
        title={`${formatStorageBytes(quota.usedBytes)} usados de ${formatStorageBytes(quota.limitBytes)}`}
      >
        <div className="space-y-4">
          <div className="overflow-hidden rounded-full bg-[rgba(76,63,97,0.08)]">
            <div
              className="h-3 rounded-full bg-[var(--primary)]"
              style={{ width: `${quota.percentUsed}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--foreground)]">
            <p>{quota.percentUsed}% usado</p>
            <p>{formatStorageBytes(quota.remainingBytes)} libres</p>
          </div>
          {params?.error ? (
            <div className="rounded-[24px] bg-[rgba(227,170,157,0.22)] px-5 py-4 text-base text-[var(--foreground)]">
              {params.error}
            </div>
          ) : null}
          {quota.isAtLimit ? (
            <div className="rounded-[24px] bg-[rgba(227,170,157,0.22)] px-5 py-4 text-base text-[var(--foreground)]">
              La carga esta bloqueada hasta liberar espacio o subir el tope.
            </div>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Paso a paso"
        title="Carga guiada"
      >
        <FileUploadForm
          courses={data.courses}
          disableUploads={quota.isAtLimit}
          defaultCourseId={params?.courseId}
          defaultGradeLabel={params?.gradeLabel}
          defaultInstitutionId={params?.institutionId}
          defaultScope={safeScope}
          defaultStudentId={params?.studentId}
          institutions={data.institutions}
          students={data.students}
        />
      </SectionCard>
    </div>
  );
}
