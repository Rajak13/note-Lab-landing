import React from 'react';
import { useFolders } from '../../context/FolderContext';
import styles from './BreadcrumbBar.module.css';

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ marginTop: -1 }}>
      <path d="M2.5 6.5L8 2L13.5 6.5V13.5C13.5 13.7761 13.2761 14 13 14H9.5V10H6.5V14H3C2.72386 14 2.5 13.7761 2.5 13.5V6.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BreadcrumbBar() {
  const { folders, activeFolderId, setActiveFolderId } = useFolders();

  const getActivePath = () => {
    if (!activeFolderId) return ['Workspace'];
    for (const folder of folders) {
      if (folder.id === activeFolderId) {
        return ['Workspace', folder.name];
      }
      if (folder.children) {
        for (const child of folder.children) {
          if (child.id === activeFolderId) {
            return ['Workspace', folder.name, child.name];
          }
        }
      }
    }
    return ['Workspace'];
  };

  const pathSegments = getActivePath();

  return (
    <nav className={styles.breadcrumbBar} aria-label="Breadcrumb navigation">
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        return (
          <React.Fragment key={index}>
            <span
              className={`${styles.item} ${isLast ? styles.itemActive : ''}`}
              onClick={() => {
                if (index === 0) setActiveFolderId(null);
              }}
            >
              {index === 0 && <HomeIcon />}
              {segment}
            </span>
            {!isLast && <span className={styles.separator}>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
