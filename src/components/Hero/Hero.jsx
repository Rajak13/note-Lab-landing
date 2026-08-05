import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import s from './Hero.module.css'
import btn from '../../styles/buttons.module.css'
import dashboardImg from '../../assets/dashboard.png'

/* ── Whiteboard SVG — back face of dashboard flip ── */
function Whiteboard() {
  return (
    <svg
      className={s.whiteboardSvg}
      viewBox="0 0 980 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NoteLab feature overview"
    >
      <rect width="980" height="520" rx="20" fill="#FFFEF9" />
      {Array.from({ length: 27 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 20} x2="980" y2={i * 20} stroke="rgba(228,103,87,0.07)" strokeWidth="1" />
      ))}
      {Array.from({ length: 50 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="520" stroke="rgba(228,103,87,0.07)" strokeWidth="1" />
      ))}
      <line x1="64" y1="0" x2="64" y2="520" stroke="rgba(228,103,87,0.25)" strokeWidth="1.5" />

      <text x="88" y="58" fontFamily="'Playfair Display',Georgia,serif" fontSize="34" fontWeight="700" fill="#2C2420" letterSpacing="-0.03em" className={s.wbTitle}>Everything your laboratory</text>
      <text x="88" y="98" fontFamily="'Playfair Display',Georgia,serif" fontSize="34" fontWeight="700" fill="#E46757" fontStyle="italic" letterSpacing="-0.03em" className={s.wbTitleAccent}>needs.</text>
      <line x1="88" y1="110" x2="620" y2="110" stroke="#E46757" strokeWidth="2" strokeDasharray="532" strokeDashoffset="532" className={s.wbUnderline} />

      <text x="88" y="160" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.12em" fill="#C94A3C" opacity="0.85" className={s.wbNum1}>01</text>
      <text x="120" y="160" fontFamily="'Playfair Display',Georgia,serif" fontSize="18" fontWeight="700" fill="#2C2420" className={s.wbFeature1Title}>Structured Experiment Logs</text>
      <line x1="120" y1="178" x2="440" y2="178" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="320" strokeDashoffset="320" className={s.wbLine1a} />
      <line x1="120" y1="194" x2="380" y2="194" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="260" strokeDashoffset="260" className={s.wbLine1b} />

      <text x="88" y="240" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.12em" fill="#C94A3C" opacity="0.85" className={s.wbNum2}>02</text>
      <text x="120" y="240" fontFamily="'Playfair Display',Georgia,serif" fontSize="18" fontWeight="700" fill="#2C2420" className={s.wbFeature2Title}>Centralized Protocol Libraries</text>
      <line x1="120" y1="258" x2="450" y2="258" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="330" strokeDashoffset="330" className={s.wbLine2a} />
      <line x1="120" y1="274" x2="390" y2="274" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="270" strokeDashoffset="270" className={s.wbLine2b} />

      <text x="88" y="320" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.12em" fill="#C94A3C" opacity="0.85" className={s.wbNum3}>03</text>
      <text x="120" y="320" fontFamily="'Playfair Display',Georgia,serif" fontSize="18" fontWeight="700" fill="#2C2420" className={s.wbFeature3Title}>AI Research Companion</text>
      <line x1="120" y1="338" x2="420" y2="338" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="300" className={s.wbLine3a} />
      <line x1="120" y1="354" x2="360" y2="354" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="240" strokeDashoffset="240" className={s.wbLine3b} />

      <text x="88" y="400" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.12em" fill="#C94A3C" opacity="0.85" className={s.wbNum4}>04</text>
      <text x="120" y="400" fontFamily="'Playfair Display',Georgia,serif" fontSize="18" fontWeight="700" fill="#2C2420" className={s.wbFeature4Title}>Real-time Team Workspace</text>
      <line x1="120" y1="418" x2="430" y2="418" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="310" strokeDashoffset="310" className={s.wbLine4a} />
      <line x1="120" y1="434" x2="370" y2="434" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="250" strokeDashoffset="250" className={s.wbLine4b} />

      <rect x="500" y="130" width="430" height="260" rx="12" fill="rgba(228,103,87,0.04)" stroke="rgba(228,103,87,0.16)" strokeWidth="1.5" strokeDasharray="5 4" className={s.wbFormulaBox} />
      <text x="715" y="180" textAnchor="middle" fontFamily="'Caveat',cursive" fontSize="24" fontWeight="600" fill="#E46757" className={s.wbFormula1}>ΔG = ΔH – TΔS</text>
      <text x="715" y="230" textAnchor="middle" fontFamily="'Caveat',cursive" fontSize="22" fill="#C94A3C" className={s.wbFormula2}>pH = –log[H⁺]</text>
      <text x="715" y="280" textAnchor="middle" fontFamily="'Caveat',cursive" fontSize="22" fill="#E46757" className={s.wbFormula3}>E = mc²</text>
      <text x="715" y="330" textAnchor="middle" fontFamily="'Caveat',cursive" fontSize="20" fill="#C94A3C" className={s.wbFormula4}>2H₂ + O₂ → 2H₂O</text>

      <circle cx="715" cy="430" r="8" fill="#E46757" opacity="0.6" className={s.wbAtomCore} />
      <ellipse cx="715" cy="430" rx="38" ry="14" stroke="#E46757" strokeWidth="1.6" opacity="0.4" strokeDasharray="100" strokeDashoffset="100" className={s.wbOrbit1} />
      <ellipse cx="715" cy="430" rx="38" ry="14" stroke="#E46757" strokeWidth="1.6" opacity="0.3" strokeDasharray="100" strokeDashoffset="100" transform="rotate(60 715 430)" className={s.wbOrbit2} />
      <ellipse cx="715" cy="430" rx="38" ry="14" stroke="#E46757" strokeWidth="1.6" opacity="0.25" strokeDasharray="100" strokeDashoffset="100" transform="rotate(120 715 430)" className={s.wbOrbit3} />

      <rect x="280" y="472" width="420" height="34" rx="17" fill="#1C1917" className={s.wbCtaRect} />
      <text x="490" y="494" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="600" fill="#FFFFFF" className={s.wbCtaText}>Click to explore dashboard view →</text>
    </svg>
  )
}

