import { AppShell } from "@/components/app-shell";
import { loadAppData } from "@/lib/app-data";
import { resolveUserRole } from "@/lib/auth-role";
import { hasSupabaseEnv, isDemoBypassEnabled } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatIsoDate } from "@/lib/utils";
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

    const role = await resolveUserRole(supabase, user);

    if (role === "alumno") {
      redirect("/portal/informes");
    }
  }

  const data = await loadAppData();
  const todayIso = formatIsoDate(new Date());
  const visibleStudents =
    data.currentProfessional.role === "admin"
      ? data.students
      : data.students.filter((student) =>
          student.assignedProfessionalIds.includes(data.currentProfessional.id),
        );
  const visibleStudentIds = new Set(visibleStudents.map((student) => student.id));
  const visibleEvents =
    data.currentProfessional.role === "admin"
      ? data.scheduleEvents
      : data.scheduleEvents.filter(
          (event) =>
            event.professionalId === data.currentProfessional.id ||
            (!!event.studentId && visibleStudentIds.has(event.studentId)),
        );
  const sessionsToday = visibleEvents.filter((event) => event.date === todayIso).length;

  return (
    <AppShell
      currentProfessional={data.currentProfessional}
      dataSource={data.source}
      sessionsToday={sessionsToday}
      studentCount={visibleStudents.length}
    >
      {children}
    </AppShell>
  );
}
