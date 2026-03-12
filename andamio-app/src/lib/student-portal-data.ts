import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Assignment, Evaluation, LibraryFile } from "@/lib/types";

interface StudentPortalStudent {
  id: string;
  firstName: string;
  lastName: string;
  institutionName: string;
  courseName: string;
  portalEmail: string;
}

export interface StudentPortalBundle {
  student: StudentPortalStudent;
  evaluations: Evaluation[];
  assignments: Assignment[];
  files: LibraryFile[];
}

export const loadStudentPortalData = cache(async (): Promise<StudentPortalBundle> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No hay una sesion valida de alumno.");
  }

  const { data: account, error: accountError } = await supabase
    .from("student_portal_accounts")
    .select("student_id, email")
    .eq("profile_id", user.id)
    .single<{ student_id: string; email: string }>();

  if (accountError || !account) {
    throw accountError ?? new Error("No se encontro la cuenta del alumno.");
  }

  const { data: studentRow, error: studentError } = await supabase
    .from("students")
    .select(
      "id, institution_id, course_id, first_name, last_name, institutions(name), courses(name)",
    )
    .eq("id", account.student_id)
    .single<{
      id: string;
      institution_id: string;
      course_id: string | null;
      first_name: string;
      last_name: string;
      institutions: { name: string } | { name: string }[] | null;
      courses: { name: string } | { name: string }[] | null;
    }>();

  if (studentError || !studentRow) {
    throw studentError ?? new Error("No se encontro el alumno.");
  }

  const studentId = studentRow.id;
  const courseId = studentRow.course_id;
  const studentFilesQuery = courseId
    ? supabase
        .from("files")
        .select(
          "id, title, kind, scope, visibility, institution_id, course_id, student_id, grade_label, subject, file_size_label, school_year, created_at",
        )
        .or(`student_id.eq.${studentId},course_id.eq.${courseId}`)
        .eq("visibility", "Equipo")
        .order("created_at", { ascending: false })
    : supabase
        .from("files")
        .select(
          "id, title, kind, scope, visibility, institution_id, course_id, student_id, grade_label, subject, file_size_label, school_year, created_at",
        )
        .eq("student_id", studentId)
        .eq("visibility", "Equipo")
        .order("created_at", { ascending: false });

  const assignmentsQuery = courseId
    ? supabase
        .from("assignments")
        .select("id, student_id, course_id, title, description, due_at")
        .or(`student_id.eq.${studentId},course_id.eq.${courseId}`)
        .order("due_at", { ascending: true })
    : supabase
        .from("assignments")
        .select("id, student_id, course_id, title, description, due_at")
        .eq("student_id", studentId)
        .order("due_at", { ascending: true });

  const [evaluationsResult, filesResult, assignmentsResult] = await Promise.all([
    supabase
      .from("evaluations")
      .select("id, student_id, title, evaluation_type, summary, evaluated_at")
      .eq("student_id", studentId)
      .order("evaluated_at", { ascending: false }),
    studentFilesQuery,
    assignmentsQuery,
  ]);

  const failed = [evaluationsResult, filesResult, assignmentsResult].find(
    (result) => result.error,
  );

  if (failed?.error) {
    throw failed.error;
  }

  const evaluations: Evaluation[] = (evaluationsResult.data ?? []).map((item) => ({
    id: item.id,
    studentId: item.student_id,
    title: item.title,
    type: item.evaluation_type,
    date: item.evaluated_at,
    summary: item.summary ?? "Sin resumen.",
  }));

  const assignments: Assignment[] = (assignmentsResult.data ?? []).map((item) => ({
    id: item.id,
    studentId: item.student_id ?? undefined,
    courseId: item.course_id ?? undefined,
    title: item.title,
    description: item.description ?? "Sin detalle.",
    dueAt: item.due_at ?? undefined,
  }));

  const files: LibraryFile[] = (filesResult.data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    kind: item.kind,
    scope: item.scope,
    visibility: item.visibility,
    institutionId: item.institution_id ?? undefined,
    courseId: item.course_id ?? undefined,
    studentId: item.student_id ?? undefined,
    gradeLabel: item.grade_label ?? undefined,
    subject: item.subject ?? "General",
    year: item.school_year ?? new Date(item.created_at).getFullYear().toString(),
    sizeLabel: item.file_size_label ?? "Sin tamano",
    uploadedAt: item.created_at,
    uploadedBy: "Andamio",
  }));

  const institutionName = Array.isArray(studentRow.institutions)
    ? studentRow.institutions[0]?.name
    : studentRow.institutions?.name;
  const courseName = Array.isArray(studentRow.courses)
    ? studentRow.courses[0]?.name
    : studentRow.courses?.name;

  return {
    student: {
      id: studentId,
      firstName: studentRow.first_name,
      lastName: studentRow.last_name,
      institutionName: institutionName ?? "Sin colegio",
      courseName: courseName ?? "Sin curso",
      portalEmail: account.email,
    },
    evaluations,
    assignments,
    files,
  };
});
