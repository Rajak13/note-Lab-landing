import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import styles from './LabAICompanion.module.css';

function renderFormattedMarkdown(text) {
  if (!text) return '';

  // 1. Process inline LaTeX expressions delimited by $ ... $
  let formatted = text.replace(/\$([^$]+)\$/g, (_, latex) => {
    try {
      return katex.renderToString(latex.trim(), { throwOnError: false, displayMode: false });
    } catch {
      return latex;
    }
  });

  // 2. Process bold **text**
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // 3. Process bullet items
  formatted = formatted.replace(/^- (.*)$/gm, '• $1');

  // 4. Convert newlines to breaks
  formatted = formatted.replace(/\n/g, '<br/>');

  return formatted;
}

function AICompanionOrb({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="url(#orbGrad)" />
      <path d="M12 6L14 10L18 12L14 14L12 18L10 14L6 12L10 10L12 6Z" fill="#FFFDF8" />
      <defs>
        <linearGradient id="orbGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E46757" />
          <stop offset="1" stopColor="#C94A3C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const LAB_ASSISTANT_PROMPTS = [
  { id: 'analyze', title: 'Verify Apparatus Assembly', query: 'Check if this experiment assembly has proper glassware connections, heating, and tube routing.' },
  { id: 'reaction', title: 'Explain Reaction Dynamics', query: 'Generate the chemical reaction equations, state symbols, and stoichiometric balancing for this setup.' },
  { id: 'safety', title: 'Safety Hazard Audit', query: 'List safety precautions, PPE requirements, and potential hazards for this lab experiment.' },
  { id: 'stoichiometry', title: 'Calculate Stoichiometry & Yield', query: 'Help calculate theoretical yield and molar concentration ratios for titrant vs analyte.' },
];

function analyzeExperimentFromNodes(nodes = [], query = '') {
  if (!nodes || !nodes.length) {
    return `Your canvas is currently empty! Drag equipment from the sidebar or load an assembly preset above, and I will analyze the experiment for you.`;
  }

  const shapes = nodes.map((n) => n.shape);
  const names = nodes.map((n) => n.label || n.shape).filter(Boolean).join(', ');
  const qLower = query.toLowerCase();

  const isDistillation = shapes.includes('liebigCondenser') && (shapes.includes('roundFlask') || shapes.includes('erlenmeyer'));
  const isTitration = shapes.includes('burette');
  const isGasGen = (shapes.includes('thistleTube') || shapes.includes('uTube') || shapes.includes('elbowTube')) && shapes.includes('roundFlask');
  const isFiltration = shapes.includes('filterFunnel');
  const isEvaporation = (shapes.includes('bunsenBurner') || shapes.includes('hotPlate')) && (shapes.includes('evaporatingDish') || shapes.includes('beaker'));

  // 1. CHEMICALS / REAGENTS INQUIRY
  if (qLower.includes('chemical') || qLower.includes('reagent') || qLower.includes('use') || qLower.includes('solution') || qLower.includes('substance') || qLower.includes('sample')) {
    if (isDistillation) {
      return `🧪 **Recommended Chemical Reagents for Distillation**:\n\n1. **Ethanol & Water Mixture** ($C_2H_5OH + H_2O$):\n   - Ethanol boils at $78.37^\\circ\\text{C}$ and distills off first.\n   - Water ($100^\\circ\\text{C}$) remains in the boiling flask.\n2. **Acetone & Water** ($CH_3COCH_3 + H_2O$):\n   - Acetone distills off at $56^\\circ\\text{C}$.\n3. **Salt Water / Brackish Sea Water**:\n   - Simple distillation yields pure liquid distillate ($H_2O$) in the receiving flask.\n\n⚠️ **Essential Additive**: Always add $2-3$ **Boiling Chips (Anti-bumping granules)** to the boiling flask to promote smooth boiling without liquid bumping!`;
    }
    if (isTitration) {
      return `🧪 **Recommended Chemical Reagents for Acid-Base Titration**:\n\n1. **Standard Titrant** (in Burette):\n   - $0.100\\,\\text{M}$ Sodium Hydroxide ($\\text{NaOH}$) standard solution.\n2. **Unknown Analyte** (in Erlenmeyer Flask):\n   - $25.0\\,\\text{mL}$ Hydrochloric Acid ($\\text{HCl}$) or Vinegar (Ethanoic acid).\n3. **pH Indicator**:\n   - $2-3$ drops of **Phenolphthalein** (turns from colorless to permanent faint pink at equivalence endpoint $\\text{pH } 8.2-10.0$).`;
    }
    if (isGasGen) {
      return `🧪 **Recommended Chemical Reagents for Gas Preparation**:\n\n1. **Hydrogen Gas** ($\\text{H}_2\\uparrow$):\n   - **Solid**: Zinc granules ($\\text{Zn}$).\n   - **Liquid**: Dilute Hydrochloric acid ($2\\,\\text{M } \\text{HCl}$).\n2. **Carbon Dioxide Gas** ($\\text{CO}_2\\uparrow$):\n   - **Solid**: Calcium carbonate ($\\text{CaCO}_3$ marble chips).\n   - **Liquid**: Dilute Hydrochloric acid ($\\text{HCl}$).`;
    }
    return `🧪 **General Chemical Reagents**:\nFor this assembly (${names}), standard aqueous solutions, diluted acid/base titrants, or ethanol/water solvent mixtures can be safely processed.`;
  }

  // 2. PROCEDURE / STEPS INQUIRY
  if (qLower.includes('procedure') || qLower.includes('step') || qLower.includes('how to') || qLower.includes('run') || qLower.includes('operate') || qLower.includes('do')) {
    if (isDistillation) {
      return `📋 **Distillation Operating Procedure**:\n1. Pour mixture into boiling flask with anti-bumping granules.\n2. Turn on cooling water inlet (bottom port of Liebig condenser).\n3. Heat boiling flask gently with Bunsen burner or heating mantle.\n4. Monitor vapor temperature on thermometer ($78^\\circ\\text{C}$ for ethanol).\n5. Collect pure liquid distillate fractions in receiving flask.`;
    }
    if (isTitration) {
      return `📋 **Titration Operating Procedure**:\n1. Fill burette with $0.100\\,\\text{M } \\text{NaOH}$ titrant and record initial volume $V_i$.\n2. Pipette $25.0\\,\\text{mL}$ acid analyte into Erlenmeyer flask; add 2 drops Phenolphthalein.\n3. Open stopcock to swirl and deliver titrant dropwise until faint pink color persists for 30 seconds.\n4. Record final burette volume $V_f$ and calculate $\\Delta V = V_f - V_i$.`;
    }
  }

  // 3. SAFETY INQUIRY
  if (qLower.includes('safety') || qLower.includes('hazard') || qLower.includes('danger') || qLower.includes('precaution') || qLower.includes('warning') || qLower.includes('caution')) {
    return `⚠️ **Safety Audit for Assembly**:\n1. Wear splash-proof chemical safety goggles and nitrile gloves.\n2. Ensure all glass joints and rubber tubing clamps are sealed airtight.\n3. Never heat a sealed closed system — keep receiver adapter vent open to atmosphere!`;
  }

  // 4. GENERAL EXPERIMENT OVERVIEW INQUIRY
  if (isDistillation) {
    return `⚗️ **Simple / Fractional Distillation Setup**\n\nThis experiment is configured for **Distillation** — a physical separation process used to purify liquids or separate volatile liquid mixtures based on differences in boiling points.\n\n- **Boiling Flask**: Heated liquid mixture vaporizes.\n- **Thermometer**: Measures vapor head temperature at the distilling head junction.\n- **Liebig Condenser**: Cold water jacket condenses vapor back into pure liquid distillate.\n- **Receiving Flask**: Collects condensed pure fractions.`;
  }

  if (isTitration) {
    return `🧪 **Acid-Base Volumetric Titration Assembly**\n\nThis setup is for **Quantitative Titration** — a laboratory method to determine the unknown concentration of an analyte by neutralising it with a standard titrant solution.\n\n- **Burette with Stopcock**: Delivers precise volume of titrant dropwise.\n- **Erlenmeyer Flask**: Holds analyte solution with acid-base indicator (e.g. Phenolphthalein).\n- **Equivalence Point**: $\\text{M}_1 \\text{V}_1 = \\text{M}_2 \\text{V}_2$ at color change endpoint.`;
  }

  if (isGasGen) {
    return `💨 **Gas Generation & Water Displacement Collection**\n\nThis setup is designed for **Gas Preparation & Collection** (such as $\\text{H}_2$, $\\text{CO}_2$, or $\\text{O}_2$ gas generation).\n\n- **Thistle Funnel**: Allows safe addition of liquid reagent (e.g. dilute $\\text{HCl}$) below liquid seal level.\n- **Generator Flask**: Solid reactant (e.g. $\\text{Zn}$ granules or $\\text{CaCO}_3$) reacts to release gas.\n- **Delivery Tubing**: Routes evolved gas to collection vessel.`;
  }

  if (isFiltration) {
    return `⏳ **Gravimetric Filtration Setup**\n\nThis setup is for **Solid-Liquid Separation** using filter paper to isolate solid precipitate from filtrate liquid.`;
  }

  if (isEvaporation) {
    return `🔥 **Thermal Evaporation & Crystallization Setup**\n\nThis setup is used to evaporate solvent from a solution to obtain solid solute crystals.`;
  }

  return `🔬 **Detected Laboratory Components**:\nThis assembly contains **${nodes.length} apparatus items** (${names}).\n\nBased on your arrangement, this setup can be used for chemical reaction synthesis, thermal processing, or fluid transfer. Ask me about safety guidelines, reaction equations, or recommended chemical reagents!`;
}

export default function LabAICompanion({ nodes, edges, onApplySuggestion }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('assistant');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your NoteLab Science Assistant. Click any analysis action below or ask me any question about your experiment setup.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchAIResponse = async (userText) => {
    try {
      const response = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          context: {
            title: 'Chemistry Laboratory Diagram',
            nodes: nodes.map((n) => ({ id: n.id, type: n.shape, label: n.label || n.shape })),
            edges: edges.map((e) => ({ from: e.from, to: e.to, label: e.label })),
          },
        }),
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim()) return text;
      }
    } catch (err) {
      console.warn('Backend AI endpoint unavailable, using local canvas analysis fallback:', err);
    }

    // Fallback to local canvas analyzer if backend route is offline
    return analyzeExperimentFromNodes(nodes, userText);
  };

  const handlePromptClick = async (prompt) => {
    setIsAnalyzing(true);
    const userMsg = { sender: 'user', text: prompt.title };
    setMessages((prev) => [...prev, userMsg]);

    const aiReply = await fetchAIResponse(prompt.query || prompt.title);
    setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    setIsAnalyzing(false);
  };

  const handleSendCustomQuery = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsAnalyzing(true);

    const aiReply = await fetchAIResponse(userText);
    setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    setIsAnalyzing(false);
  };

  return (
    <div className={styles.companionDock}>
      {isOpen && (
        <div className={styles.companionDrawer} role="dialog" aria-label="Lab Study Companion">
          <div className={styles.drawerHeader}>
            <div className={styles.drawerTitleGroup}>
              <AICompanionOrb className={styles.drawerOrb} />
              <div>
                <span className={styles.drawerTitle}>Lab Study Companion</span>
                <span className={styles.drawerSubtitle}>AI Science Assistant</span>
              </div>
            </div>
            <button type="button" className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className={styles.promptChips}>
            {LAB_ASSISTANT_PROMPTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={styles.promptChip}
                onClick={() => handlePromptClick(p)}
                disabled={isAnalyzing}
              >
                + {p.title}
              </button>
            ))}
          </div>

          <div className={styles.chatStream}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`${styles.chatBubble} ${m.sender === 'user' ? styles.userBubble : styles.aiBubble}`}
              >
                <div
                  className={styles.bubbleText}
                  dangerouslySetInnerHTML={{ __html: renderFormattedMarkdown(m.text) }}
                />
              </div>
            ))}
            {isAnalyzing && (
              <div className={`${styles.chatBubble} ${styles.aiBubble}`}>
                <div className={styles.typingDots}>Analyzing experiment layout...</div>
              </div>
            )}
          </div>

          <form className={styles.inputRow} onSubmit={handleSendCustomQuery}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Ask Lab Assistant a question..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
            <button type="submit" className={styles.sendBtn} disabled={!inputQuery.trim() || isAnalyzing}>
              Ask
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className={styles.triggerPill}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <AICompanionOrb className={styles.triggerOrb} />
        <span>Lab AI Companion</span>
      </button>
    </div>
  );
}
