import Projects from "@/components/Projects";
import { dataStore } from "@/lib/data-store";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await dataStore.getAllProjects();
  
  return (
    <main className="min-h-screen bg-background">
      <Projects data={projects} isFullPage={true} />
    </main>
  );
}
