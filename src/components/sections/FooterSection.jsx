import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CTA     = 'READY TO BUILD SOMETHING REAL?';
const CHAR_MS = 55;
const HOLD_MS = 3000;
const WIPE_MS = 25;

export default function FooterSection() {
  const sectionRef  = useRef(null);
  const textSpanRef = useRef(null);
  const timerRef    = useRef(null);
  const hasStarted  = useRef(false);

  const runTypewriter = useCallback(() => {
    let i = 0, phase = 'typing';

    const tick = () => {
      if (!textSpanRef.current) return;

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
      timerRef.current = setTimeout(tick, phase === 'wiping' ? WIPE_MS : CHAR_MS);
    };

    tick();
  }, []);

  // Use window viewport (root: null) since #main-content no longer exists
  useGSAP(() => {
    if (!sectionRef.current) return;

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
      { threshold: 0.3, root: null }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      clearTimeout(timerRef.current);
    };
  }, { scope: sectionRef, dependencies: [runTypewriter] });

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ height: '100vh', minHeight: '100vh', background: '#09090B' }}
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
          05 // CONTACT
        </span>
      </div>

      {/* CTA block */}
      <div className="relative z-10 text-center px-6 md:px-16 w-full max-w-5xl">

        {/* Typewriter headline */}
        <div className="font-mono font-bold text-white uppercase text-center w-full block mb-14"
          style={{ fontSize: 'clamp(1rem, 2.8vw, 2.5rem)', letterSpacing: '0.25em', lineHeight: 1.4 }}>
          <span ref={textSpanRef} />
          <span className="cursor-glow-blink inline-block text-white" style={{ marginLeft: '3px' }}>█</span>
        </div>

        <p className="font-mono text-white/25 uppercase mb-12"
          style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
          Let's build something exceptional together
        </p>

        {/* Footer meta */}
        <div className="mt-16 flex items-center justify-center flex-wrap gap-4 md:gap-6">
          <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
            hello@intellectstudio.com
          </span>
          <span className="text-white/10 hidden md:inline">·</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
            © 2024 Intellect Studio
          </span>
          <span className="text-white/10 hidden md:inline">·</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
            All Rights Reserved
          </span>
        </div>
      </div>
    </section>
  );
}
