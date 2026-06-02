import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const METRICS = [
  { label: 'Users Reached',       value: 2_400_000, suffix: '+' },
  { label: 'Projects Designed',   value: 148,        suffix: '+' },
  { label: 'Industry Awards',     value: 23,         suffix: ''  },
  { label: 'Years of Experience', value: 7,          suffix: '+' },
];

function fmt(raw, target) {
  return target >= 1_000_000
    ? (raw / 1_000_000).toFixed(1) + 'M'
    : Math.round(raw).toLocaleString();
}

function Counter({ target, suffix, triggered }) {
  const [display, setDisplay] = useState('0');
  const hasRun = useRef(false);

  useGSAP(() => {
    if (!triggered || hasRun.current) return;
    hasRun.current = true;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: 'power3.out',
      onUpdate:  () => setDisplay(fmt(obj.val, target)),
      onComplete: () => setDisplay(fmt(target, target)),
    });
  }, [triggered]);

  return <>{triggered ? display : '0'}{triggered ? suffix : ''}</>;
}

export default function MetricsSection() {
  const sectionRef = useRef(null);
  const [triggered, setTriggered] = useState(false);

  // root: null — window viewport (no #main-content dependency)
  useGSAP(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTriggered(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3, root: null }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="metrics"
      className="relative bg-black flex items-center overflow-hidden"
      style={{ height: '100vh', minHeight: '100vh' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.025) 40px),' +
          'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.025) 40px)',
      }} />

      <div className="relative z-10 w-full px-8 md:px-12">
        <div className="mb-10 md:mb-14">
          <span className="font-mono font-bold uppercase text-white/25"
            style={{ fontSize: '11px', letterSpacing: '0.25em' }}>
            04 // METRICS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10 border-b border-b-white/10">
          {METRICS.map((m, i) => (
            <div key={m.label} className="relative py-10 md:py-14 md:px-8"
              style={{ borderRight: i < METRICS.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              {i < METRICS.length - 1 && (
                <>
                  <span className="absolute top-0 right-0 text-[10px] font-mono text-white/25 select-none pointer-events-none -translate-x-1/2 -translate-y-1/2">+</span>
                  <span className="absolute bottom-0 right-0 text-[10px] font-mono text-white/25 select-none pointer-events-none -translate-x-1/2 translate-y-1/2">+</span>
                </>
              )}
              <div className="font-mono font-bold text-white leading-none mb-3 tabular-nums"
                style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)', letterSpacing: '-0.03em' }}>
                <Counter target={m.value} suffix={m.suffix} triggered={triggered} />
              </div>
              <div className="font-mono text-white/35 uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                {m.label}
              </div>
              <div className="absolute top-4 right-4 font-mono text-white/10"
                style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
                0{i + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-14 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-white/25 uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            Numbers that speak for themselves.
          </p>
          <p className="font-mono text-white/15 uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            EST. 2017
          </p>
        </div>
      </div>
    </section>
  );
}
