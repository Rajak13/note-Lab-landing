import contactSrc from '../../assets/contact.svg?url'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import s from './Contact.module.css'
import anim from '../../styles/animations.module.css'

function IconGlobe() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 12h18M12 3c2.5 2.8 4 6.1 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6.1-4 9s1.5 6.2 4 9"
        stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}

const contactItems = [
  {
    icon: <IconGlobe />,
    label: 'portfolio-razzaq.vercel.app',
    href: 'https://portfolio-razzaq.vercel.app',
  },
  {
    icon: <IconMail />,
    label: 'abdul.razzaq.01013@gmail.com',
    href: 'mailto:abdul.razzaq.01013@gmail.com',
  },
]

function RevealItem({ icon, label, href, index }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  return (
    <li
      ref={ref}
      className={`${s.item} ${isVisible ? anim.revealVisible : anim.reveal}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className={s.itemIcon}>{icon}</span>
      <a
        href={href}
        className={s.itemLink}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {label}
      </a>
    </li>
  )
}

export default function ContactSection() {
  const illo    = useScrollReveal({ threshold: 0.08, rootMargin: '-40px' })
  const eyebrow = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  const heading = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  const sign    = useScrollReveal({ threshold: 0.2,  rootMargin: '-50px' })
  const footer  = useScrollReveal({ threshold: 0.2,  rootMargin: '-50px' })

  return (
    <>
      <section className={s.section} id="contact" aria-labelledby="contact-heading">
        <div className={s.inner}>

          {/* ── Left: illustration ── */}
          <div
            ref={illo.ref}
            className={s.illoWrap}
            aria-hidden="true"
          >
          <img src={contactSrc} alt="" className={s.illoSvg} draggable="false" />
          </div>

          {/* ── Right: notebook closing page ── */}
          <div className={s.content}>

            <p
              ref={eyebrow.ref}
              className={`${s.eyebrow} ${eyebrow.isVisible ? anim.revealVisible : anim.reveal}`}
            >
              <span className={s.eyebrowLine} aria-hidden="true" />
              Final page
            </p>

            <h2
              ref={heading.ref}
              className={`${s.heading} ${heading.isVisible ? anim.revealVisible : anim.reveal}`}
              id="contact-heading"
              style={{ animationDelay: '80ms' }}
            >
              <span className={s.headingLine}>Thanks for</span>
              <span className={`${s.headingLine} ${s.headingAccent}`}>visiting.</span>
            </h2>

            <p className={s.closingLine}>
              Let&apos;s build better science together.
            </p>

            {/* Ruled line — notebook page feel */}
            <div className={s.ruledLine} aria-hidden="true" />

            <ul className={s.list} role="list">
              {contactItems.map(({ icon, label, href }, i) => (
                <RevealItem key={label} icon={icon} label={label} href={href} index={i} />
              ))}
            </ul>

            {/* Handwritten sign-off */}
            <p
              ref={sign.ref}
              className={`${s.signOff} ${sign.isVisible ? anim.revealVisible : anim.reveal}`}
              style={{ animationDelay: '200ms' }}
            >
              signed,
              <br />
              The NoteLab team
            </p>

          </div>
        </div>
      </section>

      {/* Footer — dark strip, same restrained branding as nav logo */}
      <footer
        ref={footer.ref}
        className={`${s.footer} ${footer.isVisible ? anim.revealVisible : anim.reveal}`}
      >
        <span className={s.footerBrand}>
          note <span className={s.footerDash}>–</span> Lab
        </span>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.8125rem' }}>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms of Service</Link>
        </div>
        <span className={s.footerCopy}>© 2026 Abdul Razzaq Ansari</span>
      </footer>
    </>
  )
}
