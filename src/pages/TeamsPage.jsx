const TEAM = [
  {
    name: 'Alex Rivera',
    role: 'Creative Director',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Marcus Chen',
    role: 'Systems Architect',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sophia Martinez',
    role: 'Motion Designer',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'David Kim',
    role: 'Frontend Developer',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Emma Watson',
    role: 'UI/UX Strategist',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
  },
];

function ProfileCard({ member }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square rounded-full overflow-hidden border border-neutral-200 relative group mb-4">
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <p className="font-bold text-sm tracking-wide text-neutral-800 uppercase text-center">
        {member.name}
      </p>
      <p className="text-xs font-mono tracking-wider text-neutral-400 mt-1 uppercase text-center">
        {member.role}
      </p>
    </div>
  );
}

export default function TeamsPage() {
  return (
    <div className="bg-white text-neutral-900 min-h-screen w-full relative">
      {/* Zone A: Absolute brand header */}
      <div className="absolute top-0 left-0 p-6 md:p-10 text-sm tracking-wider font-bold uppercase z-50 font-sans">
        INTELLECT STUDIO
      </div>

      {/* Zone B: Cinematic hero banner */}
      <div
        style={{ height: '55vh', width: '100%', overflow: 'hidden', position: 'relative' }}
      >
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
          alt="Team at work"
          className="w-full h-full object-cover select-none brightness-95"
          draggable={false}
        />
      </div>

      {/* Zone C: Circular roster matrix */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-5xl font-light tracking-tight text-center mb-16 font-sans">
          Meet the team.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 justify-center items-start">
          {TEAM.map((member) => (
            <ProfileCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
