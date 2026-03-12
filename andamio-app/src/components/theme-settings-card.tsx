"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium, MonitorCog } from "lucide-react";
import { THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";
import { cx } from "@/lib/utils";

const options: Array<{
  value: ThemePreference;
  label: string;
  helper: string;
  icon: typeof SunMedium;
}> = [
  {
    value: "light",
    label: "Claro",
    helper: "Fondo claro y limpio.",
    icon: SunMedium,
  },
  {
    value: "dark",
    label: "Oscuro",
    helper: "Menos brillo para trabajar de noche.",
    icon: MoonStar,
  },
  {
    value: "system",
    label: "Sistema",
    helper: "Sigue la preferencia del equipo.",
    icon: MonitorCog,
  },
];

function resolveTheme(value: ThemePreference) {
  if (value === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return value;
}

export function ThemeSettingsCard() {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null) ?? "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = resolveTheme(theme);
  }, [theme]);

  function applyTheme(nextTheme: ThemePreference) {
    setTheme(nextTheme);
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {options.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;

        return (
          <button
            className={cx(
              "text-left rounded-[24px] border px-5 py-5 transition",
              active
                ? "border-[rgba(146,124,183,0.24)] bg-[rgba(146,124,183,0.12)]"
                : "border-[rgba(76,63,97,0.08)] bg-white/80 hover:bg-[rgba(146,124,183,0.06)]",
            )}
            key={option.value}
            onClick={() => applyTheme(option.value)}
            type="button"
          >
            <div className="flex items-center gap-3">
              <div
                className={cx(
                  "grid h-11 w-11 place-items-center rounded-2xl",
                  active
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[rgba(146,124,183,0.12)] text-[var(--foreground)]",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold text-[var(--foreground)]">
                  {option.label}
                </p>
                <p className="mt-1 text-sm muted-copy">{option.helper}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
