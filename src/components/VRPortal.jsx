import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TYPEWRITER_LINES = ['CREATE.', 'DESIGN.', 'LAUNCH.'];

function PortalTypewriter() {
  const [text, setText] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let phase   = 'typing';

    const tick = () => {
      const line = TYPEWRITER_LINES[lineIdx];
      if (phase === 'typing') {
        charIdx++;
        setText(line.slice(0, charIdx));
        if (charIdx >= line.length) {
          phase = 'holding';
          timer.current = setTimeout(() => { phase = 'clearing'; tick(); }, 500);
          return;
        }
      } else if (phase === 'clearing') {
        charIdx--;
        setText(line.slice(0, charIdx));
        if (charIdx <= 0) {
          lineIdx = (lineIdx + 1) % TYPEWRITER_LINES.length;
          charIdx = 0;
          phase   = 'typing';
          if (lineIdx === 0) { timer.current = setTimeout(tick, 3000); return; }
        }
      }
      timer.current = setTimeout(tick, 80);
    };

    tick();
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700, fontSize: '14px',
      letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f4f4f5',
    }}>
      {text}
      <span className="cursor-blink" style={{ marginLeft: '2px' }}>█</span>
    </span>
  );
}

// Number of homepage content sections (Hero, Portfolio, About, Metrics, Footer)
const N_SECTIONS = 5;

export default function VRPortal() {
  const runwayRef      = useRef(null);
  const overlayRef     = useRef(null);
  const maskImgRef     = useRef(null);
  const heroPreviewRef = useRef(null);
  const heroTextRef    = useRef(null);
  const studioTextRef  = useRef(null);
  const brandRef       = useRef(null);
  const typeUIRef      = useRef(null);

  useGSAP(() => {
    if (!runwayRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: runwayRef.current,
        start: 'top top',
        // Compressed to ~1100px of scroll (Step 3: +=1000 – +=1200 baseline)
        end: '+=1100',
        scrub: 1,
        // Snap portal animation to N equidistant steps (Step 3)
        snap: {
          snapTo: 1 / (N_SECTIONS - 1),
          duration: { min: 0.2, max: 0.6 },
          ease: 'power1.inOut',
        },
        onUpdate(self) {
          if (!brandRef.current || !typeUIRef.current) return;
          gsap.set([brandRef.current, typeUIRef.current], {
            opacity: self.progress > 0.02 ? 0 : 1,
          });
        },
        onLeave() {
          if (overlayRef.current) {
            overlayRef.current.style.visibility   = 'hidden';
            overlayRef.current.style.pointerEvents = 'none';
          }
          if (heroPreviewRef.current) {
            heroPreviewRef.current.style.visibility   = 'hidden';
            heroPreviewRef.current.style.pointerEvents = 'none';
          }
        },
        onEnterBack() {
          if (overlayRef.current)     overlayRef.current.style.visibility = 'visible';
          if (heroPreviewRef.current) heroPreviewRef.current.style.visibility = 'visible';
          if (brandRef.current && typeUIRef.current)
            gsap.set([brandRef.current, typeUIRef.current], { opacity: 1 });
        },
      },
    });

    if (maskImgRef.current) {
      tl.to(maskImgRef.current, { scale: 35, transformOrigin: '50% 50%', ease: 'power2.in' }, 0);
    }
    if (heroTextRef.current) {
      tl.fromTo(heroTextRef.current,
        { scale: 0.7, transformOrigin: '50% 50%' },
        { scale: 1.0, ease: 'power1.out' }, 0);
    }
    if (studioTextRef.current) {
      tl.fromTo(studioTextRef.current,
        { scale: 0.7, transformOrigin: '50% 50%' },
        { scale: 1.0, ease: 'power1.out' }, 0);
    }
    if (heroPreviewRef.current) {
      tl.to(heroPreviewRef.current, { opacity: 0, ease: 'none' }, 0.88);
    }

  }, []);

  return (
    <>
      {/*
        Runway: 150vh — provides scrollable space for the portal animation.
        Animation plays over the first +=1100px of this runway (Step 3),
        then onLeave fires to clean up fixed overlays as HeroSection enters view.
      */}
      <div ref={runwayRef} style={{ height: '150vh' }} />

      {/* LAYER 0 — sand hero preview */}
      <div ref={heroPreviewRef} style={{
        position: 'fixed', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#FDFBF7', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.05) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
          <h1 ref={heroTextRef} style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 900,
            color: '#000', lineHeight: 1, letterSpacing: '-0.03em',
            fontSize: 'clamp(4rem, 14vw, 14rem)', margin: 0, willChange: 'transform',
          }}>
            INTELLECT
          </h1>
          <h2 ref={studioTextRef} style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 900,
            color: '#9CA3AF', lineHeight: 1, letterSpacing: '-0.03em',
            fontSize: 'clamp(4rem, 14vw, 14rem)', margin: 0, marginTop: '-0.06em', willChange: 'transform',
          }}>
            STUDIO
          </h2>
        </div>
      </div>

      {/* LAYER 1 — VR mask */}
      <div ref={overlayRef} style={{
        position: 'fixed', inset: 0, zIndex: 20, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <img
          ref={maskImgRef}
          src="/vr-mask.png"
          alt=""
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            willChange: 'transform', transformOrigin: '50% 50%',
            mixBlendMode: 'multiply',
          }}
          onError={(e) => {
            if (e.currentTarget.parentElement)
              e.currentTarget.parentElement.style.display = 'none';
          }}
        />
      </div>

      {/* LAYER 2 — brand tag */}
      <div ref={brandRef} style={{
        position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 30,
        pointerEvents: 'none', userSelect: 'none',
      }}>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700,
          fontSize: '13px', letterSpacing: '0.25em', color: '#fff',
          textTransform: 'uppercase', margin: 0,
          textShadow: '0 1px 10px rgba(0,0,0,0.6)',
        }}>
          INTELLECT STUDIO
        </p>
      </div>

      {/* LAYER 2 — typewriter */}
      <div ref={typeUIRef} style={{
        position: 'fixed', top: '25vh', left: '8vw', zIndex: 30,
        maxWidth: '320px', pointerEvents: 'none', userSelect: 'none',
        textShadow: '0 1px 10px rgba(0,0,0,0.6)',
      }}>
        <PortalTypewriter />
      </div>
    </>
  );
}
