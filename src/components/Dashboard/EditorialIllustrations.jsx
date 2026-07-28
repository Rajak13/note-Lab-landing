import React, { useId } from 'react';
import anim from './DashboardIllustrations.module.css';

/* NoteLab editorial palette — filled shapes, soft shadows, no thin wireframes */
const C = {
  coral: '#E46757',
  coralDark: '#C94A3C',
  coralSoft: '#FAD9D4',
  teal: '#0D9488',
  tealSoft: '#CCF0EB',
  tealLight: '#E6F7F4',
  gold: '#D97706',
  goldSoft: '#FFF3D6',
  cream: '#FFFEF9',
  warm: '#F4F1EA',
  beige: '#E8E2D9',
  wood: '#D4CEC4',
  blue: '#EFF6FF',
  yellow: '#FFFDE7',
  ink: '#2C2420',
  shadow: 'rgba(44,36,32,0.14)',
};

function ShadowFilter({ id, dy = 6, blur = 10, opacity = 0.14 }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy={dy} stdDeviation={blur} floodColor="#2C2420" floodOpacity={opacity} />
    </filter>
  );
}

/**
 * Premium editorial hero — scientist's desk from slightly above.
 * Stripe / Linear / Apple-inspired flat illustration with depth.
 */
export function StudyDeskIllustration({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const sh = `sh-${uid}`;

  return (
    <svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Scientist's study desk with notebook, microscope, and research materials"
      role="img"
    >
      <defs>
        <ShadowFilter id={sh} dy={8} blur={12} />
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.coralSoft} stopOpacity="0.5" />
          <stop offset="50%" stopColor={C.warm} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.tealLight} stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`${uid}-wood`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.beige} />
          <stop offset="100%" stopColor={C.wood} />
        </linearGradient>
        <linearGradient id={`${uid}-liquid`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor={C.teal} />
        </linearGradient>
      </defs>

      {/* Ambient backdrop */}
      <ellipse cx="300" cy="250" rx="260" ry="220" fill={`url(#${uid}-bg)`} />

      {/* Desk surface */}
      <g filter={`url(#${sh})`}>
        <path
          d="M48 340 Q300 318 552 340 L568 358 Q300 382 32 362 Z"
          fill={`url(#${uid}-wood)`}
        />
        <path d="M48 340 Q300 318 552 340" stroke={C.wood} strokeWidth="2" opacity="0.5" />
      </g>

      {/* Paper stack — back layer */}
      <g filter={`url(#${sh})`} transform="translate(118, 148) rotate(-4)">
        <rect x="0" y="0" width="130" height="168" rx="6" fill={C.cream} />
        <rect x="0" y="0" width="130" height="168" rx="6" fill={C.blue} opacity="0.35" />
        <line x1="16" y1="28" x2="110" y2="28" stroke={C.coral} strokeWidth="2" opacity="0.15" />
        <line x1="16" y1="44" x2="100" y2="44" stroke={C.coral} strokeWidth="2" opacity="0.12" />
        <line x1="16" y1="60" x2="108" y2="60" stroke={C.coral} strokeWidth="2" opacity="0.12" />
        {/* Mini molecule diagram */}
        <circle cx="88" cy="100" r="6" fill={C.teal} opacity="0.7" />
        <circle cx="104" cy="88" r="5" fill={C.coral} opacity="0.65" />
        <circle cx="72" cy="88" r="5" fill={C.gold} opacity="0.65" />
        <line x1="88" y1="100" x2="104" y2="88" stroke={C.ink} strokeWidth="1.5" opacity="0.2" />
        <line x1="88" y1="100" x2="72" y2="88" stroke={C.ink} strokeWidth="1.5" opacity="0.2" />
      </g>

      {/* Open notebook — hero focal */}
      <g className={anim.floatMedium} filter={`url(#${sh})`} transform="translate(168, 108)">
        <path d="M0 0 H118 V196 H0 Z" fill={C.coralDark} rx="4" />
        <path d="M8 0 H240 C248 0 254 6 254 14 V196 C254 204 248 210 240 210 H8 C8 210 8 0 8 0Z" fill={C.cream} />
        <rect x="8" y="0" width="16" height="210" fill={C.coral} rx="4" />
        <line x1="131" y1="0" x2="131" y2="210" stroke={C.beige} strokeWidth="2" />
        {[32, 52, 72, 92, 112, 132].map((y) => (
          <line key={`L${y}`} x1="36" y1={y} x2="118" y2={y} stroke={C.beige} strokeWidth="1.5" />
        ))}
        {[32, 52, 72, 92].map((y) => (
          <line key={`R${y}`} x1="144" y1={y} x2="230" y2={y} stroke={C.beige} strokeWidth="1.5" />
        ))}
        <text x="142" y="158" fill={C.coralDark} fontSize="13" fontFamily="Georgia, serif" fontStyle="italic">
          ΔG = ΔH − TΔS
        </text>
        <path d="M142 168 Q175 182 220 160" stroke={C.coral} strokeWidth="2" fill="none" opacity="0.5" />
      </g>

      {/* Coffee mug */}
      <g className={anim.floatSlow} filter={`url(#${sh})`} transform="translate(398, 118)">
        <ellipse cx="28" cy="52" rx="26" ry="6" fill={C.shadow} opacity="0.35" />
        <path d="M8 16 H48 V48 C48 56 40 62 28 62 C16 62 8 56 8 48 Z" fill={C.cream} />
        <path d="M8 16 H48 V28 H8 Z" fill={C.coralSoft} />
        <ellipse cx="28" cy="16" rx="20" ry="5" fill={C.coral} opacity="0.35" />
        <path d="M48 24 H58 C64 24 68 28 68 34 C68 40 64 44 58 44 H48" stroke={C.beige} strokeWidth="4" fill="none" />
        <path d="M14 28 Q20 22 28 24 Q36 26 40 32" stroke={C.cream} strokeWidth="2" opacity="0.6" fill="none" />
      </g>

      {/* Microscope */}
      <g className={anim.floatSlow} filter={`url(#${sh})`} transform="translate(418, 200)">
        <rect x="38" y="4" width="22" height="32" rx="6" fill={C.tealSoft} />
        <rect x="34" y="0" width="30" height="10" rx="5" fill={C.teal} />
        <rect x="46" y="36" width="6" height="38" rx="3" fill={C.beige} />
        <rect x="38" y="68" width="22" height="18" rx="4" fill={C.teal} />
        <rect x="20" y="92" width="58" height="8" rx="4" fill={C.wood} />
        <rect x="28" y="88" width="42" height="6" rx="3" fill={C.tealSoft} />
        <circle cx="30" cy="58" r="7" fill={C.coralSoft} stroke={C.coral} strokeWidth="2" />
      </g>

      {/* Beaker */}
      <g filter={`url(#${sh})`} transform="translate(72, 228)">
        <path d="M12 8 H36 L44 68 H4 Z" fill={C.blue} />
        <path d="M16 36 H32 V68 H16 Z" fill={`url(#${uid}-liquid)`} opacity="0.85" />
        <rect x="10" y="4" width="28" height="8" rx="3" fill={C.tealSoft} />
        <circle cx="20" cy="48" r="3" fill={C.cream} opacity="0.5" />
        <circle cx="28" cy="56" r="2" fill={C.cream} opacity="0.4" />
      </g>

      {/* Yellow sticky note */}
      <g className={anim.floatFast} filter={`url(#${sh})`} transform="rotate(-10, 88, 168)">
        <rect x="48" y="120" width="78" height="64" rx="4" fill={C.yellow} />
        <rect x="48" y="120" width="78" height="12" fill={C.gold} opacity="0.15" />
        <line x1="58" y1="146" x2="116" y2="146" stroke={C.gold} strokeWidth="2" opacity="0.35" />
        <line x1="58" y1="158" x2="108" y2="158" stroke={C.gold} strokeWidth="2" opacity="0.3" />
        <text x="58" y="140" fill={C.gold} fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.7">
          Quiz @ 3pm
        </text>
      </g>

      {/* Blue sticky note */}
      <g filter={`url(#${sh})`} transform="rotate(6, 340, 280)">
        <rect x="300" y="248" width="68" height="56" rx="4" fill={C.blue} />
        <line x1="310" y1="270" x2="358" y2="270" stroke={C.teal} strokeWidth="2" opacity="0.25" />
        <line x1="310" y1="282" x2="348" y2="282" stroke={C.teal} strokeWidth="2" opacity="0.2" />
      </g>

      {/* Ruler */}
      <g filter={`url(#${sh})`} transform="translate(280, 300) rotate(18)">
        <rect x="0" y="0" width="120" height="18" rx="3" fill={C.coralSoft} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={12 + i * 16} y1="2" x2={12 + i * 16} y2={i % 2 === 0 ? 10 : 7} stroke={C.coral} strokeWidth="1.5" opacity="0.45" />
        ))}
      </g>

      {/* Pencil */}
      <g filter={`url(#${sh})`} transform="translate(128, 318) rotate(-28)">
        <rect x="0" y="0" width="88" height="10" rx="3" fill={C.gold} />
        <polygon points="88,0 98,5 88,10" fill={C.coralDark} />
        <rect x="0" y="0" width="14" height="10" rx="3" fill={C.coralSoft} />
      </g>

      {/* Paper clips */}
      <g transform="translate(200, 328)" opacity="0.75">
        <ellipse cx="8" cy="8" rx="8" ry="10" stroke={C.teal} strokeWidth="3" fill="none" />
        <ellipse cx="22" cy="10" rx="8" ry="10" stroke={C.coral} strokeWidth="3" fill="none" />
      </g>

      {/* Floating atom — editorial filled */}
      <g className={anim.floatSlow} filter={`url(#${sh})`} transform="translate(468, 52)">
        <circle cx="0" cy="0" r="10" fill={C.coralSoft} />
        <circle cx="0" cy="0" r="5" fill={C.coral} />
        <ellipse cx="0" cy="0" rx="38" ry="14" stroke={C.coral} strokeWidth="3" fill="none" opacity="0.45" transform="rotate(25)" />
        <ellipse cx="0" cy="0" rx="38" ry="14" stroke={C.teal} strokeWidth="3" fill="none" opacity="0.4" transform="rotate(95)" />
        <ellipse cx="0" cy="0" rx="38" ry="14" stroke={C.gold} strokeWidth="3" fill="none" opacity="0.35" transform="rotate(155)" />
      </g>

      {/* DNA pill — decorative */}
      <g className={anim.floatMedium} transform="translate(520, 320)" opacity="0.55">
        <rect x="0" y="0" width="56" height="28" rx="14" fill={C.tealSoft} />
        <path d="M12 8 Q18 14 12 20 Q6 14 12 8" fill={C.teal} opacity="0.6" />
        <path d="M28 8 Q34 14 28 20 Q22 14 28 8" fill={C.coral} opacity="0.55" />
        <path d="M44 8 Q50 14 44 20 Q38 14 44 8" fill={C.teal} opacity="0.6" />
      </g>
    </svg>
  );
}

