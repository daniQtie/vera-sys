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
          background: "#f4f1e8",
          color: "#20231f",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#5d715f",
          }}
        >
          DDV / DANIEL DE VERA
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05, fontWeight: 600 }}>
            <span>If it lives in a browser,</span>
            <span style={{ color: "#5d715f" }}>
              I can build it.
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#5b625b" }}>
            {`${PROFILE.name} · ${PROFILE.role}`}
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#5b625b" }}>
          SaaS · Web applications · Digital products
        </div>
      </div>
    ),
    { ...size },
  );
}
