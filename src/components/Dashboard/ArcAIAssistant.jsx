import React, { useState } from 'react';
import styles from './ArcAIAssistant.module.css';
import { AICompanionOrb } from './DashboardIllustrations';

const COMPANION_ACTIONS = [
  { id: 'continue', label: 'Continue from last session', icon: '→' },
  { id: 'summarize', label: 'Summarize this notebook', icon: '∑' },
  { id: 'flashcards', label: 'Generate flashcards', icon: '⎘' },
  { id: 'explain', label: 'Explain a difficult concept', icon: '?' },
  { id: 'plan', label: 'Suggest today\'s study plan', icon: '◎' },
];

export default function ArcAIAssistant({ onSelectAction }) {
  const [expanded, setExpanded] = useState(false);

  const handleAction = (label) => {
    setExpanded(false);
    if (onSelectAction) onSelectAction(label);
  };

  return (
    <div className={styles.floatingDock}>
      {expanded && (
        <div className={styles.companionDrawer} role="dialog" aria-label="Study companion">
          <div className={styles.drawerHeader}>
            <div className={styles.drawerTitleGroup}>
              <AICompanionOrb className={styles.drawerOrb} />
              <div>
                <span className={styles.drawerTitle}>Study companion</span>
                <span className={styles.drawerSubtitle}>What would you like to do?</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setExpanded(false)}
              aria-label="Close companion"
            >
              ✕
            </button>
          </div>

          <div className={styles.actionList}>
            {COMPANION_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                className={styles.actionItem}
                onClick={() => handleAction(action.label)}
              >
                <span className={styles.actionIcon}>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.triggerPill}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <AICompanionOrb className={styles.triggerOrb} />
        <span>Study companion</span>
      </button>
    </div>
  );
}
