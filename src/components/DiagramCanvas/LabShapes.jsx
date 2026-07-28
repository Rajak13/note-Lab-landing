import React from 'react';
import { LAB_APPARATUS } from './LabApparatusDictionary';

/* ════════════════════════════════════════════════════════════════════
   LabShapes.jsx — Textbook-Quality Vector Laboratory Equipment Engine
   ════════════════════════════════════════════════════════════════════ */

/* ── Port Anchor Math ── */
export function getNodePorts(node) {
  const w = node.w || 80;
  const h = node.h || 80;
  
  const dictShape = LAB_APPARATUS[node.shape];
  if (dictShape && dictShape.ports) {
    const portsObj = {};
    dictShape.ports.forEach((p) => {
      const scaleX = w / dictShape.width;
      const scaleY = h / dictShape.height;
      const px = node.x + p.x * scaleX;
      const py = node.y + p.y * scaleY;
      
      let dir = 'right';
      if (p.angle >= 45 && p.angle <= 135) dir = 'top';
      else if (p.angle > 135 && p.angle < 225) dir = 'left';
      else if (p.angle >= 225 && p.angle <= 315) dir = 'bottom';

      let dx = 1, dy = 0;
      if (dir === 'left') { dx = -1; dy = 0; }
      if (dir === 'top') { dx = 0; dy = -1; }
      if (dir === 'bottom') { dx = 0; dy = 1; }

      portsObj[p.id] = { x: px, y: py, dir, dx, dy, label: p.label };
    });
    return portsObj;
  }

  return {
    top:    { x: node.x + w / 2, y: node.y,         dir: 'top',    dx: 0,  dy: -1 },
    bottom: { x: node.x + w / 2, y: node.y + h,     dir: 'bottom', dx: 0,  dy: 1  },
    left:   { x: node.x,         y: node.y + h / 2, dir: 'left',   dx: -1, dy: 0  },
    right:  { x: node.x + w,     y: node.y + h / 2, dir: 'right',  dx: 1,  dy: 0  },
  };
}

export function calculateBestPorts(fromNode, toNode, customFromPort, customToPort) {
  const fromPorts = getNodePorts(fromNode);
  const toPorts = getNodePorts(toNode);

  if (customFromPort && customToPort && fromPorts[customFromPort] && toPorts[customToPort]) {
    return { fromPort: fromPorts[customFromPort], toPort: toPorts[customToPort] };
  }

  const fcx = fromNode.x + (fromNode.w || 80) / 2;
  const fcy = fromNode.y + (fromNode.h || 80) / 2;
  const tcx = toNode.x + (toNode.w || 80) / 2;
  const tcy = toNode.y + (toNode.h || 80) / 2;

  const dx = tcx - fcx;
  const dy = tcy - fcy;

  let fp = 'right', tp = 'left';
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) { fp = 'right'; tp = 'left'; }
    else { fp = 'left'; tp = 'right'; }
  } else {
    if (dy > 0) { fp = 'bottom'; tp = 'top'; }
    else { fp = 'top'; tp = 'bottom'; }
  }
  return { fromPort: fromPorts[fp] || Object.values(fromPorts)[0], toPort: toPorts[tp] || Object.values(toPorts)[0] };
}

