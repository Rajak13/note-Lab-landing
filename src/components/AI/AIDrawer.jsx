import React, { useState, useEffect, useRef, memo } from 'react';
import { useAIAssist } from '../../hooks/useAIAssist';
import styles from './AIDrawer.module.css';

/* ── SVG Icon Components for Quick Actions & UI ── */
function ClipboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="4" y="3" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 3V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V3" stroke="currentColor" strokeWidth="1.3" />
      <line x1="6.5" y1="6" x2="9.5" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6.5" y1="8.5" x2="9.5" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldAlertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5L13.5 5.25V8.5C13.5 11.5 11 14 8 15C5 14 2.5 11.5 2.5 8.5V5.25L8 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="8" y1="6" x2="8" y2="9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M6 2.5V6L2.5 12C2 12.8 2.6 14 3.5 14H12.5C13.4 14 14 12.8 13.5 12L10 6V2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="5" y1="2.5" x2="11" y2="2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5C5.5 2.5 3.5 4.5 3.5 7C3.5 8.8 4.6 10.3 6 11V12.5C6 12.8 6.2 13 6.5 13H9.5C9.8 13 10 12.8 10 12.5V11C11.4 10.3 12.5 8.8 12.5 7C12.5 4.5 10.5 2.5 8 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="6.5" y1="14.5" x2="9.5" y2="14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L9.5 5.5L13.5 7L9.5 8.5L8 12.5L6.5 8.5L2.5 7L6.5 5.5L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Quick action presets ── */
const QUICK_ACTIONS = [
  { id: 'draft',   Icon: ClipboardIcon, label: 'Draft Procedure', prompt: 'Based on the apparatus and chemicals shown in my diagram, draft a detailed numbered experimental procedure.' },
  { id: 'safety', Icon: ShieldAlertIcon, label: 'Safety Check',    prompt: 'Perform a safety check on all chemicals and apparatus in my diagram. List hazards with explicit severity levels [HAZARD: MODERATE/HIGH] and required precautions.' },
  { id: 'stoich', Icon: FlaskIcon,       label: 'Stoichiometry',   prompt: 'Calculate the theoretical yield and stoichiometry for this reaction based on the chemicals and amounts shown in my diagram.' },
  { id: 'next',   Icon: LightbulbIcon,   label: "What's Next?",     prompt: 'Based on my experimental setup and notes so far, what are the logical next steps or experiments I should consider?' },
  { id: 'summary',Icon: SparklesIcon,    label: 'Summarise Notes',  prompt: 'Summarise my written notes and diagram into a concise experiment overview.' },
];

