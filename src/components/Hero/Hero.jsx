import { useRef, useCallback } from 'react'
import Scientists from '../../assets/scientists.svg?react'
import s from './Hero.module.css'

function CurvedHeadline() {
  return (
    <svg
      className={s.curvedText}
      viewBox="0 0 600 130"
      aria-label="Organise your experiments"
      role="img"
      overflow="visible"
    >
      <defs>
        <path id="curve" d="M 10,110 Q 300,-35 590,110" />
      </defs>
      <text className={s.curvedTextEl}>
        <textPath href="#curve" startOffset="50%" textAnchor="middle">
          Organise your experiments
        </textPath>
      </text>
    </svg>
  )
}

function CheckItem({ done, children }) {
  return (
    <li className={s.noteItem}>
      <span
        className={`${s.noteCheck} ${done ? s.noteCheckDone : s.noteCheckPending}`}
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  )
}

/* ── Draggable wrapper ── */
function DraggableNote({ className, baseRotation, children, ...rest }) {
  const ref = useRef(null)
  // persisted position across multiple drags
  const pos = useRef({ x: 0, y: 0 })
  const drag = useRef({ active: false, startX: 0, startY: 0 })

  const applyTransform = useCallback((x, y) => {
    ref.current.style.transform = `rotate(${baseRotation}) translate(${x}px, ${y}px)`
  }, [baseRotation])

  const onPointerDown = useCallback((e) => {
    if (e.button !== 0) return
    drag.current = { active: true, startX: e.clientX, startY: e.clientY }
    const el = ref.current
    el.setPointerCapture(e.pointerId)
    el.style.cursor = 'grabbing'
    el.style.zIndex = 100
    el.style.animationPlayState = 'paused'
    e.preventDefault()
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    applyTransform(pos.current.x + dx, pos.current.y + dy)
  }, [applyTransform])

  const onPointerUp = useCallback((e) => {
    if (!drag.current.active) return
    // commit final position
    pos.current.x += e.clientX - drag.current.startX
    pos.current.y += e.clientY - drag.current.startY
    drag.current.active = false
    ref.current.style.cursor = 'grab'
    ref.current.style.zIndex = ''
    ref.current.style.animationPlayState = 'running'
  }, [])

  return (
    <aside
      ref={ref}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ cursor: 'grab', touchAction: 'none' }}
      {...rest}
    >
      {children}
    </aside>
  )
}

export default function Hero() {
  return (
    <header className={s.hero}>
      <div className={s.heroInner}>

        <nav
          className={`${s.nav} ${s.animated} ${s.delayNav}`}
          aria-label="Primary navigation"
        >
          <ul className={s.navLinks} role="list">
            {['Home', 'Features', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className={s.navLink}>{item}</a>
              </li>
            ))}
          </ul>

          <a href="/" className={s.navLogo} aria-label="note-Lab home">
            note <span className={s.navLogoDash}>–</span> Lab
          </a>

          <div className={s.navActions}>
            <a href="#login" className={s.navBtn}>Login</a>
            <a href="#register" className={`${s.navBtn} ${s.navBtnPrimary}`}>Register</a>
          </div>
        </nav>

        <div className={s.content}>
          <div className={`${s.animated} ${s.delayLogo}`}>
            <CurvedHeadline />
          </div>

          <p className={`${s.subline} ${s.animated} ${s.delaySub}`}>
            <span className={s.typewriter} aria-hidden="true">
              Log protocols, track results, and collaborate with your lab — all in one place.
            </span>
          </p>

          <div className={`${s.ctaGroup} ${s.animated} ${s.delayCta}`}>
            <div className={s.ctaRow}>
              <a
                href="#get-started"
                className={s.cta}
                aria-label="Start your first experiment with note-Lab"
              >
                Start your first experiment
                <span className={s.ctaArrow} aria-hidden="true">→</span>
              </a>
              <a href="#how-it-works" className={s.ctaSecondary}>
                See how it works
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className={s.ctaReassurance}>Free to start · No credit card required</p>
          </div>
        </div>

        {/* Separator between copy and illustration */}
        <div className={s.separator} aria-hidden="true" />

        <div className={s.stage}>
          <DraggableNote
            className={`${s.note} ${s.noteYellow} ${s.noteLeft}`}
            baseRotation="-6deg"
            aria-label="Experiment note"
          >
            <p className={s.noteTitle}>Experiment #4</p>
            <ul className={s.noteBody}>
              <CheckItem done>Prepare solution A &amp; B</CheckItem>
              <CheckItem done>Record baseline pH</CheckItem>
              <CheckItem>Mix at 37°C for 20 min</CheckItem>
              <CheckItem>Document colour change</CheckItem>
            </ul>
            <p className={s.noteDate}>14 Jun 2025</p>
          </DraggableNote>

          <div className={`${s.illustrationWrap} ${s.animated} ${s.delayIllo}`}>
            <div className={s.floatWrap}>
              <Scientists aria-hidden="true" focusable="false" />
            </div>
          </div>

          <DraggableNote
            className={`${s.note} ${s.noteBlue} ${s.noteRight}`}
            baseRotation="5deg"
            aria-label="Observations note"
          >
            <p className={s.noteTitle}>Observations</p>
            <ul className={s.noteBody}>
              <CheckItem done>pH drop from 7.4 → 5.1</CheckItem>
              <CheckItem done>Precipitate at 12 min</CheckItem>
              <CheckItem>Repeat with control group</CheckItem>
            </ul>
            <p className={s.noteDate}>14 Jun 2025 · Dr. Lena</p>
          </DraggableNote>
        </div>

      </div>

      {/* Wave divider — coral → beige transition */}
      <svg
        className={s.waveDivider}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* organic wave: top edge is coral (transparent — hero bg shows), bottom fills beige */}
        <path
          d="M0,0 C180,72 360,20 540,44 C720,68 900,16 1080,38 C1260,60 1380,28 1440,36 L1440,72 L0,72 Z"
          fill="#E8E2D9"
        />
      </svg>
    </header>
  )
}
