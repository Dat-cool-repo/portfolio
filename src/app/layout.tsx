import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Dat Le — Machine Learning Engineer",
  description:
    "Dat Le — UF student and ML engineer. Production ML pipelines, LLM agent infrastructure, and research in model diffing and computer vision.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scene="home"
      className={`h-full antialiased dark ${comic.variable} ${body.variable} ${code.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground cursor-none-desktop">
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
