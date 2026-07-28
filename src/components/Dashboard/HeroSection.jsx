import React from 'react';
import styles from './HeroSection.module.css';
import dashboardHero from '../../assets/dashboard-hero.svg';
import { SparklesIcon } from './EducationalSVG';

function HeroIllustration({ user, latestExp }) {
  const hour = new Date().getHours();
  let timeOfDay = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeOfDay = 'Good afternoon';
  } else if (hour >= 17 || hour < 5) {
    timeOfDay = 'Good evening';
  }

  const displayName = user?.fullName ? user.fullName.split(' ')[0] : 'Researcher';
  const greetingText = `${timeOfDay}, ${displayName}`;

  const title = latestExp?.title || 'Laboratory Notebook';
  const hypothesis = latestExp?.hypothesis || latestExp?.materials || 'Reaction Mechanisms & Analysis';

  const noteLine1 = latestExp?.protocol ? `Protocol: ${latestExp.protocol}` : 'ΔG = ΔH − TΔS';
  const noteLine2 = latestExp?.results ? `Results: ${latestExp.results}` : 'pH = −log[H⁺]  ·  Yield 88.4%';
  const statusTag = latestExp?.status ? `STATUS: ${latestExp.status.toUpperCase()}` : 'ACTIVE RESEARCH';

  return (
    <svg
      viewBox="0 0 900 472.5"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={styles.heroBannerSvg}
      role="img"
      aria-label="Study desk with notebook, coffee, and research notes"
    >
      <image href={dashboardHero} x="0" y="0" width="900" height="472.5" preserveAspectRatio="xMidYMid meet" />

      {/* Notebook page text overlay on left page of graph paper frame — shifted left */}
      <g transform="translate(200, 135)">
        {/* User greeting inside the notebook SVG */}
        <text x="0" y="20" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill="#E46757" letterSpacing="0.04em">
          {greetingText}
        </text>

        {/* Experiment title */}
        <text x="0" y="52" fontFamily="'Playfair Display', Georgia, serif" fontSize="21" fontWeight="700" fill="#2C2420">
          {title.length > 26 ? title.substring(0, 26) + '…' : title}
        </text>

        {/* Hypothesis / Subline */}
        <text x="0" y="78" fontFamily="Inter, sans-serif" fontSize="13" fill="#666" opacity="0.85">
          {hypothesis.length > 34 ? hypothesis.substring(0, 34) + '…' : hypothesis}
        </text>

        <line x1="0" y1="96" x2="260" y2="96" stroke="#E46757" strokeWidth="1.5" opacity="0.35" strokeDasharray="4 2" />

        {/* User specific lab notes & status */}
        <text x="0" y="128" fontFamily="'Caveat', cursive, Georgia, serif" fontSize="20" fontWeight="600" fill="#C94A3C">
          {noteLine1.length > 30 ? noteLine1.substring(0, 30) + '…' : noteLine1}
        </text>
        <text x="0" y="160" fontFamily="'Caveat', cursive, Georgia, serif" fontSize="18" fill="#E46757">
          {noteLine2.length > 32 ? noteLine2.substring(0, 32) + '…' : noteLine2}
        </text>
        <text x="0" y="192" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#2C2420" opacity="0.65" letterSpacing="0.06em">
          {statusTag}
        </text>
      </g>
    </svg>
  );
}

export default function HeroSection({ user, experiments = [], onContinue, onCreateExperiment, onAskAI }) {
  const hour = new Date().getHours();
  let timeOfDay = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeOfDay = 'Good afternoon';
  } else if (hour >= 17 || hour < 5) {
    timeOfDay = 'Good evening';
  }

  const displayName = user?.fullName ? user.fullName.split(' ')[0] : 'Researcher';
  const greetingText = `${timeOfDay}, ${displayName}`;

  const sortedExperiments = Array.isArray(experiments) && experiments.length > 0
    ? [...experiments].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    : [];

  const latestExp = sortedExperiments[0];

  const hasExperiments = sortedExperiments.length > 0;
  const titleText = hasExperiments ? (latestExp?.title || 'Untitled Notebook') : 'Welcome to NoteLab';
  const tagText = hasExperiments ? (latestExp?.subject || 'Research') : 'New Workspace';
  const sublineText = hasExperiments
    ? (latestExp?.hypothesis || latestExp?.materials || 'Reaction protocols & diagrams')
    : 'Create your first notebook to log protocols and draw diagrams';

  const totalExps = experiments.length;
  const activeExps = experiments.filter((e) => e.status === 'active' || e.status === 'in-progress').length;
  const progressPercent = totalExps > 0 ? Math.round((activeExps / totalExps) * 100) : 0;

  return (
    <section className={styles.deskHero} aria-label="Your study workspace">
      <header className={styles.heroHeadline}>
        <p className={styles.greeting}>{greetingText}</p>
        <h1 className={styles.heroTitle}>{titleText}</h1>
        <p className={styles.heroSubline}>
          <span className={styles.pageTag}>{tagText}</span>
          <span className={styles.sublineSep} aria-hidden="true">
            ·
          </span>
          <span>{sublineText}</span>
        </p>
      </header>

      <div className={styles.deskVisual}>
        <HeroIllustration user={user} latestExp={latestExp} />
      </div>

      <div className={styles.heroActions}>
        <div className={styles.primaryActions}>
          {hasExperiments ? (
            <button type="button" className={styles.continueBtn} onClick={onContinue}>
              Continue reading →
            </button>
          ) : (
            <button type="button" className={styles.continueBtn} onClick={() => onCreateExperiment && onCreateExperiment()}>
              + Create First Notebook →
            </button>
          )}
          <span className={styles.estimate}>
            {hasExperiments ? `${totalExps} notebook${totalExps !== 1 ? 's' : ''} in library` : 'Ready for research'}
          </span>
        </div>

        <div className={styles.metricsRow} aria-label="Today's study metrics">
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Notebooks</span>
            <span className={styles.metricValue}>{totalExps}</span>
          </div>
          <div className={styles.metricSep} aria-hidden="true" />
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Active</span>
            <span className={styles.metricValue}>{activeExps}</span>
          </div>
          <div className={styles.metricSep} aria-hidden="true" />
          <div className={styles.metric}>
            <span className={styles.metricLabel}>AI Co-Pilot</span>
            <span className={styles.metricValue}>Ready</span>
          </div>
        </div>
      </div>

      <aside className={styles.companionNote}>
        <SparklesIcon size={14} />
        <p>
          Ready to review your recent research experiments?{' '}
          <button type="button" className={styles.companionLink} onClick={onAskAI}>
            Ask AI →
          </button>
        </p>
      </aside>
    </section>
  );
}
