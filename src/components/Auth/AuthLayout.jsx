import s from './AuthLayout.module.css'
import loginSrc from '../../assets/login.svg?url'
import registerSrc from '../../assets/register.svg?url'

export default function AuthLayout({
  children,
  mode = 'login',
  flipped    = false,
  switching  = false,
}) {
  const innerClass = [
    s.inner,
    flipped   ? s.flipped   : '',
    switching ? s.switching : '',
  ].filter(Boolean).join(' ')

  const illustrationSrc = mode === 'register' ? registerSrc : loginSrc
  const illustrationAlt = mode === 'register' ? 'NoteLab registration illustration' : 'NoteLab login illustration'

  return (
    <div className={s.frame} role="main">
      <div className={innerClass}>

        {/* Form card */}
        <div className={s.card}>
          <div className={s.binderHoles} aria-hidden="true">
            <span className={s.binderHole} />
            <span className={s.binderHole} />
            <span className={s.binderHole} />
            <span className={s.binderHole} />
            <span className={s.binderHole} />
          </div>

          <div className={s.cardHeader}>
            <span className={s.logo} aria-label="note-Lab">
              note<span className={s.logoDash}>–</span>Lab
            </span>
          </div>
          {children}
        </div>

        {/* Illustration Panel featuring login.svg / register.svg */}
        <aside className={s.panel} aria-hidden="true">
          <div className={s.panelSvgWrap}>
            <img
              src={illustrationSrc}
              alt={illustrationAlt}
              className={s.panelSvg}
              draggable="false"
            />
          </div>
        </aside>

      </div>
    </div>
  )
}
