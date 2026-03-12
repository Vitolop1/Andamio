import Image from "next/image";
import { LockKeyhole, ShieldCheck } from "lucide-react";
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
          <p className="mt-4 max-w-xl text-lg leading-8 muted-copy">
            Entrá a Andamio para trabajar con alumnos, horarios y archivos sin
            perderte entre carpetas.
          </p>
        </div>

        <LoginForm authEnabled={hasSupabaseEnv && !isDemoBypassEnabled} />

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5">
            <ShieldCheck className="h-7 w-7 text-[var(--accent-strong)]" />
            <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
              Datos protegidos
            </p>
            <p className="mt-2 text-sm leading-6 muted-copy">
              Informes, evaluaciones y materiales quedan ordenados y privados.
            </p>
          </div>
          <div className="rounded-[26px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-5">
            <LockKeyhole className="h-7 w-7 text-[var(--warm-strong)]" />
            <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
              Acceso listo
            </p>
            <p className="mt-2 text-sm leading-6 muted-copy">
              {isDemoBypassEnabled
                ? "El modo demo esta activo, asi que podes entrar sin mail ni password."
                : "Si ya creaste usuarios en Supabase, el acceso real esta listo para usar."}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[26px] bg-[rgba(188,203,79,0.18)] p-5 text-base leading-7 text-[var(--foreground)]">
          {isDemoBypassEnabled
            ? "Estas en modo demo. Cuando quieras volver al login real, desactiva NEXT_PUBLIC_ENABLE_DEMO_BYPASS."
            : "Si ves errores al entrar, el paso que sigue es revisar usuarios y permisos en Supabase."}
        </div>
      </section>
    </main>
  );
}
