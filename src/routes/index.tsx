import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { OperationalBoardPreview } from "@/components/landing/OperationalBoardPreview";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TargetUsers } from "@/components/landing/TargetUsers";
import { ProductPrinciples } from "@/components/landing/ProductPrinciples";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const title = "QurbanOps — Qurban Operations Workspace";
const description =
  "QurbanOps membantu panitia mengelola hewan kurban, tim operasional, dan progres pekerjaan dalam satu workspace.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <FeatureSection />
        <OperationalBoardPreview />
        <HowItWorks />
        <TargetUsers />
        <ProductPrinciples />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
