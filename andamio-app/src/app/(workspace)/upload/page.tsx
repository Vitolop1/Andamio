import { FileUploadForm } from "@/components/file-upload-form";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { loadAppData } from "@/lib/app-data";
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
  }>;
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const data = await loadAppData();
  const params = searchParams ? await searchParams : undefined;

  const safeScope = (() => {
    if (
      params?.scope === "Alumno" ||
      params?.scope === "Curso" ||
      params?.scope === "Institucion"
    ) {
      return params.scope as FileScope;
    }

    return "Curso" as FileScope;
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Carga simple"
        title="Subir archivo"
        description="Primero elegis el archivo. Despues lo clasificas por colegio, curso o alumno para que todo quede ordenado desde el principio."
      />

      <SectionCard
        eyebrow="Paso a paso"
        title="Carga guiada"
        description="Si el material es para todo un grado, marcas el curso y ya queda ordenado para ese grupo completo."
      >
        <FileUploadForm
          courses={data.courses}
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
