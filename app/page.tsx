import { EventsFeed } from "@/components/EventsFeed";
import { Hero } from "@/components/Hero";
import { SectorsGrid } from "@/components/SectorsGrid";
import { VisitSection } from "@/components/VisitSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectorsGrid />
      <EventsFeed />
      <VisitSection />
    </>
  );
}
