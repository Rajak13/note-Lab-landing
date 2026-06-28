import AboutSvg from '../../assets/about.svg?react'
import s from './About.module.css'

function IconMission() {
  return (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="11" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.7"/>
      <line x1="11" y1="2.5"  x2="11" y2="5.5"  stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="11" y1="16.5" x2="11" y2="19.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="2.5"  y1="11" x2="5.5"  y2="11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="16.5" y1="11" x2="19.5" y2="11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}

function IconVision() {
  return (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M1 11 C4 6 7.5 3.5 11 3.5 C14.5 3.5 18 6 21 11 C18 16 14.5 18.5 11 18.5 C7.5 18.5 4 16 1 11Z"
            stroke="currentColor" strokeWidth="1.7" fill="none"/>
      <circle cx="11" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="11" cy="11" r="1.2" fill="currentColor"/>
    </svg>
  )
}

function AboutCard({ num, icon, title, desc, accent }) {
  return (
    <article className={`${s.card} ${accent ? s.cardAccent : ''}`}>
      <span className={`${s.badge} ${accent ? s.badgeAccent : ''}`}>{num}</span>
      <div className={`${s.iconWrap} ${accent ? s.iconWrapAccent : ''}`}>{icon}</div>
      <h3 className={`${s.cardTitle} ${accent ? s.cardTitleAccent : ''}`}>{title}</h3>
      <p className={`${s.cardDesc} ${accent ? s.cardDescAccent : ''}`}>{desc}</p>
    </article>
  )
}

export default function AboutSection() {
  return (
    <section className={s.section} id="about" aria-labelledby="about-heading">
      <div className={s.inner}>
        <div className={s.left}>
          <p className={s.eyebrow}>note – Lab</p>

          <h2 className={s.heading} id="about-heading">
            <span className={s.headingLine}>ABOUT</span>
            <span className={s.headingLine}>US</span>
          </h2>

          <div className={s.cards}>
            <AboutCard
              num="01"
              icon={<IconMission />}
              title="Mission"
              desc="To organise research that addresses global scientific questions — making every experiment traceable, reproducible, and shareable."
            />
            <AboutCard
              num="02"
              icon={<IconVision />}
              title="Vision"
              desc="A world where no research goes to waste — where every discovery, no matter how small, builds on the last."
              accent
            />
          </div>
        </div>
      </div>

      <div className={s.illoWrap} aria-hidden="true">
        <AboutSvg focusable="false" className={s.illoSvg} />
      </div>

      <div className={s.bench} aria-hidden="true" />

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
          fill="#E8E2D9"
        />
      </svg>
    </section>
  )
}
