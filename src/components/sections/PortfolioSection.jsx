import { Link } from 'react-router-dom';

const PROJECTS = [
  {
    id: '01',
    title: 'DECOR AND MODULES',
    link: 'https://decor-next-git-redesign-dazzal-davids-projects.vercel.app/',
    image: '/decor.jpg',
    metaType: 'BRAND · PLATFORM',
    year: '2026',
    tags: ['REACT', 'GSAP', 'TAILWIND'],
    desc: 'Premium interior design portfolio showcasing where high-end architectural design meets luxury craftsmanship.',
  },
  {
    id: '02',
    title: 'JANSEVA LABS',
    link: 'https://janseva-labs-x77q.vercel.app',
    image: '/janseva.jpg',
    metaType: 'HEALTHCARE · APP',
    year: '2026',
    tags: ['NEXT.JS', 'NODE', 'PRISMA'],
    desc: 'NABL Accredited & ICMR Certified full-stack diagnostic platform for seamless, on-demand lab test bookings.',
  },
  {
    id: '03',
    title: 'MARKWINGZ',
    link: 'https://markwingz.vercel.app/',
    image: '/markwingz.jpg',
    metaType: 'AGENCY · STRATEGY',
    year: '2025',
    tags: ['CREATIVE', 'MOTION', 'WEBGL'],
    desc: 'Modern digital growth, marketing optimization, and strategic branding platform built for high-performance scale.',
  },
];

const ACCENT = { '01': '#22d3ee', '02': '#a855f7', '03': '#34d399' };
const BORDER = { '01': 'rgba(34,211,238,0.25)', '02': 'rgba(168,85,247,0.25)', '03': 'rgba(52,211,153,0.25)' };

function ProjectCard({ project }) {
  const accent = ACCENT[project.id];
  const border = BORDER[project.id];

  return (
    <div
      className="group cursor-pointer relative flex flex-col overflow-hidden"
      style={{ background: '#0a0a0a', border: `1px solid ${border}` }}
      onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
    >
      {/* Top header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: accent, letterSpacing: '0.18em' }}
        >
          [ {project.metaType} ]
        </span>
        <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
          {project.year}
        </span>
      </div>

      {/* Image window */}
      <div className="relative mx-4 overflow-hidden rounded-sm" style={{ aspectRatio: '16 / 10' }}>
        {/* Watermark ID */}
        <span
          className="absolute inset-0 flex items-center justify-center font-black select-none pointer-events-none z-10"
          style={{
            fontSize: 'clamp(4rem, 8vw, 7rem)',
            color: accent,
            opacity: 0.1,
            letterSpacing: '-0.04em',
          }}
        >
          {project.id}
        </span>

        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top opacity-50 group-hover:opacity-90 transition-all duration-500 scale-95 group-hover:scale-100"
          style={{ position: 'relative', zIndex: 2 }}
        />
      </div>

      {/* Bottom panel */}
      <div className="px-4 pb-5 pt-4 flex flex-col gap-2">
        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5"
              style={{ color: accent, border: `1px solid ${border}`, letterSpacing: '0.15em' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-400 font-sans mt-3 leading-relaxed">
          {project.desc}
        </p>

        {/* Bottom line */}
        <div
          className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: `1px solid ${border}` }}
        >
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: accent, letterSpacing: '0.12em' }}
          >
            {project.id} // {project.title}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase group-hover:text-white transition-colors duration-300">
            VIEW +
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="relative w-full min-h-screen bg-neutral-950 z-10"
    >
      {/* Section header */}
      <div className="flex items-end justify-between px-8 md:px-12 pt-16 pb-8">
        <div>
          <div
            className="font-mono font-bold uppercase tracking-widest mb-1 text-cyan-400"
            style={{ fontSize: '11px', letterSpacing: '0.25em' }}
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

        <Link
          to="/portfolio"
          className="group font-mono text-zinc-500 hover:text-white transition-colors duration-200 hidden md:flex items-center gap-2"
          style={{ letterSpacing: '0.1em', fontSize: '11px' }}
        >
          <span className="group-hover:opacity-100 opacity-70 transition-opacity uppercase tracking-widest">
            [ VIEW MORE WORK →&nbsp;]
          </span>
        </Link>
      </div>

      {/* 3-column card grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4 py-12 bg-black text-white">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {/* Mobile: view more */}
      <div className="md:hidden px-8 pb-10">
        <Link
          to="/portfolio"
          className="font-mono text-zinc-500 hover:text-white text-xs tracking-widest uppercase transition-colors"
          style={{ fontSize: '11px' }}
        >
          [ VIEW MORE WORK → ]
        </Link>
      </div>
    </section>
  );
}