export function generatePathData(p1, p2, routing = 'curved') {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  let pathD = '';
  let labelX = (p1.x + p2.x) / 2;
  let labelY = (p1.y + p2.y) / 2;

  if (routing === 'straight') {
    pathD = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  } else if (routing === 'curved') {
    const factor = Math.min(dist * 0.45, 90);
    const cp1x = p1.x + (p1.dx || 1) * factor;
    const cp1y = p1.y + (p1.dy || 0) * factor;
    const cp2x = p2.x + (p2.dx || -1) * factor;
    const cp2y = p2.y + (p2.dy || 0) * factor;
    pathD = `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    labelX = 0.125 * p1.x + 0.375 * cp1x + 0.375 * cp2x + 0.125 * p2.x;
    labelY = 0.125 * p1.y + 0.375 * cp1y + 0.375 * cp2y + 0.125 * p2.y;
  } else {
    if ((p1.dir === 'left' || p1.dir === 'right') && (p2.dir === 'left' || p2.dir === 'right')) {
      const midX = (p1.x + p2.x) / 2;
      pathD = `M ${p1.x} ${p1.y} H ${midX} V ${p2.y} H ${p2.x}`;
      labelX = midX; labelY = (p1.y + p2.y) / 2;
    } else if ((p1.dir === 'top' || p1.dir === 'bottom') && (p2.dir === 'top' || p2.dir === 'bottom')) {
      const midY = (p1.y + p2.y) / 2;
      pathD = `M ${p1.x} ${p1.y} V ${midY} H ${p2.x} V ${p2.y}`;
      labelX = (p1.x + p2.x) / 2; labelY = midY;
    } else {
      if (p1.dir === 'right' || p1.dir === 'left') {
        pathD = `M ${p1.x} ${p1.y} H ${p2.x} V ${p2.y}`;
        labelX = p2.x; labelY = (p1.y + p2.y) / 2;
      } else {
        pathD = `M ${p1.x} ${p1.y} V ${p2.y} H ${p2.x}`;
        labelX = (p1.x + p2.x) / 2; labelY = p2.y;
      }
    }
  }
  return { pathD, labelX, labelY };
}

function SelectionRing({ x, y, w, h, pad = 8, onResizeMouseDown }) {
  const handles = [
    { handle: 'nw', cx: x - pad, cy: y - pad, cursor: 'nwse-resize' },
    { handle: 'n',  cx: x + w / 2, cy: y - pad, cursor: 'ns-resize' },
    { handle: 'ne', cx: x + w + pad, cy: y - pad, cursor: 'nesw-resize' },
    { handle: 'e',  cx: x + w + pad, cy: y + h / 2, cursor: 'ew-resize' },
    { handle: 'se', cx: x + w + pad, cy: y + h + pad, cursor: 'nwse-resize' },
    { handle: 's',  cx: x + w / 2, cy: y + h + pad, cursor: 'ns-resize' },
    { handle: 'sw', cx: x - pad, cy: y + h + pad, cursor: 'nesw-resize' },
    { handle: 'w',  cx: x - pad, cy: y + h / 2, cursor: 'ew-resize' },
  ];

  return (
    <g>
      <rect
        x={x - pad} y={y - pad}
        width={w + pad * 2} height={h + pad * 2}
        rx="8"
        fill="none"
        stroke="#E46757"
        strokeWidth="2.2"
        strokeDasharray="5 3"
        opacity="0.85"
      />
      {handles.map((hObj) => (
        <rect
          key={hObj.handle}
          x={hObj.cx - 4.5}
          y={hObj.cy - 4.5}
          width="9"
          height="9"
          rx="2"
          fill="#FFFDF8"
          stroke="#E46757"
          strokeWidth="1.8"
          style={{ cursor: hObj.cursor, pointerEvents: 'all' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (onResizeMouseDown) onResizeMouseDown(hObj.handle, e);
          }}
        />
      ))}
    </g>
  );
}

/* ── Scientific Leader Line Component (Supports Drag-to-Move & Double Click Edit) ── */
function LeaderLineLabel({ x, y, w, h, label, leaderLine, onLabelMouseDown, onLabelDoubleClick }) {
  if (!label || !leaderLine) return null;

  const { targetX = w / 2, targetY = h / 2, dx = 60, dy = -30, side = 'right' } = leaderLine;
  const absoluteTargetX = x + targetX;
  const absoluteTargetY = y + targetY;
  const labelX = absoluteTargetX + dx;
  const labelY = absoluteTargetY + dy;
  const isRight = side === 'right' || dx >= 0;

  const kneeX = isRight ? labelX - 12 : labelX + 12;
  const pathD = `M ${absoluteTargetX} ${absoluteTargetY} L ${kneeX} ${labelY} H ${labelX}`;
  const textWidth = Math.max(120, label.length * 8.5);

  return (
    <g>
      {/* Target Dot on Apparatus */}
      <circle cx={absoluteTargetX} cy={absoluteTargetY} r="3.5" fill="#E46757" />
      
      {/* 1.5px Thin Leader Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#78716C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 3"
        pointerEvents="none"
      />

      {/* Draggable & Double-Clickable Scientific Label Box & Text */}
      <g
        data-label="true"
        onMouseDown={onLabelMouseDown}
        onDoubleClick={onLabelDoubleClick}
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
        title="Click to select, drag to move, double-click to edit text"
      >
        <rect
          x={isRight ? labelX : labelX - textWidth}
          y={labelY - 14}
          width={textWidth}
          height={24}
          fill="#FFFDF8"
          stroke="rgba(44, 36, 32, 0.2)"
          strokeWidth="1"
          rx="4"
        />
        <text
          x={isRight ? labelX + 8 : labelX - 8}
          y={labelY + 3}
          textAnchor={isRight ? 'start' : 'end'}
          fontSize="12.5"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="500"
          fill="#2C2420"
          letterSpacing="-0.01em"
        >
          {label}
        </text>
      </g>
    </g>
  );
}

function ShapeLabel({ x, y, text, hide, onLabelMouseDown, onLabelDoubleClick }) {
  if (!text || hide) return null;
  const textWidth = Math.max(90, text.length * 8 + 20);
  return (
    <g
      data-label="true"
      transform={`translate(${x}, ${y})`}
      onMouseDown={onLabelMouseDown}
      onDoubleClick={onLabelDoubleClick}
      style={{ cursor: 'pointer', pointerEvents: 'all' }}
      title="Click to select, drag to move, double-click to edit text"
    >
      <rect x={-textWidth / 2} y="-11" width={textWidth} height={22} rx="5" fill="#FFFDF8" stroke="rgba(44, 36, 32, 0.2)" strokeWidth="1" />
      <text
        x="0" y="4"
        textAnchor="middle"
        fontSize="11"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fill="#2C2420"
        letterSpacing="-0.01em"
      >{text}</text>
    </g>
  );
}

function RenderPorts({ ports, onPortClick }) {
  return (
    <g pointerEvents="all">
      {Object.entries(ports).map(([portId, p]) => (
        <g key={portId} onClick={(e) => { e.stopPropagation(); if (onPortClick) onPortClick(portId, p); }} style={{ cursor: 'crosshair' }}>
          <circle cx={p.x} cy={p.y} r="9" fill="transparent" />
          <circle
            cx={p.x} cy={p.y}
            r="5"
            fill="#FFFDF8"
            stroke="#E46757"
            strokeWidth="2.2"
          />
        </g>
      ))}
    </g>
  );
}

/* ════════════════════════════════════════════════════════════════════
   UNIVERSAL PARAMETRIC APPARATUS RENDERER (2.5px Coral Outlines)
   ════════════════════════════════════════════════════════════════════ */
export function LabEquipmentRenderer({
  node,
  color = '#E46757',
  label = '',
  selected,
  showPorts,
  onPortClick = () => {},
  onLabelMouseDown = () => {},
  onLabelDoubleClick = () => {},
  onResizeMouseDown = () => {},
}) {
  const { x, y, w = 80, h = 80, shape, liquidLevel = 50, liquidColor, flameOn = false, hideLabel = false, leaderLine } = node;
  const config = LAB_APPARATUS[shape];

  if (!config) {
    if (shape === 'process') return <ProcessRect x={x} y={y} w={w} h={h} color={color} label={label || node.label} selected={selected} showPorts={showPorts} />;
    if (shape === 'decision') return <DecisionDiamond x={x} y={y} w={w} h={h} color={color} label={label || node.label} selected={selected} showPorts={showPorts} />;
    if (shape === 'text') return <TextAnnotation x={x} y={y} w={w} h={h} color={color} label={label || node.label} selected={selected} />;
    return <ProcessRect x={x} y={y} w={w} h={h} color={color} label={label || node.label} selected={selected} showPorts={showPorts} />;
  }

  const fillStyle = liquidColor || 'rgba(6, 182, 212, 0.45)';
  const activeLiquidPct = Math.min(100, Math.max(0, liquidLevel)) / 100;
  const ports = getNodePorts(node);
  const displayLabel = node.label !== undefined ? node.label : (label || config.name);

  return (
    <g style={{ cursor: 'move' }}>
      {selected && (
        <SelectionRing
          x={x} y={y} w={w} h={h}
          onResizeMouseDown={(handle, e) => onResizeMouseDown && onResizeMouseDown(node.id, handle, e)}
        />
      )}

      {/* Full Surface Invisible Hit Target */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="rgba(255, 255, 255, 0.001)"
        pointerEvents="all"
        style={{ cursor: 'move' }}
      />

      <g transform={`translate(${x}, ${y}) scale(${w / config.width}, ${h / config.height})`} pointerEvents="none">
        
        {/* Soft Translucent Liquid Fill Clipped to Glass Walls */}
        {config.hasLiquid && activeLiquidPct > 0 && (
          <g>
            <defs>
              <clipPath id={`liquid-clip-${node.id}`}>
                {shape === 'roundFlask' ? (
                  <path d="M 33 4 H 52 V 32 A 38 38 0 1 1 33 32 Z" />
                ) : shape === 'erlenmeyer' ? (
                  <path d="M 32 4 H 53 V 25 L 78 88 Q 82 98 70 98 H 15 Q 3 98 7 88 L 32 25 Z" />
                ) : shape === 'testTube' ? (
                  <path d="M 4 4 H 28 V 94 A 12 12 0 0 1 4 94 Z" />
                ) : (
                  <rect x="2" y="2" width={config.width - 4} height={config.height - 4} rx="4" />
                )}
              </clipPath>
            </defs>
            <g clipPath={`url(#liquid-clip-${node.id})`}>
              <rect
                x="0"
                y={config.height * (1 - activeLiquidPct * 0.82)}
                width={config.width}
                height={config.height * activeLiquidPct * 0.85 + 10}
                fill={fillStyle}
                opacity="0.85"
              />
              {/* Liquid Surface Meniscus Line */}
              <line
                x1="0"
                y1={config.height * (1 - activeLiquidPct * 0.82)}
                x2={config.width}
                y2={config.height * (1 - activeLiquidPct * 0.82)}
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </g>
        )}

        {/* Dynamic Flame */}
        {config.hasFlame && flameOn && (
          <g transform={`translate(${config.width / 2}, -5)`}>
            <path
              d="M 0 0 C -10 -15, -4 -25, 0 -32 C 4 -25, 10 -15, 0 0 Z"
              fill="url(#flameOuter)"
            />
            <path
              d="M 0 0 C -5 -10, -2 -18, 0 -22 C 2 -18, 5 -10, 0 0 Z"
              fill="#FDE047"
            />
          </g>
        )}

        {/* Precision 2.5px Coral Apparatus Outlines */}
        <g stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {shape === 'beaker' && (
            <g>
              <path d={`M 4 4 H ${config.width - 10} L ${config.width} 0 M ${config.width - 10} 4 V ${config.height - 8} Q ${config.width - 10} ${config.height} ${config.width - 18} ${config.height} H 12 Q 4 ${config.height} 4 ${config.height - 8} V 4`} />
              <line x1={config.width - 20} y1="30" x2={config.width - 12} y2="30" strokeOpacity="0.5" strokeWidth="1.8" />
              <line x1={config.width - 24} y1="50" x2={config.width - 12} y2="50" strokeOpacity="0.5" strokeWidth="1.8" />
              <line x1={config.width - 20} y1="70" x2={config.width - 12} y2="70" strokeOpacity="0.5" strokeWidth="1.8" />
            </g>
          )}

          {shape === 'erlenmeyer' && (
            <g>
              <path d="M 32 4 H 53 V 25 L 78 88 Q 82 98 70 98 H 15 Q 3 98 7 88 L 32 25 Z" />
              <line x1="30" y1="50" x2="42" y2="50" strokeOpacity="0.5" strokeWidth="1.8" />
              <line x1="24" y1="70" x2="38" y2="70" strokeOpacity="0.5" strokeWidth="1.8" />
            </g>
          )}

          {shape === 'roundFlask' && (
            <g>
              <path d="M 33 4 H 52 V 32 A 38 38 0 1 1 33 32 Z" />
              <path d="M 52 24 L 66 22" strokeWidth="2.5" />
            </g>
          )}

          {shape === 'testTube' && (
            <g>
              <path d="M 4 4 H 28 V 94 A 12 12 0 0 1 4 94 Z" />
              <line x1="6" y1="35" x2="14" y2="35" strokeOpacity="0.5" strokeWidth="1.8" />
              <line x1="6" y1="60" x2="14" y2="60" strokeOpacity="0.5" strokeWidth="1.8" />
            </g>
          )}

          {shape === 'graduatedCylinder' && (
            <g>
              <path d="M 12 4 H 32 V 110 H 42 V 118 H 2 V 110 H 12 Z" />
              {[20, 35, 50, 65, 80, 95].map((gy, idx) => (
                <line key={idx} x1="14" y1={gy} x2={idx % 2 === 0 ? "26" : "20"} y2={gy} strokeOpacity="0.6" strokeWidth="1.8" />
              ))}
            </g>
          )}

          {shape === 'liebigCondenser' && (
            <g>
              {/* Outer Water Cooling Jacket */}
              <rect x="20" y="8" width="100" height="34" rx="4" strokeWidth="2.5" />
              {/* Inner Glass Vapor Tube */}
              <line x1="0" y1="25" x2="140" y2="25" strokeWidth="2.5" />
              {/* Cooling Water Inlet Barb (Bottom Right) */}
              <line x1="110" y1="42" x2="110" y2="50" strokeWidth="2.5" />
              {/* Cooling Water Outlet Barb (Top Left) */}
              <line x1="30" y1="8" x2="30" y2="0" strokeWidth="2.5" />
            </g>
          )}

          {shape === 'bunsenBurner' && (
            <g>
              <rect x="28" y="15" width="14" height="65" rx="2" strokeWidth="2.5" />
              <rect x="25" y="60" width="20" height="12" rx="2" strokeWidth="2.5" />
              <path d="M 10 90 L 25 77 H 45 L 60 90 Q 65 98 50 98 H 20 Q 5 98 10 90 Z" strokeWidth="2.5" />
              <line x1="45" y1="88" x2="70" y2="88" strokeWidth="2.5" />
            </g>
          )}

          {shape === 'burette' && (
            <g>
              {/* Glass Tube & Calibrated Markings */}
              <path d="M 8 4 H 22 V 105 L 15 118 V 138" strokeWidth="2.5" />
              {/* Stopcock Valve Wheel */}
              <circle cx="15" cy="110" r="4.5" fill={color} />
              <line x1="8" y1="110" x2="22" y2="110" strokeWidth="2.5" />
              {[15, 30, 45, 60, 75, 90].map((by, idx) => (
                <line key={idx} x1="10" y1={by} x2="18" y2={by} strokeOpacity="0.6" strokeWidth="1.8" />
              ))}
            </g>
          )}

          {shape === 'retortStand' && (
            <g>
              <rect x="10" y="135" width="70" height="12" rx="2" fill={color} fillOpacity="0.12" strokeWidth="2.5" />
              <line x1="20" y1="5" x2="20" y2="135" strokeWidth="3" />
              <rect x="16" y="45" width="8" height="12" fill={color} />
              <path d="M 24 51 H 75 M 75 35 V 65" strokeWidth="2.5" />
            </g>
          )}

          {shape === 'rubberStopper' && (
            <g>
              <polygon points="6,4 34,4 30,26 10,26" fill="#57534E" stroke="#2C2420" strokeWidth="2" />
              <circle cx="15" cy="14" r="2.5" fill="#1C1917" />
              <circle cx="25" cy="14" r="2.5" fill="#1C1917" />
            </g>
          )}

          {shape === 'uTube' && (
            <g>
              <path d="M 12 4 V 50 A 13 13 0 0 0 38 50 V 4" strokeWidth="2.8" />
            </g>
          )}

          {shape === 'elbowTube' && (
            <g>
              <path d="M 4 12 H 38 A 10 10 0 0 1 48 22 V 46" strokeWidth="2.8" />
            </g>
          )}

          {shape === 'thermometer' && (
            <g>
              <rect x="6" y="4" width="8" height="112" rx="4" strokeWidth="2.5" fill="#FFFDF8" />
              <circle cx="10" cy="108" r="5" fill="#EF4444" stroke="#C94A3C" strokeWidth="1.5" />
              <line x1="10" y1="30" x2="10" y2="108" stroke="#EF4444" strokeWidth="2" />
              {[30, 45, 60, 75, 90].map((ty, idx) => (
                <line key={idx} x1="7" y1={ty} x2="12" y2={ty} stroke="#2C2420" strokeWidth="1.2" />
              ))}
            </g>
          )}

          {shape === 'separatoryFunnel' && (
            <g>
              <path d="M 22 4 H 38 V 16 L 50 35 Q 52 80 30 95 V 116 M 30 98 H 36" strokeWidth="2.5" />
              <circle cx="30" cy="98" r="4" fill={color} />
            </g>
          )}

          {shape === 'hotPlate' && (
            <g>
              <rect x="4" y="20" width="92" height="30" rx="4" fill="#FFFDF8" strokeWidth="2.5" />
              <rect x="10" y="8" width="80" height="12" rx="2" fill="#E5E7EB" strokeWidth="2" />
              <circle cx="25" cy="35" r="4" fill={color} />
              <rect x="50" y="30" width="35" height="10" rx="2" fill="#1C1917" />
            </g>
          )}

          {shape === 'tripodStand' && (
            <g>
              <line x1="4" y1="12" x2="86" y2="12" strokeWidth="3" />
              <line x1="15" y1="12" x2="5" y2="105" strokeWidth="2.5" />
              <line x1="75" y1="12" x2="85" y2="105" strokeWidth="2.5" />
              <line x1="45" y1="12" x2="45" y2="105" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="10" y="6" width="70" height="6" fill="#9CA3AF" />
            </g>
          )}

          {/* Generic fallback SVG outline */}
          {!['beaker', 'erlenmeyer', 'roundFlask', 'testTube', 'graduatedCylinder', 'liebigCondenser', 'bunsenBurner', 'burette', 'retortStand', 'rubberStopper', 'uTube', 'elbowTube', 'thermometer', 'separatoryFunnel', 'hotPlate', 'tripodStand'].includes(shape) && (
            <rect x="4" y="4" width={config.width - 8} height={config.height - 8} rx="8" strokeDasharray="4 2" strokeWidth="2" />
          )}
        </g>
      </g>

      {/* Leader line pointing outside illustration or standard label */}
      {leaderLine ? (
        <LeaderLineLabel
          x={x} y={y} w={w} h={h}
          label={displayLabel}
          leaderLine={leaderLine}
          onLabelMouseDown={(e) => onLabelMouseDown && onLabelMouseDown(node.id, e)}
          onLabelDoubleClick={(e) => onLabelDoubleClick && onLabelDoubleClick(node.id, e)}
        />
      ) : (
        <ShapeLabel
          x={x + w / 2} y={y + h + 16}
          text={displayLabel}
          hide={hideLabel}
          onLabelMouseDown={(e) => onLabelMouseDown && onLabelMouseDown(node.id, e)}
          onLabelDoubleClick={(e) => onLabelDoubleClick && onLabelDoubleClick(node.id, e)}
        />
      )}

      {showPorts && <RenderPorts ports={ports} onPortClick={(portId) => onPortClick && onPortClick(node.id, portId)} />}

      <defs>
        <radialGradient id="flameOuter" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="60%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  );
}