/** Study journey — editorial constellation with filled nodes */
export function StudyJourneyConstellation({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const sh = `jsh-${uid}`;

  const nodes = [
    { angle: 0, r: 0.82, label: 'Jan', active: 0.35 },
    { angle: 40, r: 0.88, label: '', active: 0.55 },
    { angle: 70, r: 0.74, label: 'Feb', active: 0.72 },
    { angle: 100, r: 0.9, label: '', active: 0.42 },
    { angle: 130, r: 0.78, label: 'Mar', active: 0.92 },
    { angle: 160, r: 0.85, label: '', active: 0.58 },
    { angle: 190, r: 0.72, label: 'Apr', active: 0.82 },
    { angle: 220, r: 0.88, label: '', active: 0.48 },
    { angle: 250, r: 0.8, label: 'May', active: 1.0 },
    { angle: 280, r: 0.86, label: '', active: 0.62 },
    { angle: 310, r: 0.76, label: 'Jun', active: 0.88 },
    { angle: 340, r: 0.92, label: 'Jul', active: 0.95 },
  ];

  const cx = 200;
  const cy = 200;
  const orbitR = 128;

  const starPoints = nodes.map((node) => {
    const rad = (node.angle * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * orbitR * node.r,
      y: cy + Math.sin(rad) * orbitR * node.r,
      ...node,
    };
  });

  const brightStars = starPoints.filter((s) => s.active > 0.65);

  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} aria-label="Study journey constellation" role="img">
      <defs>
        <ShadowFilter id={sh} dy={4} blur={6} opacity={0.1} />
        <radialGradient id={`${uid}-hub`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="60%" stopColor={C.coralSoft} />
          <stop offset="100%" stopColor={C.warm} />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Night sky wash */}
      <circle cx={cx} cy={cy} r={orbitR + 36} fill={C.warm} opacity="0.5" />
      <circle cx={cx} cy={cy} r={orbitR + 12} fill="rgba(228,103,87,0.04)" />

      {/* Constellation lines between bright stars */}
      {brightStars.map((star, i) => {
        if (i === 0) return null;
        const prev = brightStars[i - 1];
        return (
          <line
            key={`line-${i}`}
            x1={prev.x}
            y1={prev.y}
            x2={star.x}
            y2={star.y}
            stroke={C.coral}
            strokeWidth="1"
            opacity={0.15 + Math.min(prev.active, star.active) * 0.15}
            strokeDasharray="4 6"
          />
        );
      })}

      {/* Center sun — today */}
      <g filter={`url(#${uid}-glow)`}>
        <circle cx={cx} cy={cy} r="38" fill={`url(#${uid}-hub)`} />
        <circle cx={cx} cy={cy} r="28" fill={C.coral} opacity="0.12" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill={C.ink} fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.55">
          Today
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={C.coralDark} fontSize="20" fontWeight="700" fontFamily="Playfair Display, Georgia, serif">
          45m
        </text>
      </g>

      {starPoints.map((star, i) => {
        const size = 3 + star.active * 9;
        const brightness = 0.3 + star.active * 0.7;
        const fill = star.active > 0.75 ? C.coral : star.active > 0.45 ? C.teal : C.beige;
        const useGlow = star.active > 0.8;
        return (
          <g key={i} filter={useGlow ? `url(#${uid}-glow)` : undefined}>
            {useGlow && (
              <circle cx={star.x} cy={star.y} r={size + 10} fill={C.coral} opacity={star.active * 0.12} />
            )}
            {/* 4-point star */}
            <path
              d={`M${star.x} ${star.y - size} L${star.x + size * 0.3} ${star.y - size * 0.3} L${star.x + size} ${star.y} L${star.x + size * 0.3} ${star.y + size * 0.3} L${star.x} ${star.y + size} L${star.x - size * 0.3} ${star.y + size * 0.3} L${star.x - size} ${star.y} L${star.x - size * 0.3} ${star.y - size * 0.3} Z`}
              fill={fill}
              opacity={brightness}
            />
            {star.label && (
              <text x={star.x} y={star.y + size + 14} textAnchor="middle" fill={C.ink} fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" opacity={0.35 + star.active * 0.3}>
                {star.label}
              </text>
            )}
          </g>
        );
      })}

      <text x="24" y="378" fill={C.coralDark} fontSize="11" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.55">
        Brighter stars · recent sessions · 14-day streak
      </text>
    </svg>
  );
}

