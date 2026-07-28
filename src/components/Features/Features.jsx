import { useState } from 'react'
import { Link } from 'react-router-dom'
import featuresSrc from '../../assets/features.svg?url'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import s from './Features.module.css'
import btn from '../../styles/buttons.module.css'
import anim from '../../styles/animations.module.css'

const workflow = [
  {
    step: '01',
    title: 'Start an experiment',
    desc: 'Open a fresh notebook page and name what you’re exploring.',
  },
  {
    step: '02',
    title: 'Write the protocol',
    desc: 'Log each step with timestamps — structured, searchable, never lost.',
  },
  {
    step: '03',
    title: 'Ask your AI companion',
    desc: 'Summarise results, explain formulas, generate flashcards in place.',
  },
  {
    step: '04',
    title: 'Share the notebook',
    desc: 'Invite your lab. Every finding builds on the last.',
  },
]

function WorkflowStep({ step, title, desc, index, isLast }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.12, rootMargin: '-40px' })

  return (
    <li
      ref={ref}
      className={`${s.workflowStep} ${isVisible ? anim.revealVisible : anim.reveal}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span className={s.stepNum}>{step}</span>
      <div className={s.stepBody}>
        <h3 className={s.stepTitle}>{title}</h3>
        <p className={s.stepDesc}>{desc}</p>
      </div>
      {!isLast && <span className={s.stepArrow} aria-hidden="true">↓</span>}
    </li>
  )
}

export default function FeaturesSection() {
  const eyebrow = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  const heading = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  const illo = useScrollReveal({ threshold: 0.08, rootMargin: '-40px' })
  const cta = useScrollReveal({ threshold: 0.3, rootMargin: '-50px' })

  return (
    <section className={s.section} id="features" aria-labelledby="features-heading">
      {/* Features: illustration LEFT, text RIGHT */}
      <div className={s.inner}>
        {/* Floating image illustration */}
        <div
          ref={illo.ref}
          className={s.illoWrap}
          aria-hidden="true"
        >
          <img src={featuresSrc} alt="Scientist using microscope in laboratory" className={s.illoSvg} draggable="false" />
        </div>

        <div className={s.left}>
          <p
            ref={eyebrow.ref}
            className={`${s.eyebrow} ${eyebrow.isVisible ? anim.revealVisible : anim.reveal}`}
          >
            <span className={s.eyebrowLine} aria-hidden="true" />
            How it works
          </p>

          <h2
            ref={heading.ref}
            className={`${s.heading} ${heading.isVisible ? anim.revealVisible : anim.reveal}`}
            id="features-heading"
            style={{ animationDelay: '80ms' }}
          >
            <span className={s.headingLine}>Built for</span>
            <span className={s.headingLine}>curious</span>
            <span className={`${s.headingLine} ${s.headingAccent}`}>minds.</span>
          </h2>

          <ol className={s.workflowList}>
            {workflow.map((item, i) => (
              <WorkflowStep key={item.step} {...item} index={i} isLast={i === workflow.length - 1} />
            ))}
          </ol>

          <div
            ref={cta.ref}
            className={`${s.ctaWrap} ${cta.isVisible ? anim.revealVisible : anim.reveal}`}
            style={{ animationDelay: '200ms' }}
          >
            <Link to="/register" className={btn.primary}>
              Open your notebook
              <span className={btn.primaryArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Thin ruled divider — notebook page edge */}
      <div className={s.sectionDivider} aria-hidden="true" />
    </section>
  )
}