/* ── Lightweight markdown renderer ── */
function MarkdownText({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      output.push(
        <pre key={i} className={styles.codeBlock}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Safety/hazard lines ([HAZARD: ...])
    if (line.includes('[HAZARD:') || line.startsWith('HAZARD:')) {
      output.push(
        <div key={i} className={`${styles.mdLine} ${styles.mdWarning}`}>
          <InlineMarkdown text={line} />
        </div>
      );
      i++;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      output.push(
        <ol key={i} className={styles.mdOl}>
          {items.map((item, idx) => (
            <li key={idx}><InlineMarkdown text={item} /></li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list
    if (/^[-*•]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•]\s/, ''));
        i++;
      }
      output.push(
        <ul key={i} className={styles.mdUl}>
          {items.map((item, idx) => (
            <li key={idx}><InlineMarkdown text={item} /></li>
          ))}
        </ul>
      );
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      output.push(<h4 key={i} className={styles.mdH3}>{line.slice(4)}</h4>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      output.push(<h3 key={i} className={styles.mdH2}>{line.slice(3)}</h3>);
      i++; continue;
    }
    if (line.startsWith('# ')) {
      output.push(<h2 key={i} className={styles.mdH1}>{line.slice(2)}</h2>);
      i++; continue;
    }

    // Horizontal rule
    if (line.startsWith('---') || line.startsWith('===')) {
      output.push(<hr key={i} className={styles.mdHr} />);
      i++; continue;
    }

    // Empty line
    if (line.trim() === '') {
      output.push(<div key={i} className={styles.mdSpacer} />);
      i++; continue;
    }

    // Normal paragraph line
    output.push(
      <p key={i} className={styles.mdP}>
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <div className={styles.markdownRoot}>{output}</div>;
}

/* Inline markdown formatter */
function InlineMarkdown({ text }) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    const italicMatch = remaining.match(/_(.+?)_/);

    const candidates = [
      boldMatch   && { idx: boldMatch.index,   len: boldMatch[0].length,   el: <strong key={key++}>{boldMatch[1]}</strong> },
      codeMatch   && { idx: codeMatch.index,   len: codeMatch[0].length,   el: <code key={key++} className={styles.inlineCode}>{codeMatch[1]}</code> },
      italicMatch && { idx: italicMatch.index, len: italicMatch[0].length, el: <em key={key++}>{italicMatch[1]}</em> },
    ].filter(Boolean).sort((a, b) => a.idx - b.idx);

    if (candidates.length === 0) {
      parts.push(remaining);
      break;
    }

    const first = candidates[0];
    if (first.idx > 0) parts.push(remaining.slice(0, first.idx));
    parts.push(first.el);
    remaining = remaining.slice(first.idx + first.len);
  }

  return <>{parts}</>;
}

function StreamingCursor() {
  return <span className={styles.streamCursor}>▊</span>;
}

const AIMessage = memo(function AIMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`${styles.messageBubbleWrap} ${isUser ? styles.userWrap : styles.assistantWrap}`}>
      {!isUser && (
        <div className={styles.avatarIcon}>
          <SparklesIcon />
        </div>
      )}
      <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.assistantBubble} ${msg.isError ? styles.errorBubble : ''}`}>
        {isUser
          ? <p className={styles.userText}>{msg.content}</p>
          : <MarkdownText text={msg.content} />
        }
      </div>
    </div>
  );
});

export default function AIDrawer({ isOpen, onClose, context }) {
  const { messages, isStreaming, streamingText, sendMessage, cancelStream, clearChat } = useAIAssist();

  const [input, setInput] = useState('');
  const threadRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input, context);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt) => {
    if (isStreaming) return;
    sendMessage(prompt, context);
  };

  const nodeCount = context?.nodes?.length || 0;
  const blockCount = context?.blocks?.length || 0;

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}

      <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`} aria-label="AI Research Co-Pilot">

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <SparklesIcon />
            </div>
            <div>
              <div className={styles.headerTitle}>AI Co-Pilot</div>
              <div className={styles.headerSub}>Experiment-aware assistant</div>
            </div>
          </div>
          <div className={styles.headerActions}>
            {messages.length > 0 && (
              <button type="button" className={styles.clearBtn} onClick={clearChat} title="Clear conversation">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 4H11.5M5 4V2.5C5 2.22 5.22 2 5.5 2H8.5C8.78 2 9 2.22 9 2.5V4M4 4L4.5 11.5C4.5 11.78 4.72 12 5 12H9C9.28 12 9.5 11.78 9.5 11.5L10 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <button type="button" className={styles.closeBtn} onClick={onClose} title="Close">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Context Pill ── */}
        <div className={styles.contextPill}>
          <FlaskIcon />
          <span className={styles.contextText}>
            {context?.title || 'Untitled'} · {nodeCount} shape{nodeCount !== 1 ? 's' : ''} · {blockCount} block{blockCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Message Thread ── */}
        <div className={styles.thread} ref={threadRef}>

          {messages.length === 0 && !isStreaming && (
            <div className={styles.emptyState}>
              <div className={styles.emptyBadge}>RESEARCH ASSISTANT</div>
              <p className={styles.emptyTitle}>How can I assist your experiment?</p>
              <p className={styles.emptySub}>I am synced with your active diagram canvas and research notes.</p>

              <div className={styles.quickActions}>
                {QUICK_ACTIONS.map(({ id, Icon, label, prompt }) => (
                  <button
                    key={id}
                    type="button"
                    className={styles.quickActionBtn}
                    onClick={() => handleQuickAction(prompt)}
                  >
                    <span className={styles.quickActionIcon}><Icon /></span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <AIMessage key={msg.id} msg={msg} />
          ))}

          {isStreaming && streamingText && (
            <div className={`${styles.messageBubbleWrap} ${styles.assistantWrap}`}>
              <div className={styles.avatarIcon}>
                <SparklesIcon />
              </div>
              <div className={`${styles.messageBubble} ${styles.assistantBubble}`}>
                <MarkdownText text={streamingText} />
                <StreamingCursor />
              </div>
            </div>
          )}

          {isStreaming && !streamingText && (
            <div className={`${styles.messageBubbleWrap} ${styles.assistantWrap}`}>
              <div className={styles.avatarIcon}>
                <SparklesIcon />
              </div>
              <div className={`${styles.messageBubble} ${styles.assistantBubble} ${styles.thinkingBubble}`}>
                <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
              </div>
            </div>
          )}
        </div>

        {/* ── Quick action chips when messages exist ── */}
        {messages.length > 0 && (
          <div className={styles.quickActionsBar}>
            {QUICK_ACTIONS.slice(0, 3).map(({ id, Icon, label, prompt }) => (
              <button
                key={id}
                type="button"
                className={styles.quickChip}
                onClick={() => handleQuickAction(prompt)}
                disabled={isStreaming}
              >
                <Icon /> {label}
              </button>
            ))}
          </div>
        )}

        {/* ── Input Area ── */}
        <div className={styles.inputArea}>
          <textarea
            ref={inputRef}
            className={styles.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your experiment setup..."
            rows={2}
            disabled={isStreaming}
          />
          <div className={styles.inputActions}>
            <span className={styles.inputHint}>Enter to send · Shift+Enter for newline</span>
            {isStreaming ? (
              <button type="button" className={styles.stopBtn} onClick={cancelStream}>
                Stop
              </button>
            ) : (
              <button
                type="button"
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!input.trim()}
              >
                Send
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
