import React, { useId } from 'react';
import anim from './DashboardIllustrations.module.css';

const C = {
  coral: '#E46757',
  coralDark: '#C94A3C',
  coralSoft: '#FAD9D4',
  teal: '#0D9488',
  tealSoft: '#CCF0EB',
  gold: '#D97706',
  cream: '#FFFEF9',
  warm: '#F4F1EA',
  beige: '#E8E2D9',
  wood: '#D4CEC4',
  blue: '#EFF6FF',
  yellow: '#FFFDE7',
  ink: '#2C2420',
};

function ShadowFilter({ id, dy = 6, blur = 12, opacity = 0.14 }) {
  return (
    <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy={dy} stdDeviation={blur} floodColor="#2C2420" floodOpacity={opacity} />
    </filter>
  );
}

/** Single desk scene — notebook rests on wood; props sit on the same surface. */
export default function StudyDeskScene({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const sh = `scene-${uid}`;

  const DESK_Y = 568;
  const NOTEBOOK_X = 268;
  const NOTEBOOK_Y = 108;

  return (
    <svg
      viewBox="0 0 960 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <ShadowFilter id={sh} />
        <linearGradient id={`${uid}-wood`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.beige} />
          <stop offset="100%" stopColor={C.wood} />
        </linearGradient>
        <linearGradient id={`${uid}-page`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.cream} />
          <stop offset="100%" stopColor="#FFF8F0" />
        </linearGradient>
        <pattern id={`${uid}-paper`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill={C.ink} opacity="0.025" />
        </pattern>
      </defs>

      {/* Quiet top — intentional empty space under navbar rhythm */}
      <rect width="960" height="640" fill={C.warm} opacity="0.35" />

      <g filter={`url(#${sh})`}>
        {/* Desk — anchor plane for all objects */}
        <path
          d={`M24 ${DESK_Y} Q480 ${DESK_Y - 24} 936 ${DESK_Y} L952 ${DESK_Y + 28} Q480 ${DESK_Y + 56} 8 ${DESK_Y + 28} Z`}
          fill={`url(#${uid}-wood)`}
        />

        {/* Contact shadow where notebook meets desk */}
        <ellipse cx="500" cy={DESK_Y - 4} rx="210" ry="10" fill="rgba(44,36,32,0.1)" />

        {/* Notebook — dominant, bottom edge on desk */}
        <g transform={`translate(${NOTEBOOK_X}, ${NOTEBOOK_Y})`}>
          <rect x="6" y="10" width="448" height="458" rx="8" fill={C.coralDark} opacity="0.06" />
          <path
            d="M0 24 C0 10 10 0 24 0 H228 C244 0 256 10 256 24 V438 C256 452 244 462 228 462 H24 C10 462 0 452 0 438 Z"
            fill={`url(#${uid}-page)`}
          />
          <rect x="0" y="0" width="30" height="462" fill={C.coral} rx="6" />
          <rect x="30" y="0" width="226" height="462" fill={`url(#${uid}-paper)`} opacity="0.45" />

          {/* Cover title — product identity on the notebook itself */}
          <text x="148" y="88" textAnchor="middle" fill={C.coralDark} fontSize="17" fontWeight="700" fontFamily="Playfair Display, Georgia, serif">
            Organic
          </text>
          <text x="148" y="112" textAnchor="middle" fill={C.coralDark} fontSize="17" fontWeight="700" fontFamily="Playfair Display, Georgia, serif">
            Chemistry II
          </text>
          <text x="148" y="136" textAnchor="middle" fill={C.ink} fontSize="10" fontFamily="Inter, sans-serif" opacity="0.45">
            Page 42 · Mechanisms
          </text>

          {/* Open spread */}
          <path
            d="M256 24 C256 10 268 0 284 0 H420 C436 0 448 10 448 24 V438 C448 452 436 462 420 462 H284 C268 462 256 452 256 438 Z"
            fill={`url(#${uid}-page)`}
          />
          <line x1="256" y1="0" x2="256" y2="462" stroke={C.beige} strokeWidth="2.5" />
          {[56, 84, 112, 140, 168, 196, 224, 252, 280, 308, 336].map((y) => (
            <line key={y} x1="46" y1={y} x2="220" y2={y} stroke={C.beige} strokeWidth="1.5" />
          ))}
          {[56, 84, 112, 140, 168].map((y) => (
            <line key={`r${y}`} x1="276" y1={y} x2="420" y2={y} stroke={C.beige} strokeWidth="1.5" opacity="0.35" />
          ))}

          <g className={anim.bookmarkSway}>
            <path d="M224 0 V88 L234 78 L244 88 V0" fill={C.teal} />
          </g>

          {/* Sticky note pinned to cover corner */}
          <g className={anim.stickyWobble} transform="translate(368, 8) rotate(6)">
            <rect width="88" height="68" rx="4" fill={C.yellow} />
            <line x1="10" y1="26" x2="78" y2="26" stroke={C.gold} strokeWidth="2" opacity="0.35" />
            <text x="10" y="18" fill={C.gold} fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.65">
              Quiz @ 3pm
            </text>
          </g>
        </g>

        {/* Coffee — on desk, right of notebook */}
        <g transform={`translate(680, ${DESK_Y - 78})`}>
          <ellipse cx="34" cy="62" rx="32" ry="7" fill="rgba(44,36,32,0.12)" />
          <path d="M10 18 H58 V54 C58 66 46 76 34 76 C22 76 10 66 10 54 Z" fill={C.cream} />
          <path d="M10 18 H58 V32 H10 Z" fill={C.coralSoft} />
          <path d="M58 28 H72 C80 28 86 34 86 42 C86 50 80 56 72 56 H58" stroke={C.beige} strokeWidth="5" fill="none" />
          <g className={anim.steamRise}>
            <path d="M26 12 Q30 0 34 12" stroke={C.coral} strokeWidth="2" opacity="0.35" fill="none" />
          </g>
        </g>

        {/* Microscope — base on desk */}
        <g className={anim.microscopeTilt} transform={`translate(720, ${DESK_Y - 118})`}>
          <rect x="44" y="6" width="26" height="36" rx="6" fill={C.tealSoft} />
          <rect x="40" y="0" width="34" height="12" rx="6" fill={C.teal} />
          <rect x="54" y="42" width="8" height="44" rx="4" fill={C.beige} />
          <rect x="42" y="82" width="30" height="24" rx="5" fill={C.teal} />
          <rect x="20" y="110" width="74" height="10" rx="5" fill={C.wood} />
        </g>

        {/* Beaker — on desk, left */}
        <g transform={`translate(140, ${DESK_Y - 92})`}>
          <path d="M14 10 H42 L50 82 H6 Z" fill={C.blue} />
          <path d="M18 44 H38 V82 H18 Z" fill={C.teal} opacity="0.75" />
        </g>

        {/* Ruler + pencil on desk surface */}
        <g transform={`translate(320, ${DESK_Y - 22}) rotate(5)`}>
          <rect width="130" height="16" rx="3" fill={C.coralSoft} />
          <rect x="140" y="3" width="80" height="10" rx="2" fill={C.gold} />
        </g>

        {/* Formula slip — under notebook edge on desk */}
        <g transform={`translate(340, ${DESK_Y - 36}) rotate(-2)`} opacity="0.85">
          <rect width="160" height="56" rx="3" fill={C.cream} />
          <text x="12" y="24" fill={C.ink} fontSize="11" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.45">
            ΔG = ΔH − TΔS
          </text>
        </g>
      </g>
    </svg>
  );
}
