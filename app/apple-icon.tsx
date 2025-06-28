import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1f2937",
        fontWeight: "bold",
        borderRadius: "20px",
      }}
    >
      KT
    </div>,
    {
      ...size,
    },
  )
}
