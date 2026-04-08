import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "Muse Creative Agency";
  const subtitle = searchParams.get("subtitle") ?? "Digital experiences that move people";
  const accent = searchParams.get("accent") ?? "#C8956C";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          backgroundColor: "#0A0A0A",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Accent dot */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "80px",
            width: "8px",
            height: "8px",
            backgroundColor: accent,
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "80px",
            fontSize: "24px",
            fontWeight: 700,
            color: "#E8E4DE",
            letterSpacing: "-0.02em",
          }}
        >
          MUSE
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: "60px",
            height: "2px",
            backgroundColor: accent,
            marginBottom: "32px",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 30 ? "52px" : "64px",
            fontWeight: 700,
            color: "#E8E4DE",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "20px",
            color: "#8A8680",
            marginTop: "20px",
            maxWidth: "600px",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: accent,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
