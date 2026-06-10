import Hero from "../components/sections/Hero";
import HowItWorks from "../components/sections/HowItWorks";
import Integrations from "../components/sections/Integrations";
import Pricing from "../components/sections/Pricing";
import Stats from "../components/sections/Stats";
import CTASection from "../components/sections/CTASection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <HowItWorks />
      <Integrations />
      <Pricing />
      <CTASection />
    </main>
  );
}
