import ContactSvg from '../../assets/contact.svg?react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import s from './Contact.module.css'
import anim from '../../styles/animations.module.css'

function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 12h18M12 3c2.5 2.8 4 6.1 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6.1-4 9s1.5 6.2 4 9" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}

const contactItems = [
  {
    icon: <IconGlobe />,
    label: 'portfolio-razzaq',
    href: 'https://portfolio-razzaq.vercel.app',
  },
  {
    icon: <IconMail />,
    label: 'abdul.razzaq.01013@gmail.com',
    href: 'mailto:abdul.razzaq.01013@gmail.com',
  },
]

/* Each contact list item gets its own observer + stagger delay */
function RevealListItem({ icon, label, href, staggerIndex }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  return (
    <li
      ref={ref}
      className={`${s.item} ${isVisible ? anim.revealVisible : anim.reveal}`}
      style={{ animationDelay: `${staggerIndex * 80}ms` }}
    >
      <span className={s.itemIcon}>{icon}</span>
      {href ? (
        <a
          href={href}
          className={s.itemLink}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {label}
        </a>
      ) : (
        <span className={s.itemText}>{label}</span>
      )}
    </li>
  )
}

export default function ContactSection() {
  const illo    = useScrollReveal({ threshold: 0.1,  rootMargin: '-50px' })
  const heading = useScrollReveal({ threshold: 0.15, rootMargin: '-50px' })
  const footer  = useScrollReveal({ threshold: 0.2,  rootMargin: '-50px' })

  return (
    <>
      <section className={s.section} id="contact" aria-labelledby="contact-heading">
        <div className={s.inner}>

          {/* Illustration */}
          <div
            ref={illo.ref}
            className={`${s.illoWrap} ${illo.isVisible ? anim.revealVisible : anim.reveal}`}
            aria-hidden="true"
          >
            <ContactSvg focusable="false" className={s.illoSvg} />
          </div>

          <div className={s.content}>
            <h2
              ref={heading.ref}
              className={`${s.heading} ${heading.isVisible ? anim.revealVisible : anim.reveal}`}
              id="contact-heading"
            >
              <span className={s.headingLine}>CONTACT</span>
              <span className={s.headingLine}>US</span>
            </h2>

            {/* Each list item reveals individually with 80 ms stagger */}
            <ul className={s.list} role="list">
              {contactItems.map(({ icon, label, href }, i) => (
                <RevealListItem
                  key={label}
                  icon={icon}
                  label={label}
                  href={href}
                  staggerIndex={i}
                />
              ))}
            </ul>
          </div>

        </div>
      </section>

      <footer
        ref={footer.ref}
        className={`${s.footer} ${footer.isVisible ? anim.revealVisible : anim.reveal}`}
      >
        <span className={s.footerBrand}>note – Lab</span>
        <span className={s.footerCopy}>© 2026 Created by Abdul Razzaq Ansari</span>
      </footer>
    </>
  )
}
