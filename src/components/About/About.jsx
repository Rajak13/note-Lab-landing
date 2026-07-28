import { useScrollReveal } from '../../hooks/useScrollReveal'
import builtSrc from '../../assets/built.svg?url'
import s from './About.module.css'
import btn from '../../styles/buttons.module.css'
import anim from '../../styles/animations.module.css'

export default function AboutSection() {
  const eyebrow = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  const heading = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  const story = useScrollReveal({ threshold: 0.12, rootMargin: '-40px' })
  const illo = useScrollReveal({ threshold: 0.08, rootMargin: '-40px' })
  const cta = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })

  return (
    <section className={s.section} id="about" aria-labelledby="about-heading">
      <div className={s.inner}>
        <div className={s.left}>
          <p
            ref={eyebrow.ref}
            className={`${s.eyebrow} ${eyebrow.isVisible ? anim.revealVisible : anim.reveal}`}
          >
            <span className={s.eyebrowLine} aria-hidden="true" />
            Research journal
          </p>

          <h2
            ref={heading.ref}
            className={`${s.heading} ${heading.isVisible ? anim.revealVisible : anim.reveal}`}
            id="about-heading"
            style={{ animationDelay: '80ms' }}
          >
            <span className={s.headingLine}>Why we</span>
            <span className={`${s.headingLine} ${s.headingAccent}`}>built this.</span>
          </h2>

          <div className={s.ruledDivider} aria-hidden="true" />

          <div
            ref={story.ref}
            className={`${s.storyBlock} ${story.isVisible ? anim.revealVisible : anim.reveal}`}
          >
            <p className={s.storyLine}>Research is forgotten.</p>
            <p className={s.storyLine}>Experiments disappear.</p>
            <p className={s.storyLine}>Protocols stay in random folders.</p>
            <p className={s.storyLine}>Lab books get lost.</p>
            <p className={s.storyPayoff}>
              We built NoteLab because <em>science deserves memory.</em>
            </p>
          </div>

          <a
            ref={cta.ref}
            href="#contact"
            className={`${btn.ghost} ${cta.isVisible ? anim.revealVisible : anim.reveal}`}
            style={{ animationDelay: '280ms' }}
          >
            Get in touch <span aria-hidden="true">→</span>
          </a>
        </div>

        <div
          ref={illo.ref}
          className={s.illoWrap}
          aria-hidden="true"
        >
          <img src={builtSrc} alt="Why we built NoteLab illustration" className={s.illoSvg} draggable="false" />
        </div>
      </div>

    </section>
  )
}
