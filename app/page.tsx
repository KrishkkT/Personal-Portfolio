import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Blogs from "@/components/Blogs";
import Contact from "@/components/Contact";
import ScaleReveal from "@/components/ScaleReveal";
import { dataStore } from "@/lib/data-store";
import { blogStoreSupabase } from "@/lib/blog-store-supabase";

export const revalidate = 60;

export default async function Home() {
  // Fetch dynamic data from the connected Supabase stores
  const [hero, about, skills, projects, experience, certifications, blogs] = await Promise.all([
    dataStore.getHeroSection(),
    dataStore.getAboutSection(),
    dataStore.getAllSkillCategories(),
    dataStore.getAllProjects(),
    dataStore.getAllExperience(),
    dataStore.getAllCertificates(),
    blogStoreSupabase.getAllPosts()
  ]);

  return (
    <>
      <Hero data={hero} />
      <ScaleReveal><About data={about} /></ScaleReveal>
      <ScaleReveal><Skills data={skills} /></ScaleReveal>
      <ScaleReveal><Education data={experience} /></ScaleReveal>
      <ScaleReveal><Projects data={projects} /></ScaleReveal>
      <ScaleReveal><Certifications data={certifications} /></ScaleReveal>
      <ScaleReveal><Blogs data={blogs} /></ScaleReveal>
      <ScaleReveal><Contact minimal={true} /></ScaleReveal>
    </>
  );
}
