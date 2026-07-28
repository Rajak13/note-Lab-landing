/* ──────────────────────────────────────────────────────────────
   BeakerIllo — flat line-art beaker with animated liquid.

   Props:
     isAnimated (bool, default false) — when true:
       • liquid fill bobs gently via translateY keyframe
       • 3 small circles rise as bubbles

   Colors: --color-coral, --color-note-blue, --color-note-yellow
   ────────────────────────────────────────────────────────────── */
export default function BeakerIllo({ isAnimated = false }) {
  const uid = isAnimated ? 'ba-anim' : 'ba-static'

  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Beaker illustration"
      role="img"
    >
      {isAnimated && (
        <style>{`
          @keyframes ${uid}-bob {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-3px); }
          }
          @keyframes ${uid}-rise {
            0%   { transform: translateY(0);    opacity: 0.9; }
            100% { transform: translateY(-22px); opacity: 0;  }
          }
          .${uid}-liquid {
            animation: ${uid}-bob 2.4s ease-in-out infinite;
            transform-origin: 50px 70px;
          }
          .${uid}-b1 {
            animation: ${uid}-rise 2s ease-in 0.2s infinite;
          }
          .${uid}-b2 {
            animation: ${uid}-rise 2s ease-in 0.85s infinite;
          }
          .${uid}-b3 {
            animation: ${uid}-rise 2s ease-in 1.5s infinite;
          }
        `}</style>
      )}

      {/* ── Beaker body outline ──────────────────────────── */}
      {/* Straight sides with a slight flare at the base */}
      <path
        d="M32 22 L32 76 Q32 84 40 84 L60 84 Q68 84 68 76 L68 22"
        stroke="#E46757"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Spout / lip at top */}
      <path
        d="M28 22 L72 22"
        stroke="#E46757"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M62 22 L66 16"
        stroke="#E46757"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Volume graduation marks */}
      <line x1="32" y1="50" x2="38" y2="50" stroke="#C94A3C" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="32" y1="60" x2="40" y2="60" stroke="#C94A3C" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="32" y1="70" x2="38" y2="70" stroke="#C94A3C" strokeWidth="1.4" strokeLinecap="round"/>

      {/* ── Liquid fill (clipped to beaker shape) ─────────── */}
      <clipPath id={`${uid}-clip`}>
        <path d="M33 22 L33 76 Q33 83 40 83 L60 83 Q67 83 67 76 L67 22 Z"/>
      </clipPath>

      {/* Liquid body — coral colored */}
      <g className={isAnimated ? `${uid}-liquid` : undefined}
         clipPath={`url(#${uid}-clip)`}>
        {/* Fill rect tall enough that bob animation never reveals bottom */}
        <rect
          x="33" y="62"
          width="34" height="30"
          fill="#E46757"
          opacity="0.75"
        />
        {/* Surface wave — slightly wavy top edge */}
        <path
          d="M33 62 Q41 58 50 62 Q59 66 67 62 L67 62"
          fill="#E46757"
          opacity="0.9"
          strokeWidth="0"
        />
      </g>

      {/* ── Bubbles (only rendered when animated) ─────────── */}
      {isAnimated && (
        <>
          <circle
            className={`${uid}-b1`}
            cx="44" cy="72"
            r="2"
            fill="#DDEEFF"
            opacity="0.85"
            clipPath={`url(#${uid}-clip)`}
          />
          <circle
            className={`${uid}-b2`}
            cx="52" cy="75"
            r="1.5"
            fill="#FFF9C4"
            opacity="0.85"
            clipPath={`url(#${uid}-clip)`}
          />
          <circle
            className={`${uid}-b3`}
            cx="58" cy="70"
            r="1.8"
            fill="#DDEEFF"
            opacity="0.8"
            clipPath={`url(#${uid}-clip)`}
          />
        </>
      )}

      {/* ── Static bubble dots when not animated ─────────── */}
      {!isAnimated && (
        <>
          <circle cx="44" cy="68" r="1.8" fill="#DDEEFF" opacity="0.7"
                  clipPath={`url(#${uid}-clip)`}/>
          <circle cx="53" cy="72" r="1.4" fill="#FFF9C4" opacity="0.7"
                  clipPath={`url(#${uid}-clip)`}/>
        </>
      )}

      {/* ── Base / stand line ─────────────────────────────── */}
      <line x1="26" y1="88" x2="74" y2="88"
            stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
