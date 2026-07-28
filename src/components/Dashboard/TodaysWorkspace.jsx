import React, { useState, useEffect } from 'react';
import styles from './TodaysWorkspace.module.css';

function CoffeeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 5H11V9.5C11 10.8807 9.88071 12 8.5 12H5.5C4.11929 12 3 10.8807 3 9.5V5Z" stroke="var(--color-coral)" strokeWidth="1.5" />
      <path d="M11 6H12.5C13.3284 6 14 6.67157 14 7.5V7.5C14 8.32843 13.3284 9 12.5 9H11" stroke="var(--color-coral)" strokeWidth="1.5" />
    </svg>
  );
}

function NotebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="var(--color-coral)" strokeWidth="1.5" />
      <line x1="6" y1="5" x2="10" y2="5" stroke="var(--color-coral)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 2H10M7 2V6L3.5 12.5C3.1 13.2 3.6 14 4.4 14H11.6C12.4 14 12.9 13.2 12.5 12.5L9 6V2" stroke="var(--color-coral)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="10" height="9" rx="2" stroke="var(--color-coral)" strokeWidth="1.5" />
      <circle cx="6" cy="7.5" r="1" fill="var(--color-coral)" />
      <circle cx="10" cy="7.5" r="1" fill="var(--color-coral)" />
      <line x1="5.5" y1="10.5" x2="10.5" y2="10.5" stroke="var(--color-coral)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="8" y1="1" x2="8" y2="4" stroke="var(--color-coral)" strokeWidth="1.4" />
    </svg>
  );
}

const FLASHCARDS = [
  {
    question: 'What is the physical principle behind Simple Distillation?',
    answer: 'Simple distillation separates liquids based on significant differences in their boiling points. The lower-boiling component vaporizes first and condenses back into liquid in the Liebig condenser.',
    subject: 'Chemistry',
  },
  {
    question: 'Where should the thermometer bulb be placed in a distillation head?',
    answer: 'Directly level with the lower entrance of the condenser sidearm to measure the accurate vapor head temperature before condensation.',
    subject: 'Laboratory Setup',
  },
  {
    question: 'What is the stoichiometric equation at the titration equivalence point?',
    answer: 'M₁V₁ = M₂V₂ (for 1:1 acid-base neutralization). At the equivalence point, moles of acid added equal moles of base present.',
    subject: 'Quantitative Chemistry',
  },
  {
    question: 'Why are anti-bumping granules (boiling chips) added to heating flasks?',
    answer: 'Boiling chips promote smooth, uniform bubble formation, preventing superheating and violent sudden boiling (bumping).',
    subject: 'Lab Safety',
  },
];

const QUIZ_QUESTIONS = [
  {
    question: 'Which piece of apparatus delivers titrant dropwise in volumetric titration?',
    options: ['Erlenmeyer Flask', 'Burette with Stopcock', 'Graduated Cylinder', 'Liebig Condenser'],
    correct: 1,
    explanation: 'A Burette with a stopcock allows precise, dropwise control of the titrant solution.',
  },
  {
    question: 'Where does cooling water enter in a Liebig Condenser?',
    options: ['Top outlet port', 'Lower inlet port', 'Vapor entrance', 'Receiving adapter'],
    correct: 1,
    explanation: 'Water enters through the lower inlet to ensure the condenser jacket remains fully filled against gravity.',
  },
  {
    question: 'What color change does Phenolphthalein undergo at the neutralization endpoint?',
    options: ['Pink to Dark Blue', 'Colorless to Faint Pink', 'Yellow to Red', 'Green to Colorless'],
    correct: 1,
    explanation: 'Phenolphthalein turns from colorless in acidic solution to a persistent faint pink at pH 8.2–10.0.',
  },
];

