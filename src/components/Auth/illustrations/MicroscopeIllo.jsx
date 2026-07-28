/* ──────────────────────────────────────────────────────────────
   MicroscopeIllo — flat line-art microscope illustration.
   Style matches Features.jsx icons: strokeWidth 1.8, round caps.
   Colors: --color-coral (#E46757), --color-coral-dark (#C94A3C),
           --color-note-blue (#DDEEFF)
   ────────────────────────────────────────────────────────────── */
export default function MicroscopeIllo() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Microscope illustration"
      role="img"
    >
      {/* Eyepiece tube — vertical cylinder top */}
      <rect x="43" y="8" width="14" height="22" rx="3"
            stroke="#E46757" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Eyepiece lens cap */}
      <rect x="40" y="6" width="20" height="5" rx="2.5"
            stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>

      {/* Arm — diagonal connecting tube to stage */}
      <path d="M50 30 L50 52" stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>

      {/* Objective lens (lower tube) */}
      <rect x="44" y="48" width="12" height="16" rx="2"
            stroke="#C94A3C" strokeWidth="1.8" strokeLinecap="round"/>

      {/* Objective tip */}
      <path d="M47 64 L47 68 M53 64 L53 68"
            stroke="#C94A3C" strokeWidth="1.8" strokeLinecap="round"/>
      <ellipse cx="50" cy="69" rx="4" ry="1.5"
               fill="#DDEEFF" stroke="#C94A3C" strokeWidth="1.4"/>

      {/* Stage (horizontal platform) */}
      <rect x="28" y="72" width="44" height="5" rx="2"
            stroke="#E46757" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Slide on stage */}
      <rect x="36" y="70" width="28" height="3" rx="1"
            fill="#DDEEFF" stroke="#E46757" strokeWidth="1.4"/>

      {/* Arm brace — the C-shape support */}
      <path d="M50 30 C38 30 32 42 32 52 L32 74"
            stroke="#E46757" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

      {/* Base */}
      <rect x="24" y="77" width="52" height="7" rx="3.5"
            fill="#DDEEFF" stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>

      {/* Focus knobs */}
      <circle cx="30" cy="62" r="3.5" stroke="#C94A3C" strokeWidth="1.6"/>
      <circle cx="30" cy="62" r="1.2" fill="#C94A3C"/>
      <circle cx="30" cy="53" r="2.5" stroke="#C94A3C" strokeWidth="1.4"/>
    </svg>
  )
}
