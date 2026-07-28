import React, { useState, useEffect, useRef } from 'react';
import styles from './SlashMenu.module.css';

const BLOCK_TYPES = [
  {
    type: 'text',
    label: 'Text',
    description: 'Plain paragraph',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 4H13M3 7.5H10M3 11H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    type: 'h1',
    label: 'Heading 1',
    description: 'Large section title',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <text x="1" y="13" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="serif">H1</text>
      </svg>
    ),
  },
  {
    type: 'h2',
    label: 'Heading 2',
    description: 'Medium subsection title',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <text x="1" y="13" fontSize="12" fontWeight="600" fill="currentColor" fontFamily="serif">H2</text>
      </svg>
    ),
  },
  {
    type: 'h3',
    label: 'Heading 3',
    description: 'Small sub-heading',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <text x="1" y="13" fontSize="12" fontWeight="500" fill="currentColor" fontFamily="serif">H3</text>
      </svg>
    ),
  },
  {
    type: 'protocol',
    label: 'Protocol Step',
    description: 'Timestamped lab step',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    type: 'formula',
    label: 'LaTeX Formula',
    description: 'Rendered math equation',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 5L6 13M2 13L6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 7H14M9 10H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    type: 'callout',
    label: 'Lab Note',
    description: 'Observation or warning callout',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 2V7L2 13H14L10 7V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="5" y1="2" x2="11" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    type: 'table',
    label: 'Data Table',
    description: 'Editable trial data grid',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <line x1="2" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.2" />
        <line x1="2" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.2" />
        <line x1="7" y1="2" x2="7" y2="14" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    type: 'code',
    label: 'Code Block',
    description: 'Python / R script',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5 5L2 8L5 11M11 5L14 8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="9" y1="4" x2="7" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function SlashMenu({ position, query, onSelect, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const menuRef = useRef(null);

  const filtered = BLOCK_TYPES.filter(
    (b) =>
      !query ||
      b.label.toLowerCase().includes(query.toLowerCase()) ||
      b.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIdx]) onSelect(filtered[activeIdx].type);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [activeIdx, filtered, onSelect, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (menuRef.current) {
      const active = menuRef.current.querySelector(`.${styles.slashItemActive}`);
      active?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  if (filtered.length === 0) return null;

  return (
    <div
      className={styles.slashMenu}
      style={{ top: position.top, left: position.left }}
      ref={menuRef}
    >
      <div className={styles.slashMenuHeader}>BLOCKS</div>
      {filtered.map((item, idx) => (
        <button
          key={item.type}
          type="button"
          className={`${styles.slashItem} ${idx === activeIdx ? styles.slashItemActive : ''}`}
          onMouseEnter={() => setActiveIdx(idx)}
          onClick={() => onSelect(item.type)}
        >
          <div className={styles.slashItemIcon}>{item.icon}</div>
          <div className={styles.slashItemText}>
            <span className={styles.slashItemLabel}>{item.label}</span>
            <span className={styles.slashItemDesc}>{item.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
