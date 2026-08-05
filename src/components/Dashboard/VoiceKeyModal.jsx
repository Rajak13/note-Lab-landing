import React, { useState } from 'react';
import styles from './VoiceKeyModal.module.css';

export default function VoiceKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('notelab_tts_key') || '');
  const [service, setService] = useState(() => localStorage.getItem('notelab_tts_service') || 'elevenlabs');
  const [voiceId, setVoiceId] = useState(() => {
    const saved = localStorage.getItem('notelab_tts_voice');
    return (saved && saved !== '21m00Tcm4TlvDq8ikWAM') ? saved : 'cgSgspJ2msm6clMCkdW9';
  });

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('notelab_tts_key', apiKey.trim());
    localStorage.setItem('notelab_tts_service', service);
    localStorage.setItem('notelab_tts_voice', voiceId);
    onSave && onSave({ apiKey: apiKey.trim(), service, voiceId });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Configure Realistic AI Voice (TTS API)</h3>
            <p className={styles.modalSubtitle}>
              Paste your ElevenLabs or OpenAI API Key for studio-quality neural voice synthesis.
            </p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Voice Provider</label>
            <div className={styles.radioRow}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="service"
                  value="elevenlabs"
                  checked={service === 'elevenlabs'}
                  onChange={() => {
                    setService('elevenlabs');
                    setVoiceId('21m00Tcm4TlvDq8ikWAM');
                  }}
                />
                <span>ElevenLabs (Ultra-Realistic)</span>
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="service"
                  value="openai"
                  checked={service === 'openai'}
                  onChange={() => {
                    setService('openai');
                    setVoiceId('nova');
                  }}
                />
                <span>OpenAI TTS (Studio Voice)</span>
              </label>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>API Key</label>
            <input
              type="password"
              className={styles.input}
              placeholder={service === 'elevenlabs' ? 'xi-api-key (e.g. 82a9f...)' : 'sk-... (OpenAI Key)'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <span className={styles.hintText}>
              Your key is saved locally in your browser and used only for audio synthesis.
            </span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Voice Selection</label>
            {service === 'elevenlabs' ? (
              <select className={styles.select} value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
                <option value="cgSgspJ2msm6clMCkdW9">Jessica — Warm Natural Female (Free Tier ✓)</option>
                <option value="JBFqnCBsd6RMkjVDRZzb">George — Professional Warm Male (Free Tier ✓)</option>
                <option value="EXAVITQu4vr4xnSDxMaL">Bella — Expressive Female (Free Tier ✓)</option>
                <option value="pNInz6obpgDQGcFmaJgB">Adam — Deep Executive Male (Free Tier ✓)</option>
              </select>
            ) : (
              <select className={styles.select} value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
                <option value="nova">Nova — Warm & Energetic Female</option>
                <option value="alloy">Alloy — Balanced Neutral</option>
                <option value="shimmer">Shimmer — Clear Expressive Female</option>
                <option value="echo">Echo — Smooth Deep Male</option>
                <option value="fable">Fable — British Narrative</option>
              </select>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Save Voice Key ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
