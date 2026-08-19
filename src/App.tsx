import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustMarquee from "./components/TrustMarquee";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Tagline from "./components/Tagline";
import TypeMarquee from "./components/TypeMarquee";
import Testimonials from "./components/Testimonials";
import Services from "./components/Services";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";
import { useTheme } from "./lib/useTheme";
import { useEasterEggs } from "./lib/useEasterEggs";

import GlobalNetwork from "./components/GlobalNetwork";

export default function App() {
  const { theme, toggle } = useTheme();
  useEasterEggs(toggle);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <Nav theme={theme} onToggleTheme={toggle} />
      <Hero />
      <TrustMarquee />
      <About />
      <HowItWorks />
      <Tagline />
      <TypeMarquee />
      <Testimonials />
      <Services />
      <FinalCta />
      <GlobalNetwork />
      <Footer />
    </>
  );
}
