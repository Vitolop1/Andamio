"use server";

import { randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  hasSupabaseServiceRole,
  isDemoBypassEnabled,
} from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  EventStatus,
  FileKind,
  FileScope,
  FileVisibility,
  Role,
  StudentStatus,
} from "@/lib/types";

interface ActorProfile {
  id: string;
  full_name: string;
  email: string;
  role: Role;
}

const STORAGE_BUCKET = "andamio-files";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Falta el campo ${key}.`);
  }

  return value.trim();
}

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function multipleStrings(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .flatMap((value) => {
      if (typeof value !== "string") {
        return [];
      }

      const trimmed = value.trim();
      return trimmed ? [trimmed] : [];
    });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatFileSize(value: number) {
  if (value < 1024 * 1024) {
    return `${Math.max(1, Math.round(value / 1024))} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function toTimeMinutes(value: string) {
  const [hours, minutes] = value.split(":").map((chunk) => Number(chunk));
  return hours * 60 + minutes;
}

function normalizeTimeForDatabase(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

function buildScheduleRedirectPath(options: {
  view: string | null;
  week: string | null;
  month: string | null;
  date: string | null;
}) {
  const params = new URLSearchParams();
  const view = options.view === "month" ? "month" : "week";
  params.set("view", view);

  if (view === "month") {
    params.set("month", options.month ?? options.date ?? new Date().toISOString().slice(0, 10));
  } else if (options.week) {
    params.set("week", options.week);
  }

  if (options.date) {
    params.set("date", options.date);
  }

  return `/schedule?${params.toString()}`;
}

async function ensureStorageBucket() {
  if (!hasSupabaseServiceRole) {
    return;
  }

  const adminClient = createSupabaseAdminClient();
  const { data: buckets, error } = await adminClient.storage.listBuckets();

  if (error) {
    throw error;
  }

  const exists = buckets?.some((bucket) => bucket.name === STORAGE_BUCKET);

  if (!exists) {
    const { error: createError } = await adminClient.storage.createBucket(
      STORAGE_BUCKET,
      {
        public: false,
        fileSizeLimit: "20MB",
      },
    );

    if (createError && !createError.message.toLowerCase().includes("already exists")) {
      throw createError;
    }
  }
}

async function resolveActorProfile() {
  if (isDemoBypassEnabled && hasSupabaseServiceRole) {
    const supabase = createSupabaseAdminClient();
    const { data: actor, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .in("role", ["admin", "profesional"])
      .order("role", { ascending: true })
      .limit(1)
      .single<ActorProfile>();

    if (error || !actor) {
      throw error ?? new Error("No se encontro un perfil para modo demo.");
    }

    return { supabase, actor };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.email) {
    throw new Error("No hay una sesion valida.");
  }

  const { data: profileById } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", user.id)
    .maybeSingle<ActorProfile>();

  if (profileById) {
    return { supabase, actor: profileById };
  }

  const { data: profileByEmail } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("email", user.email)
    .maybeSingle<ActorProfile>();

  if (profileByEmail) {
    return { supabase, actor: profileByEmail };
  }

  const fallbackName =
    typeof user.user_metadata.full_name === "string" &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : user.email;

  const { data: insertedProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      full_name: fallbackName,
      email: user.email,
      role: "profesional",
    })
    .select("id, full_name, email, role")
    .single<ActorProfile>();

  if (insertError || !insertedProfile) {
    throw insertError ?? new Error("No se pudo crear el perfil del usuario.");
  }

  return { supabase, actor: insertedProfile };
}

export async function createInstitutionAction(formData: FormData) {
  const { supabase, actor } = await resolveActorProfile();

  const payload = {
    name: requiredString(formData, "name"),
    city: optionalString(formData, "city") ?? "Salta",
    province: optionalString(formData, "province") ?? "Salta",
    lead_name: optionalString(formData, "lead_name") ?? actor.full_name,
    created_by: actor.id,
  };

  const { error } = await supabase.from("institutions").insert(payload);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/institutions");
  redirect("/institutions");
}

export async function createStudentAction(formData: FormData) {
  const { supabase, actor } = await resolveActorProfile();

  const institutionId = requiredString(formData, "institution_id");
  const courseId = optionalString(formData, "course_id");
  const assignedProfessionalId =
    optionalString(formData, "professional_id") ?? actor.id;
  const status = (optionalString(formData, "status") ??
    "nuevo-ingreso") as StudentStatus;

  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      institution_id: institutionId,
      course_id: courseId,
      first_name: requiredString(formData, "first_name"),
      last_name: requiredString(formData, "last_name"),
      birth_date: optionalString(formData, "birth_date"),
      family_contact: optionalString(formData, "family_contact"),
      support_focus: optionalString(formData, "support_focus"),
      notes: optionalString(formData, "notes"),
      status,
    })
    .select("id")
    .single<{ id: string }>();

  if (studentError || !student) {
    throw studentError ?? new Error("No se pudo crear el alumno.");
  }

  const { error: relationError } = await supabase
    .from("student_professionals")
    .insert({
      id: randomUUID(),
      student_id: student.id,
      professional_id: assignedProfessionalId,
    });

  if (relationError) {
    throw relationError;
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/students");
  revalidatePath(`/students/${student.id}`);
  redirect(`/students/${student.id}`);
}

