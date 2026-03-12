import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";
import { getBrowserPublicRuntimeConfig } from "@/lib/public-runtime-config";

export function createSupabaseBrowserClient() {
  const runtimeConfig = getBrowserPublicRuntimeConfig();
  const url = runtimeConfig?.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    runtimeConfig?.supabasePublishableKey ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    const fallbackEnv = getSupabaseEnv();
    return createBrowserClient(fallbackEnv.url, fallbackEnv.anonKey);
  }

  return createBrowserClient(url, anonKey);
}
