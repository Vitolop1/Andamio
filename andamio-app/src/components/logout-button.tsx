"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  function handleLogout() {
    setIsPending(true);

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      } finally {
        router.push("/login");
        router.refresh();
        setIsPending(false);
      }
    });
  }

  return (
    <button
      className="secondary-button text-base disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      <LogOut className="h-4 w-4" />
      {isPending ? "Saliendo..." : "Salir"}
    </button>
  );
}
