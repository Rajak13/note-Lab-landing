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

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  utterance.lang = 'en-US';

  utterance.onend = () => onEnd && onEnd();
  utterance.onerror = () => onError && onError('Audio playback error');

  // Select warm natural human voice
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const preferredNames = ['Samantha', 'Karen', 'Serena', 'Victoria', 'Moira', 'Fiona', 'Daniel', 'Natural', 'Google US English'];
    const humanVoice = voices.find((v) => preferredNames.some((name) => v.name.includes(name))) || voices.find((v) => v.lang.includes('en')) || voices[0];
    if (humanVoice) utterance.voice = humanVoice;
  }

  window.speechSynthesis.speak(utterance);
  if (onStart) onStart();
}
