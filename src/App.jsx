import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'unset';
  }, [pathname]);
  return null;
}
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VRPortal from './components/VRPortal';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import PortfolioSection from './components/sections/PortfolioSection';
import MetricsSection from './components/sections/MetricsSection';
import FooterSection from './components/sections/FooterSection';
import PortfolioPage from './pages/PortfolioPage';
import TeamsPage from './pages/TeamsPage';

// HomePage isolates all portal + section state.
// On unmount, kill every active ScrollTrigger to prevent DOM leaks
// when routing away.
function HomePage() {
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    /*
      Single-column document flow:
        1. VRPortal — 150vh runway spacer + fixed overlay fragments
        2. HeroSection — 100vh
        3. PortfolioSection — min-h-screen, immediately follows hero (Step 2)
        4. AboutSection, MetricsSection, FooterSection — natural block order

      NO overflow-x-hidden here; that is on <body> in index.css.
      NO inner scroll container (#main-content removed) — all sections
      scroll with the global window, which the VRPortal ScrollTrigger
      already uses.
    */
    <div style={{ position: 'relative' }}>
      <VRPortal />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <MetricsSection />
      <FooterSection />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/teams"     element={<TeamsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
