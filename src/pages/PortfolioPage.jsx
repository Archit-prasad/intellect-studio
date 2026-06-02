import { useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

const PROJECTS = [
  { id: 1, title: 'DECOR AND MODULES', link: 'https://decor-next-git-redesign-dazzal-davids-projects.vercel.app/', image: '/decor.jpg' },
  { id: 2, title: 'MARKWINGZ', link: 'https://markwingz.vercel.app/', image: '/markwingz.jpg' },
  { id: 3, title: 'URBX KERALA AVIATION SUMMIT', link: 'https://kaes.urbxcollegeofaviation.com/', image: '/kaex.jpg' },
  { id: 4, title: 'URBX MAIN SITE', link: 'https://urbx-college-of-aviation.vercel.app/', image: '/urbx.jpg' },
  { id: 5, title: 'CRYSTAL QUALITY', link: 'https://www.crystalquality.ae/', image: '/crystal.jpg' },
  { id: 6, title: 'JANSEVA LABS', link: 'https://janseva-labs-x77q.vercel.app', image: '/janseva.jpg' },
  { id: 7, title: 'ZION SHIPPING', link: 'https://zion-shipping-next.vercel.app/', image: '/zion.jpg' },
  { id: 8, title: 'SCHOOL TIMETABLE SYSTEM', link: 'https://school-timetable-three.vercel.app/', image: '/schoolsync.jpg' },
  { id: 9, title: 'WHATSAPP AUTOMATION SYSTEM', link: 'https://whatsapp-tool-two.vercel.app/', image: '/whatsapp.jpg' },
  { id: 10, title: 'PUBLIC COMPLAINT REGISTER PORTAL', link: 'https://complaint-register-portal.vercel.app/', image: '/complaint.jpg' },
  { id: 11, title: 'NAVIREX WEBSITE', link: 'https://navirex.vercel.app/', image: '/navirex.jpg' },
];

const ROW_HEIGHT = 110;
const SINGLE_HEIGHT = ROW_HEIGHT * PROJECTS.length;
// Triple the list so wrap seams are invisible
const tripleProjects = [...PROJECTS, ...PROJECTS, ...PROJECTS];

export default function PortfolioPage() {
  const canvasRef     = useRef(null);
  const previewRef    = useRef(null);
  const previewImgRef = useRef(null);
  const draggableRef  = useRef(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const preview = previewRef.current;
    if (!canvas || !preview) return;

    // Start showing the middle repeat so wrapping in both directions works
    gsap.set(canvas, { x: 0, y: -SINGLE_HEIGHT });

    // Center preview on cursor via percentage offset
    gsap.set(preview, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.9 });

    const quickToX = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3.out' });
    const quickToY = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3.out' });

    // Modulo wrap: keep y within the middle copy's range
    const handleWrap = () => {
      const y = gsap.getProperty(canvas, 'y');
      if (y < -(SINGLE_HEIGHT * 2)) gsap.set(canvas, { y: y + SINGLE_HEIGHT });
      else if (y > 0)               gsap.set(canvas, { y: y - SINGLE_HEIGHT });
    };

    draggableRef.current = Draggable.create(canvas, {
      type: 'x,y',
      inertia: true,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onDrag: handleWrap,
      onThrowUpdate: handleWrap,
    })[0];

    const onMouseMove = (e) => {
      quickToX(e.clientX);
      quickToY(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      if (draggableRef.current) draggableRef.current.kill();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const showPreview = useCallback((image) => {
    if (!previewRef.current || !previewImgRef.current) return;
    previewImgRef.current.src = image;
    gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
  }, []);

  const hidePreview = useCallback(() => {
    if (!previewRef.current) return;
    gsap.to(previewRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' });
  }, []);

  const openProject = useCallback((link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-white relative select-none"
      style={{ cursor: 'grab' }}
    >
      {/* Fixed back button */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 font-mono text-xs tracking-widest uppercase text-neutral-900 hover:opacity-50 transition-opacity duration-200"
        style={{ letterSpacing: '0.2em' }}
        onClick={() => { if (draggableRef.current) draggableRef.current.kill(); }}
      >
        ← Back
      </Link>

      {/* Fixed label */}
      <div
        className="fixed top-6 right-6 z-50 font-mono text-xs tracking-widest uppercase text-neutral-400"
        style={{ letterSpacing: '0.2em' }}
      >
        DRAG TO EXPLORE · {PROJECTS.length} WORKS
      </div>

      {/* Draggable text canvas */}
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          willChange: 'transform',
        }}
      >
        {tripleProjects.map((project, index) => (
          <div
            key={`${project.id}-${index}`}
            className="group relative flex items-center w-full overflow-hidden"
            style={{
              height: `${ROW_HEIGHT}px`,
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              paddingLeft: '2rem',
              paddingRight: '2rem',
            }}
            onMouseEnter={() => showPreview(project.image)}
            onMouseLeave={hidePreview}
            onClick={() => openProject(project.link)}
          >
            {/* Row number */}
            <span
              className="font-mono text-neutral-300 mr-8 shrink-0 transition-colors duration-200 group-hover:text-neutral-900"
              style={{ fontSize: '11px', letterSpacing: '0.2em', minWidth: '2.5rem' }}
            >
              {String(project.id).padStart(2, '0')}
            </span>

            {/* Title */}
            <span
              className="font-sans font-black uppercase text-neutral-900 leading-none transition-opacity duration-200 group-hover:opacity-40 whitespace-nowrap"
              style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 4.5rem)',
                letterSpacing: '-0.025em',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {project.title}
            </span>

            {/* Thin right arrow on hover */}
            <span
              className="ml-auto font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
              style={{ fontSize: '11px', letterSpacing: '0.15em' }}
            >
              OPEN →
            </span>
          </div>
        ))}
      </div>

      {/* Floating image preview (fixed, cursor-tracked) */}
      <div
        ref={previewRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '400px',
          aspectRatio: '16 / 10',
          zIndex: 40,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          borderRadius: '3px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        }}
      >
        <img
          ref={previewImgRef}
          src=""
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    </div>
  );
}
