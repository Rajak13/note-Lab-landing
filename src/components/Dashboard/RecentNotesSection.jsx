import React, { useState } from 'react';
import styles from './RecentNotesSection.module.css';
import { NotebookCoverIllustration, SectionDividerMotif } from './DashboardIllustrations';
import { SparklesIcon } from './EducationalSVG';

const SHELF_NOTEBOOKS = [
  {
    id: 1,
    title: 'Cellular Respiration',
    subject: 'Biology',
    status: 'AI Reviewed',
    spineColor: '#059669',
    accent: 'emerald',
    sticker: '🧬',
    coverTint: '#F0FDF4',
    progress: 78,
    rotate: -3,
    lift: 0,
    formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O',
    note: 'Review the electron transport chain before next session.',
  },
  {
    id: 2,
    title: 'Quantum Gates',
    subject: 'Physics',
    status: 'In Progress',
    spineColor: '#7C3AED',
    accent: 'violet',
    sticker: '⚛',
    coverTint: '#F5F3FF',
    progress: 45,
    rotate: 2,
    lift: -6,
    formula: 'H|0⟩ = (|0⟩ + |1⟩) / √2',
    note: 'Hadamard gate creates superposition — study Bloch sphere.',
  },
  {
    id: 3,
    title: 'Neuroplasticity',
    subject: 'Neuroscience',
    status: 'Mastered',
    spineColor: '#E46757',
    accent: 'coral',
    sticker: '🧠',
    coverTint: '#FFF8F6',
    progress: 100,
    rotate: -1.5,
    lift: -10,
    formula: 'LTP → ΔW = η · δ · x',
    note: 'Hebbian learning: neurons that fire together, wire together.',
  },
  {
    id: 4,
    title: 'Organic Chemistry',
    subject: 'Chemistry',
    status: 'Active',
    spineColor: '#D97706',
    accent: 'gold',
    sticker: '⚗',
    coverTint: '#FFFBEB',
    progress: 62,
    rotate: 2.5,
    lift: -4,
    formula: 'ΔG = ΔH – TΔS',
    note: 'SN1 vs SN2 — memorise leaving group ability chart.',
  },
];

/* ── Whiteboard face — inline SVG, placeholder for real art ── */
function WhiteboardFace({ book, onContinue }) {
  const pct = book.progress ?? 0;
  const spineCol = book.spineColor || '#E46757';

  return (
    <svg
      viewBox="0 0 260 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.whiteboardSvg}
      aria-label={`${book.title} whiteboard`}
    >
      {/* Board background — warm cream */}
      <rect width="260" height="320" rx="10" fill="#FFFEF9" />

      {/* Colored top bar — matches spine colour */}
      <rect width="260" height="8" rx="10" fill={spineCol} />
      <rect y="8" width="260" height="4" fill={spineCol} opacity="0.3" />

      {/* Faint graph lines */}
      {[40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300].map(y => (
        <line key={y} x1="16" y1={y} x2="244" y2={y}
          stroke="rgba(228,103,87,0.08)" strokeWidth="1" />
      ))}
      {[40, 80, 120, 160, 200, 240].map(x => (
        <line key={x} x1={x} y1="16" x2={x} y2="308"
          stroke="rgba(228,103,87,0.06)" strokeWidth="1" />
      ))}

      {/* Subject eyebrow */}
      <text x="16" y="36"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="9" fontWeight="700"
        letterSpacing="0.10em"
        style={{ textTransform: 'uppercase' }}
        fill={spineCol} opacity="0.8">
        {book.subject?.toUpperCase()}
      </text>

      {/* Title */}
      <text x="16" y="60"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="17" fontWeight="700"
        fill="#2C2420"
        letterSpacing="-0.02em">
        {book.title}
      </text>

      {/* Divider rule */}
      <line x1="16" y1="70" x2="244" y2="70"
        stroke="rgba(44,36,32,0.12)" strokeWidth="1" />

      {/* Formula — handwritten style */}
      <text x="16" y="92"
        fontFamily="'Caveat', Georgia, cursive"
        fontSize="13" fontWeight="400"
        fill={spineCol} opacity="0.85">
        {book.formula}
      </text>

      {/* Divider */}
      <line x1="16" y1="104" x2="244" y2="104"
        stroke="rgba(44,36,32,0.07)" strokeWidth="1" strokeDasharray="4 3" />

      {/* Note text — wraps manually across two lines */}
      <text x="16" y="122"
        fontFamily="'Caveat', Georgia, cursive"
        fontSize="12" fontWeight="400"
        fill="#57534E">
        {(book.note || '').slice(0, 36)}
      </text>
      {(book.note || '').length > 36 && (
        <text x="16" y="138"
          fontFamily="'Caveat', Georgia, cursive"
          fontSize="12" fontWeight="400"
          fill="#57534E">
          {(book.note || '').slice(36, 72)}
        </text>
      )}

      {/* Progress section */}
      <text x="16" y="172"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="8" fontWeight="600"
        letterSpacing="0.09em"
        fill="#78716C">
        PROGRESS
      </text>

      {/* Progress track */}
      <rect x="16" y="178" width="228" height="6" rx="3" fill="rgba(44,36,32,0.08)" />
      <rect x="16" y="178" width={228 * pct / 100} height="6" rx="3" fill={spineCol} />

      {/* Progress percentage */}
      <text x="250" y="185"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="9" fontWeight="700"
        textAnchor="end"
        fill={spineCol}>
        {pct}%
      </text>

      {/* Status pill */}
      <rect x="16" y="196" width="80" height="18" rx="9"
        fill={spineCol} opacity="0.12" />
      <text x="56" y="209"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="9" fontWeight="600"
        fill={spineCol}>
        {book.status}
      </text>

      {/* Sparkle AI badge */}
      <rect x="104" y="196" width="72" height="18" rx="9"
        fill="rgba(13,148,136,0.10)" />
      <text x="140" y="209"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="9" fontWeight="600"
        fill="#0D9488">
        ✦ AI ready
      </text>

      {/* Sticky note decoration */}
      <rect x="172" y="96" width="72" height="52" rx="3"
        fill="#FFFDE7"
        transform="rotate(3 172 96)" />
      <line x1="180" y1="112" x2="236" y2="112"
        stroke="rgba(44,36,32,0.12)" strokeWidth="1"
        transform="rotate(3 180 112)" />
      <line x1="180" y1="124" x2="230" y2="124"
        stroke="rgba(44,36,32,0.12)" strokeWidth="1"
        transform="rotate(3 180 124)" />
      <line x1="180" y1="136" x2="232" y2="136"
        stroke="rgba(44,36,32,0.12)" strokeWidth="1"
        transform="rotate(3 180 136)" />

      {/* "Continue reading" CTA area */}
      <rect x="16" y="272" width="228" height="34" rx="8"
        fill={spineCol} />
      <text x="130" y="294"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="11" fontWeight="600"
        fill="#FFFFFF">
        Continue reading →
      </text>
    </svg>
  );
}

