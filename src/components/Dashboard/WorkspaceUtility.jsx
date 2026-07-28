import React from 'react';
import styles from './WorkspaceUtility.module.css';

export default function WorkspaceUtility({ onContinue, onOpenConversation }) {
  return (
    <section className={styles.utilityStrip} aria-label="Quick workspace actions">
      <div className={styles.continueBlock}>
        <p className={styles.utilityEyebrow}>Continue reading</p>
        <div className={styles.continueRow}>
          <div className={styles.continueInfo}>
            <h3 className={styles.continueTitle}>Organic Chemistry II</h3>
            <div className={styles.continueProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '32%' }} />
              </div>
              <span className={styles.progressLabel}>32%</span>
            </div>
          </div>
          <button type="button" className={styles.continueBtn} onClick={onContinue}>
            Continue →
          </button>
        </div>
      </div>

      <div className={styles.utilityRule} aria-hidden="true" />

      <div className={styles.conversationsBlock}>
        <p className={styles.utilityEyebrow}>Recent AI conversations</p>
        <ul className={styles.conversationList}>
          <li>
            <button type="button" className={styles.conversationItem} onClick={onOpenConversation}>
              <span className={styles.conversationTitle}>Explain SN1 reactions</span>
              <span className={styles.conversationMeta}>Yesterday · Open →</span>
            </button>
          </li>
          <li>
            <button type="button" className={styles.conversationItem} onClick={onOpenConversation}>
              <span className={styles.conversationTitle}>Summarize Krebs cycle notes</span>
              <span className={styles.conversationMeta}>Tuesday · Open →</span>
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
}
