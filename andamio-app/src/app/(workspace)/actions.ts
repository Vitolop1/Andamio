"use server";

import { randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getAppStorageLimitBytes,
  hasSupabaseServiceRole,
  isDemoBypassEnabled,
} from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatStorageBytes, parseFileSizeLabel } from "@/lib/storage-quota";
import {
  buildStudentPortalEmail,
  buildStudentPortalFullName,
  buildStudentPortalPassword,
} from "@/lib/student-portal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addDays, formatIsoDate } from "@/lib/utils";
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

async function getCurrentStorageUsageBytes(
  supabase:
    | ReturnType<typeof createSupabaseAdminClient>
    | Awaited<ReturnType<typeof createSupabaseServerClient>>,
) {
  const withBytes = await supabase
    .from("files")
    .select("file_size_bytes, file_size_label");

  if (!withBytes.error) {
    return (withBytes.data ?? []).reduce(
      (total, row) =>
        total +
        (typeof row.file_size_bytes === "number" && row.file_size_bytes > 0
          ? row.file_size_bytes
          : parseFileSizeLabel(row.file_size_label)),
      0,
    );
  }

  const fallbackToLegacy = withBytes.error.message
    .toLowerCase()
    .includes("file_size_bytes");

  if (!fallbackToLegacy) {
    throw withBytes.error;
  }

  const fallback = await supabase.from("files").select("file_size_label");

  if (fallback.error) {
    throw fallback.error;
  }

  return (fallback.data ?? []).reduce(
    (total, row) => total + parseFileSizeLabel(row.file_size_label),
    0,
  );
}

function toTimeMinutes(value: string) {
  const [hours, minutes] = value.split(":").map((chunk) => Number(chunk));
  return hours * 60 + minutes;
}

function normalizeTimeForDatabase(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

function parseIsoDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("La fecha del horario no es valida.");
  }

  return parsed;
}

