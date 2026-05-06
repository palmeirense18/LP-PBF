import Hero from "@/components/sections/Hero";
import StatsStrip from "@/components/sections/StatsStrip";
import Capabilities from "@/components/sections/Capabilities";
import Equipment from "@/components/sections/Equipment";
import Industries from "@/components/sections/Industries";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main id="main" className="relative w-full">
        <Hero />
        <StatsStrip />
        <Capabilities />
        <Equipment />
        <Industries />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
