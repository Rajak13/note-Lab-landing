import React, { useState, useRef, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { LabEquipmentRenderer, generatePathData, calculateBestPorts } from './LabShapes';
import { APPARATUS_CATEGORIES, LAB_APPARATUS, LIQUID_COLORS, PRESET_EXPERIMENTS } from './LabApparatusDictionary';
import ConfirmModal from '../Common/ConfirmModal';
import LabAICompanion from './LabAICompanion';
import styles from './DiagramCanvas.module.css';

/* ── Inline SVG Icons for Draw.io Toolbar ── */
function SelectIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 2L3 11L6 8.5L8 13L9.5 12.3L7.5 7.5L11 7.5L3 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
}
function ArrowConnectIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ZoomInIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 9.5L13 13M4 6H8M6 4V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function ZoomOutIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 9.5L13 13M4 6H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function UndoIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 6H8C10.2 6 12 7.8 12 10V11M2 6L5 3M2 6L5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ClearIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function ChevronDownIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2.5C6 2.22 6.22 2 6.5 2h3c.28 0 .5.22.5.5V4M5 4v9.5c0 .28.22.5.5.5h5c.28 0 .5-.22.5-.5V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/* ── Edge Arrow Render ── */
function EdgeArrow({ edge, fromNode, toNode, selected, onSelect }) {
  const { fromPort, toPort } = calculateBestPorts(fromNode, toNode, edge.fromPort, edge.toPort);
  const { pathD, labelX, labelY } = generatePathData(fromPort, toPort, edge.routing || 'orthogonal');
  const dashArray = edge.dashStyle === 'dashed' ? '6 4' : edge.dashStyle === 'dotted' ? '2 3' : undefined;

  return (
    <g onClick={(e) => { e.stopPropagation(); onSelect(edge.id); }} style={{ cursor: 'pointer' }}>
      <path d={pathD} fill="none" stroke="transparent" strokeWidth="14" />
      <path
        d={pathD}
        fill="none"
        stroke={selected ? '#C94A3C' : edge.color || '#E46757'}
        strokeWidth={selected ? '2.8' : '2'}
        strokeDasharray={dashArray}
        markerEnd="url(#arrowhead)"
      />
      {edge.label && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect x="-40" y="-10" width="80" height="20" rx="4" fill="#FFFDF8" stroke={edge.color || '#E46757'} strokeWidth="1" />
          <text x="0" y="3" textAnchor="middle" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" fill="#2C2420">
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
}

export default function DiagramCanvas({ initialJson, onChange }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [activeTool, setActiveTool] = useState('select');
  const [placementShape, setPlacementShape] = useState('beaker');

  const [openCategories, setOpenCategories] = useState({
    glassware: true,
    tubing: true,
    heating: false,
    measurement: false,
  });

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selection, setSelection] = useState({ type: null, id: null });
  const [history, setHistory] = useState([]);

  // Pan / Zoom
  const [pan, setPan] = useState({ x: 60, y: 40 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Arrow creation state
  const [arrowStart, setArrowStart] = useState(null); // { nodeId, portId }
  const [arrowPreview, setArrowPreview] = useState(null);

  // Dragging node state
  const [draggingNode, setDraggingNode] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const svgRef = useRef(null);

  // Parse initial state
  useEffect(() => {
    if (!initialJson) return;
    try {
      const parsed = typeof initialJson === 'string' ? JSON.parse(initialJson) : initialJson;
      if (parsed.nodes) setNodes(parsed.nodes);
      if (parsed.edges) setEdges(parsed.edges);
    } catch (e) {
      console.error('Failed to parse diagram JSON', e);
    }
  }, []);

  const commit = useCallback((newNodes, newEdges) => {
    setHistory((prev) => [...prev.slice(-20), { nodes, edges }]);
    setNodes(newNodes);
    setEdges(newEdges);
    if (onChange) {
      onChange(JSON.stringify({ nodes: newNodes, edges: newEdges }));
    }
  }, [nodes, edges, onChange]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setNodes(last.nodes);
    setEdges(last.edges);
    if (onChange) {
      onChange(JSON.stringify(last));
    }
  }, [history, onChange]);

  // Wheel Zoom Listener
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => Math.min(3, Math.max(0.3, prev * zoomFactor)));
    };

    svgEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => svgEl.removeEventListener('wheel', handleWheel);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selection.type === 'node' && selection.id) {
          e.preventDefault();
          commit(
            nodes.filter((n) => n.id !== selection.id),
            edges.filter((eg) => eg.from !== selection.id && eg.to !== selection.id)
          );
          setSelection({ type: null, id: null });
        } else if (selection.type === 'edge' && selection.id) {
          e.preventDefault();
          commit(
            nodes,
            edges.filter((eg) => eg.id !== selection.id)
          );
          setSelection({ type: null, id: null });
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveTool('select');
        setSelection({ type: null, id: null });
        setArrowStart(null);
        setArrowPreview(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, nodes, edges, undo, commit]);

  const toggleCategory = (catId) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const loadPresetExperiment = (presetId) => {
    const preset = PRESET_EXPERIMENTS.find((p) => p.id === presetId);
    if (!preset) return;

    const newNodes = preset.nodes.map((n) => {
      const dictShape = LAB_APPARATUS[n.shape];
      return {
        id: n.id,
        shape: n.shape,
        x: n.x,
        y: n.y,
        w: dictShape?.width || 80,
        h: dictShape?.height || 80,
        label: n.label,
        color: '#E46757',
        liquidLevel: n.liquidLevel || 0,
        liquidColor: n.liquidColor || 'rgba(6, 182, 212, 0.6)',
        flameOn: Boolean(n.flameOn),
        hideLabel: Boolean(n.hideLabel),
        leaderLine: n.leaderLine,
      };
    });

    const newEdges = preset.edges.map((e) => ({
      id: e.id,
      from: e.source,
      to: e.target,
      fromPort: e.sourcePort,
      toPort: e.targetPort,
      routing: e.type || 'orthogonal',
      label: e.label || '',
      dashStyle: e.dashStyle || 'solid',
      color: e.color || '#E46757',
    }));

    commit(newNodes, newEdges);
    setSelection({ type: null, id: null });
    setActiveTool('select');
  };

  const getCanvasCoords = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    };
  };

  // HTML5 Drag and Drop placement onto canvas
  const handleDrop = (e) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData('shapeId');
    if (!shapeId || !LAB_APPARATUS[shapeId]) return;

    const coords = getCanvasCoords(e);
    const dictShape = LAB_APPARATUS[shapeId];
    const w = dictShape.width;
    const h = dictShape.height;

    const newNode = {
      id: nanoid(6),
      shape: shapeId,
      x: coords.x - w / 2,
      y: coords.y - h / 2,
      w,
      h,
      label: dictShape.name,
      color: '#E46757',
      liquidLevel: dictShape.hasLiquid ? 40 : 0,
      liquidColor: 'rgba(6, 182, 212, 0.6)',
      flameOn: false,
    };

    commit([...nodes, newNode], edges);
    setSelection({ type: 'node', id: newNode.id });
    setActiveTool('select');
  };

  const handleCanvasClick = (e) => {
    if (activeTool === 'select') return;

    const coords = getCanvasCoords(e);
    const dictShape = LAB_APPARATUS[placementShape];
    const w = dictShape ? dictShape.width : 80;
    const h = dictShape ? dictShape.height : 80;

    const newNode = {
      id: nanoid(6),
      shape: placementShape,
      x: coords.x - w / 2,
      y: coords.y - h / 2,
      w,
      h,
      label: dictShape ? dictShape.name : 'New Node',
      color: '#E46757',
      liquidLevel: dictShape?.hasLiquid ? 40 : 0,
      liquidColor: 'rgba(6, 182, 212, 0.6)',
      flameOn: false,
    };

    commit([...nodes, newNode], edges);
    setSelection({ type: 'node', id: newNode.id });
    setActiveTool('select');
  };

  const handlePortClick = (nodeId, portId) => {
    if (!arrowStart) {
      setArrowStart({ nodeId, portId });
    } else if (arrowStart.nodeId !== nodeId) {
      const newEdge = {
        id: nanoid(6),
        from: arrowStart.nodeId,
        fromPort: arrowStart.portId,
        to: nodeId,
        toPort: portId,
        routing: 'orthogonal',
        color: '#E46757',
        dashStyle: 'solid',
      };
      commit(nodes, [...edges, newEdge]);
      setArrowStart(null);
      setArrowPreview(null);
      setActiveTool('select');
    }
  };

  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setSelection({ type: 'node', id: nodeId });

    // If user clicked directly on a label box, select node but do NOT drag node object
    if (e.target.closest && e.target.closest('[data-label="true"]')) {
      return;
    }

    if (activeTool !== 'select' && activeTool !== 'arrow') {
      setActiveTool('select');
    }
    if (activeTool === 'arrow') return;

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const coords = getCanvasCoords(e);
    setDraggingNode(nodeId);
    dragOffsetRef.current = { x: coords.x - node.x, y: coords.y - node.y };
  };

  const [draggingLabelNodeId, setDraggingLabelNodeId] = useState(null);
  const labelDragStartRef = useRef(null);

  const handleLabelMouseDown = (nodeId, e) => {
    e.stopPropagation();
    setDraggingNode(null);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const coords = getCanvasCoords(e);
    setDraggingLabelNodeId(nodeId);
    labelDragStartRef.current = {
      startX: coords.x,
      startY: coords.y,
      initialDx: node.leaderLine?.dx || 60,
      initialDy: node.leaderLine?.dy || -30,
    };
    setSelection({ type: 'node', id: nodeId });
  };

  const handleSvgMouseDown = (e) => {
    const isNodeOrLabel = e.target.closest && (e.target.closest('[data-node="true"]') || e.target.closest('[data-label="true"]'));
    if (!isNodeOrLabel) {
      setSelection({ type: null, id: null });
    }
    if (e.button === 1 || e.altKey || (activeTool === 'select' && !isNodeOrLabel)) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const [resizingNodeId, setResizingNodeId] = useState(null);
  const resizeHandleRef = useRef(null);
  const resizeStartRef = useRef(null);

  const handleResizeMouseDown = (nodeId, handle, e) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const coords = getCanvasCoords(e);
    setResizingNodeId(nodeId);
    resizeHandleRef.current = handle;
    resizeStartRef.current = {
      startX: coords.x,
      startY: coords.y,
      initialX: node.x,
      initialY: node.y,
      initialW: node.w || 80,
      initialH: node.h || 80,
    };
    setSelection({ type: 'node', id: nodeId });
  };

  const handleSvgMouseMove = (e) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y });
      return;
    }

    const coords = getCanvasCoords(e);

    if (resizingNodeId && resizeStartRef.current) {
      const handle = resizeHandleRef.current;
      const { startX, startY, initialX, initialY, initialW, initialH } = resizeStartRef.current;
      const dx = coords.x - startX;
      const dy = coords.y - startY;

      let newX = initialX;
      let newY = initialY;
      let newW = initialW;
      let newH = initialH;

      if (handle.includes('e')) newW = Math.max(30, initialW + dx);
      if (handle.includes('s')) newH = Math.max(30, initialH + dy);
      if (handle.includes('w')) {
        const potentialW = initialW - dx;
        if (potentialW >= 30) {
          newW = potentialW;
          newX = initialX + dx;
        }
      }
      if (handle.includes('n')) {
        const potentialH = initialH - dy;
        if (potentialH >= 30) {
          newH = potentialH;
          newY = initialY + dy;
        }
      }

      const next = nodes.map((n) =>
        n.id === resizingNodeId
          ? { ...n, x: newX, y: newY, w: Math.round(newW), h: Math.round(newH) }
          : n
      );
      setNodes(next);
      return;
    }

    // Label offset drag takes priority over node object drag
    if (draggingLabelNodeId && labelDragStartRef.current) {
      const dx = labelDragStartRef.current.initialDx + (coords.x - labelDragStartRef.current.startX);
      const dy = labelDragStartRef.current.initialDy + (coords.y - labelDragStartRef.current.startY);
      const next = nodes.map((n) =>
        n.id === draggingLabelNodeId
          ? {
              ...n,
              leaderLine: {
                ...(n.leaderLine || { targetX: (n.w || 80) / 2, targetY: (n.h || 80) / 2 }),
                dx,
                dy,
              },
            }
          : n
      );
      setNodes(next);
      return;
    }

    if (draggingNode) {
      const next = nodes.map((n) =>
        n.id === draggingNode
          ? { ...n, x: coords.x - dragOffsetRef.current.x, y: coords.y - dragOffsetRef.current.y }
          : n
      );
      setNodes(next);
      return;
    }

    if (arrowStart) {
      setArrowPreview(coords);
    }
  };

  const handleSvgMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (resizingNodeId) {
      setResizingNodeId(null);
      commit(nodes, edges);
    }
    if (draggingNode) {
      setDraggingNode(null);
      commit(nodes, edges);
    }
    if (draggingLabelNodeId) {
      setDraggingLabelNodeId(null);
      commit(nodes, edges);
    }
  };

  const selectedNode = selection.type === 'node' ? nodes.find((n) => n.id === selection.id) : null;
  const selectedEdge = selection.type === 'edge' ? edges.find((e) => e.id === selection.id) : null;
  const selectedDictShape = selectedNode ? LAB_APPARATUS[selectedNode.shape] : null;

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      handleSvgMouseDown({
        clientX: touch.clientX,
        clientY: touch.clientY,
        stopPropagation: () => e.stopPropagation?.(),
        preventDefault: () => e.preventDefault?.(),
        target: e.target,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      handleSvgMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    handleSvgMouseUp();
  };

  return (
    <div className={styles.drawioLayout}>
      {/* ── Draw.io Top Action & Preset Bar ── */}
      <header className={styles.drawioHeader}>
        <div className={styles.headerToolsLeft}>
          <button
            type="button"
            className={`${styles.headerToolBtn} ${activeTool === 'select' ? styles.headerToolBtnActive : ''}`}
            onClick={() => { setActiveTool('select'); setArrowStart(null); }}
            title="Select & Move (V)"
          >
            <SelectIcon /> Select
          </button>
          <button
            type="button"
            className={`${styles.headerToolBtn} ${activeTool === 'arrow' ? styles.headerToolBtnActive : ''}`}
            onClick={() => { setActiveTool('arrow'); setArrowStart(null); }}
            title="Connect Lines (L)"
          >
            <ArrowConnectIcon /> Connector
          </button>

          <div className={styles.headerDivider} />

          <button type="button" className={styles.headerIconBtn} title="Zoom In" onClick={() => setZoom((z) => Math.min(3, z * 1.2))}>
            <ZoomInIcon />
          </button>
          <button type="button" className={styles.headerIconBtn} title="Zoom Out" onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))}>
            <ZoomOutIcon />
          </button>
          <span className={styles.zoomValue}>{Math.round(zoom * 100)}%</span>

          <div className={styles.headerDivider} />

          <button type="button" className={styles.headerToolBtn} title="Undo (Ctrl+Z)" onClick={undo}>
            <UndoIcon /> Undo
          </button>
          <button
            type="button"
            className={`${styles.headerToolBtn} ${styles.headerToolBtnDanger}`}
            title="Clear Diagram"
            onClick={() => setShowClearConfirm(true)}
          >
            <ClearIcon /> Clear
          </button>
        </div>

        <div className={styles.headerPresetsRight}>
          <span className={styles.presetLabel}>Load Assembly:</span>
          {PRESET_EXPERIMENTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={styles.headerPresetChip}
              onClick={() => loadPresetExperiment(preset.id)}
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </header>

      {/* Confirm Modal Dialog */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Diagram Canvas?"
        message="Are you sure you want to clear all apparatus shapes and connectors? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        isDanger={true}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          commit([], []);
          setSelection({ type: null, id: null });
        }}
      />

      {/* ── Main Draw.io Workbench ── */}
      <div className={styles.drawioWorkbench}>
        {/* ── Left Accordion Shape Library ── */}
        <aside className={styles.drawioLibrarySidebar}>
          <div className={styles.libraryTitle}>SHAPE LIBRARIES</div>

          {APPARATUS_CATEGORIES.map((cat) => {
            const isOpen = openCategories[cat.id];
            const catItems = Object.values(LAB_APPARATUS).filter((item) => item.category === cat.id);

            return (
              <div key={cat.id} className={styles.accordionGroup}>
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <span className={`${styles.accordionChevron} ${isOpen ? styles.accordionChevronOpen : ''}`}>
                    <ChevronDownIcon />
                  </span>
                  <span className={styles.accordionTitle}>{cat.label}</span>
                  <span className={styles.accordionCount}>{catItems.length}</span>
                </button>

                {isOpen && (
                  <div className={styles.thumbnailGrid}>
                    {catItems.map((item) => {
                      const isSelected = placementShape === item.id && activeTool === 'place';

                      return (
                        <button
                          key={item.id}
                          type="button"
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('shapeId', item.id);
                          }}
                          className={`${styles.thumbCard} ${isSelected ? styles.thumbCardActive : ''}`}
                          onClick={() => {
                            setPlacementShape(item.id);
                            setActiveTool('place');
                          }}
                          title={`Click or Drag to place ${item.name}`}
                        >
                          <div className={styles.thumbSvgContainer}>
                            <svg viewBox={`0 0 ${item.width} ${item.height}`} className={styles.thumbSvg}>
                              <LabEquipmentRenderer
                                node={{ shape: item.id, x: 0, y: 0, w: item.width, h: item.height, hideLabel: true }}
                                color="#E46757"
                              />
                            </svg>
                          </div>
                          <span className={styles.thumbLabel}>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* ── Center SVG Canvas Area (Supports Drag & Drop) ── */}
        <div
          className={styles.drawioCanvasArea}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <svg
            ref={svgRef}
            className={styles.svg}
            onMouseDown={handleSvgMouseDown}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleCanvasClick}
            style={{ touchAction: 'none' }}
          >
            <defs>
              <pattern id="dotgrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="rgba(44,36,32,0.12)" />
              </pattern>
              <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#E46757" />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotgrid)" />

            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {edges.map((edge) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                return (
                  <EdgeArrow
                    key={edge.id}
                    edge={edge}
                    fromNode={fromNode}
                    toNode={toNode}
                    selected={selection.type === 'edge' && selection.id === edge.id}
                    onSelect={(id) => setSelection({ type: 'edge', id })}
                  />
                );
              })}

              {/* Apparatus Nodes */}
              {nodes.map((node) => (
                <g
                  key={node.id}
                  data-node="true"
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                >
                  <LabEquipmentRenderer
                    node={node}
                    color={node.color}
                    label={node.label}
                    selected={selection.type === 'node' && selection.id === node.id}
                    showPorts={activeTool === 'arrow' || (selection.type === 'node' && selection.id === node.id)}
                    onPortClick={(nodeId, portId) => handlePortClick(nodeId, portId)}
                    onLabelMouseDown={(nodeId, e) => handleLabelMouseDown(nodeId, e)}
                    onResizeMouseDown={(nodeId, handle, e) => handleResizeMouseDown(nodeId, handle, e)}
                  />
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* ── Draw.io Format Panel (Right Sidebar) ── */}
        {selectedNode && (
          <aside className={styles.drawioFormatPanel}>
            <div className={styles.formatHeader}>
              <span className={styles.formatTitle}>APPARATUS FORMAT</span>
              <button type="button" className={styles.formatCloseBtn} onClick={() => setSelection({ type: null, id: null })}>
                ✕
              </button>
            </div>

            <div className={styles.formatSection}>
              <label className={styles.formatLabel}>Label Text</label>
              <input
                type="text"
                className={styles.formatInput}
                value={selectedNode.label || ''}
                onChange={(e) => {
                  const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, label: e.target.value } : n));
                  commit(next, edges);
                }}
              />
            </div>

            {selectedDictShape?.hasLiquid && (
              <div className={styles.formatSection}>
                <label className={styles.formatLabel}>Liquid Volume: {selectedNode.liquidLevel || 0}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className={styles.formatRange}
                  value={selectedNode.liquidLevel || 0}
                  onChange={(e) => {
                    const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, liquidLevel: Number(e.target.value) } : n));
                    commit(next, edges);
                  }}
                />

                <label className={styles.formatLabel} style={{ marginTop: 8 }}>Chemical Color</label>
                <div className={styles.colorPaletteGrid}>
                  {LIQUID_COLORS.map((lc) => (
                    <button
                      key={lc.id}
                      type="button"
                      className={`${styles.colorCircle} ${selectedNode.liquidColor === lc.color ? styles.colorCircleActive : ''}`}
                      style={{ backgroundColor: lc.border }}
                      onClick={() => {
                        const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, liquidColor: lc.color } : n));
                        commit(next, edges);
                      }}
                      title={lc.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedDictShape?.hasFlame && (
              <div className={styles.formatSection}>
                <label className={styles.formatLabel}>Burner Ignition</label>
                <button
                  type="button"
                  className={`${styles.igniteBtn} ${selectedNode.flameOn ? styles.igniteBtnActive : ''}`}
                  onClick={() => {
                    const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, flameOn: !n.flameOn } : n));
                    commit(next, edges);
                  }}
                >
                  Flame {selectedNode.flameOn ? 'ON' : 'OFF'}
                </button>
              </div>
            )}

            <div className={styles.formatSection}>
              <label className={styles.formatLabel}>Dimensions (Width × Height)</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', color: '#78716C' }}>Width: {selectedNode.w || selectedDictShape?.width || 80}px</span>
                  <input
                    type="range"
                    min="30"
                    max="350"
                    className={styles.formatRange}
                    value={selectedNode.w || selectedDictShape?.width || 80}
                    onChange={(e) => {
                      const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, w: Number(e.target.value) } : n));
                      commit(next, edges);
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', color: '#78716C' }}>Height: {selectedNode.h || selectedDictShape?.height || 80}px</span>
                  <input
                    type="range"
                    min="30"
                    max="350"
                    className={styles.formatRange}
                    value={selectedNode.h || selectedDictShape?.height || 80}
                    onChange={(e) => {
                      const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, h: Number(e.target.value) } : n));
                      commit(next, edges);
                    }}
                  />
                </div>
              </div>

              {/* Quick Size Chips */}
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  className={styles.headerPresetChip}
                  onClick={() => {
                    const dw = selectedDictShape?.width || 80;
                    const dh = selectedDictShape?.height || 80;
                    const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, w: Math.round(dw * 0.7), h: Math.round(dh * 0.7) } : n));
                    commit(next, edges);
                  }}
                >
                  Small
                </button>
                <button
                  type="button"
                  className={styles.headerPresetChip}
                  onClick={() => {
                    const dw = selectedDictShape?.width || 80;
                    const dh = selectedDictShape?.height || 80;
                    const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, w: dw, h: dh } : n));
                    commit(next, edges);
                  }}
                >
                  Standard
                </button>
                <button
                  type="button"
                  className={styles.headerPresetChip}
                  onClick={() => {
                    const dw = selectedDictShape?.width || 80;
                    const dh = selectedDictShape?.height || 80;
                    const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, w: Math.round(dw * 1.4), h: Math.round(dh * 1.4) } : n));
                    commit(next, edges);
                  }}
                >
                  Large
                </button>
                <button
                  type="button"
                  className={styles.headerPresetChip}
                  onClick={() => {
                    const dw = selectedDictShape?.width || 80;
                    const dh = selectedDictShape?.height || 80;
                    const next = nodes.map((n) => (n.id === selectedNode.id ? { ...n, w: Math.round(dw * 1.8), h: dh } : n));
                    commit(next, edges);
                  }}
                >
                  Broader
                </button>
              </div>
            </div>

            <div className={styles.formatSection}>
              <button
                type="button"
                className={styles.formatDeleteBtn}
                onClick={() => {
                  const nextNodes = nodes.filter((n) => n.id !== selectedNode.id);
                  const nextEdges = edges.filter((e) => e.from !== selectedNode.id && e.to !== selectedNode.id);
                  commit(nextNodes, nextEdges);
                  setSelection({ type: null, id: null });
                }}
              >
                <TrashIcon /> Delete Shape
              </button>
            </div>
          </aside>
        )}

        {/* Selected Edge Format Inspector Panel */}
        {selectedEdge && (
          <aside className={styles.drawioFormatPanel}>
            <div className={styles.formatHeader}>
              <span className={styles.formatTitle}>CONNECTOR FORMAT</span>
              <button type="button" className={styles.formatCloseBtn} onClick={() => setSelection({ type: null, id: null })}>
                ✕
              </button>
            </div>

            <div className={styles.formatSection}>
              <label className={styles.formatLabel}>Connector Badge Label</label>
              <input
                type="text"
                className={styles.formatInput}
                placeholder="e.g. Vapor Path, Distillate..."
                value={selectedEdge.label || ''}
                onChange={(e) => {
                  const next = edges.map((eg) => (eg.id === selectedEdge.id ? { ...eg, label: e.target.value } : eg));
                  commit(nodes, next);
                }}
              />
            </div>

            <div className={styles.formatSection}>
              <label className={styles.formatLabel}>Line Routing Style</label>
              <select
                className={styles.formatInput}
                value={selectedEdge.routing || 'orthogonal'}
                onChange={(e) => {
                  const next = edges.map((eg) => (eg.id === selectedEdge.id ? { ...eg, routing: e.target.value } : eg));
                  commit(nodes, next);
                }}
              >
                <option value="orthogonal">Orthogonal Angle</option>
                <option value="curved">Curved Bezier</option>
                <option value="straight">Direct Straight Line</option>
              </select>
            </div>

            <div className={styles.formatSection}>
              <label className={styles.formatLabel}>Line Dash Style</label>
              <select
                className={styles.formatInput}
                value={selectedEdge.dashStyle || 'solid'}
                onChange={(e) => {
                  const next = edges.map((eg) => (eg.id === selectedEdge.id ? { ...eg, dashStyle: e.target.value } : eg));
                  commit(nodes, next);
                }}
              >
                <option value="solid">Solid Line</option>
                <option value="dashed">Dashed Line</option>
                <option value="dotted">Dotted Line</option>
              </select>
            </div>

            <div className={styles.formatSection}>
              <button
                type="button"
                className={styles.formatDeleteBtn}
                onClick={() => {
                  const nextEdges = edges.filter((eg) => eg.id !== selectedEdge.id);
                  commit(nodes, nextEdges);
                  setSelection({ type: null, id: null });
                }}
              >
                <TrashIcon /> Delete Connector Line
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Floating Lab AI Study Companion */}
      <LabAICompanion nodes={nodes} edges={edges} />
    </div>
  );
}
