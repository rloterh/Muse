import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import { AuthViewerProvider } from "@/components/providers/auth-viewer-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { PageTransition } from "@/components/providers/page-transition";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { getServerAuthSnapshot } from "@/lib/auth/viewer";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";
import { homeMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  ...homeMetadata,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { viewer } = await getServerAuthSnapshot();

  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLd() }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd() }} />
      </head>
      <body className="grain min-h-screen bg-[var(--color-bg)] font-body text-[var(--color-text)] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10001] focus:bg-[var(--color-accent)] focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-[var(--color-bg)]"
        >
          Skip to content
        </a>
        <AuthViewerProvider initialViewer={viewer}>
          <AnalyticsProvider />
          <SmoothScrollProvider>
            <PageTransition>
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
            </PageTransition>
          </SmoothScrollProvider>
        </AuthViewerProvider>
      </body>
    </html>
  );
}
