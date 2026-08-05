import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import { useToast } from '../context/ToastContext';

import TopNav from '../components/Dashboard/TopNav';
import HeroSection from '../components/Dashboard/HeroSection';
import StatsGrid from '../components/Dashboard/StatsGrid';
import RecentNotesSection from '../components/Dashboard/RecentNotesSection';
import CommandPaletteModal from '../components/Dashboard/CommandPaletteModal';
import TodaysWorkspace from '../components/Dashboard/TodaysWorkspace';
import ArcAIAssistant from '../components/Dashboard/ArcAIAssistant';
import SidebarFinderTree from '../components/Dashboard/SidebarFinderTree';
import BreadcrumbBar from '../components/Dashboard/BreadcrumbBar';
import FolderInspectorPanel from '../components/Dashboard/FolderInspectorPanel';
import WorkspaceView from '../components/Dashboard/WorkspaceView';
import NotebookShelfView from '../components/Dashboard/NotebookShelfView';
import VoiceKeyModal from '../components/Dashboard/VoiceKeyModal';
import { FloatingAtomDecor } from '../components/Dashboard/DashboardIllustrations';
import { getApiUrl } from '../config/api';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('notelab-theme') || 'light');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('notelab-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    toast.info(
      nextTheme === 'dark' ? 'Dark Theme Enabled' : 'Light Theme Enabled',
      'Appearance Updated',
      { icon: nextTheme === 'dark' ? 'moon' : 'sun' }
    );
  };

  useEffect(() => {
    fetch(getApiUrl('/auth/me'), { credentials: 'include' })
      .then((r) => {
        if (r.status === 401) {
          navigate('/login');
          return null;
        }
        if (!r.ok) return null;
        return r.json();
      })
      .then((userData) => {
        if (userData) setUser(userData);
      })
      .catch((err) => {
        console.warn('Auth fetch warning:', err.message);
      });
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(getApiUrl('/api/experiments'), { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) {
          navigate('/login');
          return null;
        }
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data) setExperiments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('API fetch warning:', err.message);
        setExperiments([]);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(getApiUrl('/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      });
      toast.success('Your research session has ended securely', 'Laboratory Closed');
    } catch (err) {
      console.warn('Logout request failed', err);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const handleCreateExperiment = async (customTitle = 'Untitled Notebook', subject = 'Organic Chemistry') => {
    try {
      const res = await fetch(getApiUrl('/api/experiments'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customTitle,
          subject: subject,
          hypothesis: '',
          protocol: '',
          status: 'in-progress',
        }),
      });

      if (res.status === 401) {
        toast.error('Session expired. Please log in again.', 'Unauthorized');
        navigate('/login');
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || `Server error (${res.status})`);
      }

      const data = await res.json();
      const newExp = Array.isArray(data) ? data[0] : data;
      toast.success('New research notebook created', 'Notebook Ready');
      if (newExp?.id) {
        navigate(`/notebook/${newExp.id}`);
      }
    } catch (err) {
      console.error('Create experiment error:', err);
      toast.error(err.message || 'Could not create notebook', 'Server Error');
    }
  };

  const handleDeleteExperiment = async (expId) => {
    try {
      await fetch(getApiUrl(`/api/experiments/${expId}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      setExperiments((prev) => prev.filter((exp) => exp.id !== expId));
      toast.success('Research notebook deleted', 'Notebook Removed');
    } catch (err) {
      setExperiments((prev) => prev.filter((exp) => exp.id !== expId));
    }
  };

  const handleRenameExperiment = async (expId, newTitle) => {
    if (!newTitle || !newTitle.trim()) return;
    const cleanTitle = newTitle.trim();
    try {
      await fetch(getApiUrl(`/api/experiments/${expId}`), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle }),
      });
      setExperiments((prev) =>
        prev.map((exp) => (exp.id === expId ? { ...exp, title: cleanTitle } : exp))
      );
      toast.success('Notebook title updated', 'Renamed');
    } catch (err) {
      setExperiments((prev) =>
        prev.map((exp) => (exp.id === expId ? { ...exp, title: cleanTitle } : exp))
      );
    }
  };

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.ambientBackground} aria-hidden="true">
        <div className={styles.ambientGlow1} />
        <div className={styles.ambientGlow2} />
        <FloatingAtomDecor className={styles.decorAtom1} />
        <FloatingAtomDecor className={styles.decorAtom2} />
        <div className={styles.graphPaper} />
      </div>

      <div className={styles.contentWrapper}>
        <TopNav
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onCreateExperiment={handleCreateExperiment}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Opening your laboratory…</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>Error: {error}</p>
          </div>
        ) : activeTab === 'Workspace' ? (
          <WorkspaceView
            experiments={experiments}
            onCreateExperiment={handleCreateExperiment}
            onDeleteExperiment={handleDeleteExperiment}
            onRenameExperiment={handleRenameExperiment}
            onOpenNotebook={(exp) => {
              if (exp?.id) navigate(`/notebook/${exp.id}`);
              else handleCreateExperiment();
            }}
          />
        ) : activeTab === 'Notebook Shelf' ? (
          <NotebookShelfView
            experiments={experiments}
            onCreateExperiment={handleCreateExperiment}
            onDeleteExperiment={handleDeleteExperiment}
            onRenameExperiment={handleRenameExperiment}
            onOpenNotebook={(id) => navigate(`/notebook/${id}`)}
          />
        ) : activeTab === 'Study Activity' ? (
          <StudyActivityView experiments={experiments} />
        ) : (
          <main id="main-dashboard-content">
            <HeroSection
              user={user}
              experiments={experiments}
              onCreateExperiment={handleCreateExperiment}
              onContinue={() => {
                const latestExp = experiments[0];
                if (latestExp?.id) navigate(`/notebook/${latestExp.id}`);
                else handleCreateExperiment();
              }}
              onAskAI={() => setIsSearchOpen(true)}
            />

            <TodaysWorkspace
              experiments={experiments}
              onCreateExperiment={handleCreateExperiment}
              onContinue={() => {
                const latestExp = experiments[0];
                if (latestExp?.id) navigate(`/notebook/${latestExp.id}`);
                else handleCreateExperiment();
              }}
              onOpenConversation={() => setIsSearchOpen(true)}
              onQuickAction={() => setIsSearchOpen(true)}
            />

            <StatsGrid experiments={experiments} />

            <RecentNotesSection
              experiments={experiments}
              onCreateExperiment={handleCreateExperiment}
              onViewExperiment={(exp) => {
                const notebookId = exp?._notebookId || exp?.id;
                if (notebookId) navigate(`/notebook/${notebookId}`);
                else handleCreateExperiment();
              }}
            />
          </main>
        )}
      </div>

      <FolderInspectorPanel />

      <ArcAIAssistant
        onSelectAction={() => {
          setIsSearchOpen(true);
        }}
      />

      <CommandPaletteModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