export default function TodaysWorkspace({
  experiments = [],
  onContinue,
  onCreateExperiment,
  onOpenConversation,
}) {
  const [agenda, setAgenda] = useState([
    { id: 1, text: 'Log initial reaction protocols', time: '09:00', done: true },
    { id: 2, text: 'Draw apparatus setup diagram', time: '11:30', done: true },
    { id: 3, text: 'Run AI Safety Check & Stoichiometry', time: '14:00', done: false },
    { id: 4, text: 'Review research notes & exports', time: '16:30', done: false },
  ]);

  // Pomodoro Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Active Modals
  const [activeModal, setActiveModal] = useState(null); // 'flashcards' | 'quiz' | null

  // Flashcards state
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleAgenda = (id) => {
    setAgenda((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const handleSelectQuizOpt = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === QUIZ_QUESTIONS[quizIdx].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIdx + 1 < QUIZ_QUESTIONS.length) {
      setQuizIdx((i) => i + 1);
      setSelectedOpt(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setQuizFinished(false);
  };

  const latestExp = Array.isArray(experiments) && experiments.length > 0 ? experiments[0] : null;

  return (
    <section className={styles.todaysWorkspace} aria-label="Today's workspace">
      {/* Column 1 — Mission */}
      <div className={styles.col}>
        <p className={styles.colEyebrow}>Today&apos;s mission</p>
        <ul className={styles.agendaList}>
          {agenda.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.agendaItem} ${item.done ? styles.agendaDone : ''}`}
                onClick={() => toggleAgenda(item.id)}
              >
                <span className={item.done ? styles.checkDone : styles.checkOpen}>
                  {item.done ? '✓' : '○'}
                </span>
                <span className={styles.agendaText}>{item.text}</span>
                <span className={styles.agendaTime}>{item.time}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.colRule} aria-hidden="true" />

      {/* Column 2 — Continue + AI */}
      <div className={styles.col}>
        <p className={styles.colEyebrow}>Active Research</p>
        {latestExp ? (
          <div className={styles.continueBlock}>
            <h3 className={styles.continueTitle}>{latestExp.title || 'Untitled Protocol'}</h3>
            <div className={styles.progressRow}>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '85%' }} />
              </div>
              <span className={styles.progressPct}>85%</span>
            </div>
            <p className={styles.continueMeta}>
              Subject: {latestExp.subject || 'Chemistry'} · Status: {latestExp.status || 'Active'}
            </p>
            <button type="button" className={styles.textLink} onClick={onContinue}>
              Open notebook →
            </button>
          </div>
        ) : (
          <div className={styles.continueBlock}>
            <h3 className={styles.continueTitle}>No active notebook</h3>
            <p className={styles.continueMeta}>Create your first research notebook to get started.</p>
            {onCreateExperiment && (
              <button type="button" className={styles.textLink} onClick={() => onCreateExperiment()}>
                + Create Notebook →
              </button>
            )}
          </div>
        )}

        <p className={styles.colEyebrow} style={{ marginTop: 'var(--space-28)' }}>
          Recent AI Research Notebooks
        </p>
        <ul className={styles.linkList}>
          {experiments.slice(0, 2).map((exp, i) => (
            <li key={exp.id || i}>
              <button type="button" className={styles.linkItem} onClick={onContinue}>
                {exp.title || 'Research Protocol'}
                <span className={styles.linkMeta}>{exp.subject || 'Notebook'} · Open →</span>
              </button>
            </li>
          ))}
          {experiments.length === 0 && (
            <li>
              <button type="button" className={styles.linkItem} onClick={() => onCreateExperiment && onCreateExperiment()}>
                Start your first notebook with AI
                <span className={styles.linkMeta}>Create →</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className={styles.colRule} aria-hidden="true" />

      {/* Column 3 — Today's desk + quick actions */}
      <div className={styles.col}>
        <p className={styles.colEyebrow}>Today&apos;s desk</p>
        <ul className={styles.deskList}>
          <li className={styles.deskItem}>
            <span className={styles.deskIcon} aria-hidden="true"><CoffeeIcon /></span>
            <div className={styles.timerBox}>
              <span>Study Break Timer: <strong>{formatTimer(timerSeconds)}</strong></span>
              <button
                type="button"
                className={styles.timerBtn}
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </li>
          <li className={styles.deskItem}>
            <span className={styles.deskIcon} aria-hidden="true"><NotebookIcon /></span>
            <span>{experiments.length} research notebook{experiments.length !== 1 ? 's' : ''} in library</span>
          </li>
          <li className={styles.deskItem}>
            <span className={styles.deskIcon} aria-hidden="true"><FlaskIcon /></span>
            <span>Vector canvas apparatus diagramming active</span>
          </li>
        </ul>

        <p className={styles.colEyebrow} style={{ marginTop: 'var(--space-28)' }}>
          Interactive Study Tools
        </p>
        <ul className={styles.actionList}>
          <li>
            <button
              type="button"
              className={styles.actionLink}
              onClick={() => {
                setCardIdx(0);
                setIsFlipped(false);
                setActiveModal('flashcards');
              }}
            >
              🗂 Practice Flashcards →
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.actionLink}
              onClick={() => {
                resetQuiz();
                setActiveModal('quiz');
              }}
            >
              🧪 Chemistry Quiz Deck →
            </button>
          </li>
        </ul>
      </div>

      {/* ── Flashcards Modal ── */}
      {activeModal === 'flashcards' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalSubject}>{FLASHCARDS[cardIdx].subject}</span>
              <span className={styles.modalCounter}>{cardIdx + 1} / {FLASHCARDS.length}</span>
            </div>

            <div
              className={`${styles.flashcardBox} ${isFlipped ? styles.flashcardFlipped : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={styles.flashcardSide}>
                <span className={styles.cardPrompt}>QUESTION</span>
                <p className={styles.cardQuestion}>{FLASHCARDS[cardIdx].question}</p>
                <span className={styles.flipHint}>Click card to reveal answer ↺</span>
              </div>

              {isFlipped && (
                <div className={styles.flashcardAnswerSide}>
                  <span className={styles.cardPrompt}>ANSWER</span>
                  <p className={styles.cardAnswer}>{FLASHCARDS[cardIdx].answer}</p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.navCardBtn}
                disabled={cardIdx === 0}
                onClick={() => {
                  setCardIdx((i) => Math.max(0, i - 1));
                  setIsFlipped(false);
                }}
              >
                ← Previous
              </button>

              <button
                type="button"
                className={styles.primaryModalBtn}
                onClick={() => {
                  if (cardIdx + 1 < FLASHCARDS.length) {
                    setCardIdx((i) => i + 1);
                    setIsFlipped(false);
                  } else {
                    setActiveModal(null);
                  }
                }}
              >
                {cardIdx + 1 < FLASHCARDS.length ? 'Next Card →' : 'Done Deck ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Quiz Modal ── */}
      {activeModal === 'quiz' && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            {!quizFinished ? (
              <>
                <div className={styles.modalHeader}>
                  <span className={styles.modalSubject}>Lab Quiz</span>
                  <span className={styles.modalCounter}>Question {quizIdx + 1} / {QUIZ_QUESTIONS.length}</span>
                </div>

                <h4 className={styles.quizQuestion}>{QUIZ_QUESTIONS[quizIdx].question}</h4>

                <div className={styles.quizOptionsList}>
                  {QUIZ_QUESTIONS[quizIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx;
                    const isCorrect = oIdx === QUIZ_QUESTIONS[quizIdx].correct;
                    let optStyle = styles.quizOptBtn;

                    if (selectedOpt !== null) {
                      if (isCorrect) optStyle += ` ${styles.quizOptCorrect}`;
                      else if (isSelected) optStyle += ` ${styles.quizOptWrong}`;
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        className={optStyle}
                        onClick={() => handleSelectQuizOpt(oIdx)}
                      >
                        <span className={styles.optLetter}>{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedOpt !== null && (
                  <div className={styles.explanationBox}>
                    <p><strong>Explanation:</strong> {QUIZ_QUESTIONS[quizIdx].explanation}</p>
                    <button type="button" className={styles.primaryModalBtn} onClick={handleNextQuiz}>
                      {quizIdx + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'View Score →'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.quizResultBox}>
                <h3>Quiz Complete! 🎉</h3>
                <p className={styles.scoreText}>You scored <strong>{score}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong></p>
                <div className={styles.modalFooter}>
                  <button type="button" className={styles.navCardBtn} onClick={resetQuiz}>
                    Retry Quiz ↺
                  </button>
                  <button type="button" className={styles.primaryModalBtn} onClick={() => setActiveModal(null)}>
                    Close Deck ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
