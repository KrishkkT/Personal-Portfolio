import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Krish Thakker - Cybersecurity, AI & Developer Portfolio",
    short_name: "KT Portfolio",
    description:
      "Professional portfolio of Krish Thakker, showcasing expertise in Development, Cybersecurity, CLoud and AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f23",
    theme_color: "#c9b037",
    icons: [
      {
        src: "/images/favicon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/images/favicon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  }
}
