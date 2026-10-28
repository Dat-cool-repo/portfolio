import type { Metadata, Viewport } from "next";
import { Bangers, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import ImpactFlash from "@/components/ImpactFlash";
import SceneBackground from "@/components/SceneBackground";
import SectionThemes from "@/components/SectionThemes";
import InkFilters from "@/components/InkFilters";

const comic = Bangers({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-comic",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const code = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-code",
});

const title = "Dat Le — Machine Learning Engineer";
const description =
  "Dat Le — UF student and ML engineer. Production ML pipelines, LLM agent infrastructure, and research in model diffing and computer vision.";

// The preview image itself comes from app/opengraph-image.tsx; metadataBase
// turns its path into the absolute URL that link unfurlers require.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.dat-dev.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Dat Le",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// Dark browser chrome and native UI (scrollbars, form controls) from the
// first paint, matching the page background.
export const viewport: Viewport = {
  themeColor: "#0a0820",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scene="home"
      className={`h-full antialiased dark ${comic.variable} ${body.variable} ${code.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground cursor-none-desktop">
        {/* First tab stop: skips the floating buttons and the nav. Hidden until focused. */}
        <a
          href="#main"
          className="skip-link ink-btn bg-accent-3 text-paper-ink"
        >
          Skip to content
        </a>
        {/* Without JS the scroll reveals never fire; show everything instead. */}
        <noscript>
          <style>{`.reveal { opacity: 1; translate: none; }`}</style>
        </noscript>
        <InkFilters />
        <SceneBackground />
        <CustomCursor />
        <CommandPalette />
        <ImpactFlash />
        {children}
        <SectionThemes />
      </body>
    </html>
  );
}
