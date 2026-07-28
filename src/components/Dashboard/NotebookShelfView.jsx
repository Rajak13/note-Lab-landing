import React, { useState } from 'react';
import styles from './NotebookShelfView.module.css';

const SUBJECT_COLOR_MAP = {
  'Organic Chemistry': '#C94A3C',
  'Quantum Physics': '#4F46E5',
  'Cellular Biology': '#059669',
  'Neuroscience': '#D97706',
};

/* ── Scientific SVG Icons (NO EMOJIS) ── */
function BookshelfIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6H20M4 12H20M4 18H20" stroke="var(--color-coral, #E46757)" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 3V6M10 3V6M14 3V6M18 3V6" stroke="var(--color-coral, #E46757)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BookOpenIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 3.5C2 3.5 4.5 2.5 8 4.5C11.5 2.5 14 3.5 14 3.5V13.5C14 13.5 11.5 12.5 8 14.5C4.5 12.5 2 13.5 2 13.5V3.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="8" y1="4.5" x2="8" y2="14.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function PencilIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinelinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4H13M5 4V13C5 13.5 5.5 14 6 14H10C10.5 14 11 13.5 11 13V4M6 4V2.5C6 2.2 6.2 2 6.5 2H9.5C9.8 2 10 2.2 10 2.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function NotebookShelfView({
  experiments = [],
  onOpenNotebook,
  onCreateExperiment,
  onRenameExperiment,
  onDeleteExperiment,
}) {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = ['All', ...new Set(experiments.map((e) => e.subject).filter(Boolean))];
  const statuses = ['All', 'Active', 'Mastered', 'In Progress'];

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSubject = selectedSubject === 'All' || exp.subject === selectedSubject;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Active' && exp.status !== 'mastered') ||
      (selectedStatus === 'Mastered' && exp.status === 'mastered');
    const matchesQuery =
      !searchQuery ||
      exp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesStatus && matchesQuery;
  });

  return (
    <div className={styles.shelfContainer}>
      {/* ── Header Banner ── */}
      <div className={styles.shelfHeader}>
        <div>
          <h2 className={styles.shelfTitle}>
            <BookshelfIcon size={24} /> Hardcover Research Notebook Shelf
          </h2>
          <p className={styles.shelfSubtitle}>
            Physical laboratory archive for apparatus diagrams, stoichiometry protocols, and trial observations.
          </p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <span className={styles.searchIconWrap}><SearchIcon size={15} /></span>
            <input
              type="text"
              placeholder="Filter shelf by title or discipline…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {onCreateExperiment && (
            <button type="button" className={styles.newNotebookBtn} onClick={() => onCreateExperiment()}>
              + New Journal
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Discipline:</span>
          <div className={styles.chipList}>
            {subjects.map((sub) => (
              <button
                key={sub}
                type="button"
                className={`${styles.chipBtn} ${selectedSubject === sub ? styles.chipActive : ''}`}
                onClick={() => setSelectedSubject(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Status:</span>
          <div className={styles.chipList}>
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                className={`${styles.chipBtn} ${selectedStatus === st ? styles.chipActive : ''}`}
                onClick={() => setSelectedStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Oak & Paper Bookshelf Tier ── */}
      {filteredExperiments.length > 0 ? (
        <div className={styles.shelfTier}>
          <div className={styles.shelfGrid}>
            {filteredExperiments.map((exp, idx) => {
              const themeColor = SUBJECT_COLOR_MAP[exp.subject] || '#E46757';
              const isMastered = exp.status === 'mastered';
              const catalogId = `NL-JRNL-${(idx + 101).toString().padStart(3, '0')}`;

              return (
                <div key={exp.id} className={styles.journalCard}>
                  <div
                    className={styles.journalCover}
                    style={{ borderTopColor: themeColor }}
                    onClick={() => onOpenNotebook && onOpenNotebook(exp.id)}
                  >
                    <div className={styles.spineBand} style={{ background: themeColor }} />

                    <div className={styles.journalHeader}>
                      <span className={styles.catalogCode}>{catalogId}</span>
                      <span className={styles.subjectBadge} style={{ color: themeColor, borderColor: themeColor }}>
                        {exp.subject || 'Chemistry'}
                      </span>
                    </div>

                    <h3 className={styles.journalTitle}>{exp.title || 'Untitled Research Protocol'}</h3>

                    <p className={styles.journalExcerpt}>
                      {exp.aiInsight || 'Apparatus vector diagram, stoichiometry protocols, and observation records.'}
                    </p>

                    <div className={styles.journalMeta}>
                      <span className={isMastered ? styles.statusMastered : styles.statusActive}>
                        [{isMastered ? 'RECORDED & MASTERED' : 'IN PROGRESS'}]
                      </span>
                      <span className={styles.dateLabel}>
                        {exp.updatedAt ? new Date(exp.updatedAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardActionsRow}>
                    <button
                      type="button"
                      className={styles.openJournalBtn}
                      onClick={() => onOpenNotebook && onOpenNotebook(exp.id)}
                    >
                      <BookOpenIcon size={15} /> Open Journal
                    </button>
                    {onRenameExperiment && (
                      <button
                        type="button"
                        className={styles.iconActionBtn}
                        onClick={() => onRenameExperiment(exp)}
                        title="Rename Journal"
                      >
                        <PencilIcon size={14} />
                      </button>
                    )}
                    {onDeleteExperiment && (
                      <button
                        type="button"
                        className={styles.iconActionBtn}
                        onClick={() => onDeleteExperiment(exp.id, exp.title)}
                        title="Delete Journal"
                      >
                        <TrashIcon size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.woodenPlank} aria-hidden="true" />
        </div>
      ) : (
        <div className={styles.emptyShelfBox}>
          <h3 className={styles.emptyTitle}>No Matching Journals on Shelf</h3>
          <p className={styles.emptySubtitle}>Adjust your discipline or status filters, or start a new scientific journal.</p>
          {onCreateExperiment && (
            <button type="button" className={styles.primaryBtn} onClick={() => onCreateExperiment()}>
              + Create Laboratory Journal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
