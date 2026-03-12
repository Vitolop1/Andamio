import "server-only";

import { hasSupabaseServiceRole } from "@/lib/env.server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const STORAGE_BUCKET = "andamio-files";
const SIGNED_URL_TTL_SECONDS = 60 * 20;

export async function loadSignedFileUrlMap(
  files: Array<{ id: string; storagePath: string }>,
) {
  if (!hasSupabaseServiceRole() || !files.length) {
    return new Map<string, string>();
  }

  const adminClient = createSupabaseAdminClient();
  const signedEntries = await Promise.all(
    files.map(async (file) => {
      const { data, error } = await adminClient.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(file.storagePath, SIGNED_URL_TTL_SECONDS);

      if (error || !data?.signedUrl) {
        return [file.id, ""] as const;
      }

      return [file.id, data.signedUrl] as const;
    }),
  );

  return new Map(
    signedEntries.filter((entry) => entry[1]),
  );
}
