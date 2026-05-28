import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const PROJECTS = [
  {
    id: '01',
    code: 'NEXUS ONE',
    type: 'Brand · Platform',
    year: '2024',
    tech: ['React', 'GSAP', 'Figma'],
    glowColor: 'rgba(0, 255, 255, 0.6)',
    borderColor: 'rgba(0, 255, 255, 0.25)',
    accentColor: '#00FFFF',
    bgGrad: 'linear-gradient(135deg, rgba(0,255,255,0.05) 0%, transparent 60%)',
    label: 'IDENTITY SYSTEM',
    desc: 'Full brand identity and digital platform for a next-gen SaaS startup.',
  },
  {
    id: '02',
    code: 'AXIOM X',
    type: 'App · Motion',
    year: '2024',
    tech: ['TypeScript', 'Three.js', 'Motion'],
    glowColor: 'rgba(168, 85, 247, 0.6)',
    borderColor: 'rgba(168, 85, 247, 0.25)',
    accentColor: '#A855F7',
    bgGrad: 'linear-gradient(135deg, rgba(168,85,247,0.05) 0%, transparent 60%)',
    label: 'INTERACTIVE APP',
    desc: 'Immersive 3D interactive application with real-time data visualisation.',
  },
  {
    id: '03',
    code: 'VERDANT',
    type: 'Web · Strategy',
    year: '2023',
    tech: ['Next.js', 'GSAP', 'Prisma'],
    glowColor: 'rgba(34, 197, 94, 0.6)',
    borderColor: 'rgba(34, 197, 94, 0.25)',
    accentColor: '#22C55E',
    bgGrad: 'linear-gradient(135deg, rgba(34,197,94,0.05) 0%, transparent 60%)',
    label: 'FULL-STACK WEB',
    desc: 'Editorial-first web experience with full content management and analytics.',
  },
];

function HUDBrackets({ color }) {
  const size = 16;
  const thick = 2;
  const style = { position: 'absolute', pointerEvents: 'none', zIndex: 2 };
  const lineStyle = { background: color, position: 'absolute' };
  return (
    <>
      {/* Top-left */}
      <div style={{ ...style, top: 12, left: 12 }}>
        <div style={{ ...lineStyle, width: size, height: thick, top: 0, left: 0 }} />
        <div style={{ ...lineStyle, width: thick, height: size, top: 0, left: 0 }} />
      </div>
      {/* Top-right */}
      <div style={{ ...style, top: 12, right: 12 }}>
        <div style={{ ...lineStyle, width: size, height: thick, top: 0, right: 0 }} />
        <div style={{ ...lineStyle, width: thick, height: size, top: 0, right: 0 }} />
      </div>
      {/* Bottom-left */}
      <div style={{ ...style, bottom: 12, left: 12 }}>
        <div style={{ ...lineStyle, width: size, height: thick, bottom: 0, left: 0 }} />
        <div style={{ ...lineStyle, width: thick, height: size, bottom: 0, left: 0 }} />
      </div>
      {/* Bottom-right */}
      <div style={{ ...style, bottom: 12, right: 12 }}>
        <div style={{ ...lineStyle, width: size, height: thick, bottom: 0, right: 0 }} />
        <div style={{ ...lineStyle, width: thick, height: size, bottom: 0, right: 0 }} />
      </div>
    </>
  );
}

