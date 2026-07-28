import React, { useRef, useEffect, useState } from 'react';
import styles from '../BlockEditor.module.css';

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * ProtocolBlock — timestamped lab step with check/uncheck toggle.
 */
export default function ProtocolBlock({ block, onChange, onKeyDown }) {
  const [done, setDone] = useState(block.done || false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = block.content || '';
    }
  }, [block.content]);

  const toggleDone = () => {
    const next = !done;
    setDone(next);
    onChange(block.content, next);
  };

  return (
    <div className={`${styles.protocolBlock} ${done ? styles.protocolDone : ''}`}>
      <button
        type="button"
        className={`${styles.protocolCheck} ${done ? styles.protocolCheckDone : ''}`}
        onClick={toggleDone}
        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
      >
        {done && <CheckIcon />}
      </button>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={styles.protocolContent}
        data-placeholder="Describe the protocol step…"
        onInput={(e) => onChange(e.currentTarget.textContent, done)}
        onKeyDown={onKeyDown}
      />

      <div className={styles.protocolTimestamp}>
        <ClockIcon />
        <span>{block.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
