export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "andamio-theme";

export const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem("${THEME_STORAGE_KEY}") || "light";
    const resolved =
      stored === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : stored;
    document.documentElement.dataset.theme = resolved;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;
