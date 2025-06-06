import ProjectsClientPage from "./ProjectsClientPage"

export const metadata = {
  title: "Projects Portfolio | KT - Full Stack Developer & Cybersecurity Specialist",
  description:
    "Explore Krish Thakker's web development and cybersecurity projects, featuring Next.js, React, TypeScript, and secure application development.",
  keywords: [
    "Web Development Projects",
    "Cybersecurity Projects",
    "Full Stack Portfolio",
    "React Projects",
    "Next.js Applications",
    "TypeScript Projects",
  ],
  openGraph: {
    title: "Projects Portfolio | KT - Full Stack Developer & Cybersecurity Specialist",
    description:
      "Explore Krish Thakker's web development and cybersecurity projects, featuring Next.js, React, TypeScript, and secure application development.",
    url: "https://kjt.vercel.app/projects",
    images: [
      {
        url: "/images/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Krish Thakker - Projects Portfolio",
      },
    ],
  },
}

export default function ProjectsPage() {
  return <ProjectsClientPage />
}