export async function createProfessionalAction(formData: FormData) {
  await resolveActorProfile();

  if (!hasSupabaseServiceRole) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY para crear usuarios profesionales.",
    );
  }

  const fullName = requiredString(formData, "full_name");
  const email = requiredString(formData, "email");
  const password = requiredString(formData, "password");
  const role = (optionalString(formData, "role") ?? "profesional") as Role;

  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role,
    },
  });

  if (error || !data.user) {
    throw error ?? new Error("No se pudo crear el usuario en Auth.");
  }

  const { error: profileError } = await adminClient.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName,
    email,
    role,
  });

  if (profileError) {
    throw profileError;
  }

  revalidatePath("/professionals");
  redirect("/professionals");
}

export async function createLibraryFileAction(formData: FormData) {
  const actorContext = await resolveActorProfile();
  const actor = actorContext.actor;
  const fileInput = formData.get("document");

  if (!(fileInput instanceof File) || fileInput.size === 0) {
    throw new Error("Tenes que seleccionar un archivo para subir.");
  }

  const scope = (requiredString(formData, "scope") as FileScope) ?? "Curso";
  const kind = (requiredString(formData, "kind") as FileKind) ?? "Material";
  const visibility =
    (optionalString(formData, "visibility") as FileVisibility | null) ?? "Equipo";
  const institutionId = optionalString(formData, "institution_id");
  const courseId = optionalString(formData, "course_id");
  const studentId = optionalString(formData, "student_id");
  const gradeLabel = optionalString(formData, "grade_label");

  if (scope === "Curso" && !courseId && !gradeLabel) {
    throw new Error("Para un archivo de curso, elegi un grado o un curso puntual.");
  }

  if (scope === "Alumno" && !studentId) {
    throw new Error("Para un archivo de alumno, tenes que seleccionar el alumno.");
  }

  let resolvedInstitutionId = institutionId;
  let resolvedCourseId = courseId;

  if (scope === "Alumno" && studentId) {
    const { data: studentRow, error: studentError } = await actorContext.supabase
      .from("students")
      .select("institution_id, course_id")
      .eq("id", studentId)
      .single<{ institution_id: string; course_id: string | null }>();

    if (studentError || !studentRow) {
      throw studentError ?? new Error("No se pudo resolver el alumno seleccionado.");
    }

    resolvedInstitutionId = studentRow.institution_id;
    resolvedCourseId = studentRow.course_id;
  }

  if (courseId) {
    const { data: courseRow, error: courseError } = await actorContext.supabase
      .from("courses")
      .select("institution_id")
      .eq("id", courseId)
      .single<{ institution_id: string }>();

    if (courseError || !courseRow) {
      throw courseError ?? new Error("No se pudo resolver el curso seleccionado.");
    }

    resolvedInstitutionId = courseRow.institution_id;
  }

  await ensureStorageBucket();

  const extension =
    fileInput.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "bin";
  const safeTitle = slugify(requiredString(formData, "title"));
  const folder = slugify(kind);
  const gradeFolder = gradeLabel ? `grades/${slugify(gradeLabel)}` : null;
  const baseFileName = `${Date.now()}-${safeTitle}.${extension}`;

  let storagePath = `general/${folder}/${baseFileName}`;

  if (scope === "Alumno" && studentId) {
    storagePath = `students/${studentId}/${folder}/${baseFileName}`;
  } else if (scope === "Curso" && resolvedInstitutionId && resolvedCourseId) {
    storagePath = `institutions/${resolvedInstitutionId}/courses/${resolvedCourseId}/${folder}/${baseFileName}`;
  } else if (scope === "Curso" && resolvedInstitutionId && gradeFolder) {
    storagePath = `institutions/${resolvedInstitutionId}/${gradeFolder}/${folder}/${baseFileName}`;
  } else if (scope === "Curso" && gradeFolder) {
    storagePath = `${gradeFolder}/${folder}/${baseFileName}`;
  } else if (scope === "Institucion" && resolvedInstitutionId && gradeFolder) {
    storagePath = `institutions/${resolvedInstitutionId}/${gradeFolder}/${folder}/${baseFileName}`;
  } else if (scope === "Institucion" && resolvedInstitutionId) {
    storagePath = `institutions/${resolvedInstitutionId}/${folder}/${baseFileName}`;
  } else if (gradeFolder) {
    storagePath = `${gradeFolder}/${folder}/${baseFileName}`;
  }

  const storageClient = hasSupabaseServiceRole
    ? createSupabaseAdminClient()
    : actorContext.supabase;
  const bytes = Buffer.from(await fileInput.arrayBuffer());
  const { error: uploadError } = await storageClient.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, bytes, {
      contentType: fileInput.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const databaseClient = hasSupabaseServiceRole
    ? createSupabaseAdminClient()
    : actorContext.supabase;

  const filePayload = {
    uploaded_by: actor.id,
    institution_id: resolvedInstitutionId,
    course_id: resolvedCourseId,
    student_id: studentId,
    title: requiredString(formData, "title"),
    storage_path: storagePath,
    kind,
    scope,
    visibility,
    grade_label: gradeLabel,
    subject: optionalString(formData, "subject"),
    file_size_label: formatFileSize(fileInput.size),
    school_year: optionalString(formData, "school_year"),
  };

  let { error: fileError } = await databaseClient.from("files").insert(filePayload);

  if (
    fileError &&
    (fileError.message.toLowerCase().includes("visibility") ||
      fileError.message.toLowerCase().includes("grade_label"))
  ) {
    const fallbackPayload = {
      uploaded_by: filePayload.uploaded_by,
      institution_id: filePayload.institution_id,
      course_id: filePayload.course_id,
      student_id: filePayload.student_id,
      title: filePayload.title,
      storage_path: filePayload.storage_path,
      kind: filePayload.kind,
      scope: filePayload.scope,
      subject: filePayload.subject,
      file_size_label: filePayload.file_size_label,
      school_year: filePayload.school_year,
    };
    const fallbackInsert = await databaseClient.from("files").insert(fallbackPayload);
    fileError = fallbackInsert.error;
  }

  if (fileError) {
    throw fileError;
  }

  revalidatePath("/dashboard");
  revalidatePath("/library");
  revalidatePath("/upload");

  if (studentId) {
    revalidatePath(`/students/${studentId}`);
  }

  redirect("/library");
}

export async function upsertScheduleEventAction(formData: FormData) {
  const { supabase, actor } = await resolveActorProfile();
  const eventId = optionalString(formData, "event_id");
  const view = optionalString(formData, "view");
  const week = optionalString(formData, "week");
  const month = optionalString(formData, "month");
  const professionalId = optionalString(formData, "professional_id") ?? actor.id;
  const date = requiredString(formData, "date");
  const startTime = requiredString(formData, "start_time");
  const endTime = requiredString(formData, "end_time");
  const title = optionalString(formData, "title");
  const location = optionalString(formData, "location") ?? "Andamio";
  const status = (optionalString(formData, "status") ?? "confirmada") as EventStatus;

  if (toTimeMinutes(endTime) <= toTimeMinutes(startTime)) {
    throw new Error("La hora de fin tiene que ser posterior a la de inicio.");
  }

  const redirectWeek = week ?? date;
  const redirectPath = buildScheduleRedirectPath({
    view,
    week: redirectWeek,
    month,
    date,
  });

  if (eventId) {
    const studentId = optionalString(formData, "student_id");
    let resolvedTitle = title;

    if (!resolvedTitle && studentId) {
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("first_name, last_name")
        .eq("id", studentId)
        .single<{ first_name: string; last_name: string }>();

      if (studentError || !student) {
        throw studentError ?? new Error("No se pudo resolver el alumno.");
      }

      resolvedTitle = `Sesion individual - ${student.first_name} ${student.last_name}`;
    }

    const { error } = await supabase
      .from("schedule_events")
      .update({
        student_id: studentId,
        professional_id: professionalId,
        title: resolvedTitle ?? "Bloque general",
        event_date: date,
        start_time: normalizeTimeForDatabase(startTime),
        end_time: normalizeTimeForDatabase(endTime),
        location,
        status,
      })
      .eq("id", eventId);

    if (error) {
      throw error;
    }

    revalidatePath("/dashboard");
    revalidatePath("/schedule");
    revalidatePath("/students");

    if (studentId) {
      revalidatePath(`/students/${studentId}`);
    }

    redirect(redirectPath);
  }

  const studentIds = multipleStrings(formData, "student_ids");

  if (!studentIds.length && !title) {
    throw new Error("Si no elegis alumnos, escribi un titulo para el bloque.");
  }

  if (!studentIds.length) {
    const { error } = await supabase.from("schedule_events").insert({
      professional_id: professionalId,
      student_id: null,
      title,
      event_date: date,
      start_time: normalizeTimeForDatabase(startTime),
      end_time: normalizeTimeForDatabase(endTime),
      location,
      status,
    });

    if (error) {
      throw error;
    }

    revalidatePath("/dashboard");
    revalidatePath("/schedule");
    redirect(redirectPath);
  }

  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, first_name, last_name")
    .in("id", studentIds);

  if (studentsError) {
    throw studentsError;
  }

  const studentMap = new Map(
    (students ?? []).map((student) => [
      student.id,
      `${student.first_name} ${student.last_name}`,
    ]),
  );

  const records = studentIds.map((studentId) => ({
    id: randomUUID(),
    professional_id: professionalId,
    student_id: studentId,
    title: title ?? `Sesion individual - ${studentMap.get(studentId) ?? "Alumno"}`,
    event_date: date,
    start_time: normalizeTimeForDatabase(startTime),
    end_time: normalizeTimeForDatabase(endTime),
    location,
    status,
  }));

  const { error } = await supabase.from("schedule_events").insert(records);

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
  revalidatePath("/schedule");
  revalidatePath("/students");

  for (const studentId of studentIds) {
    revalidatePath(`/students/${studentId}`);
  }

  redirect(redirectPath);
}

export async function deleteScheduleEventAction(formData: FormData) {
  const { supabase } = await resolveActorProfile();
  const eventId = requiredString(formData, "event_id");
  const studentId = optionalString(formData, "student_id");
  const view = optionalString(formData, "view");
  const week = optionalString(formData, "week");
  const month = optionalString(formData, "month");
  const date = optionalString(formData, "date");

  const { error } = await supabase.from("schedule_events").delete().eq("id", eventId);

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
  revalidatePath("/schedule");
  revalidatePath("/students");

  if (studentId) {
    revalidatePath(`/students/${studentId}`);
  }

  redirect(
    buildScheduleRedirectPath({
      view,
      week,
      month,
      date,
    }),
  );
}
