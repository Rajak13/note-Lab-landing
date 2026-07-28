import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFolders } from '../../context/FolderContext';
import SidebarFinderTree from './SidebarFinderTree';
import BreadcrumbBar from './BreadcrumbBar';
import styles from './WorkspaceView.module.css';

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <line x1="3" y1="4" x2="13" y2="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="3" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 5H13M6 5V3H10V5M5 5L5.5 13H10.5L11 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NotebookFileIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="2" width="10" height="12" rx="1.5" stroke={color || 'var(--color-coral)'} strokeWidth="1.6" />
      <line x1="6" y1="5" x2="10" y2="5" stroke={color || 'var(--color-coral)'} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="6" y1="8" x2="10" y2="8" stroke={color || 'var(--color-coral)'} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function WorkspaceView({
  experiments = [],
  onOpenNotebook,
  onCreateExperiment,
  onDeleteExperiment,
  onRenameExperiment,
}) {
  const { folders, activeFolderId, openInspector } = useFolders();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
  const [editingExp, setEditingExp] = useState(null); // { id, title }
  const [deletingExp, setDeletingExp] = useState(null); // { id, title }
  const [renameInput, setRenameInput] = useState('');

  const activeFolder = folders.find((f) => f.id === activeFolderId) || folders[0];
  const activeColor = activeFolder?.color || '#C94A3C';

  const handleOpenRename = (exp, e) => {
    e.stopPropagation();
    setEditingExp(exp);
    setRenameInput(exp.title || 'Untitled Notebook');
  };

  const handleConfirmRename = (e) => {
    e.preventDefault();
    if (editingExp && onRenameExperiment) {
      onRenameExperiment(editingExp.id, renameInput);
    }
    setEditingExp(null);
  };

  const handleOpenDelete = (exp, e) => {
    e.stopPropagation();
    setDeletingExp(exp);
  };

  const handleConfirmDelete = () => {
    if (deletingExp && onDeleteExperiment) {
      onDeleteExperiment(deletingExp.id);
    }
    setDeletingExp(null);
  };

  return (
    <div className={styles.workspaceContainer}>
      <SidebarFinderTree />

      <main className={styles.mainSection}>
        <BreadcrumbBar />

        <div className={styles.workspaceHeader}>
          <div className={styles.headerInfo}>
            <h2 className={styles.headerTitle}>{activeFolder?.name || 'Workspace Files'}</h2>
            <p className={styles.headerMeta}>
              {activeFolder?.children?.length || 0} subfolders · {experiments.length} research notebooks
            </p>
          </div>

          <div className={styles.actionRow}>
            {/* Grid / List View Switcher Toggle */}
            <div className={styles.viewToggleGroup}>
              <button
                type="button"
                className={`${styles.viewToggleBtn} ${viewMode === 'cards' ? styles.viewToggleBtnActive : ''}`}
                onClick={() => setViewMode('cards')}
                title="Cards Grid View"
              >
                <GridIcon /> Cards
              </button>
              <button
                type="button"
                className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                onClick={() => setViewMode('list')}
                title="Compact List View"
              >
                <ListIcon /> List
              </button>
            </div>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => openInspector(activeFolder)}
            >
              Inspect Folder
            </button>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => (onCreateExperiment ? onCreateExperiment() : onOpenNotebook && onOpenNotebook(null))}
            >
              <PlusIcon /> New Notebook
            </button>
          </div>
        </div>

        {/* Empty State */}
        {experiments.length === 0 ? (
          <div className={styles.emptyGridState}>
            <div className={styles.emptyGridIcon}>
              <NotebookFileIcon color={activeColor} />
            </div>
            <h3 className={styles.emptyGridTitle}>No research notebooks in this folder</h3>
            <p className={styles.emptyGridSub}>
              Create a new lab notebook to organize your research protocols, reaction diagrams, and AI notes.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => (onCreateExperiment ? onCreateExperiment() : onOpenNotebook && onOpenNotebook(null))}
            >
              <PlusIcon /> Create Notebook
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards Grid View */
          <div className={styles.fileGrid}>
            {experiments.map((exp, idx) => {
              const dateStr = exp.updatedAt || exp.createdAt;
              const formattedDate = dateStr
                ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'Recently';

              return (
                <div
                  key={exp.id || idx}
                  className={styles.fileCard}
                  onClick={() => {
                    if (exp.id) navigate(`/notebook/${exp.id}`);
                    else if (onOpenNotebook) onOpenNotebook(exp);
                  }}
                >
                  <div className={styles.fileCardAccent} style={{ backgroundColor: activeColor }} />

                  <div className={styles.fileCardHeader}>
                    <div className={styles.fileCardIcon} style={{ backgroundColor: `${activeColor}15` }}>
                      <NotebookFileIcon color={activeColor} />
                    </div>

                    <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={styles.cardActionBtn}
                        onClick={(e) => handleOpenRename(exp, e)}
                        title="Rename Notebook"
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className={`${styles.cardActionBtn} ${styles.cardActionDelete}`}
                        onClick={(e) => handleOpenDelete(exp, e)}
                        title="Delete Notebook"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <h3 className={styles.fileCardTitle}>{exp.title || 'Untitled Protocol'}</h3>

                  <div className={styles.fileCardMeta}>
                    <span>Updated {formattedDate}</span>
                    <span>{exp.subject || 'Research'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compact List View */
          <div className={styles.listViewContainer}>
            <table className={styles.listTable}>
              <thead>
                <tr>
                  <th>Notebook Name</th>
                  <th>Subject</th>
                  <th>Last Modified</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiments.map((exp, idx) => {
                  const dateStr = exp.updatedAt || exp.createdAt;
                  const formattedDate = dateStr
                    ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Recently';

                  return (
                    <tr
                      key={exp.id || idx}
                      onClick={() => {
                        if (exp.id) navigate(`/notebook/${exp.id}`);
                        else if (onOpenNotebook) onOpenNotebook(exp);
                      }}
                    >
                      <td>
                        <div className={styles.listTitleCell}>
                          <NotebookFileIcon color={activeColor} />
                          <span className={styles.listTitleText}>{exp.title || 'Untitled Protocol'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.listSubjectBadge}>{exp.subject || 'Research'}</span>
                      </td>
                      <td>
                        <span className={styles.listMetaText}>{formattedDate}</span>
                      </td>
                      <td>
                        <span className={styles.listStatusPill}>
                          {exp.status === 'mastered' ? '✓ Mastered' : 'In Progress'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.listActionsGroup}>
                          <button
                            type="button"
                            className={styles.cardActionBtn}
                            onClick={(e) => handleOpenRename(exp, e)}
                            title="Rename Notebook"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className={`${styles.cardActionBtn} ${styles.cardActionDelete}`}
                            onClick={(e) => handleOpenDelete(exp, e)}
                            title="Delete Notebook"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Rename Notebook Modal */}
      {editingExp && (
        <div className={styles.modalOverlay} onClick={() => setEditingExp(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Rename Research Notebook</h3>
            <form onSubmit={handleConfirmRename}>
              <input
                type="text"
                className={styles.modalInput}
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                autoFocus
              />
              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={() => setEditingExp(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingExp && (
        <div className={styles.modalOverlay} onClick={() => setDeletingExp(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Notebook?</h3>
            <p className={styles.modalSub}>
              Are you sure you want to delete <strong>"{deletingExp.title || 'Untitled Notebook'}"</strong>? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => setDeletingExp(null)}>
                Cancel
              </button>
              <button type="button" className={styles.dangerBtn} onClick={handleConfirmDelete}>
                Delete Notebook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
