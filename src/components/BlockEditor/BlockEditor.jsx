import React, { useState, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import SlashMenu from './SlashMenu';
import TextBlock from './blocks/TextBlock';
import ProtocolBlock from './blocks/ProtocolBlock';
import FormulaBlock from './blocks/FormulaBlock';
import CalloutBlock from './blocks/CalloutBlock';
import TableBlock from './blocks/TableBlock';
import CodeBlock from './blocks/CodeBlock';
import styles from './BlockEditor.module.css';

/* ── Drag handle icon ── */
function DragHandleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="4" cy="4" r="1.2" fill="currentColor" />
      <circle cx="10" cy="4" r="1.2" fill="currentColor" />
      <circle cx="4" cy="10" r="1.2" fill="currentColor" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" />
      <circle cx="4" cy="7" r="1.2" fill="currentColor" />
      <circle cx="10" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

/* ── Delete icon ── */
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 5H13M6 5V3H10V5M5 5L5.5 13H10.5L11 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Duplicate icon ── */
function DuplicateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 11V3H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Sortable block wrapper ── */
function SortableBlock({ block, children, onDelete, onDuplicate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${styles.blockRow} ${isDragging ? styles.blockRowDragging : ''}`}>
      {/* Drag handle + actions — shown on hover */}
      <div className={styles.blockActions}>
        <button type="button" className={styles.dragHandle} {...attributes} {...listeners} aria-label="Drag to reorder">
          <DragHandleIcon />
        </button>
        <button type="button" className={styles.blockActionBtn} onClick={onDuplicate} title="Duplicate block">
          <DuplicateIcon />
        </button>
        <button type="button" className={styles.blockActionBtn} onClick={onDelete} title="Delete block">
          <TrashIcon />
        </button>
      </div>

      {/* Block content */}
      <div className={styles.blockContent}>{children}</div>
    </div>
  );
}

/* ── Block renderer ── */
function renderBlock(block, handlers) {
  const { onChange, onKeyDown, onFocus } = handlers;
  switch (block.type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'text':
      return <TextBlock block={block} onChange={onChange} onKeyDown={onKeyDown} onFocus={onFocus} />;
    case 'protocol':
      return (
        <ProtocolBlock
          block={block}
          onChange={(content, done) => onChange(content, { done })}
          onKeyDown={onKeyDown}
        />
      );
    case 'formula':
      return <FormulaBlock block={block} onChange={onChange} />;
    case 'callout':
      return <CalloutBlock block={block} onChange={onChange} onKeyDown={onKeyDown} />;
    case 'table':
      return <TableBlock block={block} onChange={onChange} />;
    case 'code':
      return <CodeBlock block={block} onChange={onChange} onKeyDown={onKeyDown} />;
    default:
      return <TextBlock block={block} onChange={onChange} onKeyDown={onKeyDown} onFocus={onFocus} />;
  }
}

/* ── Default blocks ── */
const defaultBlocks = () => [
  { id: nanoid(), type: 'h1', content: '' },
  { id: nanoid(), type: 'text', content: '' },
];

/* ── Main BlockEditor ── */
export default function BlockEditor({ initialBlocks, onChange }) {
  const [blocks, setBlocks] = useState(() =>
    initialBlocks && initialBlocks.length > 0 ? initialBlocks : defaultBlocks()
  );

  // Slash menu state
  const [slashMenu, setSlashMenu] = useState({ open: false, blockId: null, query: '', position: { top: 0, left: 0 } });
  const [activeId, setActiveId] = useState(null);

  const activeBlockRef = useRef(null); // tracks which block is currently focused

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  /* ── Helpers ── */
  const commit = useCallback(
    (next) => {
      setBlocks(next);
      onChange && onChange(next);
    },
    [onChange]
  );

  const updateBlock = useCallback(
    (id, content, extra = {}) => {
      commit(
        blocks.map((b) =>
          b.id === id ? { ...b, content, ...extra } : b
        )
      );
    },
    [blocks, commit]
  );

  const addBlockAfter = useCallback(
    (id, type = 'text') => {
      const idx = blocks.findIndex((b) => b.id === id);
      const newBlock = {
        id: nanoid(),
        type,
        content: '',
        timestamp:
          type === 'protocol'
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined,
      };
      const next = [...blocks];
      next.splice(idx + 1, 0, newBlock);
      commit(next);
      // Focus the new block after render
      setTimeout(() => {
        const el = document.querySelector(`[data-block-id="${newBlock.id}"]`);
        el?.focus();
      }, 50);
      return newBlock.id;
    },
    [blocks, commit]
  );

  const deleteBlock = useCallback(
    (id) => {
      if (blocks.length === 1) return; // keep at least one block
      const idx = blocks.findIndex((b) => b.id === id);
      const next = blocks.filter((b) => b.id !== id);
      commit(next);
      // Focus previous block
      setTimeout(() => {
        const prev = next[Math.max(0, idx - 1)];
        const el = document.querySelector(`[data-block-id="${prev?.id}"]`);
        el?.focus();
      }, 30);
    },
    [blocks, commit]
  );

  const duplicateBlock = useCallback(
    (id) => {
      const idx = blocks.findIndex((b) => b.id === id);
      const original = blocks[idx];
      const copy = { ...original, id: nanoid() };
      const next = [...blocks];
      next.splice(idx + 1, 0, copy);
      commit(next);
    },
    [blocks, commit]
  );

  /* ── Slash menu logic ── */
  const openSlashMenu = (blockId, query, position) => {
    setSlashMenu({ open: true, blockId, query, position });
  };

  const closeSlashMenu = () => {
    setSlashMenu((s) => ({ ...s, open: false, query: '' }));
  };

  const handleSlashSelect = (type) => {
    if (!slashMenu.blockId) return;
    const block = blocks.find((b) => b.id === slashMenu.blockId);
    if (!block) return;

    // If current block is empty, transform it; otherwise add after
    if (!block.content || block.content === '/') {
      commit(
        blocks.map((b) =>
          b.id === slashMenu.blockId
            ? {
                ...b,
                type,
                content: '',
                timestamp:
                  type === 'protocol'
                    ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : undefined,
              }
            : b
        )
      );
    } else {
      addBlockAfter(slashMenu.blockId, type);
    }
    closeSlashMenu();
  };

  /* ── Keyboard handler per block ── */
  const makeKeyHandler = (blockId) => (e) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
      e.preventDefault();
      addBlockAfter(blockId, 'text');
      closeSlashMenu();
    }

    if (e.key === 'Backspace' && !block.content) {
      e.preventDefault();
      deleteBlock(blockId);
    }
  };

  /* ── Input handler — detect slash ── */
  const makeChangeHandler = (blockId) => (content, extra) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    updateBlock(blockId, content, extra);

    // Detect slash command trigger
    const lastSlash = content.lastIndexOf('/');
    if (lastSlash !== -1) {
      const query = content.slice(lastSlash + 1);
      const el = document.querySelector(`[data-block-id="${blockId}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        openSlashMenu(blockId, query, {
          top: rect.bottom + window.scrollY + 6,
          left: rect.left + window.scrollX,
        });
      }
    } else {
      closeSlashMenu();
    }
  };

  /* ── DnD handlers ── */
  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIdx = blocks.findIndex((b) => b.id === active.id);
      const newIdx = blocks.findIndex((b) => b.id === over.id);
      commit(arrayMove(blocks, oldIdx, newIdx));
    }
  };

  const activeBlock = blocks.find((b) => b.id === activeId);

  return (
    <div className={styles.editor}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onDelete={() => deleteBlock(block.id)}
              onDuplicate={() => duplicateBlock(block.id)}
            >
              <div data-block-id={block.id} tabIndex={-1} style={{ outline: 'none' }}>
                {renderBlock(block, {
                  onChange: makeChangeHandler(block.id),
                  onKeyDown: makeKeyHandler(block.id),
                  onFocus: () => { activeBlockRef.current = block.id; },
                })}
              </div>
            </SortableBlock>
          ))}
        </SortableContext>

        {/* Drag overlay — smooth ghost while dragging */}
        <DragOverlay>
          {activeBlock ? (
            <div className={styles.dragOverlay}>
              <div className={styles.dragOverlayInner}>
                {activeBlock.type === 'h1' && <span className={styles.dragOverlayH1}>{activeBlock.content || 'Heading'}</span>}
                {activeBlock.type === 'h2' && <span className={styles.dragOverlayH2}>{activeBlock.content || 'Heading'}</span>}
                {activeBlock.type === 'h3' && <span className={styles.dragOverlayH3}>{activeBlock.content || 'Heading'}</span>}
                {activeBlock.type === 'formula' && <span className={styles.dragOverlayFormula}>LaTeX Formula</span>}
                {activeBlock.type === 'protocol' && <span className={styles.dragOverlayProtocol}>{activeBlock.content || 'Protocol Step'}</span>}
                {activeBlock.type === 'callout' && <span className={styles.dragOverlayCallout}>{activeBlock.content || 'Lab Note'}</span>}
                {activeBlock.type === 'table' && <span className={styles.dragOverlayTable}>Data Table</span>}
                {activeBlock.type === 'code' && <span className={styles.dragOverlayCode}>Code Block</span>}
                {activeBlock.type === 'text' && <span className={styles.dragOverlayText}>{activeBlock.content || 'Text'}</span>}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Slash menu */}
      {slashMenu.open && (
        <SlashMenu
          position={slashMenu.position}
          query={slashMenu.query}
          onSelect={handleSlashSelect}
          onClose={closeSlashMenu}
        />
      )}
    </div>
  );
}
