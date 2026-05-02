import type { Metadata } from "next";
import { Cinzel, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-wordmark",
  weight: ["400", "500", "600"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vasconcelos Fragrances — Perfumaria Contratipo Premium",
    template: "%s · Vasconcelos Fragrances",
  },
  description:
    "Fragrâncias inspiradas em grandes sucessos. Alta fixação, presença marcante e elegância em cada detalhe.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Vasconcelos Fragrances",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${cinzel.variable} ${montserrat.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
