import React, { useState, useEffect } from 'react';
import styles from './CommandPaletteModal.module.css';
import { useToast } from '../../context/ToastContext';
import {
  SearchIcon,
  SparklesIcon,
  NotebookIcon,
  AtomIcon,
  FlashcardsIcon,
  GraduationIcon
} from './EducationalSVG';

export default function CommandPaletteModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const toast = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { title: 'Create New AI Note', category: 'Actions', icon: <NotebookIcon size={16} />, shortcut: '⌘ N' },
    { title: 'Ask AI Tutor a Question', category: 'Actions', icon: <SparklesIcon size={16} />, shortcut: '⌘ Space' },
    { title: 'Generate Quiz from Notebook', category: 'Study Tools', icon: <GraduationIcon size={16} />, shortcut: '⌘ Q' },
    { title: 'Open Organic Chemistry Lab', category: 'Notebooks', icon: <AtomIcon size={16} />, shortcut: '⌘ 1' },
    { title: 'Review 20 Daily Flashcards', category: 'Study Tools', icon: <FlashcardsIcon size={16} />, shortcut: '⌘ F' }
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <SearchIcon size={18} style={{ color: 'var(--color-coral)' }} />
          <input
            type="text"
            className={styles.input}
            placeholder="Type a command, search notes, or ask AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <span className={styles.kbd}>ESC to close</span>
        </div>

        <div className={styles.list}>
          <div className={styles.groupLabel}>Quick Commands & AI Search</div>
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <div
                key={index}
                className={styles.item}
                onClick={() => {
                  toast.success(`Executing ${item.title}...`, 'Command Palette');
                  onClose();
                }}
              >
                <div className={styles.itemLeft}>
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <span className={styles.kbd}>{item.shortcut}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '16px', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              No commands found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