/** Collectible notebook cover — tactile, stickers, texture */
export function NotebookCoverIllustration({
  spineColor = C.coral,
  accent = 'coral',
  label = '',
  sticker = '★',
  coverTint = C.cream,
}) {
  const uid = useId().replace(/:/g, '');
  const sh = `ncsh-${uid}`;

  const ribbons = {
    coral: C.coral,
    teal: C.teal,
    gold: C.gold,
    plum: '#9B6B8A',
    emerald: '#059669',
    violet: '#7C3AED',
  };
  const ribbon = ribbons[accent] || spineColor;
  const stickerColors = { coral: C.coralSoft, teal: C.tealSoft, gold: C.goldSoft, emerald: '#D1FAE5', violet: '#EDE9FE' };
  const stickerBg = stickerColors[accent] || C.coralSoft;

  return (
    <svg viewBox="0 0 130 160" fill="none" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <defs>
        <ShadowFilter id={sh} dy={6} blur={8} opacity={0.16} />
        <pattern id={`${uid}-tex`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill={C.ink} opacity="0.03" />
        </pattern>
      </defs>

      <ellipse cx="68" cy="152" rx="50" ry="5" fill={C.shadow} opacity="0.5" />

      <g filter={`url(#${sh})`}>
        <rect x="20" y="12" width="90" height="128" rx="5" fill={coverTint} />
        <rect x="20" y="12" width="90" height="128" rx="5" fill={`url(#${uid}-tex)`} />
        <rect x="20" y="12" width="18" height="128" rx="5" fill={spineColor} />
        <rect x="34" y="12" width="3" height="128" fill="rgba(0,0,0,0.08)" />
        {[36, 72, 108].map((y) => (
          <circle key={y} cx="29" cy={y} r="2.5" fill={C.cream} opacity="0.85" />
        ))}
        <line x1="46" y1="40" x2="98" y2="40" stroke={C.beige} strokeWidth="2" />
        <line x1="46" y1="54" x2="94" y2="54" stroke={C.beige} strokeWidth="2" />
        <line x1="46" y1="68" x2="88" y2="68" stroke={C.beige} strokeWidth="2" />
        <path d="M96 12 V58 L100 54 L104 58 V12" fill={ribbon} />
        {label && (
          <text x="65" y="102" textAnchor="middle" fill={C.ink} fontSize="9" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.55">
            {label.length > 12 ? `${label.slice(0, 10)}…` : label}
          </text>
        )}
        <rect x="44" y="84" width="56" height="24" rx="3" fill={C.yellow} opacity="0.55" />
        {/* Sticker */}
        <circle cx="98" cy="28" r="12" fill={stickerBg} />
        <text x="98" y="32" textAnchor="middle" fill={spineColor} fontSize="11" fontWeight="700">
          {sticker}
        </text>
        {/* Worn corner fold */}
        <path d="M102 132 L110 140 L102 140 Z" fill={C.beige} opacity="0.6" />
      </g>
    </svg>
  );
}

export function StudyProgressArc({ progress = 68, size = 72 }) {
  const uid = useId().replace(/:/g, '');
  const r = 28;
  const stroke = 5;
  const normalized = r - stroke * 0.5;
  const circumference = normalized * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-arc`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.coral} />
          <stop offset="100%" stopColor={C.teal} />
        </linearGradient>
      </defs>
      <circle cx="36" cy="36" r={normalized} stroke={C.coralSoft} strokeWidth={stroke} fill={C.warm} />
      <circle
        cx="36"
        cy="36"
        r={normalized}
        stroke={`url(#${uid}-arc)`}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="40" textAnchor="middle" fill={C.ink} fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">
        {progress}%
      </text>
    </svg>
  );
}

export function AICompanionOrb({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const sh = `aish-${uid}`;

  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <defs>
        <ShadowFilter id={sh} dy={4} blur={6} />
        <radialGradient id={`${uid}-orb`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={C.blue} />
          <stop offset="100%" stopColor={C.tealSoft} />
        </radialGradient>
      </defs>
      <g filter={`url(#${sh})`}>
        <circle cx="40" cy="40" r="32" fill={`url(#${uid}-orb)`} />
        <circle cx="40" cy="40" r="26" fill="none" stroke={C.teal} strokeWidth="2" opacity="0.25" strokeDasharray="5 4" />
        <ellipse cx="32" cy="36" rx="4" ry="5" fill={C.ink} opacity="0.65" />
        <ellipse cx="48" cy="36" rx="4" ry="5" fill={C.ink} opacity="0.65" />
        <path d="M30 48 Q40 56 50 48" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="52" cy="24" r="4" fill={C.coral} opacity="0.7" />
        <circle cx="24" cy="28" r="2.5" fill={C.gold} opacity="0.6" />
      </g>
    </svg>
  );
}

export function SectionDividerMotif() {
  return (
    <svg viewBox="0 0 120 12" fill="none" aria-hidden="true" style={{ width: '120px', height: '12px' }}>
      <circle cx="6" cy="6" r="3" fill={C.coral} opacity="0.35" />
      <line x1="16" y1="6" x2="104" y2="6" stroke={C.beige} strokeWidth="2" />
      <circle cx="114" cy="6" r="2" fill={C.teal} opacity="0.4" />
    </svg>
  );
}

export function FloatingAtomDecor({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="6" fill={C.coralSoft} />
      <circle cx="40" cy="40" r="3" fill={C.coral} opacity="0.5" />
      <ellipse cx="40" cy="40" rx="30" ry="11" stroke={C.coral} strokeWidth="2" fill="none" opacity="0.2" transform="rotate(25 40 40)" />
      <ellipse cx="40" cy="40" rx="30" ry="11" stroke={C.teal} strokeWidth="2" fill="none" opacity="0.18" transform="rotate(85 40 40)" />
    </svg>
  );
}

export function EmptyShelfIllustration() {
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden="true">
      <rect x="16" y="86" width="168" height="8" rx="2" fill={C.wood} />
      <rect x="60" y="44" width="40" height="42" rx="4" fill={C.warm} stroke={C.beige} strokeWidth="2" strokeDasharray="6 4" />
      <text x="100" y="68" textAnchor="middle" fill={C.coral} fontSize="10" fontFamily="Inter, sans-serif" opacity="0.45">
        Your first notebook
      </text>
    </svg>
  );
}
