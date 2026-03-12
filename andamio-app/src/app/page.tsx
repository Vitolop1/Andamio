import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { loadAppData } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadAppData();

  return (
    <main className="mx-auto flex min-h-screen max-w-[1080px] items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="surface-card mx-auto w-full p-8 text-center sm:p-12">
        <div className="flex flex-col items-center">
          <Image
            alt="Logo de Andamio"
            className="h-auto w-[300px] sm:w-[420px]"
            height={180}
            priority
            src="/andamiologo.png"
            width={420}
          />
          <p className="eyebrow mt-8">Plataforma privada</p>
          <h1 className="display-font mt-4 max-w-4xl text-5xl font-semibold leading-tight text-[var(--foreground)] sm:text-7xl">
            Andamio
          </h1>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="primary-button text-base" href="/login">
            Login
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="secondary-button text-base" href="/dashboard">
            Abrir panel
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-6">
            <p className="text-4xl font-semibold text-[var(--foreground)]">
              {data.students.length}
            </p>
            <p className="mt-2 text-base muted-copy">alumnos cargados</p>
          </article>
          <article className="rounded-[28px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-6">
            <p className="text-4xl font-semibold text-[var(--foreground)]">
              {data.institutions.length}
            </p>
            <p className="mt-2 text-base muted-copy">colegios y espacios</p>
          </article>
          <article className="rounded-[28px] border border-[rgba(76,63,97,0.08)] bg-white/82 p-6">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[rgba(146,124,183,0.12)] text-[var(--primary-strong)]">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
              acceso privado
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
