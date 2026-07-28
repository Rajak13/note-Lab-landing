import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getApiUrl } from '../config/api';
import BlockEditor from '../components/BlockEditor/BlockEditor';
import DiagramCanvas from '../components/DiagramCanvas/DiagramCanvas';
import AIDrawer from '../components/AI/AIDrawer';
import styles from './NotebookPage.module.css';
import { buildSmartAudioScript, playSmartAudioBriefing } from '../utils/audioBriefing';

/* ── Icons ── */
function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 3H11L13 5V13H3V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="5.5" y="3" width="5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4.5" y="9" width="7" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.spinner}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 12" />
    </svg>
  );
}
function AIIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 5L6 7L8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function NotesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 3H13M3 7H10M3 11H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function DiagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M6 2V6L2 12H14L10 6V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="5" y1="2" x2="11" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const SAVE_DEBOUNCE_MS = 1200;

export default function NotebookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [experiment, setExperiment] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [canvasJson, setCanvasJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [titleValue, setTitleValue] = useState('');
  const [activeView, setActiveView] = useState('notes'); // 'notes' | 'diagram'
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleAudioSummary = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Browser audio speech engine not supported');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      toast.info('Audio briefing paused');
      return;
    }

    const script = buildSmartAudioScript(
      titleValue,
      experiment?.subject,
      experiment?.hypothesis,
      experiment?.protocol,
      experiment?.aiInsight,
      blocks
    );

    playSmartAudioBriefing(
      script,
      () => {
        setIsPlayingAudio(true);
        toast.success('Playing Executive AI Audio Briefing 🎧', 'AI Voice Briefing');
      },
      () => setIsPlayingAudio(false),
      (err) => {
        setIsPlayingAudio(false);
        toast.error(err);
      }
    );
  };

  // Parsed canvas nodes+edges for AI context (kept in sync on every canvasJson change)
  const canvasParsed = useMemo(() => {
    try { return canvasJson ? JSON.parse(canvasJson) : { nodes: [], edges: [] }; } catch { return { nodes: [], edges: [] }; }
  }, [canvasJson]);

  // The full experiment context sent to the AI drawer
  const aiContext = useMemo(() => ({
    title:   titleValue || 'Untitled Experiment',
    subject: experiment?.subject || '',
    nodes:   canvasParsed.nodes || [],
    edges:   canvasParsed.edges || [],
    blocks,
  }), [titleValue, experiment, canvasParsed, blocks]);

  const saveTimerRef = useRef(null);

  /* ── Load experiment ── */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(getApiUrl(`/api/experiments/${id}`), { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setExperiment(data);
        setTitleValue(data.title || 'Untitled Notebook');
        try {
          const parsed = data.blocks ? JSON.parse(data.blocks) : [];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBlocks(parsed);
          } else {
            // Default Authentic Interactive Lab Journal Template
            setBlocks([
              { id: nanoid(6), type: 'h1', content: `${data.title || 'Simple Distillation'} — Lab Journal` },
              { id: nanoid(6), type: 'callout', variant: 'warning', content: '⚠️ SAFETY FIRST: Wear splash-proof goggles & lab coat. Never seal a distillation system completely — keep receiver vent adapter open to atmosphere to prevent pressure buildup!' },
              { id: nanoid(6), type: 'h2', content: '1. Objective' },
              { id: nanoid(6), type: 'protocol', items: [
                { id: nanoid(4), text: 'To separate ethanol and water mixture based on differences in boiling points (78.37°C vs 100°C).', checked: true },
                { id: nanoid(4), text: 'To record temperature profile during liquid-vapour equilibrium transition.', checked: false },
              ]},
              { id: nanoid(6), type: 'h2', content: '2. Apparatus Verification Checklist' },
              { id: nanoid(6), type: 'protocol', items: [
                { id: nanoid(4), text: 'Distillation Round Boiling Flask (250 mL)', checked: true },
                { id: nanoid(4), text: 'Liebig Condenser with rubber cooling water hoses', checked: true },
                { id: nanoid(4), text: 'Thermometer (0 - 150°C) positioned at vapor head junction', checked: true },
                { id: nanoid(4), text: 'Receiving Erlenmeyer Flask', checked: true },
                { id: nanoid(4), text: 'Bunsen Burner / Heating Mantle & Retort Support Stand', checked: true },
                { id: nanoid(4), text: 'Anti-bumping granules (Boiling Chips)', checked: false },
              ]},
              { id: nanoid(6), type: 'h2', content: '3. Procedure Protocols' },
              { id: nanoid(6), type: 'protocol', items: [
                { id: nanoid(4), text: '1. Assemble apparatus as shown in the diagram tab, ensuring all glass joints are secure and lightly greased.', checked: true },
                { id: nanoid(4), text: '2. Fill distillation flask to no more than 2/3 capacity with liquid sample mixture and add 3 boiling chips.', checked: false },
                { id: nanoid(4), text: '3. Position thermometer bulb level with lower entrance of condenser sidearm.', checked: false },
                { id: nanoid(4), text: '4. Turn on cooling water (inlet at lower port, outlet at upper port).', checked: false },
                { id: nanoid(4), text: '5. Heat gently using Bunsen burner until liquid begins to boil steadily.', checked: false },
                { id: nanoid(4), text: '6. Collect pure distillate fractions at 78.5°C in receiving flask.', checked: false },
                { id: nanoid(4), text: '7. Turn off burner before boiling flask becomes completely dry.', checked: false },
              ]},
              { id: nanoid(6), type: 'h2', content: '4. Observations Log' },
              { id: nanoid(6), type: 'table', rows: [
                ['Time (min)', 'Vapor Temp (°C)', 'Distillate Vol (mL)', 'Visual Observations'],
                ['0 min', '22.0°C', '0.0 mL', 'Liquid mixture quiet, heat applied.'],
                ['5 min', '78.2°C', '1.5 mL', 'Vapor reaches condenser, clear droplets form.'],
                ['10 min', '78.5°C', '8.0 mL', 'Steady distillation of pure ethanol fraction.'],
                ['15 min', '95.0°C', '12.5 mL', 'Temperature rises; swap receiving flask for water fraction.'],
              ]},
              { id: nanoid(6), type: 'h2', content: '5. Separation Principle & Reaction Equations' },
              { id: nanoid(6), type: 'formula', content: '\\Delta T = T_{\\text{water}} - T_{\\text{ethanol}} = 100^\\circ\\text{C} - 78.37^\\circ\\text{C} = 21.63^\\circ\\text{C}' },
              { id: nanoid(6), type: 'h2', content: '6. Expected Results & Conclusion' },
              { id: nanoid(6), type: 'text', content: 'A clear distillate of purified ethanol is collected in the receiving flask at 78.5°C while non-volatile residue remains in the original boiling flask.' },
            ]);
          }
        } catch { setBlocks([]); }
        setCanvasJson(data.canvasJson || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error('Failed to load notebook', 'Connection Error');
      });
  }, [id]);

  /* ── Generic debounced save ── */
  const scheduleAutosave = useCallback((payload) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        await fetch(getApiUrl(`/api/experiments/${id}`), {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setLastSaved(new Date());
      } catch {
        toast.error('Auto-save failed', 'Save Error');
      } finally {
        setSaving(false);
      }
    }, SAVE_DEBOUNCE_MS);
  }, [id, toast]);

  /* ── Blocks change ── */
  const handleBlocksChange = useCallback((nextBlocks) => {
    setBlocks(nextBlocks);
    scheduleAutosave({ blocks: JSON.stringify(nextBlocks), title: titleValue });
  }, [scheduleAutosave, titleValue]);

  /* ── Canvas change ── */
  const handleCanvasChange = useCallback((nextJson) => {
    setCanvasJson(nextJson);
    scheduleAutosave({ canvasJson: nextJson, title: titleValue });
  }, [scheduleAutosave, titleValue]);

  /* ── Manual save ── */
  const handleManualSave = async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaving(true);
    try {
      await fetch(getApiUrl(`/api/experiments/${id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: JSON.stringify(blocks),
          canvasJson,
          title: titleValue,
        }),
      });
      setLastSaved(new Date());
      toast.success('Notebook saved', 'Saved');
    } catch {
      toast.error('Save failed', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleBlur = () => {
    scheduleAutosave({ blocks: JSON.stringify(blocks), canvasJson, title: titleValue });
  };

  const formatLastSaved = (date) => {
    if (!date) return null;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <p>Opening notebook…</p>
      </div>
    );
  }

  return (
    <div className={styles.notebookPage}>
      {/* ── Top Bar ── */}
      <header className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <BackArrowIcon /><span>Workspace</span>
        </button>

        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbRoot}>Workspace</span>
          <ChevronIcon />
          <span className={styles.breadcrumbLeaf}>{experiment?.subject || 'Research'}</span>
          <ChevronIcon />
          <span className={styles.breadcrumbCurrent}>{titleValue}</span>
        </div>

        {/* ── View toggle (center of top bar) ── */}
        <div className={styles.viewToggle}>
          <button
            type="button"
            className={`${styles.viewToggleBtn} ${activeView === 'notes' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setActiveView('notes')}
          >
            <NotesIcon /> Notes
          </button>
          <button
            type="button"
            className={`${styles.viewToggleBtn} ${activeView === 'diagram' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setActiveView('diagram')}
          >
            <DiagramIcon /> Diagram
          </button>
        </div>

        <div className={styles.topBarActions}>
          {lastSaved && !saving && <span className={styles.savedLabel}>Saved {formatLastSaved(lastSaved)}</span>}
          {saving && <span className={styles.savingLabel}><SpinnerIcon /> Saving…</span>}
          <button
            type="button"
            className={styles.saveBtn}
            onClick={() => setIsAIOpen(true)}
            style={{
              background: 'rgba(228, 103, 87, 0.12)',
              color: 'var(--color-coral-dark, #C94A3C)',
              fontWeight: 700,
              marginRight: 6
            }}
          >
            ✨ AI Co-Pilot
          </button>
          <button
            type="button"
            className={`${styles.saveBtn} ${isPlayingAudio ? styles.audioActiveBtn : ''}`}
            onClick={handleToggleAudioSummary}
            title="Listen to AI Audio Laboratory Summary"
            style={{
              background: isPlayingAudio ? '#059669' : 'rgba(44, 36, 32, 0.06)',
              color: isPlayingAudio ? '#FFF' : 'var(--color-text-dark)',
              marginRight: 6
            }}
          >
            {isPlayingAudio ? '🔊 Pause Briefing' : '🎧 Audio Briefing'}
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleManualSave} disabled={saving}>
            <SaveIcon /> Save
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════
          NOTES VIEW
          ══════════════════════════════════════ */}
      {activeView === 'notes' && (
        <div className={styles.paperArea}>
          <div className={styles.paper}>
            <div className={styles.marginRule} />

            <input
              className={styles.notebookTitle}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Untitled Notebook"
            />

            <div className={styles.notebookMeta}>
              <span>LAB NOTEBOOK</span><span>·</span>
              <span>{new Date(experiment?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {experiment?.subject && <><span>·</span><span>{experiment.subject}</span></>}
            </div>

            <div className={styles.divider} />

            <div className={styles.slashHint}>
              Type <kbd>/</kbd> anywhere to insert a block — headings, protocol steps, LaTeX formulas, tables, and more.
            </div>

            <BlockEditor initialBlocks={blocks} onChange={handleBlocksChange} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          DIAGRAM VIEW — full height canvas
          ══════════════════════════════════════ */}
      {activeView === 'diagram' && (
        <div className={styles.diagramArea}>
          <div className={styles.diagramHeader}>
            <div className={styles.diagramHeaderLeft}>
              <span className={styles.diagramHeaderTitle}>{titleValue} — Experiment Diagram</span>
              <span className={styles.diagramHeaderSub}>Draw your apparatus, reaction mechanism, or process flow</span>
            </div>
            <div className={styles.diagramHeaderHints}>
              <kbd>Alt + drag</kbd> pan &nbsp;·&nbsp; <kbd>Scroll</kbd> zoom &nbsp;·&nbsp; <kbd>Del</kbd> delete &nbsp;·&nbsp; <kbd>⌘Z</kbd> undo &nbsp;·&nbsp; <kbd>Esc</kbd> cancel
            </div>
          </div>
          <div className={styles.diagramCanvasWrap}>
            <DiagramCanvas initialJson={canvasJson} onChange={handleCanvasChange} />
          </div>
        </div>
      )}
      {/* ── AI Co-Pilot Drawer ── */}
      <AIDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        context={aiContext}
      />
    </div>
  );
}
