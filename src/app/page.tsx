import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ProtocolOverview from "@/components/landing/ProtocolOverview";
import DefenseLayers from "@/components/landing/DefenseLayers";
import FeaturedDatasets from "@/components/landing/FeaturedDatasets";
import TokenInfo from "@/components/landing/TokenInfo";
import GetStartedCTA from "@/components/landing/GetStartedCTA";
import * as api from "@/lib/api";

export const revalidate = 0;

export default async function Home() {
  const apiDatasets = await api.fetchDatasets();

  const featuredDatasets = (apiDatasets ?? []).map((d) => ({
    id: d.dataset_id,
    name: d.name,
    domain: d.source_domains[0] || "",
    fields: Object.keys(d.schema).length,
    dedupKey: d.dedup_fields?.join(" + ") || "—",
  }));

  const datasetCount = featuredDatasets.length;
  const totalFields = featuredDatasets.reduce((s, d) => s + d.fields, 0);
  const uniquePlatforms = new Set(featuredDatasets.map((d) => d.domain));
  const platformCount = uniquePlatforms.size;

  return (
    <>
      <Navbar />
      <main>
        <HeroSection datasetCount={datasetCount} platformCount={platformCount} totalFields={totalFields} />
        <HowItWorks />
        <ProtocolOverview />
        <DefenseLayers />
        <FeaturedDatasets datasets={featuredDatasets} />
        <TokenInfo />
        <GetStartedCTA />
      </main>
      <Footer />
    </>
  );
}
