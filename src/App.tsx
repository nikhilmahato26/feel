import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import { useTheme } from "./lib/useTheme";
import { useEasterEggs } from "./lib/useEasterEggs";
import { scrollToTarget } from "./lib/scroller";

/**
 * Route changes should land at the top of the new page; a route carrying a hash
 * should land on that section. Browsers only do the second one on a real
 * document load, so both are handled here.
 */
function RouteScroll() {
  // `key` changes on every navigation, including re-clicking the link you're
  // already on — without it, tapping "About" a second time would do nothing.
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      // The target may mount in the same commit as this effect, so wait a frame.
      const raf = requestAnimationFrame(() => scrollToTarget(hash));
      return () => cancelAnimationFrame(raf);
    }
    scrollToTarget(0, true);
  }, [pathname, hash, key]);

  return null;
}

export default function App() {
  const { theme, toggle } = useTheme();
  useEasterEggs(toggle);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <RouteScroll />
      <Nav theme={theme} onToggleTheme={toggle} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        {/* Unknown paths fall back to the home page rather than a dead end. */}
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
