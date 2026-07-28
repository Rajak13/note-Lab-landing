/* ──────────────────────────────────────────────────────────────
   HelixIllo — simplified double-helix DNA strand.
   Two sinusoidal strands with rung connectors.
   Colors: --color-coral, --color-coral-dark, --color-note-blue
   ────────────────────────────────────────────────────────────── */
export default function HelixIllo() {
  /*
   * Build helix rungs at regular vertical intervals.
   * Strand A peaks left, Strand B peaks right (opposite phase).
   * At each rung level we connect the two strands with a line.
   *
   * SVG viewBox: 0 0 100 100
   * Strand A: cubic bezier S-curve (left-peaking)
   * Strand B: cubic bezier S-curve (right-peaking, 180° phase offset)
   */

  /* Pre-computed rung connection points (x1, y, x2) at 7 levels */
  const rungs = [
    { y: 14, x1: 36, x2: 64 },
    { y: 24, x1: 52, x2: 48 },
    { y: 34, x1: 64, x2: 36 },
    { y: 50, x1: 50, x2: 50 }, // midpoint crossover
    { y: 66, x1: 36, x2: 64 },
    { y: 76, x1: 52, x2: 48 },
    { y: 86, x1: 64, x2: 36 },
  ]

  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 100 100"
      fill="none"
      aria-label="DNA helix illustration"
      role="img"
    >
      {/* Strand A — left-winding */}
      <path
        d="M50 10
           C30 18 70 30 50 42
           C30 54 70 66 50 78
           C40 84 44 90 50 90"
        stroke="#E46757"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Strand B — right-winding (mirror) */}
      <path
        d="M50 10
           C70 18 30 30 50 42
           C70 54 30 66 50 78
           C60 84 56 90 50 90"
        stroke="#C94A3C"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Rung connectors */}
      {rungs.map(({ y, x1, x2 }) => (
        <line
          key={y}
          x1={x1} y1={y}
          x2={x2} y2={y}
          stroke="#DDEEFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ))}

      {/* Base-pair end dots — alternating colors for visual rhythm */}
      {rungs.map(({ y, x1, x2 }, i) => (
        <g key={`dots-${y}`}>
          <circle cx={x1} cy={y} r="2.2"
                  fill={i % 2 === 0 ? '#E46757' : '#FFF9C4'}
                  stroke={i % 2 === 0 ? '#C94A3C' : '#E46757'}
                  strokeWidth="1"
          />
          <circle cx={x2} cy={y} r="2.2"
                  fill={i % 2 === 0 ? '#DDEEFF' : '#E46757'}
                  stroke="#C94A3C"
                  strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  )
}
