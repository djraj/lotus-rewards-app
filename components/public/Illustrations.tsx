import React from 'react';

// Brand illustrations for the public site, drawn as inline SVG so they ship
// in the bundle (no external image host) and pick up the CSS motion classes
// from index.html. Palette: rose (primary), amber/gold (logo), sky (water).

// One petal pointing up from (0,0); rotated/scaled to build the lotus.
const petalPath = (w: number, h: number) =>
  `M0,0 C${w},${-h * 0.35} ${w * 0.6},${-h * 0.85} 0,${-h} C${-w * 0.6},${-h * 0.85} ${-w},${-h * 0.35} 0,0 Z`;

const LOTUS_PETALS: { angle: number; w: number; h: number; fill: string }[] = [
  { angle: -100, w: 30, h: 92, fill: 'url(#gl-petal-soft)' },
  { angle: 100, w: 30, h: 92, fill: 'url(#gl-petal-soft)' },
  { angle: -68, w: 38, h: 122, fill: 'url(#gl-petal-soft)' },
  { angle: 68, w: 38, h: 122, fill: 'url(#gl-petal-soft)' },
  { angle: -40, w: 42, h: 134, fill: 'url(#gl-petal-rose)' },
  { angle: 40, w: 42, h: 134, fill: 'url(#gl-petal-rose)' },
  { angle: -16, w: 44, h: 146, fill: 'url(#gl-petal-rose)' },
  { angle: 16, w: 44, h: 146, fill: 'url(#gl-petal-rose)' },
  { angle: 0, w: 46, h: 156, fill: 'url(#gl-petal-front)' },
];

const PetalGradients: React.FC = () => (
  <>
    <linearGradient id="gl-petal-soft" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor="#fb7185" />
      <stop offset="100%" stopColor="#ffe4e6" />
    </linearGradient>
    <linearGradient id="gl-petal-rose" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor="#e11d48" />
      <stop offset="100%" stopColor="#fda4af" />
    </linearGradient>
    <linearGradient id="gl-petal-front" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor="#f43f5e" />
      <stop offset="70%" stopColor="#fb7185" />
      <stop offset="100%" stopColor="#fff1f2" />
    </linearGradient>
  </>
);

const Sparkle: React.FC<{ x: number; y: number; size?: number; delay?: string }> = ({ x, y, size = 10, delay = '0s' }) => (
  <path
    className="gl-float"
    style={{ animationDelay: delay }}
    transform={`translate(${x} ${y})`}
    d={`M0,${-size} Q0,0 ${size},0 Q0,0 0,${size} Q0,0 ${-size},0 Q0,0 0,${-size} Z`}
    fill="#f59e0b"
    opacity="0.8"
  />
);

export const LotusHero: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 480 440" className={className} role="img" aria-label="A lotus blooming on a calm pond at sunrise">
    <defs>
      <radialGradient id="gl-sun" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#fef3c7" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fff7ed" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="gl-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#bae6fd" />
      </linearGradient>
      <linearGradient id="gl-pad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
      <PetalGradients />
    </defs>

    <circle cx="240" cy="190" r="180" fill="url(#gl-sun)" className="gl-breathe" />
    <circle cx="240" cy="190" r="74" fill="#fef3c7" opacity="0.7" />

    <ellipse cx="240" cy="372" rx="228" ry="56" fill="url(#gl-water)" />
    {[0, 1.3, 2.6].map((delay) => (
      <ellipse
        key={delay}
        cx="240"
        cy="356"
        rx="120"
        ry="20"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="2"
        className="gl-ripple"
        style={{ animationDelay: `${delay}s` }}
      />
    ))}

    <g className="gl-float-slow">
      <path d="M70,378 a52,18 0 1,0 104,0 a52,18 0 1,0 -104,0 M122,378 L170,370 L166,384 Z" fill="url(#gl-pad)" fillRule="evenodd" />
    </g>
    <g className="gl-float-slow" style={{ animationDelay: '2s' }}>
      <path d="M318,388 a46,15 0 1,0 92,0 a46,15 0 1,0 -92,0 M364,388 L322,380 L326,394 Z" fill="url(#gl-pad)" fillRule="evenodd" opacity="0.9" />
    </g>

    <g transform="translate(240 350)">
      <g className="gl-breathe">
        {LOTUS_PETALS.map((p) => (
          <path key={p.angle} d={petalPath(p.w, p.h)} transform={`rotate(${p.angle})`} fill={p.fill} stroke="#fff1f2" strokeWidth="1.5" />
        ))}
      </g>
    </g>

    <Sparkle x={120} y={140} delay="0s" />
    <Sparkle x={370} y={110} size={8} delay="1.5s" />
    <Sparkle x={400} y={230} size={6} delay="3s" />
    <Sparkle x={80} y={250} size={7} delay="2.2s" />
  </svg>
);

