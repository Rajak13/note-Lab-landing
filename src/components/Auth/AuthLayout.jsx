import s from './AuthLayout.module.css'

/**
 * AuthLayout — full-viewport split-screen auth shell.
 *
 * Props:
 *   children          — form content inside the white card
 *   illustrationSlots — array of up to 6 React nodes for the grid
 *   flipped           — when true, card is on the RIGHT, panel on the LEFT
 *   switching         — when true, applies the mid-transition fade-out
 *                       (set briefly by the parent during the mode change)
 */
export default function AuthLayout({
  children,
  illustrationSlots = [],
  flipped    = false,
  switching  = false,
}) {
  const cells = Array.from({ length: 6 }, (_, i) => illustrationSlots[i] ?? null)

  const innerClass = [
    s.inner,
    flipped   ? s.flipped   : '',
    switching ? s.switching : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={s.frame} role="main">
      <div className={innerClass}>

        {/* Form card */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.logo} aria-label="note-Lab">
              note<span className={s.logoDash}>–</span>Lab
            </span>
          </div>
          {children}
        </div>

        {/* Illustration panel */}
        <aside className={s.panel} aria-hidden="true">
          <div className={s.grid}>
            {cells.map((node, i) => (
              <div key={i} className={s.cell}>
                {node}
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  )
}
