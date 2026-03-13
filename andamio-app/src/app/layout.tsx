import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
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
    "Consultorio y plataforma privada de Andamio para organizar acompanamientos, archivos, tareas, informes y seguimiento profesional.",
};

const ADSENSE_CLIENT_ID = "ca-pub-4088690490762441";

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
        <Script
          async
          crossOrigin="anonymous"
          id="adsense-site-verification"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="beforeInteractive"
        />
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