const SmallLotus: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {LOTUS_PETALS.map((p) => (
      <path key={p.angle} d={petalPath(p.w, p.h)} transform={`rotate(${p.angle})`} fill={p.fill} stroke="#fff1f2" strokeWidth="2" />
    ))}
  </g>
);

const PETALS = [
  { left: 6, delay: 0, duration: 16, size: 18, drift: 60 },
  { left: 18, delay: 5, duration: 20, size: 12, drift: -40 },
  { left: 32, delay: 9, duration: 18, size: 16, drift: 80 },
  { left: 47, delay: 2, duration: 22, size: 10, drift: -60 },
  { left: 61, delay: 12, duration: 17, size: 14, drift: 50 },
  { left: 74, delay: 7, duration: 21, size: 18, drift: -30 },
  { left: 86, delay: 3, duration: 19, size: 12, drift: 40 },
  { left: 94, delay: 14, duration: 23, size: 15, drift: -70 },
];

// Petals drifting down behind a section. Purely decorative: aria-hidden and
// hidden entirely under prefers-reduced-motion.
export const FloatingPetals: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {PETALS.map((p, i) => (
      <svg
        key={i}
        className="gl-petal"
        viewBox="-12 -24 24 24"
        width={p.size}
        height={p.size}
        style={{
          left: `${p.left}%`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          ['--gl-drift-x' as string]: `${p.drift}px`,
        }}
      >
        <path d={petalPath(10, 24)} fill={i % 3 === 0 ? '#fcd34d' : '#fda4af'} opacity="0.85" />
      </svg>
    ))}
  </div>
);

export const WaveDivider: React.FC<{ className?: string; fill?: string; flip?: boolean }> = ({
  className = '',
  fill = '#ffffff',
  flip = false,
}) => (
  <svg
    viewBox="0 0 1440 80"
    preserveAspectRatio="none"
    className={`block w-full h-12 md:h-20 ${flip ? 'rotate-180' : ''} ${className}`}
    aria-hidden="true"
  >
    <path d="M0,48 C240,88 480,8 720,32 C960,56 1200,80 1440,40 L1440,80 L0,80 Z" fill={fill} />
  </svg>
);

// Seed -> sprout -> bloom, for the "small steps" story.
export const GrowthScene: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 420 260" className={className} role="img" aria-label="A seed growing into a sprout and then a blooming lotus">
    <defs>
      <PetalGradients />
      <linearGradient id="gl-soil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#fcd34d" />
      </linearGradient>
    </defs>
    <path d="M20,212 C140,196 280,228 400,208 L400,250 L20,250 Z" fill="url(#gl-soil)" opacity="0.6" />

    <path d="M88,196 C150,150 220,150 300,130" fill="none" stroke="#fda4af" strokeWidth="3" className="gl-dash" strokeLinecap="round" />

    <ellipse cx="70" cy="204" rx="14" ry="10" fill="#b45309" />
    <path d="M70,196 q4,-10 10,-12" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />

    <g className="gl-grow">
      <path d="M200,212 L200,160" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
      <path d="M200,176 C180,170 172,154 176,142 C190,146 200,160 200,176 Z" fill="#4ade80" className="gl-sway" />
      <path d="M200,168 C220,160 230,146 226,132 C212,138 200,152 200,168 Z" fill="#22c55e" className="gl-sway" style={{ animationDelay: '1s' }} />
    </g>

    <g className="gl-grow" style={{ animationDelay: '0.4s' }}>
      <path d="M340,212 L340,150" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
      <g className="gl-breathe">
        <SmallLotus x={340} y={152} scale={0.42} />
      </g>
    </g>

    <text x="70" y="240" textAnchor="middle" className="fill-slate-500" fontSize="13" fontWeight="600">Show up</text>
    <text x="200" y="240" textAnchor="middle" className="fill-slate-500" fontSize="13" fontWeight="600">Grow</text>
    <text x="340" y="240" textAnchor="middle" className="fill-slate-500" fontSize="13" fontWeight="600">Bloom</text>
  </svg>
);

