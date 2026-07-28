import React, { useEffect } from 'react';
import styles from './ToastContainer.module.css';

/* ── Pure SVG Icons (NO EMOJIS) ── */
function SuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.2L6 10.7L12.5 4.8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 4.5V8.5" stroke="#C94A3C" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="11.2" r="1" fill="#C94A3C" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="1" fill="#E46757" />
      <path d="M8 7.5V11" stroke="#E46757" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 6V9" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="11.2" r="0.9" fill="#D97706" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="#E46757" strokeWidth="1.6" />
      <path d="M8 1V3M8 13V15M1 8H3M13 8H15M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M3.05 12.95L4.46 11.54M11.54 4.46L12.95 3.05" stroke="#E46757" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M14 9.5A6 6 0 1 1 6.5 2A4.8 4.8 0 0 0 14 9.5Z" stroke="#E46757" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function NotebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="#E46757" strokeWidth="1.6" />
      <line x1="6" y1="5" x2="10" y2="5" stroke="#E46757" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="6" y1="8" x2="10" y2="8" stroke="#E46757" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L9.2 5.8L13.5 7L9.2 8.2L8 12.5L6.8 8.2L2.5 7L6.8 5.8L8 1.5Z" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ToastItem({ toast, onDismiss }) {
  const { id, type, title, message, duration, icon } = toast;

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const variantClass =
    type === 'success'
      ? styles.toastSuccess
      : type === 'error'
      ? styles.toastError
      : type === 'warning'
      ? styles.toastWarning
      : styles.toastInfo;

  let IconComponent =
    type === 'success'
      ? SuccessIcon
      : type === 'error'
      ? ErrorIcon
      : type === 'warning'
      ? WarningIcon
      : InfoIcon;

  if (icon === 'sun') IconComponent = SunIcon;
  else if (icon === 'moon') IconComponent = MoonIcon;
  else if (icon === 'notebook') IconComponent = NotebookIcon;
  else if (icon === 'sparkles') IconComponent = SparklesIcon;

  const eyebrowLabel =
    type === 'success'
      ? '— LAB PROTOCOL'
      : type === 'error'
      ? '— AUTHENTICATION'
      : type === 'warning'
      ? '— RESEARCH WARNING'
      : '— SYSTEM NOTICE';

  return (
    <div className={`${styles.toast} ${variantClass}`} role="status" aria-live="polite">
      <div className={styles.toastContent}>
        <div className={styles.toastIcon}>
          <IconComponent />
        </div>
        <div className={styles.toastTextWrap}>
          <span className={styles.toastEyebrow}>{eyebrowLabel}</span>
          {title && <h4 className={styles.toastTitle}>{title}</h4>}
          {message && <p className={styles.toastMessage}>{message}</p>}
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
      {duration > 0 && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer} aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
