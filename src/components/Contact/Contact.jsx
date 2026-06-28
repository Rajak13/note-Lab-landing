import ContactSvg from '../../assets/contact.svg?react'
import s from './Contact.module.css'

function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 12h18M12 3c2.5 2.8 4 6.1 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6.1-4 9s1.5 6.2 4 9" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 4h3l1.5 4-2 1.5c1 2.2 2.8 4 5 5L15.5 13 19.5 14.5V18c0 .55-.45 1-1 1C10.3 19 5 13.7 5 6.5c0-.55.45-1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
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
    icon: <IconPin />,
    label: 'Dharan-1, Sunsari, Nepal',
  },
  {
    icon: <IconGlobe />,
    label: 'portfolio-razzaq',
    href: 'https://portfolio-razzaq.vercel.app',
  },
  {
    icon: <IconClock />,
    label: 'Monday to Friday',
  },
  {
    icon: <IconPhone />,
    label: '9827310498',
    href: 'tel:+9779827310498',
  },
  {
    icon: <IconMail />,
    label: 'abdul.razzaq.01013@gmail.com',
    href: 'mailto:abdul.razzaq.01013@gmail.com',
  },
]

export default function ContactSection() {
  return (
    <>
      <section className={s.section} id="contact" aria-labelledby="contact-heading">
        <div className={s.inner}>
          <div className={s.illoWrap} aria-hidden="true">
            <ContactSvg focusable="false" className={s.illoSvg} />
          </div>

          <div className={s.content}>
            <p className={s.eyebrow}>note – Lab</p>

            <h2 className={s.heading} id="contact-heading">
              <span className={s.headingLine}>CONTACT</span>
              <span className={s.headingLine}>US</span>
            </h2>

            <ul className={s.list} role="list">
              {contactItems.map(({ icon, label, href }) => (
                <li key={label} className={s.item}>
                  <span className={s.itemIcon}>{icon}</span>
                  {href ? (
                    <a href={href} className={s.itemLink} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {label}
                    </a>
                  ) : (
                    <span className={s.itemText}>{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <span className={s.footerBrand}>note – Lab</span>
        <span className={s.footerCopy}>© 2026 Created by Abdul Razzaq Ansari</span>
      </footer>
    </>
  )
}