function addMonths(value: Date, amount: number) {
  const next = new Date(value);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function addYears(value: Date, amount: number) {
  const next = new Date(value);
  next.setFullYear(next.getFullYear() + amount);
  return next;
}

function buildRecurringDates(
  startDateIso: string,
  repeatWindow: string,
  repeatDays: string[],
) {
  if (repeatWindow === "none") {
    return [startDateIso];
  }

  const startDate = parseIsoDate(startDateIso);
  const days = repeatDays.length
    ? repeatDays.map((value) => Number(value))
    : [startDate.getDay()];

  const daySet = new Set(days);
  const endDate =
    repeatWindow === "week"
      ? addDays(startDate, 6)
      : repeatWindow === "month"
        ? addMonths(startDate, 1)
        : addYears(startDate, 1);

  const dates: string[] = [];

  for (
    let cursor = new Date(startDate);
    cursor <= endDate;
    cursor = addDays(cursor, 1)
  ) {
    if (daySet.has(cursor.getDay())) {
      dates.push(formatIsoDate(cursor));
    }
  }

  return dates.length ? Array.from(new Set(dates)) : [startDateIso];
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

async function ensureStudentPortalAccount(options: {
  studentId: string;
  firstName: string;
  lastName: string;
}) {
  if (!hasSupabaseServiceRole) {
    return null;
  }

  const adminClient = createSupabaseAdminClient();
  const portalEmail = buildStudentPortalEmail(
    options.firstName,
    options.lastName,
    options.studentId,
  );
  const initialPassword = buildStudentPortalPassword(options.firstName);
  const fullName = buildStudentPortalFullName(options.firstName, options.lastName);

  const { data: existingAccount } = await adminClient
    .from("student_portal_accounts")
    .select("profile_id")
    .eq("student_id", options.studentId)
    .maybeSingle<{ profile_id: string }>();

  if (existingAccount?.profile_id) {
    return {
      email: portalEmail,
      initialPassword,
      profileId: existingAccount.profile_id,
    };
  }

  const { data: authUsersData, error: authUsersError } =
    await adminClient.auth.admin.listUsers();

  if (authUsersError) {
    throw authUsersError;
  }

  const existingUser = authUsersData.users.find((user) => user.email === portalEmail);

  let profileId = existingUser?.id;

  if (existingUser) {
    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      existingUser.id,
      {
        email: portalEmail,
        password: initialPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: "alumno",
        },
      },
    );

    if (updateError) {
      throw updateError;
    }
  } else {
    const { data: createdUser, error: createError } =
      await adminClient.auth.admin.createUser({
        email: portalEmail,
        password: initialPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: "alumno",
        },
      });

    if (createError || !createdUser.user) {
      throw createError ?? new Error("No se pudo crear el acceso del alumno.");
    }

    profileId = createdUser.user.id;
  }

  if (!profileId) {
    throw new Error("No se pudo resolver el perfil del alumno.");
  }

  const { error: profileError } = await adminClient.from("profiles").upsert({
    id: profileId,
    full_name: fullName,
    email: portalEmail,
    role: "alumno",
  });

  if (profileError) {
    throw profileError;
  }

  const { error: accountError } = await adminClient
    .from("student_portal_accounts")
    .upsert({
      student_id: options.studentId,
      profile_id: profileId,
      email: portalEmail,
      initial_password: initialPassword,
    });

  if (accountError) {
    throw accountError;
  }

  return {
    email: portalEmail,
    initialPassword,
    profileId,
  };
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
  const firstName = requiredString(formData, "first_name");
  const lastName = requiredString(formData, "last_name");

  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      institution_id: institutionId,
      course_id: courseId,
      first_name: firstName,
      last_name: lastName,
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

  await ensureStudentPortalAccount({
    studentId: student.id,
    firstName,
    lastName,
  });

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
    throw new Error("Para un archivo compartido, elegi un grado o una seccion / taller.");
  }

  if (scope === "Alumno" && !studentId) {
    throw new Error("Para un archivo de alumno, tenes que seleccionar el alumno.");
  }

  const quotaClient = hasSupabaseServiceRole
    ? createSupabaseAdminClient()
    : actorContext.supabase;
  const usedBytes = await getCurrentStorageUsageBytes(quotaClient);
  const limitBytes = getAppStorageLimitBytes();
  const nextUsage = usedBytes + fileInput.size;

  if (nextUsage > limitBytes) {
    const remainingBytes = Math.max(limitBytes - usedBytes, 0);
    const message =
      remainingBytes > 0
        ? `No entra. Quedan ${formatStorageBytes(remainingBytes)} libres y este archivo pesa ${formatStorageBytes(fileInput.size)}.`
        : "Se alcanzo el limite interno de almacenamiento.";
    redirect(`/upload?error=${encodeURIComponent(message)}`);
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
      throw courseError ?? new Error("No se pudo resolver la seccion / taller seleccionada.");
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
    storagePath = `institutions/${resolvedInstitutionId}/sections/${resolvedCourseId}/${folder}/${baseFileName}`;
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
    file_size_bytes: fileInput.size,
    school_year: optionalString(formData, "school_year"),
  };

  let { error: fileError } = await databaseClient.from("files").insert(filePayload);

  if (
    fileError &&
    (fileError.message.toLowerCase().includes("visibility") ||
      fileError.message.toLowerCase().includes("grade_label") ||
      fileError.message.toLowerCase().includes("file_size_bytes"))
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
  const repeatWindow = optionalString(formData, "repeat_window") ?? "none";
  const repeatDays = multipleStrings(formData, "repeat_days");

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
  const eventDates = buildRecurringDates(date, repeatWindow, repeatDays);

  if (!studentIds.length && !title) {
    throw new Error("Si no elegis alumnos, escribi un titulo para el bloque.");
  }

  if (!studentIds.length) {
    const records = eventDates.map((eventDate) => ({
      professional_id: professionalId,
      student_id: null,
      title,
      event_date: eventDate,
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

  const records = studentIds.flatMap((studentId) =>
    eventDates.map((eventDate) => ({
      id: randomUUID(),
      professional_id: professionalId,
      student_id: studentId,
      title: title ?? `Sesion individual - ${studentMap.get(studentId) ?? "Alumno"}`,
      event_date: eventDate,
      start_time: normalizeTimeForDatabase(startTime),
      end_time: normalizeTimeForDatabase(endTime),
      location,
      status,
    })),
  );

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
