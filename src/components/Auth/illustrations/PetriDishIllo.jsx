/* ──────────────────────────────────────────────────────────────
   PetriDishIllo — flat line-art petri dish viewed from above.
   Colors: --color-coral, --color-note-yellow, --color-note-blue
   ────────────────────────────────────────────────────────────── */
export default function PetriDishIllo() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Petri dish illustration"
      role="img"
    >
      {/* Dish lid (outer ring) */}
      <circle cx="50" cy="52" r="34"
              stroke="#E46757" strokeWidth="1.8"/>

      {/* Dish base (inner, slightly smaller, offset to show depth) */}
      <circle cx="50" cy="54" r="28"
              fill="#DDEEFF" stroke="#E46757" strokeWidth="1.4"/>

      {/* Agar surface — very subtle fill ring */}
      <circle cx="50" cy="54" r="28" fill="#DDEEFF" opacity="0.6"/>

      {/* Colony clusters — coral dots of varying size */}
      <circle cx="44" cy="48" r="5.5"
              fill="#E46757" opacity="0.85"/>
      <circle cx="58" cy="52" r="3.5"
              fill="#E46757" opacity="0.7"/>
      <circle cx="47" cy="62" r="4"
              fill="#C94A3C" opacity="0.75"/>
      <circle cx="60" cy="43" r="2.5"
              fill="#E46757" opacity="0.55"/>
      <circle cx="38" cy="58" r="2"
              fill="#C94A3C" opacity="0.5"/>

      {/* Colony halos (diffusion rings) */}
      <circle cx="44" cy="48" r="9"
              stroke="#E46757" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
      <circle cx="58" cy="52" r="6.5"
              stroke="#E46757" strokeWidth="1" strokeDasharray="2 2" opacity="0.35"/>

      {/* Small satellite colonies */}
      <circle cx="52" cy="70" r="1.5" fill="#FFF9C4" stroke="#E46757" strokeWidth="1.2"/>
      <circle cx="34" cy="50" r="1.5" fill="#FFF9C4" stroke="#E46757" strokeWidth="1.2"/>
      <circle cx="64" cy="62" r="1.5" fill="#FFF9C4" stroke="#E46757" strokeWidth="1.2"/>

      {/* Lid grip — small tab at top */}
      <path d="M46 18 L54 18" stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="44" y="15" width="12" height="5" rx="2.5"
            stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}
