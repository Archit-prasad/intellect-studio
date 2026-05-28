import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Top-level registration (belt-and-suspenders alongside main.jsx)
gsap.registerPlugin(ScrollTrigger, useGSAP);

const CTA     = 'READY TO BUILD SOMETHING REAL?';
const CHAR_MS = 55;
const HOLD_MS = 3000;
const WIPE_MS = 25;

export default function FooterSection() {
  const sectionRef  = useRef(null);   // ← attached to <section> ✓
  const textSpanRef = useRef(null);   // ← attached to <span> ✓
  const timerRef    = useRef(null);
  const hasStarted  = useRef(false);

  // Typewriter — writes directly to the DOM span; no GSAP, no state re-renders.
  const runTypewriter = useCallback(() => {
    let i = 0, phase = 'typing';

    const tick = () => {
      if (!textSpanRef.current) return;   // guard: span may have unmounted

      if (phase === 'typing') {
        i++;
        textSpanRef.current.textContent = CTA.slice(0, i);
        if (i >= CTA.length) {
          phase = 'holding';
          timerRef.current = setTimeout(() => { phase = 'wiping'; tick(); }, HOLD_MS);
          return;
        }
      } else if (phase === 'wiping') {
        i--;
        textSpanRef.current.textContent = CTA.slice(0, i);
        if (i <= 0) {
          phase = 'typing';
          timerRef.current = setTimeout(tick, 500);
          return;
        }
      }
      timerRef.current = setTimeout(tick, CHAR_MS);
    };

    tick();
  }, []);

  // IntersectionObserver triggers the typewriter when section enters viewport.
  // root: '#main-content' scopes the intersection check to the inner scroll box.
  useGSAP(() => {
    if (!sectionRef.current) return;

    const container = document.querySelector('#main-content');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted.current) {
            hasStarted.current = true;
            runTypewriter();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3, root: container || null }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      clearTimeout(timerRef.current);
    };
  }, { scope: sectionRef, dependencies: [runTypewriter] });

  return (
    <section
      ref={sectionRef}            /* ← ref attached ✓ */
      id="contact"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: '100vh', minHeight: '100vh',
        background: '#09090B',
        scrollSnapAlign: 'start', scrollSnapStop: 'always',
      }}
    >
      {/* Dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Ambient glow */}
      <div className="absolute pointer-events-none" style={{
        width: '700px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }} />

      {/* Section label */}
      <div className="absolute top-10 left-8 md:left-12">
        <span className="font-mono font-bold uppercase text-white/20"
          style={{ fontSize: '11px', letterSpacing: '0.25em' }}>
          05 // JOIN US
        </span>
      </div>

      {/* CTA block */}
      <div className="relative z-10 text-center px-6 md:px-16 w-full max-w-5xl">

        {/* Typewriter headline */}
        <div className="font-mono font-bold text-white uppercase text-center w-full block mb-14"
          style={{ fontSize: 'clamp(1rem, 2.8vw, 2.5rem)', letterSpacing: '0.25em', lineHeight: 1.4 }}>
          <span ref={textSpanRef} />   {/* ← ref attached ✓ */}
          <span className="cursor-glow-blink inline-block text-white" style={{ marginLeft: '3px' }}>█</span>
        </div>

        <p className="font-mono text-white/25 uppercase mb-12"
          style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
          Talent intake open · We build with exceptional people
        </p>

        {/* Application buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#apply-job"
            className="font-sans font-bold text-white uppercase text-sm"
            style={{
              padding: '16px 44px', minWidth: '210px', textAlign: 'center', display: 'inline-block',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              letterSpacing: '0.12em',
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { background: 'rgba(255,255,255,0.14)', duration: 0.25 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { background: 'rgba(255,255,255,0.08)', duration: 0.3  })}
          >
            Apply for Job
          </a>

          <a href="#apply-intern"
            className="font-sans font-bold text-white uppercase text-sm"
            style={{
              padding: '16px 44px', minWidth: '210px', textAlign: 'center', display: 'inline-block',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              letterSpacing: '0.12em',
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { background: 'rgba(255,255,255,0.07)', duration: 0.25 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { background: 'rgba(255,255,255,0.03)', duration: 0.3  })}
          >
            Apply as Intern
          </a>
        </div>

        {/* Footer meta */}
        <div className="mt-16 flex items-center justify-center flex-wrap gap-4 md:gap-6">
          <span className="font-mono text-white/20 uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            hello@intellectstudio.com
          </span>
          <span className="text-white/10 hidden md:inline">·</span>
          <span className="font-mono text-white/15 uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            © 2024 Intellect Studio
          </span>
          <span className="text-white/10 hidden md:inline">·</span>
          <span className="font-mono text-white/15 uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            All Rights Reserved
          </span>
        </div>
      </div>
    </section>
  );
}
