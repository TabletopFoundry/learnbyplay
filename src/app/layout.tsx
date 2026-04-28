import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BASE_URL } from "@/lib/constants";

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "LearnByPlay — Standards-Aligned Board Game Lessons",
    template: "%s | LearnByPlay",
  },
  description:
    "Turn great board games into trusted, standards-aligned instruction. LearnByPlay helps teachers find the right game, launch a lesson, run structured play, and show administrators exactly what students practiced.",
  keywords: [
    "board games",
    "education",
    "lesson plans",
    "Common Core",
    "CASEL",
    "SEL",
    "classroom tools",
    "standards alignment",
    "game-based learning",
    "teacher dashboard",
  ],
  authors: [{ name: "LearnByPlay Team" }],
  creator: "LearnByPlay",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LearnByPlay",
    title: "LearnByPlay — Standards-Aligned Board Game Lessons",
    description:
      "Turn great board games into trusted, standards-aligned instruction for real classrooms.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnByPlay — Standards-Aligned Board Game Lessons",
    description:
      "Turn great board games into trusted, standards-aligned instruction for real classrooms.",
  },
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-[var(--background)] font-sans text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <a href="#main-content" className="skip-to-content">Skip to main content</a>
          <SiteHeader />
          <main id="main-content" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
