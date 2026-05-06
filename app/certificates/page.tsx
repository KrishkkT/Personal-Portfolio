import Certifications from "@/components/Certifications";
import { dataStore } from "@/lib/data-store";

export const revalidate = 60;

export default async function CertificatesPage() {
  const certifications = await dataStore.getAllCertificates();
  
  return (
    <main className="min-h-screen bg-background">
      <Certifications data={certifications} isFullPage={true} />
    </main>
  );
}