/* ── Single flipping book card ── */
function FlipBook({ book, onContinue }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article
      className={`${styles.bookItem} ${flipped ? styles.bookFlipped : ''}`}
      style={{
        '--book-rotate': `${book.rotate ?? 0}deg`,
        '--book-lift': `${book.lift ?? 0}px`,
        '--spine-color': book.spineColor || '#E46757',
      }}
    >
      <div className={styles.flipInner}>

        {/* ── FRONT: notebook cover ── */}
        <div className={styles.flipFront}>
          <button
            type="button"
            className={styles.bookButton}
            onClick={() => setFlipped(true)}
            aria-label={`Open ${book.title}`}
          >
            <div className={styles.bookCover}>
              <NotebookCoverIllustration
                spineColor={book.spineColor}
                accent={book.accent}
                label={book.subject}
                sticker={book.sticker}
                coverTint={book.coverTint}
              />
            </div>
            <div className={styles.bookMeta}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <span className={styles.bookStatus}>{book.status}</span>
            </div>
            {book.progress != null && (
              <div className={styles.progressTrack} aria-hidden="true">
                <div className={styles.progressFill} style={{ width: `${book.progress}%` }} />
              </div>
            )}
            <span className={styles.aiBadge}>
              <SparklesIcon size={12} />
              AI ready
            </span>
          </button>
        </div>

        {/* ── BACK: whiteboard ── */}
        <div className={styles.flipBack}>
          <button
            type="button"
            className={styles.whiteboardClose}
            onClick={() => setFlipped(false)}
            aria-label="Close whiteboard"
          >
            ✕
          </button>
          {/* Clickable CTA area at bottom of whiteboard SVG */}
          <div
            className={styles.whiteboardWrap}
            onClick={() => { onContinue && onContinue(book); }}
          >
            <WhiteboardFace book={book} onContinue={onContinue} />
          </div>
        </div>

      </div>
    </article>
  );
}

export default function RecentNotesSection({ experiments = [], onViewExperiment, onCreateExperiment }) {
  const hasExperiments = Array.isArray(experiments) && experiments.length > 0;

  const displayNotes = hasExperiments
    ? experiments.map((exp, i) => ({
        ...SHELF_NOTEBOOKS[i % SHELF_NOTEBOOKS.length],
        _notebookId: exp.id || exp.u_id || null,
        id: exp.id || exp.u_id || i,
        title: exp.title || 'Untitled Notebook',
        subject: exp.subject || 'Research',
        status: exp.status || 'Active',
        note: exp.hypothesis || exp.materials || 'Reaction protocol & notes',
        formula: exp.protocol ? `Protocol: ${exp.protocol.slice(0, 30)}` : 'ΔG = ΔH – TΔS',
        progress: 100,
        ...exp,
      }))
    : [];

  return (
    <section className={styles.shelfSection} aria-labelledby="shelf-heading">
      <div className={styles.sectionIntro}>
        <SectionDividerMotif />
        <div className={styles.sectionHeaderRow}>
          <div>
            <p className={styles.sectionEyebrow}>Notebook shelf</p>
            <h2 id="shelf-heading" className={styles.sectionTitle}>
              Your research collection
            </h2>
          </div>
          <span className={styles.shelfCount}>{experiments.length} notebook{experiments.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {!hasExperiments ? (
        <div className={styles.emptyShelfCard}>
          <div className={styles.emptyShelfIcon}>
            <SparklesIcon size={24} />
          </div>
          <h3 className={styles.emptyShelfTitle}>Your research shelf is empty</h3>
          <p className={styles.emptyShelfSub}>
            Create your first experiment notebook to record protocols, draw apparatus diagrams, and collaborate with AI.
          </p>
          {onCreateExperiment && (
            <button
              type="button"
              className={styles.emptyShelfBtn}
              onClick={() => onCreateExperiment()}
            >
              + Create your first notebook
            </button>
          )}
        </div>
      ) : (
        <>
          <p className={styles.flipHint} aria-hidden="true">
            <span className={styles.flipHintDot} />
            Click any notebook to open its whiteboard
          </p>

          <div className={styles.shelfSurface}>
            <div className={styles.shelfBooks}>
              {displayNotes.map((book, idx) => (
                <FlipBook
                  key={book.u_id || book.id || idx}
                  book={book}
                  onContinue={onViewExperiment}
                />
              ))}
            </div>
            <div className={styles.shelfLip} aria-hidden="true" />
          </div>
        </>
      )}
    </section>
  );
}