/* ── Legacy Standard Flowchart Shapes ── */
export function ProcessRect({ x, y, w = 120, h = 60, color = '#E46757', label = '', selected, showPorts }) {
  const ports = getNodePorts({ x, y, w, h });
  return (
    <g>
      {selected && <SelectionRing x={x} y={y} w={w} h={h} />}
      <rect x={x} y={y} width={w} height={h} rx="8" fill="#FFFDF8" stroke={color} strokeWidth="2.5" />
      <ShapeLabel x={x + w / 2} y={y + h / 2 + 4} text={label} />
      {showPorts && <RenderPorts ports={ports} />}
    </g>
  );
}

export function DecisionDiamond({ x, y, w = 90, h = 90, color = '#E46757', label = '', selected, showPorts }) {
  const ports = getNodePorts({ x, y, w, h });
  const points = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`;
  return (
    <g>
      {selected && <SelectionRing x={x} y={y} w={w} h={h} />}
      <polygon points={points} fill="#FFFDF8" stroke={color} strokeWidth="2.5" />
      <ShapeLabel x={x + w / 2} y={y + h / 2 + 4} text={label} />
      {showPorts && <RenderPorts ports={ports} />}
    </g>
  );
}

export function TextAnnotation({ x, y, label = '', color = '#78716C', selected }) {
  return (
    <g>
      {selected && <SelectionRing x={x - 10} y={y - 15} w={100} h={30} />}
      <text x={x} y={y} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="500" fill={color}>{label || 'Double click to edit note...'}</text>
    </g>
  );
}