// An envelope sealed with a lotus, with a paper plane looping away.
export const ContactScene: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 320 220" className={className} role="img" aria-label="An envelope sealed with a lotus and a paper plane flying away">
    <defs>
      <PetalGradients />
    </defs>
    <circle cx="160" cy="120" r="96" fill="#fff1f2" />
    <path d="M40,60 C90,10 170,20 230,46" fill="none" stroke="#fda4af" strokeWidth="2.5" className="gl-dash" strokeLinecap="round" />
    <g className="gl-float" transform="translate(238 34)">
      <path d="M0,10 L34,0 L22,30 L16,18 Z" fill="#f43f5e" />
      <path d="M16,18 L34,0 L10,14 Z" fill="#fb7185" />
    </g>
    <g className="gl-float-slow">
      <rect x="86" y="90" width="148" height="96" rx="14" fill="#ffffff" stroke="#fecdd3" strokeWidth="3" />
      <path d="M90,96 L160,146 L230,96" fill="none" stroke="#fecdd3" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="160" cy="146" r="18" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" />
      <SmallLotus x={160} y={156} scale={0.13} />
    </g>
  </svg>
);

const SPOT_TONES = {
  rose: 'from-rose-100 to-rose-200 text-rose-500',
  amber: 'from-amber-100 to-amber-200 text-amber-600',
  sky: 'from-sky-100 to-sky-200 text-sky-600',
  emerald: 'from-emerald-100 to-emerald-200 text-emerald-600',
} as const;

// A soft organic blob with a large icon and two orbiting dots - the
// "image" for each service row.
export const SpotIllustration: React.FC<{ icon: string; tone?: keyof typeof SPOT_TONES; className?: string }> = ({
  icon,
  tone = 'rose',
  className = '',
}) => (
  <div className={`relative w-40 h-40 md:w-48 md:h-48 ${className}`} aria-hidden="true">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${SPOT_TONES[tone]} gl-breathe`}
      style={{ borderRadius: '62% 38% 55% 45% / 48% 60% 40% 52%' }}
    />
    <div className={`absolute inset-0 flex items-center justify-center text-5xl md:text-6xl ${SPOT_TONES[tone].split(' ').pop()}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <span className="absolute top-3 right-4 w-4 h-4 rounded-full bg-amber-300 gl-float" />
    <span className="absolute bottom-5 left-2 w-3 h-3 rounded-full bg-rose-300 gl-float" style={{ animationDelay: '2s' }} />
  </div>
);

// Two small cards floating beside the hero art, naming what the centre does.
export const HeroBadges: React.FC = () => (
  <>
    <div className="absolute left-0 top-10 md:-left-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-rose-100 border border-rose-50 p-3 pr-5 flex items-center gap-3 gl-float">
      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 text-white flex items-center justify-center">
        <i className="fa-solid fa-hand-sparkles"></i>
      </span>
      <div>
        <p className="text-sm font-bold text-slate-800">No-touch energy healing</p>
        <p className="text-xs text-slate-500">Complements medical care</p>
      </div>
    </div>
    <div
      className="absolute right-0 bottom-16 md:-right-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-amber-100 border border-amber-50 p-3 pr-5 flex items-center gap-3 gl-float"
      style={{ animationDelay: '2.5s' }}
    >
      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center">
        <i className="fa-solid fa-leaf"></i>
      </span>
      <div>
        <p className="text-sm font-bold text-slate-800">Members earn Lotus Points</p>
        <p className="text-xs text-slate-500">For serving the community</p>
      </div>
    </div>
  </>
);
