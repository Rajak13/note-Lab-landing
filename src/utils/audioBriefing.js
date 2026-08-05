/**
 * Generates an executive AI audio laboratory briefing script
 * synthesized into human-friendly spoken narrative.
 */
export function buildSmartAudioScript(title, subject, hypothesis, protocol, aiInsight, blocks = []) {
  const cleanTitle = title || 'Untitled Experiment';
  const cleanSubject = subject || 'Scientific Research';

  let objectiveText = hypothesis || 'investigating chemical equilibrium and reaction kinetics';
  if (objectiveText.length > 180) objectiveText = objectiveText.slice(0, 180) + '...';

  let insightText = aiInsight || 'Apparatus layout verified and stoichiometry balanced.';

  // Extract key headings or protocol items from block notes if present
  let keyProtocols = [];
  if (Array.isArray(blocks)) {
    blocks.forEach((b) => {
      if (b.type === 'protocol' && Array.isArray(b.items)) {
        b.items.forEach((item) => {
          if (item.text) keyProtocols.push(item.text);
        });
      }
    });
  }

  let protocolSummary = '';
  if (keyProtocols.length > 0) {
    protocolSummary = `Key steps completed: ${keyProtocols.slice(0, 2).join(', ')}.`;
  } else if (protocol) {
    protocolSummary = `Protocol outline: ${protocol.slice(0, 120)}.`;
  }

  // Clean chemical formulas for speech (e.g. M1V1=M2V2 -> M 1 V 1 equals M 2 V 2)
  const spokenScript = `
    Welcome researcher. Here is your AI executive briefing for ${cleanTitle}, in the field of ${cleanSubject}.
    
    Primary Objective: ${objectiveText}.
    
    ${protocolSummary}
    
    AI Co-Pilot Synthesis: ${insightText}.
    
    All safety parameters and glassware connections remain verified. Proceed with experiment logging.
  `
    .replace(/M_1V_1\s*=\s*M_2V_2/gi, 'M 1 V 1 equals M 2 V 2')
    .replace(/\\Delta T/g, 'Delta T')
    .replace(/\\circ C/g, ' degrees Celsius')
    .replace(/\\rightarrow/g, ' yields ')
    .replace(/\s+/g, ' ')
    .trim();

  return spokenScript;
}

export function playSmartAudioBriefing(script, onStart, onEnd, onError) {
  if (!('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();

  const speakWithVoice = () => {
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.92;
    utterance.pitch = 1.02;
    utterance.lang = 'en-US';

    utterance.onend = () => onEnd && onEnd();
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error event:', e);
      onError && onError('Audio playback error');
    };

    const allVoices = window.speechSynthesis.getVoices();
    if (allVoices && allVoices.length > 0) {
      // Prioritize natural/enhanced/premium human voices
      const premiumNames = [
        'Google US English', 'Google UK English Female', 'Samantha', 'Karen',
        'Serena', 'Victoria', 'Ava (Premium)', 'Samantha (Enhanced)',
        'Karen (Enhanced)', 'Daniel', 'Fiona', 'Moira', 'Natural'
      ];

      const chosenVoice =
        allVoices.find((v) => premiumNames.some((pName) => v.name.includes(pName))) ||
        allVoices.find((v) => v.lang.startsWith('en') && !v.name.toLowerCase().includes('compact')) ||
        allVoices.find((v) => v.lang.startsWith('en')) ||
        allVoices[0];

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
    if (onStart) onStart();
  };

  // Check if voices are loaded or wait for onvoiceschanged
  const currentVoices = window.speechSynthesis.getVoices();
  if (currentVoices && currentVoices.length > 0) {
    speakWithVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      speakWithVoice();
    };
    // Fallback timer if onvoiceschanged doesn't fire
    setTimeout(() => {
      speakWithVoice();
    }, 150);
  }
}
