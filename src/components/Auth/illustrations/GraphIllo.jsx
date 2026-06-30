/* ──────────────────────────────────────────────────────────────
   GraphIllo — flat line-art bar chart with a line graph overlay.
   Colors: --color-coral, --color-coral-dark,
           --color-note-yellow, --color-note-blue
   ────────────────────────────────────────────────────────────── */
export default function GraphIllo() {
  /* Bar chart data: [x-center, bar-height] pairs.
     All bars anchor at baseline y=78, grow upward.           */
  const bars = [
    { x: 26, h: 28, color: '#E46757' },
    { x: 39, h: 42, color: '#C94A3C' },
    { x: 52, h: 22, color: '#E46757' },
    { x: 65, h: 36, color: '#C94A3C' },
    { x: 78, h: 18, color: '#E46757' },
  ]
  const baseline = 78
  const barW = 10

  /* Line graph overlay — connects midpoints of bar tops */
  const linePoints = bars
    .map(b => `${b.x},${baseline - b.h}`)
    .join(' ')

  return (
    <svg
      width="240"
      height="200"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Graph illustration"
      role="img"
    >
      {/* ── Axis lines ─────────────────────────────────────── */}
      {/* Y-axis */}
      <line x1="18" y1="14" x2="18" y2="80"
            stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>
      {/* X-axis */}
      <line x1="18" y1="80" x2="86" y2="80"
            stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>

      {/* Y-axis tick marks */}
      {[80, 65, 50, 35, 20].map(y => (
        <line key={y}
              x1="15" y1={y} x2="18" y2={y}
              stroke="#E46757" strokeWidth="1.2" strokeLinecap="round"/>
      ))}

      {/* Horizontal grid lines — subtle */}
      {[65, 50, 35, 20].map(y => (
        <line key={`g${y}`}
              x1="18" y1={y} x2="86" y2={y}
              stroke="#E46757" strokeWidth="0.8" opacity="0.2"
              strokeDasharray="3 3"/>
      ))}

      {/* ── Bar chart ──────────────────────────────────────── */}
      {bars.map(({ x, h, color }) => (
        <rect
          key={x}
          x={x - barW / 2}
          y={baseline - h}
          width={barW}
          height={h}
          rx="2"
          fill={color}
          opacity="0.82"
        />
      ))}

      {/* Bar value caps — flat top stroke */}
      {bars.map(({ x, h }) => (
        <line
          key={`cap-${x}`}
          x1={x - barW / 2 + 1}
          y1={baseline - h}
          x2={x + barW / 2 - 1}
          y2={baseline - h}
          stroke="#FFF9C4"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ))}

      {/* ── Line graph overlay ─────────────────────────────── */}
      <polyline
        points={linePoints}
        stroke="#DDEEFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Data point dots on the line */}
      {bars.map(({ x, h }) => (
        <circle
          key={`pt-${x}`}
          cx={x}
          cy={baseline - h}
          r="2.5"
          fill="#DDEEFF"
          stroke="#E46757"
          strokeWidth="1.2"
        />
      ))}

      {/* ── X-axis labels — abstract tick marks ───────────── */}
      {bars.map(({ x }) => (
        <line
          key={`xt-${x}`}
          x1={x} y1="80"
          x2={x} y2="83"
          stroke="#E46757" strokeWidth="1.2" strokeLinecap="round"
        />
      ))}

      {/* Upward trend arrow on line end */}
      <path
        d="M78 42 L80 38 L82 42"
        stroke="#DDEEFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
