import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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
  const sectionRef = useRef(null);
  const indexRef   = useRef(null);
  const descRef    = useRef(null);
  const linesRef   = useRef([]);

  // Line reveal — root: null targets the window viewport (no inner scroll container)
  useGSAP(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          linesRef.current.forEach((el, i) => {
            if (!el) return;
            gsap.fromTo(
              el,
              { opacity: 0, filter: 'blur(8px)', y: 18 },
              { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.7, delay: i * 0.06, ease: 'power3.out' }
            );
          });

          observer.disconnect();
        });
      },
      { threshold: 0.15, root: null }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, { scope: sectionRef, dependencies: [] });

  // Dual-speed parallax using window scroll (no #main-content dependency)
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !indexRef.current || !descRef.current) return;

      const rect    = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(0, Math.min(1,
        (windowH - rect.top) / (windowH + rect.height)
      ));

      gsap.set(indexRef.current, { y: -35 * progress });
      gsap.set(descRef.current,  { y: -70 * progress });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-[#FDFBF7] flex items-center overflow-hidden"
      style={{ height: '100vh', minHeight: '100vh' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-black/10" />

      <div className="w-full px-8 md:px-12 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 md:gap-20 items-start pt-12 md:pt-0">

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

        <div ref={descRef} className="max-w-2xl">
          <div className="mb-8">
            {LINES.map((line, i) =>
              line === '' ? (
                <div key={i} className="h-5" />
              ) : (
                <div
                  key={i}
                  ref={(el) => { linesRef.current[i] = el; }}
                  className="font-sans font-light text-black leading-snug"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 2.6rem)', letterSpacing: '-0.02em' }}
                >
                  {line}
                </div>
              )
            )}
          </div>

          <style>{`
            @keyframes marquee-scroll {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            .marquee-animate {
              animation: marquee-scroll 24s linear infinite;
            }
            .marquee-group:hover .marquee-animate {
              animation-play-state: paused;
            }
          `}</style>
          <div className="overflow-hidden mt-6 marquee-group">
            <div className="marquee-animate flex gap-5 w-max">
              {['Brand Identity', 'Full-Stack Dev', 'Motion Design', 'UI/UX', 'Strategy'].map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs font-bold uppercase text-zinc-500 border-[0.5px] border-neutral-300 px-6 py-2 hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap cursor-default"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {tag}
                </span>
              ))}
              {['Brand Identity', 'Full-Stack Dev', 'Motion Design', 'UI/UX', 'Strategy'].map((tag) => (
                <span
                  key={`dup-${tag}`}
                  aria-hidden="true"
                  className="font-mono text-xs font-bold uppercase text-zinc-500 border-[0.5px] border-neutral-300 px-6 py-2 hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap cursor-default"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 font-sans font-black text-black select-none pointer-events-none"
        style={{ fontSize: 'clamp(6rem, 18vw, 20rem)', lineHeight: 0.85, opacity: 0.03, letterSpacing: '-0.04em' }}>
        ABOUT
      </div>
    </section>
  );
}
