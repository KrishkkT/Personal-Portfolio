import Education from "@/components/Education";
import { dataStore } from "@/lib/data-store";

export const revalidate = 60;

export default async function ExperiencePage() {
  const experience = await dataStore.getAllExperience();
  
  return (
    <main className="min-h-screen bg-background">
      <Education data={experience} isFullPage={true} />
    </main>
  );
}
