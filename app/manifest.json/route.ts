import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KT - Full Stack Developer & Cybersecurity Specialist",
    short_name: "KT Portfolio",
    description:
      "Professional portfolio of Krish Thakker, showcasing expertise in Full Stack Development, Cybersecurity, and Cloud Computing.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f23",
    theme_color: "#c9b037",
    icons: [
      {
        src: "/images/favicon.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/favicon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  }
}
