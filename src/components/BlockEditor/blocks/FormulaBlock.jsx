import React, { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import styles from '../BlockEditor.module.css';

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * FormulaBlock — KaTeX-rendered LaTeX block with inline edit toggle.
 */
export default function FormulaBlock({ block, onChange }) {
  const [editing, setEditing] = useState(!block.content);
  const [rawLatex, setRawLatex] = useState(block.content || '\\Delta G = \\Delta H - T\\Delta S');
  const [renderError, setRenderError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const renderedHTML = React.useMemo(() => {
    try {
      setRenderError(null);
      return katex.renderToString(rawLatex, {
        throwOnError: true,
        displayMode: true,
        trust: false,
      });
    } catch (err) {
      setRenderError(err.message);
      return '';
    }
  }, [rawLatex]);

  const handleSave = () => {
    onChange(rawLatex);
    setEditing(false);
  };

  return (
    <div className={styles.formulaBlock}>
      <div className={styles.formulaLabel}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M3 4H13M3 8H9M3 12H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        LaTeX Formula
      </div>

      {editing ? (
        <div className={styles.formulaEditArea}>
          <textarea
            ref={textareaRef}
            className={styles.formulaTextarea}
            value={rawLatex}
            onChange={(e) => setRawLatex(e.target.value)}
            placeholder="\Delta G = \Delta H - T\Delta S"
            rows={2}
            spellCheck={false}
          />
          {rawLatex && !renderError && (
            <div
              className={styles.formulaPreview}
              dangerouslySetInnerHTML={{ __html: renderedHTML }}
            />
          )}
          {renderError && (
            <div className={styles.formulaError}>LaTeX error: {renderError}</div>
          )}
          <button type="button" className={styles.formulaSaveBtn} onClick={handleSave}>
            <CheckIcon /> Render Formula
          </button>
        </div>
      ) : (
        <div
          className={styles.formulaRendered}
          dangerouslySetInnerHTML={{ __html: renderedHTML }}
          onClick={() => setEditing(true)}
          title="Click to edit"
        />
      )}

      {!editing && (
        <button
          type="button"
          className={styles.formulaEditBtn}
          onClick={() => setEditing(true)}
          title="Edit LaTeX"
        >
          <EditIcon /> Edit
        </button>
      )}
    </div>
  );
}