function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const glowRef = useRef(null);
  const thumbRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    // 3D tilt
    gsap.to(innerRef.current, {
      rotateY: dx * 8,
      rotateX: -dy * 8,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Cursor-tracking glow
    const glowX = e.clientX - rect.left;
    const glowY = e.clientY - rect.top;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(300px at ${glowX}px ${glowY}px, ${project.glowColor} 0%, transparent 70%)`;
    }
  }, [project.glowColor]);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
    if (thumbRef.current) {
      gsap.to(thumbRef.current, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    gsap.to(innerRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
    if (thumbRef.current) {
      gsap.to(thumbRef.current, { scale: 1, duration: 0.4, ease: 'power2.out' });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative flex-1 cursor-pointer"
      style={{ perspective: '1000px', minHeight: '460px', maxHeight: '70vh' }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={innerRef}
        className="card-3d relative w-full h-full"
        style={{
          border: `1px solid ${project.borderColor}`,
          background: '#0D0D10',
          overflow: 'hidden',
          minHeight: 'inherit',
          maxHeight: 'inherit',
        }}
      >
        {/* HUD Brackets */}
        <HUDBrackets color={project.accentColor} />

        {/* Cursor glow overlay */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none z-10 transition-all duration-100"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: project.bgGrad }}
        />

        {/* Card content */}
        <div className="relative z-20 flex flex-col h-full p-6">
          {/* Top: project meta */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="font-mono font-bold uppercase tracking-widest"
              style={{ fontSize: '10px', color: project.accentColor, letterSpacing: '0.2em' }}
            >
              {project.type}
            </span>
            <span
              className="font-mono text-zinc-600 uppercase tracking-widest"
              style={{ fontSize: '10px' }}
            >
              {project.year}
            </span>
          </div>

          {/* Thumbnail area */}
          <div
            ref={thumbRef}
            className="flex-1 flex items-center justify-center mb-6 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
              border: `1px solid ${project.borderColor}`,
              minHeight: '200px',
            }}
          >
            {/* Placeholder grid pattern */}
            <div className="w-full h-full relative flex items-center justify-center">
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                style={{ strokeDasharray: '4 4' }}
              >
                <defs>
                  <pattern id={`grid-${project.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke={project.accentColor} strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />
              </svg>
              <span
                className="font-sans font-black select-none"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 6rem)',
                  color: project.accentColor,
                  opacity: hovered ? 0.3 : 0.1,
                  letterSpacing: '-0.04em',
                  transition: 'opacity 0.3s',
                }}
              >
                {project.id}
              </span>
            </div>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.map((t) => (
              <span
                key={t}
                className="font-mono uppercase tracking-widest"
                style={{
                  fontSize: '9px',
                  color: project.accentColor,
                  border: `1px solid ${project.borderColor}`,
                  padding: '2px 6px',
                  letterSpacing: '0.15em',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Description */}
          <p
            className="font-sans text-zinc-400 mb-5 leading-relaxed"
            style={{ fontSize: '12px' }}
          >
            {project.desc}
          </p>

          {/* Bottom: project label */}
          <div className="flex items-end justify-between mt-auto">
            <div>
              <div
                className="font-mono font-bold text-zinc-500 uppercase tracking-widest"
                style={{ fontSize: '9px', letterSpacing: '0.2em', marginBottom: '3px' }}
              >
                {project.label}
              </div>
              <div
                className="font-mono font-bold uppercase tracking-widest"
                style={{ fontSize: '13px', color: '#FDFBF7', letterSpacing: '0.12em' }}
              >
                {project.id} // {project.code}
              </div>
            </div>
            <div
              className="font-mono text-zinc-600 uppercase tracking-widest"
              style={{ fontSize: '9px', letterSpacing: '0.15em' }}
            >
              VIEW →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="relative flex flex-col overflow-hidden"
      style={{
        height: '100vh',
        minHeight: '100vh',
        background: '#0D0D10',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
    >
      {/* Section Header */}
      <div className="flex items-end justify-between px-8 md:px-12 pt-10 pb-6">
        <div>
          <div
            className="font-mono font-bold uppercase tracking-widest mb-1"
            style={{ fontSize: '11px', color: '#00FFFF', letterSpacing: '0.25em' }}
          >
            PORTFOLIO
          </div>
          <h2
            className="font-sans font-black text-white leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}
          >
            SELECTED WORK
          </h2>
        </div>
        <a
          href="#"
          className="group font-mono text-zinc-500 hover:text-white transition-colors duration-200 text-xs tracking-widest uppercase hidden md:flex items-center gap-2"
          style={{ letterSpacing: '0.1em', fontSize: '11px' }}
        >
          <span className="group-hover:opacity-100 opacity-70 transition-opacity">
            [ VIEW MORE WORK →&nbsp;]
          </span>
        </a>
      </div>

      {/* Triptych Grid */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 px-8 md:px-12 pb-8 min-h-0">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {/* Mobile: view more link */}
      <div className="md:hidden px-8 pb-6">
        <a
          href="#"
          className="font-mono text-zinc-500 hover:text-white text-xs tracking-widest uppercase transition-colors"
          style={{ fontSize: '11px' }}
        >
          [ VIEW MORE WORK → ]
        </a>
      </div>
    </section>
  );
}
