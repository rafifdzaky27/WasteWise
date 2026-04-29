import Hero from "../../components/landing/Hero";
import CycleOfReward from "../../components/landing/CycleOfReward";
import CommunityImpact from "../../components/landing/CommunityImpact";
import Marketplace from "../../components/landing/Marketplace";
import BioBinVitality from "../../components/landing/BioBinVitality";
import About from "../../components/landing/About";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CycleOfReward />
      <CommunityImpact />
      <Marketplace />
      <BioBinVitality />
    </>
  );
}
