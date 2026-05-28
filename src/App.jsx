import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VRPortal from './components/VRPortal';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import PortfolioSection from './components/sections/PortfolioSection';
import MetricsSection from './components/sections/MetricsSection';
import FooterSection from './components/sections/FooterSection';

export default function App() {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    /*
      Outer div: NO overflow-x-hidden here — that property, when combined with
      position:relative, can implicitly set overflow-y:auto on some browsers,
      creating an unexpected scroll container that clips position:fixed children.
      overflow-x:hidden is already on <body> in index.css, which is safe.
    */
    <div style={{ position: 'relative' }}>
      {/*
        VRPortal returns a Fragment:
          1. A 300vh spacer div (the GSAP ScrollTrigger runway)
          2. All fixed overlay elements as document-level siblings — NOT inside
             the runway div. This prevents GSAP's pin from creating a CSS
             containing block that would re-parent the fixed children.
      */}
      <VRPortal />

      {/*
        #main-content: a 100vh inner scroll box positioned in document flow
        after the 300vh portal runway. Once the user scrolls through the portal
        (0 → 300vh window scroll), this container enters the viewport.
        CSS scroll-snap provides the per-section snap behaviour.
        Section-level GSAP animations specify scroller:'#main-content'.
      */}
      <div
        id="main-content"
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          overscrollBehavior: 'contain',
          // Ensure it is rendered on top of any stray fixed layers
          position: 'relative',
          zIndex: 1,
        }}
      >
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <MetricsSection />
        <FooterSection />
      </div>
    </div>
  );
}
