import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeroSection() {
  const sectionRef = useRef(null);
  const navRef = useRef(null);
  const heroTextRef = useRef(null);
  const studioTextRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const magneticRefs = useRef([]);

  // Magnetic pull effect
  useEffect(() => {
    const RADIUS = 80;
    const STRENGTH = 0.35;

    const handlers = magneticRefs.current.map((el) => {
      if (!el) return null;

      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < RADIUS) {
          gsap.to(el, {
            x: dx * STRENGTH,
            y: dy * STRENGTH,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      };

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return { el, onMove, onLeave };
    });

    return () => {
      handlers.forEach((h) => {
        if (!h) return;
        h.el.removeEventListener('mousemove', h.onMove);
        h.el.removeEventListener('mouseleave', h.onLeave);
      });
    };
  }, []);

  const addMagneticRef = (el) => {
    if (el && !magneticRefs.current.includes(el)) {
      magneticRefs.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative bg-[#FDFBF7] flex flex-col overflow-hidden"
      style={{
        height: '100vh',
        minHeight: '100vh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,0,0,0.03) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <nav
        ref={navRef}
        className="relative z-10 flex items-center justify-between px-8 md:px-12 pt-7 pb-5"
      >
        <span
          className="font-sans font-bold text-black tracking-widest uppercase text-sm"
          style={{ letterSpacing: '0.2em' }}
        >
          INTELLECT STUDIO
        </span>
        <a
          ref={addMagneticRef}
          href="#apply"
          className="magnetic-btn font-sans font-bold text-white bg-black px-6 py-2.5 text-sm tracking-wider uppercase hover:bg-zinc-800 transition-colors"
          style={{ letterSpacing: '0.08em' }}
        >
          Apply Now →
        </a>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-12">
        <div ref={heroTextRef}>
          <h1
            className="font-sans font-black text-black leading-none tracking-tight select-none"
            style={{
              fontSize: 'clamp(5rem, 16vw, 16rem)',
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
            }}
          >
            INTELLECT
          </h1>
          <h2
            ref={studioTextRef}
            className="font-sans font-black leading-none tracking-tight select-none"
            style={{
              fontSize: 'clamp(5rem, 16vw, 16rem)',
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              color: '#9CA3AF',
            }}
          >
            STUDIO
          </h2>
        </div>

        {/* Editorial paragraph */}
        <p
          ref={subtitleRef}
          className="font-sans text-zinc-500 mt-8 max-w-sm text-base leading-relaxed"
        >
          Welcome here. We design, build, and launch digital experiences that
          define tomorrow.
        </p>

        {/* Button Suite */}
        <div ref={buttonsRef} className="flex flex-wrap items-center gap-3 mt-8">
          <a
            ref={addMagneticRef}
            href="mailto:hello@intellectstudio.com"
            className="magnetic-btn font-mono text-xs font-bold tracking-widest uppercase px-5 py-3 border border-black/10 text-black hover:border-black transition-colors"
            style={{
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            Email Us
          </a>
          <a
            ref={addMagneticRef}
            href="tel:+1234567890"
            className="magnetic-btn font-mono text-xs font-bold tracking-widest uppercase px-5 py-3 border border-black/10 text-black hover:border-black transition-colors"
            style={{
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            Call Us
          </a>

          <div className="w-px h-6 bg-black/20 mx-1 hidden md:block" />

          <a
            ref={addMagneticRef}
            href="#login"
            className="magnetic-btn font-sans text-sm font-semibold text-zinc-500 hover:text-black transition-colors underline underline-offset-4"
          >
            Log In
          </a>
          <a
            ref={addMagneticRef}
            href="#register"
            className="magnetic-btn font-sans text-sm font-semibold text-zinc-500 hover:text-black transition-colors underline underline-offset-4"
          >
            Register
          </a>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="relative z-10 px-8 md:px-12 pb-8 flex items-center gap-3">
        <div className="w-6 h-px bg-black/30" />
        <span className="font-mono text-xs text-black/30 tracking-widest uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
