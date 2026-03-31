import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ProtocolOverview from "@/components/landing/ProtocolOverview";
import DefenseLayers from "@/components/landing/DefenseLayers";
import FeaturedDatasets from "@/components/landing/FeaturedDatasets";
import TokenInfo from "@/components/landing/TokenInfo";
import GetStartedCTA from "@/components/landing/GetStartedCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <ProtocolOverview />
        <DefenseLayers />
        <FeaturedDatasets />
        <TokenInfo />
        <GetStartedCTA />
      </main>
      <Footer />
    </>
  );
}
