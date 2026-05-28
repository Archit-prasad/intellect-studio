import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Top-level registration (belt-and-suspenders alongside main.jsx)
gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = [
  'We are a creative technology studio',
  'building digital products that matter.',
  '',
  'From brand identity to full-stack platforms,',
  'we design at the intersection of craft',
  'and engineering precision.',
  '',
  'Our work ships. Our design endures.',
];

export default function AboutSection() {
  const sectionRef = useRef(null);   // ← attached to <section>
  const indexRef   = useRef(null);   // ← attached to left column div
  const descRef    = useRef(null);   // ← attached to right column div
  const linesRef   = useRef([]);     // ← populated by per-line ref callbacks

  // ── Line reveal via IntersectionObserver ───────────────────────────────────
  // Avoids GSAP ScrollTrigger + custom scroller entirely.
  // root: '#main-content' makes intersection relative to the inner scroll box.
  useGSAP(() => {
    if (!sectionRef.current) return;

    const container = document.querySelector('#main-content');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Staggered blur-reveal for each line
          linesRef.current.forEach((el, i) => {
            if (!el) return; // sparse-array holes and null on unmount
            gsap.fromTo(
              el,
              { opacity: 0, filter: 'blur(8px)', y: 18 },
              {
                opacity: 1, filter: 'blur(0px)', y: 0,
                duration: 0.7, delay: i * 0.06, ease: 'power3.out',
              }
            );
          });

          observer.disconnect(); // animate only once
        });
      },
      { threshold: 0.15, root: container || null }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, { scope: sectionRef, dependencies: [] });

  // ── Dual-speed parallax via scroll event on #main-content ─────────────────
  // Using a scroll listener avoids GSAP ScrollTrigger's custom-scroller path
  // which was the source of the '_gsap' crash.
  useEffect(() => {
    const container = document.querySelector('#main-content');
    if (!container) return;

    const onScroll = () => {
      if (!sectionRef.current || !indexRef.current || !descRef.current) return;

      const cH   = container.clientHeight;
      const sTop = sectionRef.current.offsetTop;
      const sH   = sectionRef.current.offsetHeight;
      const raw  = container.scrollTop;

      // Progress: 0 when top of section enters bottom of viewport → 1 when it exits top
      const progress = Math.max(0, Math.min(1,
        (raw - (sTop - cH)) / (sH + cH)
      ));

      gsap.set(indexRef.current, { y: -35 * progress });   // slow
      gsap.set(descRef.current,  { y: -70 * progress });   // 30% faster
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-[#FDFBF7] flex items-center overflow-hidden"
      style={{
        height: '100vh', minHeight: '100vh',
        scrollSnapAlign: 'start', scrollSnapStop: 'always',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-black/10" />

      <div className="w-full px-8 md:px-12 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 md:gap-20 items-start pt-12 md:pt-0">

        {/* Left: section index — ref attached ✓ */}
        <div ref={indexRef} className="flex flex-col gap-2 md:pt-2">
          <span className="font-mono font-bold text-black uppercase"
            style={{ fontSize: '11px', letterSpacing: '0.25em' }}>
            01 // CONTEXT
          </span>
          <div className="w-8 h-px bg-black mt-3" />
          <span className="font-mono text-zinc-400 uppercase mt-1"
            style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            About Us
          </span>
        </div>

        {/* Right: editorial copy — ref attached ✓ */}
        <div ref={descRef} className="max-w-2xl">
          <div className="mb-8">
            {LINES.map((line, i) =>
              line === '' ? (
                <div key={i} className="h-5" />
              ) : (
                <div
                  key={i}
                  ref={(el) => { linesRef.current[i] = el; }}  // ← ref attached ✓
                  className="font-sans font-light text-black leading-snug"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 2.6rem)', letterSpacing: '-0.02em' }}
                >
                  {line}
                </div>
              )
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {['Brand Identity', 'Full-Stack Dev', 'Motion Design', 'UI/UX', 'Strategy'].map((tag) => (
              <span key={tag}
                className="font-mono text-xs font-bold uppercase text-zinc-500 border border-zinc-300 px-3 py-1.5"
                style={{ letterSpacing: '0.15em' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Background ghost text */}
      <div className="absolute bottom-0 right-0 font-sans font-black text-black select-none pointer-events-none"
        style={{ fontSize: 'clamp(6rem, 18vw, 20rem)', lineHeight: 0.85, opacity: 0.03, letterSpacing: '-0.04em' }}>
        ABOUT
      </div>
    </section>
  );
}
