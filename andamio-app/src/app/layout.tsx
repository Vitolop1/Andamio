import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { getSupabaseEnv } from "@/lib/env";
import { buildPublicRuntimeConfigScript } from "@/lib/public-runtime-config";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Andamio",
    template: "%s | Andamio",
  },
  description:
    "Plataforma privada para organizar instituciones, secciones, alumnos, archivos y seguimiento profesional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { url, anonKey } = getSupabaseEnv();
  const publicRuntimeConfigScript = buildPublicRuntimeConfigScript({
    supabaseUrl: url,
    supabasePublishableKey: anonKey,
  });

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          dangerouslySetInnerHTML={{ __html: publicRuntimeConfigScript }}
        />
      </head>
      <body className={`${manrope.variable} ${fraunces.variable} antialiased`}>
        <div className="page-shell">{children}</div>
      </body>
    </html>
  );
}
