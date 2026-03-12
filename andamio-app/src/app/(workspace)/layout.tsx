import { AppShell } from "@/components/app-shell";
import { loadAppData } from "@/lib/app-data";
import { hasSupabaseEnv, isDemoBypassEnabled } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (hasSupabaseEnv && !isDemoBypassEnabled) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }
  }

  const data = await loadAppData();
  const sessionsToday = data.scheduleEvents.filter(
    (event) => event.date === "2026-03-12",
  ).length;

  return (
    <AppShell
      currentProfessional={data.currentProfessional}
      dataSource={data.source}
      sessionsToday={sessionsToday}
      studentCount={data.students.length}
    >
      {children}
    </AppShell>
  );
}
