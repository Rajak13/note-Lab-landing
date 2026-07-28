import React from 'react';

/**
 * Clean, lightweight, monochrome vector SVG illustration inspired by the structure of the logistics map,
 * reinterpreted for NoteLab as an educational workspace with floating nodes, notebooks, AI neural links,
 * biological structures, chemical flasks, formulas, and study analytics.
 */
export function HeroEducationIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 1000 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
      aria-label="Educational Knowledge Map Illustration"
    >
      <defs>
        <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          <circle cx="40" cy="40" r="1.5" fill="rgba(255, 255, 255, 0.1)" />
        </pattern>

        <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E2433" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#141824" stopOpacity="0.9" />
        </linearGradient>

        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid background */}
      <rect width="1000" height="340" fill="url(#heroGrid)" rx="16" />

      {/* Flowing subject knowledge connection paths */}
      <path
        d="M 50 180 Q 200 80, 380 190 T 700 120 T 950 220"
        fill="none"
        stroke="rgba(228, 103, 87, 0.3)"
        strokeWidth="3"
        strokeDasharray="6 6"
      />
      <path
        d="M 120 260 Q 300 290, 520 180 T 820 240 T 980 90"
        fill="none"
        stroke="rgba(16, 185, 129, 0.25)"
        strokeWidth="2"
      />

      {/* Connection Nodes */}
      <g transform="translate(180, 110)">
        <circle cx="0" cy="0" r="32" fill="url(#cardBg)" stroke="#E46757" strokeWidth="2" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#E46757" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M-6 -10 h12 v4 l-8 14 h20 l-8 -14 v-4 z" stroke="#E46757" strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="4" r="2" fill="#E46757" />
        <text x="0" y="55" fill="#E5E7EB" fontSize="11" fontWeight="600" textAnchor="middle">Bio-Chem AI Notes</text>
      </g>

      <g transform="translate(480, 190)">
        <circle cx="0" cy="0" r="36" fill="url(#cardBg)" stroke="#10B981" strokeWidth="2" />
        <circle cx="0" cy="0" r="48" fill="none" stroke="#10B981" strokeOpacity="0.25" strokeWidth="1.5" />
        <ellipse cx="0" cy="0" rx="16" ry="6" stroke="#10B981" strokeWidth="1.5" transform="rotate(30)" />
        <ellipse cx="0" cy="0" rx="16" ry="6" stroke="#10B981" strokeWidth="1.5" transform="rotate(150)" />
        <circle cx="0" cy="0" r="4" fill="#10B981" />
        <text x="0" y="60" fill="#E5E7EB" fontSize="11" fontWeight="600" textAnchor="middle">Quantum Mechanics</text>
      </g>

      <g transform="translate(760, 110)">
        <circle cx="0" cy="0" r="32" fill="url(#cardBg)" stroke="#8B5CF6" strokeWidth="2" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="-8" cy="-6" r="3" fill="#8B5CF6" />
        <circle cx="8" cy="-6" r="3" fill="#8B5CF6" />
        <circle cx="0" cy="8" r="3" fill="#8B5CF6" />
        <path d="M-8 -6 L8 -6 L0 8 Z" stroke="#8B5CF6" strokeWidth="1" />
        <text x="0" y="55" fill="#E5E7EB" fontSize="11" fontWeight="600" textAnchor="middle">AI Tutor Node</text>
      </g>

      {/* Floating Formula Card */}
      <g transform="translate(280, 40)">
        <rect x="0" y="0" width="160" height="64" rx="12" fill="#1E2433" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" filter="url(#glowEffect)" />
        <text x="14" y="24" fill="#9CA3AF" fontSize="10" fontWeight="500">FORMULA SUMMARY</text>
        <text x="14" y="44" fill="#F9FAFB" fontSize="14" fontWeight="700" fontFamily="monospace">E = mc² + ℏω</text>
        <circle cx="138" cy="22" r="6" fill="#10B981" />
      </g>

      {/* Floating AI Progress Card */}
      <g transform="translate(560, 240)">
        <rect x="0" y="0" width="180" height="68" rx="12" fill="#1E2433" stroke="rgba(228, 103, 87, 0.3)" strokeWidth="1" />
        <path d="M 16 48 L 40 32 L 70 40 L 100 20 L 130 28 L 164 14" fill="none" stroke="#E46757" strokeWidth="2" />
        <circle cx="164" cy="14" r="3.5" fill="#E46757" />
        <text x="16" y="22" fill="#9CA3AF" fontSize="10" fontWeight="500">RETENTION RATE</text>
        <text x="130" y="22" fill="#E46757" fontSize="12" fontWeight="700">96.4%</text>
      </g>
    </svg>
  );
}

/* ── Rich Illustrated Vector Graphic Components ── */

