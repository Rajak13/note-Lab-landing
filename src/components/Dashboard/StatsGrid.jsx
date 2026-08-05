import React, { useState, useRef, useEffect } from 'react';
import styles from './StatsGrid.module.css';
import { StudyJourneyConstellation, StudyProgressArc, SectionDividerMotif } from './DashboardIllustrations';
import { SparklesIcon } from './EducationalSVG';
import { getApiUrl } from '../../config/api';
import { buildSmartAudioScript, playSmartAudioBriefing } from '../../utils/audioBriefing';

export default function StatsGrid({ experiments = [] }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const activeExp = experiments.length > 0 ? experiments[0] : null;
  const title = activeExp?.title || 'Research Protocols & Analysis';
  const paperText = activeExp?.hypothesis || activeExp?.materials || 'Electrophilic aromatic substitution involves the attack of an electron-rich aromatic ring on an electrophile, generating a resonance-stabilized intermediate.';
  const formulaText = activeExp?.protocol ? `Protocol: ${activeExp.protocol.slice(0, 30)}` : 'r = k [ArH] [E⁺]';

  const totalExps = experiments.length;

  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      stopAllAudio();
      setIsPlayingAudio(false);
      return;
    }

    stopAllAudio();

    let parsedBlocks = [];
    try {
      if (activeExp?.blocks) parsedBlocks = JSON.parse(activeExp.blocks);
    } catch (e) {}

    const script = buildSmartAudioScript(
      title,
      activeExp?.subject,
      activeExp?.hypothesis,
      activeExp?.protocol,
      activeExp?.aiInsight,
      parsedBlocks
    );

    const savedKey = localStorage.getItem('notelab_tts_key');
    const savedService = localStorage.getItem('notelab_tts_service') || 'elevenlabs';
    const savedVoice = localStorage.getItem('notelab_tts_voice') || 'cgSgspJ2msm6clMCkdW9';

    if (savedKey) {
      try {
        const res = await fetch(getApiUrl('/api/tts/speak'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': savedKey },
          body: JSON.stringify({ text: script, service: savedService, voiceId: savedVoice })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('audio')) {
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          audio.onended = () => {
            setIsPlayingAudio(false);
            audioRef.current = null;
          };
          audio.onerror = () => {
            setIsPlayingAudio(false);
            audioRef.current = null;
          };

          await audio.play();
          setIsPlayingAudio(true);
          return;
        }
      } catch (err) {
        console.warn('Neural TTS fetch error, fallback active');
      }
    }

    playSmartAudioBriefing(
      script,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className={styles.workspaceFlow}>
      <section className={styles.researchSection} aria-labelledby="research-heading">
        <div className={styles.sectionIntro}>
          <SectionDividerMotif />
          <div>
            <p className={styles.sectionEyebrow}>Research workspace</p>
            <h2 id="research-heading" className={styles.sectionTitle}>
              {title}
            </h2>
          </div>
        </div>

        <div className={styles.paperCanvas}>
          <div className={styles.redMargin} aria-hidden="true" />
          <div className={styles.pinnedNote} aria-hidden="true">
            {activeExp ? `Status: ${activeExp.status || 'Active'}` : 'Lab Ready'}
          </div>
          <p className={styles.paperBody}>
            {paperText}
          </p>
          <p className={styles.handAnnotation}>← active lab protocol notes</p>

          <div className={styles.formulaBox}>
            <span className={styles.formulaHighlight}>{formulaText}</span>
            <span className={styles.formulaNote}>{activeExp?.subject || 'chemistry'}</span>
          </div>

          <div className={styles.audioRow}>
            <span className={styles.audioLabel}>
              <SparklesIcon size={15} />
              AI Audio Summary · {isPlayingAudio ? 'Speaking...' : 'Ready'}
            </span>
            <button
              type="button"
              className={styles.audioBtn}
              onClick={handleToggleAudio}
            >
              {isPlayingAudio ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
      </section>

      <section className={styles.journeySection} aria-labelledby="journey-heading">
        <div className={styles.journeyLayout}>
          <div className={styles.journeyCopy}>
            <p className={styles.sectionEyebrow}>Study journey</p>
            <h2 id="journey-heading" className={styles.sectionTitle}>
              Your year in focus
            </h2>
            <p className={styles.journeyDesc}>
              {totalExps > 0
                ? `${totalExps} research notebook${totalExps !== 1 ? 's' : ''} logged in your constellation.`
                : 'Each node marks a study session — a constellation of your research.'}
            </p>
            <div className={styles.streakBadge}>{totalExps > 0 ? `${totalExps * 3 + 2} entries` : 'Ready to start'}</div>
          </div>
          <div className={styles.constellationWrap}>
            <StudyJourneyConstellation className={styles.constellation} />
          </div>
        </div>
      </section>

      <section className={styles.insightsSection} aria-labelledby="insights-heading">
        <div className={styles.insightsLayout}>
          <div>
            <p className={styles.sectionEyebrow}>Knowledge insights</p>
            <h2 id="insights-heading" className={styles.sectionTitle}>
              Retention & Sync
            </h2>
            <p className={styles.insightsDesc}>
              Vector diagrams, Notion-style block notes, and AI co-pilot active.
            </p>
          </div>
          <div className={styles.insightsMetrics}>
            <StudyProgressArc progress={totalExps > 0 ? 100 : 0} size={80} />
            <div className={styles.insightsBreakdown}>
              <span>Notebooks <strong>{totalExps}</strong></span>
              <span>Diagrams <strong>Active</strong></span>
              <span>AI Engine <strong>Connected</strong></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
