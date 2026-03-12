"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface LoginFormProps {
  authEnabled: boolean;
}

export function LoginForm({ authEnabled }: LoginFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function mapLoginError(message: string) {
    const normalized = message.toLowerCase();

    if (normalized.includes("missing email or phone")) {
      return "Escribi un email y una contrasena antes de entrar.";
    }

    if (normalized.includes("invalid login credentials")) {
      return "Ese email o contrasena no coincide con un usuario cargado.";
    }

    return message;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!authEnabled) {
      router.push("/dashboard");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email =
      typeof formData.get("email") === "string"
        ? String(formData.get("email")).trim()
        : "";
    const password =
      typeof formData.get("password") === "string"
        ? String(formData.get("password"))
        : "";

    if (!email || !password) {
      setErrorMessage("Escribi un email y una contrasena antes de entrar.");
      return;
    }

    setIsPending(true);

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(mapLoginError(error.message));
          setIsPending(false);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No se pudo iniciar sesion.",
        );
        setIsPending(false);
        return;
      }

      setIsPending(false);
    });
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="form-label">Email</span>
        <input
          autoComplete="email"
          className="input-field"
          defaultValue=""
          name="email"
          placeholder="emimaidanacornejo@gmail.com"
          type="email"
        />
      </label>

      <label className="block">
        <span className="form-label">Password</span>
        <input
          autoComplete="current-password"
          className="input-field"
          defaultValue=""
          name="password"
          placeholder="Tu contrasena"
          type="password"
        />
      </label>

      <button
        className="primary-button w-full text-base disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {authEnabled ? (isPending ? "Entrando..." : "Entrar al panel") : "Abrir demo"}
        <ArrowRight className="h-4 w-4" />
      </button>

      {errorMessage ? (
        <p className="rounded-[22px] bg-[rgba(227,170,157,0.2)] px-5 py-4 text-base text-[var(--warm-strong)]">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
