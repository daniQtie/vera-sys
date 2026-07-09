import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/seed-data";

export const runtime = "edge";
export const alt = `${PROFILE.name} — ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0b08",
          color: "#f4ece0",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#d0a94f",
          }}
        >
          VeraSys
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 600 }}>
            If it lives in a browser,
            <br />
            <span style={{ fontStyle: "italic", color: "#d0a94f" }}>
              I can build it.
            </span>
          </div>
          <div style={{ fontSize: 30, color: "#a99c88" }}>
            {PROFILE.name} · {PROFILE.role}
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#6e6355" }}>
          E-commerce · Booking systems · Full-stack platforms
        </div>
      </div>
    ),
    { ...size },
  );
}
