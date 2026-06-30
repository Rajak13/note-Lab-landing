/* ──────────────────────────────────────────────────────────────
   EnvelopeIllo — open envelope with a paper airplane launching
   out of it and leaving a dashed trail arc.

   Animation:
     • Airplane flies up-right on a gentle arc, loops back
     • Envelope flap opens slightly in sync
     • Dashed trail fades in as the plane moves

   Colors: coral #E46757, coral-dark #C94A3C,
           note-blue #DDEEFF, note-yellow #FFF9C4
   ────────────────────────────────────────────────────────────── */
export default function EnvelopeIllo() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Envelope with paper airplane illustration"
      role="img"
    >
      <style>{`
        @keyframes env-fly {
          0%   { transform: translate(0px, 0px)   rotate(-30deg); opacity: 1; }
          60%  { transform: translate(24px, -22px) rotate(-38deg); opacity: 1; }
          85%  { transform: translate(30px, -26px) rotate(-42deg); opacity: 0.2; }
          100% { transform: translate(0px, 0px)   rotate(-30deg); opacity: 1; }
        }
        @keyframes env-trail {
          0%, 20%  { stroke-dashoffset: 60; opacity: 0; }
          50%      { stroke-dashoffset: 10; opacity: 0.7; }
          85%      { stroke-dashoffset: 0;  opacity: 0.4; }
          100%     { stroke-dashoffset: 60; opacity: 0; }
        }
        @keyframes env-flap {
          0%, 100% { transform: rotateX(0deg); }
          40%      { transform: rotateX(-18deg); }
        }
        .env-plane {
          animation: env-fly 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: 46px 52px;
        }
        .env-trail {
          stroke-dasharray: 4 3;
          stroke-dashoffset: 60;
          animation: env-trail 3s ease-in-out infinite;
        }
        .env-flap {
          animation: env-flap 3s ease-in-out infinite;
          transform-origin: 50px 58px;
        }
      `}</style>

      {/* ── Envelope body ────────────────────────────────── */}
      <rect x="14" y="56" width="72" height="34" rx="4"
            fill="#DDEEFF" stroke="#E46757" strokeWidth="1.8"
            strokeLinejoin="round"/>

      {/* Bottom-left and bottom-right fold lines */}
      <line x1="14" y1="90" x2="50" y2="72"
            stroke="#E46757" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
      <line x1="86" y1="90" x2="50" y2="72"
            stroke="#E46757" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>

      {/* ── Flap (open, hinged at top of envelope) ──────── */}
      <g className="env-flap">
        <path d="M14 58 L50 44 L86 58"
              fill="#FFF9C4" stroke="#E46757" strokeWidth="1.8"
              strokeLinejoin="round"/>
      </g>

      {/* ── Dashed flight trail ───────────────────────────── */}
      <path
        className="env-trail"
        d="M46 52 Q52 38 62 28"
        stroke="#C94A3C"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Paper airplane ───────────────────────────────── */}
      <g className="env-plane">
        {/* main body triangle */}
        <path d="M36 58 L58 50 L46 66 Z"
              fill="#FFF9C4" stroke="#E46757" strokeWidth="1.6"
              strokeLinejoin="round"/>
        {/* centre crease line */}
        <line x1="46" y1="54" x2="46" y2="66"
              stroke="#E46757" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        {/* left wing fold */}
        <line x1="36" y1="58" x2="46" y2="58"
              stroke="#E46757" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      </g>

      {/* ── Decorative scatter dots ───────────────────────── */}
      <circle cx="78" cy="38" r="2.2" fill="#FFF9C4" stroke="#E46757" strokeWidth="1.2"/>
      <circle cx="84" cy="30" r="1.4" fill="#E46757" opacity="0.4"/>
      <circle cx="70" cy="26" r="1.6" fill="#DDEEFF" stroke="#E46757" strokeWidth="1"/>

      {/* Tiny sparkle near trail end */}
      <path d="M64 24 L64.5 26 L66.5 26.5 L64.5 27 L64 29 L63.5 27 L61.5 26.5 L63.5 26Z"
            fill="#FFF9C4" stroke="#E46757" strokeWidth="0.6"/>
    </svg>
  )
}
