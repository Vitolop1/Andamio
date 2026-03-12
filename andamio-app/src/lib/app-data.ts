import { cache } from "react";
import {
  assignments as mockAssignments,
  courses as mockCourses,
  currentProfessional as mockProfessional,
  evaluations as mockEvaluations,
  institutions as mockInstitutions,
  libraryFiles as mockLibraryFiles,
  scheduleEvents as mockScheduleEvents,
  students as mockStudents,
} from "@/lib/mock-data";
import {
  hasSupabaseEnv,
  hasSupabaseServiceRole,
  isDemoBypassEnabled,
} from "@/lib/env";
import { inferGradeLabel } from "@/lib/grades";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Assignment,
  Course,
  Evaluation,
  Institution,
  LibraryFile,
  ProfessionalListItem,
  ProfessionalProfile,
  ScheduleEvent,
  Student,
} from "@/lib/types";
import { initialsFromName } from "@/lib/utils";

type SourceMode = "mock" | "supabase";

interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "profesional" | "alumno";
}

interface InstitutionRow {
  id: string;
  name: string;
  city: string | null;
  province: string | null;
  lead_name: string | null;
  created_at: string;
}

interface CourseRow {
  id: string;
  institution_id: string;
  name: string;
  school_year: string;
  level: string | null;
  shift: string | null;
  teacher_name: string | null;
}

interface StudentRow {
  id: string;
  institution_id: string;
  course_id: string | null;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  family_contact: string | null;
  support_focus: string | null;
  notes: string | null;
  status: Student["status"];
  created_at: string;
}

interface StudentProfessionalRow {
  student_id: string;
  professional_id: string;
}

interface EvaluationRow {
  id: string;
  student_id: string;
  title: string;
  evaluation_type: string;
  summary: string | null;
  evaluated_at: string;
}

interface FileRow {
  id: string;
  uploaded_by: string | null;
  institution_id: string | null;
  course_id: string | null;
  student_id: string | null;
  title: string;
  storage_path: string;
  kind: LibraryFile["kind"];
  scope: LibraryFile["scope"];
  visibility?: LibraryFile["visibility"] | null;
  grade_label?: string | null;
  subject: string | null;
  file_size_label: string | null;
  school_year: string | null;
  created_at: string;
}

interface ScheduleEventRow {
  id: string;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  professional_id: string | null;
  location: string | null;
  student_id: string | null;
  status: ScheduleEvent["status"];
}

interface AssignmentRow {
  id: string;
  student_id: string | null;
  course_id: string | null;
  title: string;
  description: string | null;
  due_at: string | null;
}

export interface AppDataBundle {
  source: SourceMode;
  currentProfessional: ProfessionalProfile;
  professionals: ProfessionalListItem[];
  institutions: Institution[];
  courses: Course[];
  students: Student[];
  evaluations: Evaluation[];
  assignments: Assignment[];
  libraryFiles: LibraryFile[];
  scheduleEvents: ScheduleEvent[];
}

function getMockBundle(): AppDataBundle {
  return {
    source: "mock",
    currentProfessional: mockProfessional,
    professionals: [
      {
        id: mockProfessional.id,
        name: mockProfessional.name,
        email: "emimaidanacornejo@gmail.com",
        role: "admin",
      },
      {
        id: "11111111-1111-1111-1111-111111111112",
        name: "Prof. Rosario Maidana",
        email: "rosario@andamio.app",
        role: "profesional",
      },
      {
        id: "11111111-1111-1111-1111-111111111113",
        name: "Prof. Agustina Esquiu",
        email: "agustina@andamio.app",
        role: "profesional",
      },
    ],
    institutions: mockInstitutions,
    courses: mockCourses,
    students: mockStudents,
    evaluations: mockEvaluations,
    assignments: mockAssignments,
    libraryFiles: mockLibraryFiles,
    scheduleEvents: mockScheduleEvents,
  };
}

