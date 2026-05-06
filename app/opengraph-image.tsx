import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "PBFMACHINE — Precision. Quality. Performance.";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #1E3A5F 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#F5F5F5",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: "#2B5BA6",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            marginBottom: 24,
            display: "flex",
          }}
        >
          EST. NEW JERSEY · USA
        </div>
        <div
          style={{
            fontSize: 128,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          PBFMACHINE
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#C0C5CE",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginTop: 24,
            display: "flex",
          }}
        >
          Precision · Quality · Performance
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            fontSize: 16,
            color: "#95A5A6",
            display: "flex",
          }}
        >
          High-tolerance CNC machining for aerospace, defense, automotive,
          medical &amp; industrial sectors.
        </div>
      </div>
    ),
    { ...size }
  );
}
