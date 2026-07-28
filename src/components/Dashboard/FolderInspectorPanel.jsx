import React from 'react';
import { useFolders, COLOR_PALETTE } from '../../context/FolderContext';
import styles from './FolderInspectorPanel.module.css';

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L9.2 5.8L13.5 7L9.2 8.2L8 12.5L6.8 8.2L2.5 7L6.8 5.8L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PromoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 13V3M3 8L8 3L13 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FolderInspectorPanel() {
  const { selectedFile, inspectorOpen, closeInspector, updateFolderColor, moveFolder } = useFolders();

  if (!inspectorOpen || !selectedFile) return null;

  const currentColor = selectedFile.color || '#C94A3C';
  const isSubfolder = Boolean(selectedFile.parentId);

  return (
    <div className={styles.panelOverlay} onClick={closeInspector}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()} aria-label="File Inspector">
        <div className={styles.header}>
          <span className={styles.eyebrow}>— INSPECTOR PANEL</span>
          <button type="button" className={styles.closeBtn} onClick={closeInspector}>
            ✕
          </button>
        </div>

        <div>
          <h3 className={styles.itemTitle}>{selectedFile.name || selectedFile.title}</h3>
        </div>

        <div className={styles.metaGroup}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Item Type</span>
            <span className={styles.metaValue}>
              {selectedFile.children ? 'Subject Folder' : 'Research Notebook'}
            </span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Hierarchy Level</span>
            <span className={styles.metaValue}>
              {isSubfolder ? 'Nested Subfolder' : 'Top-Level Subject'}
            </span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Last Modified</span>
            <span className={styles.metaValue}>Today, 2:15 PM</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Word Count</span>
            <span className={styles.metaValue}>1,420 words</span>
          </div>

          {/* Color Picker for Folder / File */}
          <div className={styles.colorPickerSection}>
            <span className={styles.metaLabel}>Accent Color</span>
            <div className={styles.colorRow}>
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.colorSwatch} ${currentColor === c.hex ? styles.colorSwatchActive : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => updateFolderColor(selectedFile.id, c.hex)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Move to Top-Level Folder Action */}
          {isSubfolder && (
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                className={styles.promoteBtn}
                onClick={() => {
                  moveFolder(selectedFile.id, null);
                  closeInspector();
                }}
              >
                <PromoteIcon /> Move to Top-Level Subject Workspace
              </button>
            </div>
          )}

          {/* Delete Folder Action */}
          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                background: 'rgba(220, 38, 38, 0.06)',
                color: '#DC2626',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onClick={() => {
                deleteFolder(selectedFile.id);
                closeInspector();
              }}
            >
              Delete Subject Folder
            </button>
          </div>
        </div>

        <div className={styles.aiSummaryBox}>
          <span className={styles.aiTitle}>
            <SparklesIcon /> AI Research Companion Summary
          </span>
          <p className={styles.aiText}>
            "Organic synthesis kinetics confirmed with 94.2% crystal yield. UV-Vis absorbance peak recorded at 340nm."
          </p>
        </div>
      </aside>
    </div>
  );
}
