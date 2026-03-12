import { cache } from "react";
import {
  getAppStorageLimitBytes,
  hasSupabaseEnv,
  hasSupabaseServiceRole,
  isDemoBypassEnabled,
} from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface FileSizeRow {
  file_size_bytes?: number | null;
  file_size_label?: string | null;
}

interface StorageUsageSummary {
  limitBytes: number;
  usedBytes: number;
  remainingBytes: number;
  percentUsed: number;
  isAtLimit: boolean;
}

export function formatStorageBytes(value: number) {
  if (value >= 1024 * 1024 * 1024) {
    return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (value >= 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${value} B`;
}

export function parseFileSizeLabel(value: string | null | undefined) {
  if (!value) {
    return 0;
  }

  const match = value.trim().match(/^([\d.,]+)\s*(KB|MB|GB|B)$/i);

  if (!match) {
    return 0;
  }

  const numeric = Number(match[1].replace(",", "."));
  const unit = match[2].toUpperCase();

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  switch (unit) {
    case "GB":
      return Math.round(numeric * 1024 * 1024 * 1024);
    case "MB":
      return Math.round(numeric * 1024 * 1024);
    case "KB":
      return Math.round(numeric * 1024);
    default:
      return Math.round(numeric);
  }
}

async function fetchFileSizeRows() {
  if (!hasSupabaseEnv) {
    return [] as FileSizeRow[];
  }

  const useAdminClient = isDemoBypassEnabled && hasSupabaseServiceRole;
  const supabase = useAdminClient
    ? createSupabaseAdminClient()
    : await createSupabaseServerClient();

  const withBytes = await supabase
    .from("files")
    .select("file_size_bytes, file_size_label");

  if (!withBytes.error) {
    return (withBytes.data ?? []) as FileSizeRow[];
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

  return (fallback.data ?? []) as FileSizeRow[];
}

export const loadStorageQuotaSummary = cache(
  async (): Promise<StorageUsageSummary> => {
    const limitBytes = getAppStorageLimitBytes();
    const rows = await fetchFileSizeRows();
    const usedBytes = rows.reduce(
      (total, row) =>
        total +
        (row.file_size_bytes && row.file_size_bytes > 0
          ? row.file_size_bytes
          : parseFileSizeLabel(row.file_size_label)),
      0,
    );
    const remainingBytes = Math.max(limitBytes - usedBytes, 0);
    const percentUsed = limitBytes
      ? Math.min(100, Math.round((usedBytes / limitBytes) * 100))
      : 0;

    return {
      limitBytes,
      usedBytes,
      remainingBytes,
      percentUsed,
      isAtLimit: usedBytes >= limitBytes,
    };
  },
);
