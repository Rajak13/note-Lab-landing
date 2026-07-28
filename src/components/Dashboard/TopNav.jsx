import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './TopNav.module.css';
import { SearchIcon, SunIcon, MoonIcon } from './EducationalSVG';
import {
  NavOverviewIcon,
  NavShelfIcon,
  NavLabsIcon,
  NavActivityIcon,
  NavNotebookMarkIcon,
} from './DashboardNavIcons';

function LogoutIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 11L13 8L10 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 8H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: 'Overview', label: 'Overview', Icon: NavOverviewIcon },
  { id: 'Workspace', label: 'Finder Workspace', Icon: NavLabsIcon },
  { id: 'Notebook Shelf', label: 'Notebook Shelf', Icon: NavShelfIcon },
  { id: 'Study Activity', label: 'Study Activity', Icon: NavActivityIcon },
];

export default function TopNav({ user, activeTab, setActiveTab, onOpenSearch, onCreateExperiment, theme, onToggleTheme, onLogout }) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';
  const userName = user?.fullName || 'Researcher';

  return (
    <header className={styles.navHeader}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navLogo} aria-label="note-Lab home">
          <NavNotebookMarkIcon size={20} />
          <span className={styles.logoText}>
            note <span className={styles.navLogoDash}>–</span> Lab
          </span>
        </Link>

        <nav className={styles.navLinks} aria-label="Dashboard navigation">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={`${styles.navIconBtn} ${activeTab === id ? styles.navIconActive : ''}`}
              onClick={() => setActiveTab(id)}
              aria-label={label}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <Icon size={20} />
              <span className={styles.navTooltip}>{label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.actionsGroup}>
          {onCreateExperiment && (
            <button
              type="button"
              className={styles.newNotebookBtn}
              onClick={() => onCreateExperiment()}
              title="Create a new research notebook"
            >
              + New Notebook
            </button>
          )}

          <button
            type="button"
            className={styles.iconBtn}
            onClick={onOpenSearch}
            aria-label="Search notes — ⌘K"
          >
            <SearchIcon size={18} />
            <span className={styles.navTooltip}>Search · ⌘K</span>
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            <span className={styles.navTooltip}>Toggle theme</span>
          </button>

          <div className={styles.avatarWrap}>
            <button
              type="button"
              className={styles.avatarBtn}
              onClick={() => setIsAccountOpen((prev) => !prev)}
              aria-label={`Account — ${userName}`}
              aria-expanded={isAccountOpen}
            >
              <span className={styles.avatarInitial}>{userInitial}</span>
              <span className={styles.navTooltip}>{userName}</span>
            </button>

            {isAccountOpen && (
              <div className={styles.accountDropdown}>
                <div className={styles.accountHeader}>
                  <strong className={styles.accountName}>{userName}</strong>
                  <span className={styles.accountEmail}>{user?.email || 'researcher@notelab.app'}</span>
                </div>
                <div className={styles.dropdownDivider} aria-hidden="true" />
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={() => {
                    setIsAccountOpen(false);
                    onLogout && onLogout();
                  }}
                >
                  <LogoutIcon size={15} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
