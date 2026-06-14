import { ImageResponse } from "next/og";

// Route segment config
export const alt =
  "Worth Fighting For — a space for the two of you, whenever you need it.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          textAlign: "center",
          backgroundColor: "#fbf4f7",
          backgroundImage:
            "radial-gradient(circle at 22% 20%, #f4d2e0 0%, transparent 45%), radial-gradient(circle at 80% 78%, #ddc8ec 0%, transparent 45%)",
          color: "#574a5c",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "30px",
            color: "#9c7b91",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "9999px",
              backgroundColor: "#c0697f",
            }}
          />
          A sanctuary for two
        </div>

        <div
          style={{
            marginTop: "36px",
            fontSize: "92px",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#4a3f52",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Fight for each other,</span>
          <span style={{ display: "flex" }}>
            not
            <span style={{ color: "#c0697f", margin: "0 0.28em" }}>with</span>
            each other.
          </span>
        </div>

        <div
          style={{
            marginTop: "40px",
            fontSize: "36px",
            lineHeight: 1.4,
            color: "#7a6a80",
            maxWidth: "880px",
          }}
        >
          A space for the two of you, whenever you need it.
        </div>

        <div
          style={{
            marginTop: "56px",
            fontSize: "26px",
            fontWeight: 600,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#c0697f",
          }}
        >
          Worth Fighting For
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
