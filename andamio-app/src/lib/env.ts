const DEFAULT_STORAGE_LIMIT_BYTES = 10_000_000_000;

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

export function hasSupabaseServiceRole() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isDemoBypassEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_BYPASS === "true";
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y una key publica de Supabase.",
    );
  }

  return { url, anonKey };
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY.");
  }

  return serviceRoleKey;
}

export function getAppStorageLimitBytes() {
  const rawValue = process.env.APP_STORAGE_LIMIT_BYTES;

  if (!rawValue) {
    return DEFAULT_STORAGE_LIMIT_BYTES;
  }

  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_STORAGE_LIMIT_BYTES;
  }

  return Math.floor(parsed);
}
