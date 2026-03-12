import { redirect } from "next/navigation";
import { StudentShell } from "@/components/student-shell";
import { resolveUserRole } from "@/lib/auth-role";
import { hasSupabaseEnv, isDemoBypassEnabled } from "@/lib/env.server";
import { loadStudentPortalData } from "@/lib/student-portal-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function StudentPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (hasSupabaseEnv() && !isDemoBypassEnabled()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const role = await resolveUserRole(supabase, user);

    if (role !== "alumno") {
      redirect("/dashboard");
    }
  }

  const data = await loadStudentPortalData();

  return (
    <StudentShell studentName={`${data.student.firstName} ${data.student.lastName}`}>
      {children}
    </StudentShell>
  );
}
