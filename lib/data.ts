export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'frontend' | 'backend' | 'design' | 'tools' | '3d-graphics';

export interface Skill {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  description: string;
  icon?: string;
  yearsActive?: number;
}

export const skills: Skill[] = [
  {
    name: 'React',
    level: 'advanced',
    category: 'frontend',
    description: 'Building production apps with hooks, context, and server components',
    icon: 'react',
    yearsActive: 3
  },
  {
    name: 'TypeScript',
    level: 'advanced',
    category: 'frontend',
    description: 'Type-safe architectures with generics and advanced patterns',
    icon: 'typescript',
    yearsActive: 2
  },
  {
    name: 'Next.js',
    level: 'intermediate',
    category: 'frontend',
    description: 'Server-side rendering and static generation for performance',
    icon: 'nextjs',
    yearsActive: 2
  },
  {
    name: 'GSAP',
    level: 'intermediate',
    category: 'design',
    description: 'Timeline-based animations for smooth UI transitions',
    icon: 'gsap',
    yearsActive: 1
  },
  {
    name: 'Three.js',
    level: 'intermediate',
    category: '3d-graphics',
    description: 'WebGL scenes with custom shaders and physics integration',
    icon: 'threejs',
    yearsActive: 1
  },
  {
    name: 'React Three Fiber',
    level: 'beginner',
    category: '3d-graphics',
    description: 'Declarative 3D with React for interactive experiences',
    icon: 'r3f'
  },
  {
    name: 'Node.js',
    level: 'intermediate',
    category: 'backend',
    description: 'REST APIs and real-time services with Express and Fastify',
    icon: 'nodejs',
    yearsActive: 2
  },
  {
    name: 'PostgreSQL',
    level: 'intermediate',
    category: 'backend',
    description: 'Relational data modeling with migrations and query optimization',
    icon: 'postgresql',
    yearsActive: 1
  },
  {
    name: 'Figma',
    level: 'intermediate',
    category: 'design',
    description: 'Component-based design systems and prototyping workflows',
    icon: 'figma',
    yearsActive: 2
  },
  {
    name: 'Git',
    level: 'advanced',
    category: 'tools',
    description: 'Version control, rebasing strategies, and collaborative workflows',
    icon: 'git',
    yearsActive: 3
  }
];

export const projects = [
  {
    id: 'project-1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with Next.js, Stripe, and Sanity.',
    image: '/projects/project1.jpg',
    tags: ['Next.js', 'Stripe', 'Tailwind CSS'],
    link: '#'
  },
  {
    id: 'project-2',
    title: 'AI Analytics Dashboard',
    description: 'Real-time data visualization dashboard for AI model metrics.',
    image: '/projects/project2.jpg',
    tags: ['React', 'D3.js', 'Node.js'],
    link: '#'
  },
  {
    id: 'project-3',
    title: 'Creative Agency Site',
    description: 'Award-winning portfolio site with WebGL and GSAP animations.',
    image: '/projects/project3.jpg',
    tags: ['Three.js', 'GSAP', 'React'],
    link: '#'
  }
];

export const education = [
  {
    degree: "B.Tech in Computer Engineering",
    institution: "Dharmsinh Desai University",
    period: "2021 - 2025",
    location: "Nadiad, Gujarat",
    description: "Focused on core computer science subjects including algorithms, data structures, and software engineering principles. Active member of the technical coding club."
  },
  {
    role: "Frontend Developer Intern",
    company: "TechNova Solutions",
    period: "May 2024 - Aug 2024",
    location: "Remote",
    description: "Developed and optimized responsive web interfaces using React and Tailwind CSS. Improved lighthouse performance score by 20% through code splitting and lazy loading."
  }
];

export const certifications = [
  {
    title: "AWS Certified Developer – Associate",
    issuer: "Amazon Web Services",
    date: "Aug 2023",
    link: "#"
  },
  {
    title: "Meta Front-End Developer",
    issuer: "Coursera",
    date: "Dec 2023",
    link: "#"
  },
  {
    title: "Google Cybersecurity Professional",
    issuer: "Google",
    date: "Feb 2024",
    link: "#"
  }
];

export const blogs = [
  {
    title: "Mastering Framer Motion in React",
    excerpt: "Learn how to build complex, delightful UI animations using Framer Motion's declarative APIs.",
    date: "Apr 12, 2024",
    readTime: "5 min read",
    image: "/projects/project2.jpg",
    link: "#"
  },
  {
    title: "The Future of WebGL with React Three Fiber",
    excerpt: "Exploring the capabilities of React Three Fiber and how it simplifies building 3D experiences on the web.",
    date: "Mar 28, 2024",
    readTime: "8 min read",
    image: "/projects/project3.jpg",
    link: "#"
  },
  {
    title: "Why Next.js App Router is a Game Changer",
    excerpt: "A deep dive into the architecture of Next.js 14 App Router and server components.",
    date: "Feb 15, 2024",
    readTime: "6 min read",
    image: "/projects/project1.jpg",
    link: "#"
  }
];
