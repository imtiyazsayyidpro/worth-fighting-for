import { ImageResponse } from "next/og";

// Route segment config
export const alt =
  "Worth Fighting For — come back to the same side.";
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
          backgroundColor: "#fcf8f6",
          backgroundImage:
            "radial-gradient(circle at 50% 28%, rgba(214,158,150,0.40) 0%, transparent 52%)",
          color: "#3a2e38",
        }}
      >
        {/* breathing presence */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "9999px",
            backgroundImage:
              "radial-gradient(circle at 36% 30%, #f8ddd6, #d69e96 72%)",
            boxShadow: "0 18px 50px -10px rgba(214,158,150,0.6)",
            marginBottom: "44px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "26px",
            color: "#c98e86",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          For the two of you
        </div>

        <div
          style={{
            fontSize: "88px",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: "#3a2e38",
          }}
        >
          Come back to the same side.
        </div>

        <div
          style={{
            marginTop: "36px",
            fontSize: "34px",
            lineHeight: 1.4,
            color: "#8b7f88",
            maxWidth: "820px",
          }}
        >
          A quiet, guided space for the two of you to find your way back to each
          other.
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
