import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Hero } from "@/components/marketing/Hero";
import { Pillars } from "@/components/marketing/Pillars";
import { Inspector } from "@/components/marketing/Inspector";
import { ProofRibbon } from "@/components/marketing/ProofRibbon";
import { Pricing } from "@/components/marketing/Pricing";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function Landing() {
  return (
    <>
      <MarketingHeader />
      <main>
        <Hero />
        <Pillars />
        <Inspector />
        <ProofRibbon />
        <Pricing />
        <CtaBanner />
      </main>
      <MarketingFooter />
    </>
  );
}
