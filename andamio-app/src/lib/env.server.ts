import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

const DEFAULT_STORAGE_LIMIT_BYTES = 10_000_000_000;

function getRuntimeEnvValue(key: string) {
  const processValue = process.env[key];

  if (typeof processValue === "string" && processValue.length > 0) {
    return processValue;
  }

  try {
    const context = getCloudflareContext();
    const envValue = (context.env as Record<string, unknown> | undefined)?.[key];

    if (typeof envValue === "string" && envValue.length > 0) {
      return envValue;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function hasSupabaseEnv() {
  return Boolean(
    getRuntimeEnvValue("NEXT_PUBLIC_SUPABASE_URL") &&
      (getRuntimeEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
        getRuntimeEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY")),
  );
}

export function hasSupabaseServiceRole() {
  return Boolean(getRuntimeEnvValue("SUPABASE_SERVICE_ROLE_KEY"));
}

export function isDemoBypassEnabled() {
  return getRuntimeEnvValue("NEXT_PUBLIC_ENABLE_DEMO_BYPASS") === "true";
}

export function getSupabaseEnv() {
  const url = getRuntimeEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey =
    getRuntimeEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    getRuntimeEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y una key publica de Supabase.",
    );
  }

  return { url, anonKey };
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = getRuntimeEnvValue("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceRoleKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY.");
  }

  return serviceRoleKey;
}

export function getAppStorageLimitBytes() {
  const rawValue = getRuntimeEnvValue("APP_STORAGE_LIMIT_BYTES");

  if (!rawValue) {
    return DEFAULT_STORAGE_LIMIT_BYTES;
  }

  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_STORAGE_LIMIT_BYTES;
  }

  return Math.floor(parsed);
}
