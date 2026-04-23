import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CycleOfReward from "@/components/CycleOfReward";
import CommunityImpact from "@/components/CommunityImpact";
import Marketplace from "@/components/Marketplace";
import BioBinVitality from "@/components/BioBinVitality";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CycleOfReward />
        <CommunityImpact />
        <Marketplace />
        <BioBinVitality />
      </main>
      <Footer />
    </>
  );
}
