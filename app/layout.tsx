import type { Metadata } from "next";
import "./globals.css";

// Nota: em produção (com acesso irrestrito à internet), substituir por
// next/font/google (Geist) para tipografia customizada. Neste ambiente de
// desenvolvimento sandbox, fonts.googleapis.com está bloqueado, então usamos
// a stack de fontes de sistema como fallback temporário.

export const metadata: Metadata = {
  title: "Story Boost",
  description: "Adesivos profissionais para Stories do Instagram, prontos em segundos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
