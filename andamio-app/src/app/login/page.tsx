import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { hasSupabaseEnv, isDemoBypassEnabled } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Acceso profesional",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (hasSupabaseEnv && !isDemoBypassEnabled) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[980px] items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="surface-card mx-auto w-full max-w-[640px] p-8 text-center sm:p-12">
        <div className="flex flex-col items-center">
          <Image
            alt="Logo de Andamio"
            className="h-auto w-[260px] sm:w-[340px]"
            height={160}
            priority
            src="/andamiologo.png"
            width={340}
          />
          <p className="eyebrow mt-6">Acceso privado</p>
          <h1 className="display-font mt-4 text-6xl font-semibold text-[var(--foreground)] sm:text-7xl">
            Login
          </h1>
        </div>

        <LoginForm authEnabled={hasSupabaseEnv && !isDemoBypassEnabled} />
      </section>
    </main>
  );
}
