import React from 'react';
import styles from './StudyActivityView.module.css';

/* ── Scientific SVG Icons (NO EMOJIS) ── */
function LabLedgerIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4H20V20H4V4Z" stroke="var(--color-coral, #E46757)" strokeWidth="1.8" />
      <path d="M4 9H20" stroke="var(--color-coral, #E46757)" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M9 4V20" stroke="var(--color-coral, #E46757)" strokeWidth="1.5" />
      <line x1="12" y1="13" x2="17" y2="13" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="16" x2="16" y2="16" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FlameIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C10.5 5.5 8 8 8 11.5C8 15 10 17.5 12 17.5C14 17.5 16 15 16 11.5C16 8 13.5 5.5 12 2Z" stroke="var(--color-coral, #E46757)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 17.5C10.5 17.5 9.5 18.5 9.5 20C9.5 21.2 10.6 22 12 22C13.4 22 14.5 21.2 14.5 20C14.5 18.5 13.5 17.5 12 17.5Z" stroke="#D97706" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="var(--color-coral, #E46757)" strokeWidth="1.8" />
      <path d="M12 7V12L15.5 14" stroke="var(--color-coral, #E46757)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TargetIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="var(--color-coral, #E46757)" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="var(--color-coral, #E46757)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="var(--color-coral, #E46757)" />
    </svg>
  );
}

function ShieldCheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L13.5 3.5V7.5C13.5 11 11 13.5 8 14.5C5 13.5 2.5 11 2.5 7.5V3.5L8 1.5Z" stroke="#059669" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.5 7.5L7 9L10.5 5.5" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FormulaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4H7M5 4V12M5 12H3M5 12H7" stroke="#4F46E5" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 7L13 11M13 7L9 11" stroke="#4F46E5" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const HEATMAP_DAYS = [
  { day: 'MON', hours: '2.5h', intensity: 60 },
  { day: 'TUE', hours: '3.0h', intensity: 75 },
  { day: 'WED', hours: '1.5h', intensity: 40 },
  { day: 'THU', hours: '4.2h', intensity: 95 },
  { day: 'FRI', hours: '2.8h', intensity: 70 },
  { day: 'SAT', hours: '0.8h', intensity: 25 },
  { day: 'SUN', hours: '3.5h', intensity: 85 },
];

export default function StudyActivityView({ experiments = [] }) {
  const totalNotebooks = experiments.length || 1;
  const masteredCount = experiments.filter((e) => e.status === 'mastered').length;

  const subjectsMap = experiments.reduce((acc, exp) => {
    const sub = exp.subject || 'General Chemistry';
    acc[sub] = (acc[sub] || 0) + 1;
    return acc;
  }, {});

  const subjectStats = Object.entries(subjectsMap).map(([subject, count]) => ({
    subject,
    count,
    pct: Math.round((count / totalNotebooks) * 100),
  }));

  return (
    <div className={styles.ledgerWrapper}>
      {/* ── Ledger Header Banner ── */}
      <header className={styles.ledgerBanner}>
        <div className={styles.bannerMeta}>
          <span className={styles.stampedTag}>OFFICIAL RESEARCH LOG</span>
          <span className={styles.catalogCode}>CATALOG REF: #NL-2026-LAB</span>
        </div>
        <h2 className={styles.ledgerHeading}>
          <LabLedgerIcon size={24} /> Research & Laboratory Analytics Ledger
        </h2>
        <p className={styles.ledgerSubheading}>
          Formal documentation of research focus hours, protocol completion rates, and AI co-pilot stoichiometry checks.
        </p>
      </header>

      {/* ── 3 Key Research Calibration Metrics ── */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIconWrap}><FlameIcon size={20} /></span>
            <span className={styles.metricLabel}>RESEARCH STREAK</span>
          </div>
          <div className={styles.metricBody}>
            <span className={styles.metricNumber}>7</span>
            <span className={styles.metricUnit}>Consecutive Days</span>
          </div>
          <div className={styles.metricFooter}>
            <span className={styles.verifiedBadge}>[QUALIFIED] Top 5% Active Focus</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIconWrap}><ClockIcon size={20} /></span>
            <span className={styles.metricLabel}>TOTAL FOCUS HOURS</span>
          </div>
          <div className={styles.metricBody}>
            <span className={styles.metricNumber}>18.3</span>
            <span className={styles.metricUnit}>Hours Logged</span>
          </div>
          <div className={styles.metricFooter}>
            <span className={styles.verifiedBadge}>+4.2h vs prior 7-day period</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIconWrap}><TargetIcon size={20} /></span>
            <span className={styles.metricLabel}>MASTERY PROTOCOLS</span>
          </div>
          <div className={styles.metricBody}>
            <span className={styles.metricNumber}>{masteredCount}</span>
            <span className={styles.metricUnit}>/ {totalNotebooks} Notebooks</span>
          </div>
          <div className={styles.metricFooter}>
            <span className={styles.verifiedBadge}>{Math.round((masteredCount / totalNotebooks) * 100)}% Protocol Completion</span>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Journal Spread ── */}
      <div className={styles.journalSpread}>
        {/* Left Column: Glassware Graduation Activity Chart */}
        <section className={styles.journalSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Laboratory Focus Hours (7-Day Cycle)</h3>
            <span className={styles.sectionRef}>FIG. 1.1</span>
          </div>

          <div className={styles.chartContainer}>
            <div className={styles.graduationLines} aria-hidden="true">
              <span>4.0h</span>
              <span>3.0h</span>
              <span>2.0h</span>
              <span>1.0h</span>
              <span>0.0h</span>
            </div>

            <div className={styles.tubesRow}>
              {HEATMAP_DAYS.map((d) => (
                <div key={d.day} className={styles.tubeCol}>
                  <div className={styles.tubeTrack}>
                    <div className={styles.tubeFill} style={{ height: `${d.intensity}%` }} />
                    <div className={styles.meniscusCurve} />
                  </div>
                  <span className={styles.tubeVal}>{d.hours}</span>
                  <span className={styles.tubeDay}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Discipline Distribution */}
        <section className={styles.journalSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Discipline Volume Breakdown</h3>
            <span className={styles.sectionRef}>FIG. 1.2</span>
          </div>

          <div className={styles.disciplineList}>
            {subjectStats.map((item) => (
              <div key={item.subject} className={styles.disciplineRow}>
                <div className={styles.disciplineMeta}>
                  <span className={styles.disciplineName}>{item.subject}</span>
                  <span className={styles.disciplineCount}>{item.count} Notebook{item.count !== 1 ? 's' : ''} ({item.pct}%)</span>
                </div>
                <div className={styles.ruleTrack}>
                  <div className={styles.ruleFill} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── AI Co-Pilot Verification & Audit Log ── */}
      <section className={styles.journalSection} style={{ marginTop: 24 }}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>AI Co-Pilot Automated Safety & Stoichiometric Verification Log</h3>
          <span className={styles.sectionRef}>AUDIT REPOSITORY</span>
        </div>

        <div className={styles.logTable}>
          <div className={styles.logRow}>
            <div className={styles.logTagCell}>
              <ShieldCheckIcon size={16} />
              <span className={styles.logTagText}>SAFETY CHECK</span>
            </div>
            <div className={styles.logDetailsCell}>
              <strong className={styles.logSubject}>Simple Distillation Apparatus Atmospheric Vent</strong>
              <p className={styles.logDesc}>Verified open receiver adapter vent on ethanol-water boiling flask to prevent hazardous pressure accumulation.</p>
            </div>
            <div className={styles.logTimeCell}>14:20 UTC</div>
          </div>

          <div className={styles.logRow}>
            <div className={styles.logTagCell}>
              <FormulaIcon size={16} />
              <span className={styles.logTagText}>STOICHIOMETRY</span>
            </div>
            <div className={styles.logDetailsCell}>
              <strong className={styles.logSubject}>Acid-Base Volumetric Neutralization Endpoint</strong>
              <p className={styles.logDesc}>Calculated 25.0 mL HCl analyte molar concentration as 0.0980 M against 0.100 M standardized NaOH titrant.</p>
            </div>
            <div className={styles.logTimeCell}>Yesterday</div>
          </div>

          <div className={styles.logRow}>
            <div className={styles.logTagCell}>
              <FormulaIcon size={16} />
              <span className={styles.logTagText}>QUANTUM FIDELITY</span>
            </div>
            <div className={styles.logDetailsCell}>
              <strong className={styles.logSubject}>Hadamard Gate Superposition State Simulation</strong>
              <p className={styles.logDesc}>Mapped computational basis state |0⟩ to equal superposition state (|0⟩ + |1⟩)/√2 on Bloch sphere with 99.8% fidelity.</p>
            </div>
            <div className={styles.logTimeCell}>3 days ago</div>
          </div>
        </div>
      </section>
    </div>
  );
}
