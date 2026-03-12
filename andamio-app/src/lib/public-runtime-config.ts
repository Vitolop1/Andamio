export interface PublicRuntimeConfig {
  supabaseUrl: string;
  supabasePublishableKey: string;
}

declare global {
  interface Window {
    __ANDAMIO_PUBLIC_CONFIG__?: PublicRuntimeConfig;
  }
}

function escapeForInlineScript(value: string) {
  return value.replace(/</g, "\\u003c");
}

export function buildPublicRuntimeConfigScript(config: PublicRuntimeConfig) {
  return `window.__ANDAMIO_PUBLIC_CONFIG__ = ${escapeForInlineScript(
    JSON.stringify(config),
  )};`;
}

export function getBrowserPublicRuntimeConfig() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.__ANDAMIO_PUBLIC_CONFIG__ ?? null;
}