function calculateAge(birthDate: string | null) {
  if (!birthDate) {
    return 0;
  }

  const today = new Date();
  const date = new Date(birthDate);

  let age = today.getFullYear() - date.getFullYear();
  const monthDelta = today.getMonth() - date.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
}

function composeSessionTimestamp(date: string, time: string) {
  return `${date}T${time}`;
}

function normalizeTime(value: string) {
  return value.slice(0, 5);
}

async function fetchFilesWithCompatibility(
  supabase: ReturnType<typeof createSupabaseAdminClient> | Awaited<ReturnType<typeof createSupabaseServerClient>>,
) {
  const withVisibility = await supabase
    .from("files")
    .select(
      "id, uploaded_by, institution_id, course_id, student_id, title, storage_path, kind, scope, visibility, grade_label, subject, file_size_label, school_year, created_at",
    )
    .order("created_at", { ascending: false });

  if (!withVisibility.error) {
    return withVisibility;
  }

  const fallbackToLegacy =
    withVisibility.error.message.toLowerCase().includes("visibility") ||
    withVisibility.error.message.toLowerCase().includes("grade_label");

  if (!fallbackToLegacy) {
    return withVisibility;
  }

  const fallback = await supabase
    .from("files")
    .select(
      "id, uploaded_by, institution_id, course_id, student_id, title, storage_path, kind, scope, subject, file_size_label, school_year, created_at",
    )
    .order("created_at", { ascending: false });

  if (fallback.error) {
    return fallback;
  }

  return {
    ...fallback,
    data: (fallback.data ?? []).map((file) => ({
      ...file,
      visibility: "Equipo",
      grade_label: null,
    })),
  };
}