/* ── Nav icons ── */
function IconHome() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="11" width="5" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="2" width="5" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="7" width="5" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}
function IconFeatures() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="6" y="1" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 6 L2 13 C2 14.1 4 15 8 15 C12 15 14 14.1 14 13 L10 6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <line x1="3.5" y1="11.5" x2="12.5" y2="11.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  )
}
function IconAbout() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="3" y="1" width="2.5" height="14" rx="1" fill="currentColor" opacity="0.35"/>
      <line x1="7" y1="5"  x2="11" y2="5"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="8"  x2="11" y2="8"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="11" x2="9.5" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function IconContact() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1 5 L8 9.5 L15 5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}

function IconLogin() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 11L13 8L10 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 8H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconCta() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="var(--color-text-dark)" />
      <path d="M6 10H14M10 6V14" stroke="#FAF7F2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const NAV_ITEMS = [
  { label: 'Home',     href: '#home',     Icon: IconHome },
  { label: 'Features', href: '#features', Icon: IconFeatures },
  { label: 'About',    href: '#about',    Icon: IconAbout },
  { label: 'Contact',  href: '#contact',  Icon: IconContact },
]

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="rgba(201, 74, 60, 0.10)" stroke="var(--color-coral-text)" strokeWidth="1.4" />
      <path d="M5 8.2L7 10.2L11 5.8" stroke="var(--color-coral-text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Hero() {
  const [activeSection, setActiveSection] = useState('#home');

  useEffect(() => {
    const sectionIds = ['home', 'features', 'about', 'contact'];
    const observers = [];

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.35,
      rootMargin: '-80px 0px -40% 0px',
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className={s.hero} id="home">

      <div className={s.graphPaper} aria-hidden="true" />

      {/* ── Floating Spherical/Pill Vertical Sidebar Navigation ── */}
      <aside className={s.sidebarWrap} aria-label="Floating navigation sidebar">
        <nav className={s.sidebar}>
          {/* Nav Links */}
          <ul className={s.sidebarLinks} role="list">
            {NAV_ITEMS.map(({ label, href, Icon }) => {
              const isActive = href === activeSection;
              return (
                <li key={label} className={s.sidebarItem}>
                  <a
                    href={href}
                    className={`${s.sidebarLink} ${isActive ? s.sidebarLinkActive : ''}`}
                    aria-label={label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={s.sidebarIcon}><Icon /></span>
                    <span className={s.tooltipLabel}>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className={s.sidebarDivider} aria-hidden="true" />

          {/* Action Links */}
          <div className={s.sidebarActions}>
            <Link to="/login" className={s.sidebarLogin} aria-label="Login">
              <span className={s.sidebarIcon}><IconLogin /></span>
              <span className={s.tooltipLabel}>Login</span>
            </Link>
            <Link to="/register" className={s.sidebarCta} aria-label="Get started">
              <span className={s.sidebarCtaIcon}><IconCta /></span>
              <span className={s.tooltipLabel}>Get started →</span>
            </Link>
          </div>
        </nav>
      </aside>

      <div className={s.heroInner}>

        {/* ── Brand Logo & Eyebrow Badge Above Headline (Left-aligned) ── */}
        <div className={s.eyebrowWrap}>
          <a href="/" className={s.heroLogo} aria-label="note-Lab home">
            note <span className={s.heroLogoDash}>–</span> Lab
          </a>
          <p className={s.eyebrow}>
            <span className={s.eyebrowLine} aria-hidden="true" />
            Your lab notebook, reimagined
          </p>
        </div>

        {/* ── 2-Column Hero Grid (Spaced-Out Desktop Layout) ── */}
        <div className={s.heroGrid}>
          {/* Left Column (~62%): Headline + Subline */}
          <div className={s.heroLeftCol}>
            <h1 className={s.heading}>
              Everything your laboratory <span className={s.headingAccent}>needs.</span>
            </h1>
            <p className={s.subline}>
              Log protocols, track results, and collaborate with your lab — all in one place.
            </p>
          </div>

          {/* Right Column (~38%): Editorial Callouts + CTAs + Tagline */}
          <div className={s.heroRightCol}>
            <ul className={s.heroBullets} role="list">
              <li className={s.bulletItem}>
                <span className={s.bulletIcon}><IconFeatures /></span>
                <div className={s.bulletTextWrap}>
                  <strong className={s.bulletTitle}>Protocol Automation</strong>
                  <span className={s.bulletDesc}>Structured protocol logging & auto-indexing</span>
                </div>
              </li>
              <li className={s.bulletItem}>
                <span className={s.bulletIcon}><IconAbout /></span>
                <div className={s.bulletTextWrap}>
                  <strong className={s.bulletTitle}>AI Research Companion</strong>
                  <span className={s.bulletDesc}>Contextual literature & formula search</span>
                </div>
              </li>
              <li className={s.bulletItem}>
                <span className={s.bulletIcon}><IconContact /></span>
                <div className={s.bulletTextWrap}>
                  <strong className={s.bulletTitle}>Lab Collaboration</strong>
                  <span className={s.bulletDesc}>Real-time team experiment syncing</span>
                </div>
              </li>
            </ul>

            <div className={s.ctaGroup}>
              <Link to="/register" className={btn.primary} aria-label="Start your first experiment">
                Start your first experiment
                <span className={btn.primaryArrow} aria-hidden="true">→</span>
              </Link>
              <a href="#features" className={btn.ghost}>
                See how it works <span aria-hidden="true">→</span>
              </a>
            </div>

            <p className={s.ctaHighlightTag}>
              Free forever for individual researchers
            </p>
          </div>
        </div>

        {/* ── Clean & Simple Product Showcase Container ── */}
        <div className={s.productContainer}>
          <div className={s.screenshotFrame}>
            <img
              src={dashboardImg}
              alt="NoteLab dashboard interface preview"
              className={s.screenshotImg}
              draggable="false"
              fetchPriority="high"
              decoding="async"
              width="1200"
              height="675"
            />
          </div>
        </div>

      </div>

      <div className={s.sectionDivider} aria-hidden="true" />
    </header>
  );
}
