/* ──────────────────────────────────────────────────────────────
   LockKeyIllo — open padlock with a key floating nearby.
   The shackle lifts gently on loop to suggest "unlocking".
   Colors: coral #E46757, coral-dark #C94A3C, note-yellow #FFF9C4
   ────────────────────────────────────────────────────────────── */
export default function LockKeyIllo() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Lock and key illustration"
      role="img"
    >
      <style>{`
        @keyframes lk-lift {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes lk-spin {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(12deg); }
        }
        .lk-shackle {
          animation: lk-lift 2.6s ease-in-out infinite;
          transform-origin: 50px 56px;
        }
        .lk-key {
          animation: lk-spin 2.6s ease-in-out infinite;
          transform-origin: 72px 36px;
        }
      `}</style>

      {/* ── Lock body ─────────────────────────────────────── */}
      <rect x="26" y="54" width="48" height="36" rx="6"
            fill="#FFF9C4" stroke="#E46757" strokeWidth="1.8"
            strokeLinejoin="round"/>

      {/* Keyhole — circle + slot */}
      <circle cx="50" cy="68" r="5"
              fill="none" stroke="#E46757" strokeWidth="1.6"/>
      <rect x="47.5" y="68" width="5" height="8" rx="1"
            fill="#E46757" opacity="0.35"/>
      <line x1="50" y1="73" x2="50" y2="78"
            stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>

      {/* ── Shackle (open — right side lifted) ───────────── */}
      <g className="lk-shackle">
        {/* left leg — stays in lock */}
        <line x1="36" y1="54" x2="36" y2="40"
              stroke="#C94A3C" strokeWidth="2.2" strokeLinecap="round"/>
        {/* arc at top */}
        <path d="M36 40 Q36 28 50 28 Q64 28 64 40"
              stroke="#C94A3C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        {/* right leg — lifted clear of body */}
        <line x1="64" y1="40" x2="64" y2="47"
              stroke="#C94A3C" strokeWidth="2.2" strokeLinecap="round"/>
      </g>

      {/* ── Key (floating top-right, slight rotation bob) ── */}
      <g className="lk-key">
        {/* key bow (ring) */}
        <circle cx="72" cy="30" r="8"
                fill="none" stroke="#E46757" strokeWidth="1.8"/>
        <circle cx="72" cy="30" r="4"
                fill="none" stroke="#E46757" strokeWidth="1.4"/>

        {/* key blade (shaft) */}
        <line x1="72" y1="38" x2="72" y2="62"
              stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>

        {/* teeth */}
        <line x1="72" y1="48" x2="77" y2="48"
              stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="72" y1="54" x2="76" y2="54"
              stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="72" y1="60" x2="75" y2="60"
              stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>

        {/* sparkle beside key bow */}
        <path d="M60 24 L60.5 26 L62.5 26.5 L60.5 27 L60 29 L59.5 27 L57.5 26.5 L59.5 26Z"
              fill="#FFF9C4" stroke="#E46757" strokeWidth="0.6"/>
      </g>

      {/* ── Small dots — decorative scatter ──────────────── */}
      <circle cx="18" cy="70" r="2" fill="#DDEEFF" opacity="0.7"/>
      <circle cx="21" cy="82" r="1.4" fill="#E46757" opacity="0.35"/>
      <circle cx="82" cy="78" r="1.8" fill="#FFF9C4" stroke="#E46757" strokeWidth="1"/>
    </svg>
  )
}
