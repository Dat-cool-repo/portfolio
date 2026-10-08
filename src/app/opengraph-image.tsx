import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Link-preview card (iMessage, Discord, Slack, LinkedIn, X). Rendered once at
// build time; mirrors the hero's comic palette.
export const alt = "Dat Le — Machine Learning Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [bangers, headshot] = await Promise.all([
    readFile(join(process.cwd(), "assets/Bangers-Regular.ttf")),
    readFile(join(process.cwd(), "public/portrait-headshot.jpg")),
  ]);
  const portrait = `data:image/jpeg;base64,${headshot.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          gap: 64,
          background: "#0b0614",
          backgroundImage: "radial-gradient(circle at 85% 30%, #2a1048 0%, #0b0614 60%)",
          color: "#fdf8ec",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "#ffe14d",
              color: "#140c1f",
              border: "4px solid #000",
              boxShadow: "6px 6px 0 #000",
              padding: "8px 18px",
              fontSize: 30,
              letterSpacing: 2,
              transform: "rotate(-2deg)",
            }}
          >
            dat-dev.com
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 36,
              fontSize: 132,
              lineHeight: 0.92,
              letterSpacing: 3,
              textShadow: "6px 6px 0 #ff2e88",
            }}
          >
            <span>DAT LE</span>
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 60, color: "#ffe14d", letterSpacing: 2 }}>
            MACHINE LEARNING ENGINEER
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#22e4ff", letterSpacing: 2 }}>
            UF CS &apos;27 · ML PIPELINES · LLM AGENTS · RESEARCH
          </div>
        </div>

        <div
          style={{
            display: "flex",
            border: "6px solid #000",
            boxShadow: "14px 14px 0 #ff2e88",
            transform: "rotate(2deg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori only renders <img> */}
          <img src={portrait} width={336} height={420} alt="" style={{ objectFit: "cover" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bangers", data: bangers, style: "normal", weight: 400 }],
    },
  );
}