/** Illustrated Stack of Books for Total Notes card */
export function BookStackIllustration({ width = 54, height = 54 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 64 64" fill="none">
      {/* Bottom Book */}
      <rect x="8" y="44" width="48" height="12" rx="3" fill="#E46757" />
      <path d="M8 44 h48 v3 H8 z" fill="#C94A3C" />
      <rect x="14" y="48" width="36" height="4" fill="#FFF8F0" rx="1" />

      {/* Middle Book */}
      <rect x="12" y="30" width="42" height="11" rx="3" fill="#10B981" />
      <path d="M12 30 h42 v3 H12 z" fill="#059669" />
      <rect x="18" y="34" width="30" height="3" fill="#F0FDF4" rx="1" />

      {/* Top Open Book */}
      <rect x="16" y="16" width="36" height="11" rx="3" fill="#8B5CF6" />
      <path d="M16 16 h36 v3 H16 z" fill="#6D28D9" />
      <rect x="22" y="20" width="24" height="3" fill="#F5F3FF" rx="1" />

      {/* Bookmark Ribbon */}
      <path d="M 40 16 v 18 l 4 -3 l 4 3 v -18 Z" fill="#F59E0B" />
    </svg>
  );
}

/** Illustrated Chemistry Beaker with Floating Particles */
export function FlaskBeakerIllustration({ width = 54, height = 54 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 64 64" fill="none">
      <path d="M26 10 h12 v10 L48 48 A6 6 0 0 1 42 56 H22 A6 6 0 0 1 16 48 L26 20 Z" fill="rgba(228, 103, 87, 0.15)" stroke="#E46757" strokeWidth="3" strokeLinejoin="round" />
      <path d="M20 40 Q 32 36, 44 40 L 42 52 H 22 Z" fill="#E46757" fillOpacity="0.8" />
      <circle cx="28" cy="44" r="2.5" fill="#FFFFFF" fillOpacity="0.7" />
      <circle cx="34" cy="48" r="1.5" fill="#FFFFFF" fillOpacity="0.7" />
      {/* Floating Bubbles */}
      <circle cx="32" cy="28" r="3" fill="#E46757" opacity="0.6" />
      <circle cx="26" cy="18" r="2" fill="#10B981" opacity="0.8" />
      <circle cx="38" cy="20" r="2.5" fill="#8B5CF6" opacity="0.7" />
    </svg>
  );
}

/** SVG Donut Radial Progress Ring for Quiz Accuracy */
export function RadialProgressRing({ score = 94, size = 90 }) {
  const radius = 34;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <svg height={size} width={size} viewBox="0 0 80 80">
      <circle
        stroke="rgba(228, 103, 87, 0.12)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={40}
        cy={40}
      />
      <circle
        stroke="url(#radialGrad)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={40}
        cy={40}
        transform="rotate(-90 40 40)"
      />
      <defs>
        <linearGradient id="radialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E46757" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <text x="40" y="44" fill="var(--color-text-dark)" fontSize="16" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
        {score}%
      </text>
    </svg>
  );
}

/** GitHub-Style 365-Day Study Activity Heatmap Grid */
export function StudyHeatmapSVG() {
  // Generate 24 columns x 5 rows of activity boxes
  const columns = 24;
  const rows = 5;
  const boxSize = 10;
  const gap = 4;

  const getOpacity = (c, r) => {
    const val = (c * 3 + r * 7) % 10;
    if (val > 7) return 0.9;
    if (val > 4) return 0.55;
    if (val > 2) return 0.25;
    return 0.08;
  };

  return (
    <svg viewBox={`0 0 ${columns * (boxSize + gap)} ${rows * (boxSize + gap)}`} style={{ width: '100%', height: 'auto' }}>
      {Array.from({ length: columns }).map((_, c) =>
        Array.from({ length: rows }).map((_, r) => {
          const op = getOpacity(c, r);
          return (
            <rect
              key={`${c}-${r}`}
              x={c * (boxSize + gap)}
              y={r * (boxSize + gap)}
              width={boxSize}
              height={boxSize}
              rx={2}
              fill="#E46757"
              fillOpacity={op}
            />
          );
        })
      )}
    </svg>
  );
}

/* ── Lightweight Modular Icons ── */
export function AtomIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(150 12 12)" />
    </svg>
  );
}

export function MicroscopeIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 18h12" />
      <path d="M12 18v-3" />
      <path d="M9 15h6" />
      <path d="M14 9l-4-4" />
      <path d="M10 5l-2 2" />
      <path d="M12 7l4 4" />
      <path d="M15 11c0 2.2-1.8 4-4 4" />
    </svg>
  );
}

export function NotebookIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 3v18" />
      <path d="M12 7h5" />
      <path d="M12 11h5" />
      <path d="M12 15h3" />
    </svg>
  );
}

export function SparklesIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l1.9 4.8L18 9.7l-4.1 3.5.9 5.8-4.8-2.9-4.8 2.9.9-5.8L2 9.7l4.1-1.9L8.2 3z" fill="currentColor" fillOpacity="0.2" />
      <path d="M19 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
    </svg>
  );
}

export function SearchIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function BellIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function SunIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function MoonIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function GraduationIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10L12 5L2 10L12 15L22 10Z" />
      <path d="M6 12.2V17A6 3 0 0 0 18 17V12.2" />
      <path d="M22 10V16" />
    </svg>
  );
}

export function FlashcardsIcon({ className = "", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="6" y="7" width="15" height="13" rx="2" />
      <path d="M3 17V5a2 2 0 0 1 2-2h12" />
      <path d="M10 11h7" />
      <path d="M10 15h4" />
    </svg>
  );
}

export function CommandIcon({ className = "", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 6 0V6a3 3 0 0 0-6 0 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

