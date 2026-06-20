import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScoreGrid from "@/components/ScoreGrid";
import FeatureGrid from "@/components/FeatureGrid";
import UploadModule from "@/components/UploadModule";
import ModulesSection from "@/components/ModulesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ScoreGrid />
      <FeatureGrid />
      <UploadModule />
      <ModulesSection />
      <Footer />
    </main>
  );
}