export const loadAppData = cache(async (): Promise<AppDataBundle> => {
  if (!hasSupabaseEnv) {
    return getMockBundle();
  }

  try {
    const useAdminClient = isDemoBypassEnabled && hasSupabaseServiceRole;
    const supabase = useAdminClient
      ? createSupabaseAdminClient()
      : await createSupabaseServerClient();
    const user = useAdminClient
      ? null
      : (await supabase.auth.getUser()).data.user;

    const [
      profilesResult,
      institutionsResult,
      coursesResult,
      studentsResult,
      studentProfessionalsResult,
      evaluationsResult,
      filesResult,
      scheduleEventsResult,
      assignmentsResult,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .order("created_at", { ascending: true }),
      supabase
        .from("institutions")
        .select("id, name, city, province, lead_name, created_at")
        .order("name", { ascending: true }),
      supabase
        .from("courses")
        .select("id, institution_id, name, school_year, level, shift, teacher_name")
        .order("name", { ascending: true }),
      supabase
        .from("students")
        .select(
          "id, institution_id, course_id, first_name, last_name, birth_date, family_contact, support_focus, notes, status, created_at",
        )
        .order("last_name", { ascending: true }),
      supabase
        .from("student_professionals")
        .select("student_id, professional_id"),
      supabase
        .from("evaluations")
        .select("id, student_id, title, evaluation_type, summary, evaluated_at")
        .order("evaluated_at", { ascending: false }),
      fetchFilesWithCompatibility(supabase),
      supabase
        .from("schedule_events")
        .select(
          "id, title, event_date, start_time, end_time, professional_id, location, student_id, status",
        )
        .order("event_date", { ascending: true }),
      supabase
        .from("assignments")
        .select("id, student_id, course_id, title, description, due_at"),
    ]);

    const results = [
      profilesResult,
      institutionsResult,
      coursesResult,
      studentsResult,
      studentProfessionalsResult,
      evaluationsResult,
      filesResult,
      scheduleEventsResult,
      assignmentsResult,
    ];

    const failedQuery = results.find((result) => result.error);

    if (failedQuery?.error) {
      throw failedQuery.error;
    }

    const profiles = (profilesResult.data ?? []) as ProfileRow[];
    const institutionRows = (institutionsResult.data ?? []) as InstitutionRow[];
    const courseRows = (coursesResult.data ?? []) as CourseRow[];
    const studentRows = (studentsResult.data ?? []) as StudentRow[];
    const studentProfessionalRows =
      (studentProfessionalsResult.data ?? []) as StudentProfessionalRow[];
    const evaluationRows = (evaluationsResult.data ?? []) as EvaluationRow[];
    const fileRows = (filesResult.data ?? []) as FileRow[];
    const scheduleRows = (scheduleEventsResult.data ?? []) as ScheduleEventRow[];
    const assignmentRows = (assignmentsResult.data ?? []) as AssignmentRow[];

    const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

    const sessionProfile =
      (user && profiles.find((profile) => profile.id === user.id)) ||
      (user?.email
        ? profiles.find((profile) => profile.email === user.email)
        : undefined);

    const firstProfessional =
      sessionProfile ??
      profiles.find((profile) => profile.role === "admin") ??
      profiles.find((profile) => profile.role === "profesional");

    const currentProfessional: ProfessionalProfile = firstProfessional
      ? {
          id: firstProfessional.id,
          name: firstProfessional.full_name,
          role: firstProfessional.role,
          roleLabel:
            firstProfessional.role === "admin"
              ? "Administradora"
              : "Profesional",
          initials: initialsFromName(firstProfessional.full_name),
        }
      : mockProfessional;
    const currentRole = firstProfessional?.role ?? "profesional";

    const professionals: ProfessionalListItem[] = profiles
      .filter((profile) => profile.role === "profesional" || profile.role === "admin")
      .map((profile) => ({
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: profile.role,
      }));

    const professionalByStudent = new Map<string, string>();
    for (const assignment of studentProfessionalRows) {
      if (!professionalByStudent.has(assignment.student_id)) {
        const profile = profileMap.get(assignment.professional_id);
        professionalByStudent.set(
          assignment.student_id,
          profile?.full_name ?? currentProfessional.name,
        );
      }
    }

    const professionalIdsByStudent = new Map<string, string[]>();
    for (const assignment of studentProfessionalRows) {
      const ids = professionalIdsByStudent.get(assignment.student_id) ?? [];

      if (!ids.includes(assignment.professional_id)) {
        ids.push(assignment.professional_id);
      }

      professionalIdsByStudent.set(assignment.student_id, ids);
    }

    const assignmentCountByStudent = new Map<string, number>();
    for (const assignment of assignmentRows) {
      if (assignment.student_id) {
        assignmentCountByStudent.set(
          assignment.student_id,
          (assignmentCountByStudent.get(assignment.student_id) ?? 0) + 1,
        );
        continue;
      }

      if (!assignment.course_id) {
        continue;
      }

      for (const student of studentRows) {
        if (student.course_id !== assignment.course_id) {
          continue;
        }

        assignmentCountByStudent.set(
          student.id,
          (assignmentCountByStudent.get(student.id) ?? 0) + 1,
        );
      }
    }

    const earliestEventByStudent = new Map<string, ScheduleEventRow>();
    for (const event of scheduleRows) {
      if (!event.student_id) {
        continue;
      }

      const existing = earliestEventByStudent.get(event.student_id);
      const currentStamp = composeSessionTimestamp(event.event_date, event.start_time);
      const existingStamp = existing
        ? composeSessionTimestamp(existing.event_date, existing.start_time)
        : null;

      if (!existingStamp || currentStamp < existingStamp) {
        earliestEventByStudent.set(event.student_id, event);
      }
    }

    const institutions: Institution[] = institutionRows.map((institution) => ({
      id: institution.id,
      name: institution.name,
      city: institution.city ?? "Sin ciudad",
      province: institution.province ?? "Sin provincia",
      lead: institution.lead_name ?? currentProfessional.name,
      activeStudents: studentRows.filter(
        (student) => student.institution_id === institution.id,
      ).length,
      activeCourses: courseRows.filter(
        (course) => course.institution_id === institution.id,
      ).length,
      lastUpdate: "Sincronizado con Supabase",
    }));

    const courses: Course[] = courseRows.map((course) => ({
      id: course.id,
      institutionId: course.institution_id,
      name: course.name,
      schoolYear: course.school_year,
      level: course.level ?? "Sin nivel",
      shift: course.shift ?? "Sin turno",
      teacher: course.teacher_name ?? "Sin docente asignada",
      studentCount: studentRows.filter((student) => student.course_id === course.id)
        .length,
      subjects: [],
    }));
    const courseMap = new Map(courses.map((course) => [course.id, course]));

    const students: Student[] = studentRows.map((student) => {
      const nextEvent = earliestEventByStudent.get(student.id);

      return {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        age: calculateAge(student.birth_date),
        institutionId: student.institution_id,
        courseId: student.course_id ?? "",
        professional:
          professionalByStudent.get(student.id) ?? currentProfessional.name,
        supportFocus: student.support_focus ?? "Seguimiento general",
        familyContact: student.family_contact ?? "Contacto sin cargar",
        status: student.status,
        nextSession: nextEvent
          ? composeSessionTimestamp(nextEvent.event_date, nextEvent.start_time)
          : student.created_at,
        pendingTasks: assignmentCountByStudent.get(student.id) ?? 0,
        notes: student.notes ?? "Sin observaciones cargadas.",
        assignedProfessionalIds:
          professionalIdsByStudent.get(student.id) ?? [],
      };
    });

    const evaluations: Evaluation[] = evaluationRows.map((evaluation) => ({
      id: evaluation.id,
      studentId: evaluation.student_id,
      title: evaluation.title,
      type: evaluation.evaluation_type,
      date: evaluation.evaluated_at,
      summary: evaluation.summary ?? "Sin resumen cargado.",
    }));

    const assignments: Assignment[] = assignmentRows.map((assignment) => ({
      id: assignment.id,
      studentId: assignment.student_id ?? undefined,
      courseId: assignment.course_id ?? undefined,
      title: assignment.title,
      description: assignment.description ?? "Sin detalle cargado.",
      dueAt: assignment.due_at ?? undefined,
    }));

    const visibleFileRows = fileRows.filter((file) => {
      const visibility = file.visibility ?? "Equipo";

      if (currentRole === "admin") {
        return true;
      }

      if (visibility === "Equipo") {
        return true;
      }

      return file.uploaded_by === currentProfessional.id;
    });

    const libraryFiles: LibraryFile[] = visibleFileRows.map((file) => ({
      id: file.id,
      title: file.title,
      kind: file.kind,
      scope: file.scope,
      visibility: file.visibility ?? "Equipo",
      institutionId: file.institution_id ?? undefined,
      courseId: file.course_id ?? undefined,
      studentId: file.student_id ?? undefined,
      gradeLabel:
        file.grade_label ??
        inferGradeLabel(
          file.course_id ? courseMap.get(file.course_id)?.name : undefined,
        ) ??
        undefined,
      subject: file.subject ?? "General",
      year:
        file.school_year ??
        new Date(file.created_at).getFullYear().toString(),
      sizeLabel: file.file_size_label ?? "Tamano sin cargar",
      uploadedAt: file.created_at,
      uploadedBy:
        (file.uploaded_by ? profileMap.get(file.uploaded_by)?.full_name : null) ??
        currentProfessional.name,
    }));

    const scheduleEvents: ScheduleEvent[] = scheduleRows.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.event_date,
      startTime: normalizeTime(event.start_time),
      endTime: normalizeTime(event.end_time),
      professionalId: event.professional_id ?? undefined,
      professional:
        (event.professional_id
          ? profileMap.get(event.professional_id)?.full_name
          : null) ?? currentProfessional.name,
      location: event.location ?? "Ubicacion sin cargar",
      studentId: event.student_id ?? undefined,
      status: event.status,
    }));

    return {
      source: "supabase",
      currentProfessional,
      professionals,
      institutions,
      courses,
      students,
      evaluations,
      assignments,
      libraryFiles,
      scheduleEvents,
    };
  } catch (error) {
    console.error("No se pudo cargar Supabase. Se usa modo demo.", error);
    return getMockBundle();
  }
});
