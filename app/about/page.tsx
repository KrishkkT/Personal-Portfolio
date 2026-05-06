import About from "@/components/About";
import { dataStore } from "@/lib/data-store";

export const revalidate = 60;

export default async function AboutPage() {
  const about = await dataStore.getAboutSection();
  
  return (
    <main className="min-h-screen bg-background">
      <About data={about} />
    </main>
  );
}
