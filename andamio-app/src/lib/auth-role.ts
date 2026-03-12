import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Role } from "@/lib/types";

const KNOWN_ROLES: Role[] = ["admin", "profesional", "alumno"];

function isRole(value: unknown): value is Role {
  return typeof value === "string" && KNOWN_ROLES.includes(value as Role);
}

export function extractRoleFromUser(user: Pick<User, "user_metadata"> | null | undefined) {
  const role = user?.user_metadata?.role;
  return isRole(role) ? role : null;
}

export async function resolveUserRole(
  supabase: SupabaseClient,
  user: Pick<User, "id" | "email" | "user_metadata">,
) {
  const metadataRole = extractRoleFromUser(user);

  if (metadataRole) {
    return metadataRole;
  }

  const { data: profileById } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: Role }>();

  if (profileById?.role) {
    return profileById.role;
  }

  if (!user.email) {
    return null;
  }

  const { data: profileByEmail } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", user.email)
    .maybeSingle<{ role: Role }>();

  return profileByEmail?.role ?? null;
}

export function getHomePathForRole(role: Role | null) {
  return role === "alumno" ? "/portal/informes" : "/dashboard";
}
