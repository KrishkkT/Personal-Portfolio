import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 32,
  height: 32,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1f2937",
        fontWeight: "bold",
        borderRadius: "8px",
      }}
    >
      KT
    </div>,
    {
      ...size,
    },
  )
}
