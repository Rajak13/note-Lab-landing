import React, { useRef, useEffect } from 'react';
import styles from '../BlockEditor.module.css';

/**
 * CodeBlock — syntax-highlighted code block for Python/R scripts.
 * Uses a styled <textarea> with monospace font; real highlighting would need
 * a library like highlight.js, kept minimal here for zero extra bundle.
 */
export default function CodeBlock({ block, onChange, onKeyDown }) {
  const textareaRef = useRef(null);

  // Auto-grow textarea
  const autoGrow = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoGrow();
  }, [block.content]);

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>Python · R</span>
        <div className={styles.codeDots}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className={styles.codeTextarea}
        value={block.content || ''}
        onChange={(e) => {
          onChange(e.target.value);
          autoGrow();
        }}
        onKeyDown={(e) => {
          // Allow Tab for indentation inside code blocks
          if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const next = block.content.substring(0, start) + '    ' + block.content.substring(end);
            onChange(next);
            setTimeout(() => {
              e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
            return;
          }
          onKeyDown && onKeyDown(e);
        }}
        placeholder="# Write Python or R code here..."
        spellCheck={false}
        rows={4}
      />
    </div>
  );
}
