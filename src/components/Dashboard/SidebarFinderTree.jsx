import React, { useState, useEffect, useRef } from 'react';
import { useFolders, COLOR_PALETTE } from '../../context/FolderContext';
import styles from './SidebarFinderTree.module.css';

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4C2 3.44772 2.44772 3 3 3H6.17157C6.70201 3 7.21071 3.21071 7.58579 3.58579L8.41421 4.41421C8.78929 4.78929 9.29799 5 9.82843 5H13C13.5523 5 14 5.44772 14 6V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z" fill={color || 'var(--color-coral)'} opacity="0.9" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L10.1 5.8L14.8 6.5L11.4 9.8L12.2 14.5L8 12.3L3.8 14.5L4.6 9.8L1.2 6.5L5.9 5.8L8 1.5Z" fill="#D97706" />
    </svg>
  );
}

function WorkspaceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5" height="5" rx="1" fill="var(--color-coral)" />
      <rect x="9" y="2" width="5" height="5" rx="1" fill="var(--color-coral)" opacity="0.6" />
      <rect x="2" y="9" width="5" height="5" rx="1" fill="var(--color-coral)" opacity="0.6" />
      <rect x="9" y="9" width="5" height="5" rx="1" fill="var(--color-coral)" opacity="0.4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M11.06 1.94a1.5 1.5 0 012.12 2.12L4.5 12.75 1.5 13.5l.75-3L11.06 1.94z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderPlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4C2 3.44772 2.44772 3 3 3H6.17157C6.70201 3 7.21071 3.21071 7.58579 3.58579L8.41421 4.41421C8.78929 4.78929 9.29799 5 9.82843 5H13C13.5523 5 14 5.44772 14 6V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7.5v3.5M6.25 9.25h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function StarMenuIcon({ filled }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill={filled ? "#D97706" : "none"} aria-hidden="true">
      <path d="M8 1.5L10.1 5.8L14.8 6.5L11.4 9.8L12.2 14.5L8 12.3L3.8 14.5L4.6 9.8L1.2 6.5L5.9 5.8L8 1.5Z" stroke="#D97706" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h10M6 4V2.5C6 2.22 6.22 2 6.5 2h3c.28 0 .5.22.5.5V4M5 4v9.5c0 .28.22.5.5.5h5c.28 0 .5-.22.5-.5V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SidebarFinderTree() {
  const {
    folders,
    activeFolderId,
    setActiveFolderId,
    createFolder,
    moveFolder,
    renameFolder,
    updateFolderColor,
    toggleStarFolder,
    deleteFolder,
    openInspector,
  } = useFolders();

  const [expandedFolders, setExpandedFolders] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [createType, setCreateType] = useState('top');
  const [targetParentId, setTargetParentId] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#C94A3C');

  // Three-dots menu state
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Inline rename state
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (e, folderId) => {
    e.stopPropagation();
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const startCreation = (type = 'top', parentId = null) => {
    setCreateType(type);
    setTargetParentId(parentId);
    setIsCreating(true);
    setActiveMenuId(null);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const parentId = createType === 'sub' ? (targetParentId || activeFolderId) : null;
    createFolder(newFolderName.trim(), selectedColor, parentId);
    setNewFolderName('');
    setIsCreating(false);
  };

  const startRename = (folder) => {
    setRenamingId(folder.id);
    setRenameValue(folder.name);
    setActiveMenuId(null);
  };

  const handleRenameSubmit = (e, folderId) => {
    e.preventDefault();
    if (renameValue.trim()) {
      renameFolder(folderId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const starredFolders = folders.filter((f) => f.starred);

  return (
    <aside className={styles.sidebar} aria-label="Finder Sidebar">
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          <WorkspaceIcon />
          Research Desk
        </span>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => startCreation('top')}
          title="Create Subject Folder"
        >
          <PlusIcon />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateSubmit} className={styles.newFolderInputRow}>
          <div className={styles.typeSelector}>
            <button
              type="button"
              className={`${styles.typeBtn} ${createType === 'top' ? styles.typeBtnActive : ''}`}
              onClick={() => setCreateType('top')}
            >
              Top-Level
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${createType === 'sub' ? styles.typeBtnActive : ''}`}
              onClick={() => setCreateType('sub')}
            >
              Subfolder
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FolderIcon color={selectedColor} />
            <input
              type="text"
              className={styles.input}
              placeholder={createType === 'top' ? 'Subject name...' : 'Subfolder name...'}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.colorRow}>
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${styles.colorSwatch} ${selectedColor === c.hex ? styles.colorSwatchActive : ''}`}
                style={{ backgroundColor: c.hex }}
                onClick={() => setSelectedColor(c.hex)}
                title={c.name}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Create
            </button>
          </div>
        </form>
      )}

      {/* Starred Quick Access */}
      {starredFolders.length > 0 && (
        <div>
          <div className={styles.sectionLabel}>
            <StarIcon /> Favorites
          </div>
          <ul className={styles.treeList}>
            {starredFolders.map((folder) => (
              <li
                key={folder.id}
                className={`${styles.treeItem} ${activeFolderId === folder.id ? styles.treeItemActive : ''}`}
                onClick={() => {
                  setActiveFolderId(folder.id);
                  openInspector(folder);
                }}
              >
                <StarIcon />
                <span className={styles.itemText}>{folder.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subject Folders Tree */}
      <div>
        <div className={styles.sectionLabel}>
          <FolderIcon color="var(--color-coral)" /> Subject Workspace
        </div>
        {folders.length === 0 ? (
          <div className={styles.emptyFoldersState}>
            <p className={styles.emptyFoldersText}>No subject folders created yet.</p>
            <button
              type="button"
              className={styles.addFolderBtn}
              onClick={() => startCreation('top')}
            >
              + Create Subject Folder
            </button>
          </div>
        ) : (
          <ul className={styles.treeList}>
            {folders.map((folder) => {
              const isExpanded = expandedFolders[folder.id];
              const isActive = activeFolderId === folder.id;
              const childCount = folder.children?.length || 0;
              const isMenuOpen = activeMenuId === folder.id;
              const isRenaming = renamingId === folder.id;

              return (
                <React.Fragment key={folder.id}>
                  <li
                    className={`${styles.treeItem} ${isActive ? styles.treeItemActive : ''}`}
                    onClick={() => {
                      setActiveFolderId(folder.id);
                      openInspector(folder);
                    }}
                  >
                    {childCount > 0 ? (
                      <span
                        className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
                        onClick={(e) => toggleExpand(e, folder.id)}
                      >
                        <ChevronIcon />
                      </span>
                    ) : (
                      <span style={{ width: 14 }} />
                    )}
                    <FolderIcon color={folder.color} />

                    {isRenaming ? (
                      <form
                        onSubmit={(e) => handleRenameSubmit(e, folder.id)}
                        onClick={(e) => e.stopPropagation()}
                        className={styles.renameForm}
                      >
                        <input
                          type="text"
                          className={styles.renameInput}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={(e) => handleRenameSubmit(e, folder.id)}
                          autoFocus
                        />
                      </form>
                    ) : (
                      <span className={styles.itemText}>{folder.name}</span>
                    )}

                    {childCount > 0 && <span className={styles.itemCount}>{childCount}</span>}

                    {/* Three dots menu button */}
                    <div className={styles.menuContainer} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={styles.dotsBtn}
                        onClick={() => setActiveMenuId(isMenuOpen ? null : folder.id)}
                        title="Folder options"
                      >
                        <MoreIcon />
                      </button>

                      {isMenuOpen && (
                        <div className={styles.dropdownMenu} ref={menuRef}>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => startRename(folder)}
                          >
                            <PencilIcon /> Rename
                          </button>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => startCreation('sub', folder.id)}
                          >
                            <FolderPlusIcon /> Add Subfolder
                          </button>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => {
                              toggleStarFolder(folder.id);
                              setActiveMenuId(null);
                            }}
                          >
                            <StarMenuIcon filled={folder.starred} /> {folder.starred ? 'Unstar' : 'Add to Favorites'}
                          </button>

                          <div className={styles.menuColorRow}>
                            <span className={styles.menuColorLabel}>Color:</span>
                            {COLOR_PALETTE.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                className={styles.menuSwatch}
                                style={{ backgroundColor: c.hex }}
                                onClick={() => {
                                  updateFolderColor(folder.id, c.hex);
                                  setActiveMenuId(null);
                                }}
                                title={c.name}
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            className={`${styles.menuItem} ${styles.menuItemDanger}`}
                            onClick={() => {
                              deleteFolder(folder.id);
                              setActiveMenuId(null);
                            }}
                          >
                            <TrashIcon /> Delete Folder
                          </button>
                        </div>
                      )}
                    </div>
                  </li>

                  {/* Subfolders */}
                  {isExpanded &&
                    folder.children?.map((child) => {
                      const isChildMenuOpen = activeMenuId === child.id;
                      const isChildRenaming = renamingId === child.id;

                      return (
                        <li
                          key={child.id}
                          className={`${styles.treeItem} ${activeFolderId === child.id ? styles.treeItemActive : ''}`}
                          style={{ paddingLeft: 32 }}
                          onClick={() => {
                            setActiveFolderId(child.id);
                            openInspector(child);
                          }}
                        >
                          <FolderIcon color={child.color} />

                          {isChildRenaming ? (
                            <form
                              onSubmit={(e) => handleRenameSubmit(e, child.id)}
                              onClick={(e) => e.stopPropagation()}
                              className={styles.renameForm}
                            >
                              <input
                                type="text"
                                className={styles.renameInput}
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={(e) => handleRenameSubmit(e, child.id)}
                                autoFocus
                              />
                            </form>
                          ) : (
                            <span className={styles.itemText}>{child.name}</span>
                          )}

                          {/* Three dots menu button for child */}
                          <div className={styles.menuContainer} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className={styles.dotsBtn}
                              onClick={() => setActiveMenuId(isChildMenuOpen ? null : child.id)}
                              title="Subfolder options"
                            >
                              <MoreIcon />
                            </button>

                            {isChildMenuOpen && (
                              <div className={styles.dropdownMenu} ref={menuRef}>
                                <button
                                  type="button"
                                  className={styles.menuItem}
                                  onClick={() => startRename(child)}
                                >
                                  <PencilIcon /> Rename
                                </button>
                                <button
                                  type="button"
                                  className={styles.menuItem}
                                  onClick={() => {
                                    moveFolder(child.id, null);
                                    setActiveMenuId(null);
                                  }}
                                >
                                  <ArrowUpIcon /> Promote to Top-Level
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                                  onClick={() => {
                                    deleteFolder(child.id);
                                    setActiveMenuId(null);
                                  }}
                                >
                                  <TrashIcon /> Delete Subfolder
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
