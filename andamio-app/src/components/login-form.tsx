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
  const [email, setEmail] = useState("valentina@andamio.app");
  const [password, setPassword] = useState("demo-andamio");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!authEnabled) {
      router.push("/dashboard");
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
          setErrorMessage(error.message);
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
          className="input-field"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
      </label>

      <label className="block">
        <span className="form-label">Password</span>
        <input
          className="input-field"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
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
