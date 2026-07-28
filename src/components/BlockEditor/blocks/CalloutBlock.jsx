import React, { useRef, useEffect } from 'react';
import styles from '../BlockEditor.module.css';

function BeakerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M6 2V7L2 13H14L10 7V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="5" y1="2" x2="11" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="5.5" cy="11" r="0.8" fill="currentColor" />
      <circle cx="8.5" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

/**
 * CalloutBlock — warm bordered lab annotation callout card.
 */
export default function CalloutBlock({ block, onChange, onKeyDown }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = block.content || '';
    }
  }, [block.content]);

  return (
    <div className={styles.calloutBlock}>
      <div className={styles.calloutIconWrap}>
        <BeakerIcon />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={styles.calloutContent}
        data-placeholder="Add a lab note, observation, or warning…"
        onInput={(e) => onChange(e.currentTarget.textContent)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
