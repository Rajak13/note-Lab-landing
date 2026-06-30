/* ──────────────────────────────────────────────────────────────
   NotebookIllo — flat line-art lab notebook with sticky note.
   Colors: --color-coral, --color-coral-dark,
           --color-note-yellow, --color-note-blue
   ────────────────────────────────────────────────────────────── */
export default function NotebookIllo() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Lab notebook illustration"
      role="img"
    >
      {/* ── Notebook body ────────────────────────────────── */}
      <rect x="18" y="14" width="56" height="72" rx="4"
            fill="#FFF9C4" stroke="#E46757" strokeWidth="1.8"
            strokeLinejoin="round"/>

      {/* Spine binding — coral stripe on left */}
      <rect x="18" y="14" width="10" height="72" rx="4"
            fill="#E46757" opacity="0.15" stroke="#E46757" strokeWidth="1.4"/>

      {/* Binding holes */}
      <circle cx="23" cy="30" r="2" stroke="#E46757" strokeWidth="1.4"/>
      <circle cx="23" cy="50" r="2" stroke="#E46757" strokeWidth="1.4"/>
      <circle cx="23" cy="70" r="2" stroke="#E46757" strokeWidth="1.4"/>

      {/* ── Page lines ───────────────────────────────────── */}
      <line x1="33" y1="30" x2="66" y2="30" stroke="#E46757" strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <line x1="33" y1="38" x2="66" y2="38" stroke="#E46757" strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <line x1="33" y1="46" x2="66" y2="46" stroke="#E46757" strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <line x1="33" y1="54" x2="55" y2="54" stroke="#E46757" strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>

      {/* Short "done" check on line 1 */}
      <circle cx="30" cy="30" r="2.5" fill="#E46757"/>
      <path d="M28.8 30 L30 31.3 L31.6 28.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>

      <circle cx="30" cy="38" r="2.5" fill="#E46757"/>
      <path d="M28.8 38 L30 39.3 L31.6 37" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Pending circle */}
      <circle cx="30" cy="46" r="2.5" stroke="#E46757" strokeWidth="1.4"/>
      <circle cx="30" cy="54" r="2.5" stroke="#E46757" strokeWidth="1.4"/>

      {/* ── Sticky note (overlapping corner, rotated slightly) */}
      <g transform="rotate(-8, 66, 62)">
        <rect x="54" y="54" width="24" height="22" rx="2"
              fill="#DDEEFF" stroke="#E46757" strokeWidth="1.6"
              strokeLinejoin="round"/>
        <line x1="57" y1="61" x2="75" y2="61" stroke="#E46757" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <line x1="57" y1="66" x2="72" y2="66" stroke="#E46757" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <line x1="57" y1="71" x2="70" y2="71" stroke="#E46757" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      </g>

      {/* ── Corner fold at bottom-right ───────────────────── */}
      <path d="M70 82 L74 86 L70 86 Z"
            fill="#E46757" opacity="0.3" stroke="#E46757" strokeWidth="1"/>
    </svg>
  )
}
