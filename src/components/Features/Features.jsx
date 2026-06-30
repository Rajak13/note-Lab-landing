import FeaturesSvg from '../../assets/features.svg?react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import s from './Features.module.css'
import btn from '../../styles/buttons.module.css'
import anim from '../../styles/animations.module.css'

/* ── Inline SVG icons (simple, lab-themed) ── */
function IconLog() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="20" rx="2" stroke="#E46757" strokeWidth="1.8"/>
      <line x1="8" y1="9"  x2="16" y2="9"  stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="8" y1="17" x2="13" y2="17" stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="21" cy="21" r="5" fill="#E46757"/>
      <line x1="21" y1="18.5" x2="21" y2="23.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="18.5" y1="21" x2="23.5" y2="21" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function IconProtocol() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="10" height="13" rx="1.5" stroke="#E46757" strokeWidth="1.8"/>
      <rect x="15" y="5" width="10" height="13" rx="1.5" stroke="#E46757" strokeWidth="1.8"/>
      <line x1="5" y1="9"  x2="11" y2="9"  stroke="#E46757" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="11" y2="12" stroke="#E46757" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="17" y1="9"  x2="23" y2="9"  stroke="#E46757" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="17" y1="12" x2="23" y2="12" stroke="#E46757" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8"  y1="21" x2="20" y2="21" stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="14" y1="18" x2="14" y2="21" stroke="#E46757" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function IconAI() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="22" height="13" rx="3" stroke="#E46757" strokeWidth="1.8"/>
      <circle cx="9"  cy="12.5" r="1.5" fill="#E46757"/>
      <circle cx="14" cy="12.5" r="1.5" fill="#E46757"/>
      <circle cx="19" cy="12.5" r="1.5" fill="#E46757"/>
      <path d="M10 19 L8 23" stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M18 19 L20 23" stroke="#E46757" strokeWidth="1.6" strokeLinecap="round"/>
      {/* sparkle */}
      <path d="M23 3 L23.6 5 L25.6 5.6 L23.6 6.2 L23 8.2 L22.4 6.2 L20.4 5.6 L22.4 5Z" fill="#E46757"/>
    </svg>
  )
}

function IconTeam() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="10" cy="9"  r="3.5" stroke="#E46757" strokeWidth="1.8"/>
      <circle cx="20" cy="9"  r="3.5" stroke="#E46757" strokeWidth="1.8"/>
      <path d="M3 22 C3 18 6.5 15.5 10 15.5 C13.5 15.5 17 18 17 22" stroke="#E46757" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M17 17 C17.8 16 19.2 15.5 20 15.5 C23.5 15.5 25 17.5 25 20" stroke="#E46757" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

const features = [
  {
    num: '01',
    icon: <IconLog />,
    title: 'Experiment Logs',
    desc: 'Record every step of your experiments with structured, searchable logs and timestamps.',
    side: 'left',
  },
  {
    num: '02',
    icon: <IconProtocol />,
    title: 'Protocol Libraries',
    desc: 'Build and share reusable protocol templates across your entire research team.',
    side: 'right',
  },
  {
    num: '03',
    icon: <IconAI />,
    title: 'AI Chat Panel',
    desc: 'Ask questions about your data, get summaries, and surface insights instantly.',
    side: 'left',
  },
  {
    num: '04',
    icon: <IconTeam />,
    title: 'Team Views',
    desc: 'See what your collaborators are working on with shared dashboards and live activity.',
    side: 'right',
  },
]

function Card({ num, icon, title, desc, accent }) {
  return (
    <article className={`${s.card} ${accent ? s.cardAccent : ''}`}>
      <span className={`${s.badge} ${accent ? s.badgeAccent : ''}`}>{num}.</span>
      <div className={`${s.iconWrap} ${accent ? s.iconWrapAccent : ''}`}>
        {icon}
      </div>
      <h3 className={`${s.cardTitle} ${accent ? s.cardTitleAccent : ''}`}>{title}</h3>
      <p  className={`${s.cardDesc}  ${accent ? s.cardDescAccent  : ''}`}>{desc}</p>
    </article>
  )
}

/* Wrapper that owns the reveal ref + stagger delay for each card */
function RevealCard({ feature, accent, staggerIndex }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  return (
    <div
      ref={ref}
      className={isVisible ? anim.revealVisible : anim.reveal}
      style={{ animationDelay: `${staggerIndex * 80}ms` }}
    >
      <Card {...feature} accent={accent} />
    </div>
  )
}

export default function FeaturesSection() {
  const heading  = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  const illo     = useScrollReveal({ threshold: 0.1,  rootMargin: '-50px' })
  const cta      = useScrollReveal({ threshold: 0.3,  rootMargin: '-50px' })

  // Ordered stagger: 01 (left), 02 (right), 03 (left), 04 (right)
  const leftFeatures  = features.filter(f => f.side === 'left')   // 01, 03
  const rightFeatures = features.filter(f => f.side === 'right')  // 02, 04

  return (
    <section className={s.section} id="features" aria-labelledby="features-heading">

      {/* main stage */}
      <div className={s.stage}>

        {/* left cards — stagger indices 0 and 2 */}
        <div className={s.colLeft}>
          {leftFeatures.map((f, i) => (
            <RevealCard key={f.num} feature={f} accent={i === 1} staggerIndex={i * 2} />
          ))}
        </div>

        {/* centre: heading + illustration */}
        <div className={s.centre}>
          <p className={s.eyebrow}>
            <span aria-hidden="true" className={s.eyebrowDot} />
            What we offer
          </p>
          <h2
            ref={heading.ref}
            className={`${s.heading} ${heading.isVisible ? anim.revealVisible : anim.reveal}`}
            id="features-heading"
          >
            <span className={s.line}>OUR</span>
            <span className={s.line}>FEATURES</span>
          </h2>
          <div
            ref={illo.ref}
            className={`${s.illoWrap} ${illo.isVisible ? anim.revealVisible : anim.reveal}`}
            style={{ animationDelay: '160ms' }}
            aria-hidden="true"
          >
            <FeaturesSvg focusable="false" />
          </div>
        </div>

        {/* right cards — stagger indices 1 and 3 */}
        <div className={s.colRight}>
          {rightFeatures.map((f, i) => (
            <RevealCard key={f.num} feature={f} accent={i === 0} staggerIndex={i * 2 + 1} />
          ))}
        </div>

      </div>

      {/* CTA */}
      <div
        ref={cta.ref}
        className={`${s.ctaWrap} ${cta.isVisible ? anim.revealVisible : anim.reveal}`}
        style={{ animationDelay: '320ms' }}
      >
        <a href="#about" className={`${btn.outlined} ${btn.onLight}`}>
          See all features
          <span aria-hidden="true"> →</span>
        </a>
      </div>

      {/* Bottom wave divider */}
      <svg
        className={s.waveBottom}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,40 C240,80 480,0 720,32 C960,64 1200,10 1440,40"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2.5"
        />
        <path
          d="M0,40 C240,80 480,0 720,32 C960,64 1200,10 1440,40 L1440,80 L0,80 Z"
          fill="var(--color-coral)"
        />
      </svg>

    </section>
  )
}
