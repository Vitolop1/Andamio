import { NextResponse } from "next/server";
import { hasSupabaseServiceRole } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const STORAGE_BUCKET = "andamio-files";

interface ProfileRow {
  id: string;
  email: string;
  role: "admin" | "profesional" | "alumno";
}

interface FileRow {
  id: string;
  uploaded_by: string | null;
  storage_path: string;
  title: string;
  institution_id: string | null;
  course_id: string | null;
  student_id: string | null;
  scope: "Alumno" | "Curso" | "Institucion" | null;
  visibility: "Equipo" | "Privado" | null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!hasSupabaseServiceRole) {
    return new Response("Falta SUPABASE_SERVICE_ROLE_KEY para abrir archivos.", {
      status: 500,
    });
  }

  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return new Response("Necesitas iniciar sesion para abrir este archivo.", {
      status: 401,
    });
  }

  const adminClient = createSupabaseAdminClient();
  const { data: profileById } = await adminClient
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  const { data: profileByEmail } = profileById
    ? { data: null }
    : await adminClient
        .from("profiles")
        .select("id, email, role")
        .eq("email", user.email)
        .maybeSingle<ProfileRow>();

  const profile = profileById ?? profileByEmail;

  if (!profile) {
    return new Response("No encontramos un perfil con acceso para este usuario.", {
      status: 403,
    });
  }

  const { data: file, error: fileError } = await adminClient
    .from("files")
    .select("id, uploaded_by, storage_path, title, institution_id, course_id, student_id, scope, visibility")
    .eq("id", id)
    .maybeSingle<FileRow>();

  if (fileError) {
    return new Response("No se pudo consultar el archivo.", { status: 500 });
  }

  if (!file) {
    return new Response("No encontramos ese archivo.", { status: 404 });
  }

  let canRead =
    profile.role === "admin" ||
    file.uploaded_by === profile.id ||
    file.uploaded_by === user.id;

  if (!canRead && profile.role === "alumno") {
    const { data: portalAccount } = await adminClient
      .from("student_portal_accounts")
      .select("student_id")
      .eq("profile_id", profile.id)
      .maybeSingle<{ student_id: string }>();

    if (portalAccount?.student_id) {
      const { data: studentRow } = await adminClient
        .from("students")
        .select("institution_id, course_id")
        .eq("id", portalAccount.student_id)
        .maybeSingle<{ institution_id: string; course_id: string | null }>();

      canRead =
        (file.visibility ?? "Equipo") === "Equipo" &&
        (file.student_id === portalAccount.student_id ||
          (!!studentRow?.course_id && file.course_id === studentRow.course_id) ||
          (file.scope === "Institucion" &&
            file.institution_id === studentRow?.institution_id));
    }
  } else if (!canRead) {
    canRead = (file.visibility ?? "Equipo") === "Equipo";
  }

  if (!canRead) {
    return new Response("No tenes permisos para abrir este archivo.", {
      status: 403,
    });
  }

  const { data: signedUrlData, error: signedUrlError } = await adminClient.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(file.storage_path, 60 * 10);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    return new Response(
      "El archivo esta registrado, pero no encontramos el contenido real en Storage.",
      { status: 404 },
    );
  }

  return NextResponse.redirect(signedUrlData.signedUrl);
}
