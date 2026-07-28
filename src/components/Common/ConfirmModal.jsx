import React, { useEffect } from 'react';
import styles from './ConfirmModal.module.css';

function WarningTriangleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2L1.5 17H18.5L10 2Z" stroke="#C94A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(201, 74, 60, 0.1)" />
      <path d="M10 8V12M10 14.5V15" stroke="#C94A3C" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = true, onConfirm, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <div className={styles.iconBadge}>
            <WarningTriangleIcon />
          </div>
          <div className={styles.headerText}>
            <h3 className={styles.modalTitle}>{title}</h3>
            {message && <p className={styles.modalMessage}>{message}</p>}
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`${styles.confirmBtn} ${isDanger ? styles.confirmBtnDanger : ''}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
