import React, { useRef, useEffect } from 'react';
import styles from '../BlockEditor.module.css';

/**
 * TextBlock — handles text, h1, h2, h3 block types.
 * Uses contentEditable for inline editing.
 */
export default function TextBlock({ block, onChange, onKeyDown, onFocus }) {
  const ref = useRef(null);

  // Sync external content changes only when not focused
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = block.content || '';
    }
  }, [block.content]);

  const tagMap = { h1: 'h1', h2: 'h2', h3: 'h3', text: 'p' };
  const Tag = tagMap[block.type] || 'p';

  const placeholderMap = {
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    text: "Type '/' for commands…",
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={`${styles.textBlock} ${styles[`block_${block.type}`]}`}
      data-placeholder={placeholderMap[block.type] || ''}
      onInput={(e) => onChange(e.currentTarget.textContent)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
    />
  );
}
