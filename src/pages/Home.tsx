import Hero from "../components/Hero";
import ClientOrbit from "../components/ClientOrbit";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import FinalCta from "../components/FinalCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <ClientOrbit />
      <About />
      <HowItWorks />
      <Services />
      <Testimonials />
      <FinalCta />
    </main>
  );
}
