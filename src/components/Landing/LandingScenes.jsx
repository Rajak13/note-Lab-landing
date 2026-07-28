/**
 * LandingScenes.jsx
 * ─────────────────────────────────────────────────────────────────
 * Four inline SVG scenes sharing the same recurring NoteLab objects:
 *   notebook · coffee · pencil · sticky note · formula card · beaker
 *
 * Exports:
 *   LandingHeroLabScene     — Hero: full desk, open notebook, objects scattered
 *   LandingMicroscopeScene  — Features: microscope scene, formula cards, particles
 *   LandingJournalScene     — About: stack of 3 notebooks with bookmarks
 *   LandingCloseScene       — Contact: closed notebook, pencil, coffee, plant
 */

import anim from '../../styles/landingAnimations.module.css'

const C = {
  coral:     '#E46757',
  coralDark: '#C94A3C',
  coralSoft: 'rgba(228,103,87,0.12)',
  cream:     '#FFFEF9',
  warm:      '#F4F1EA',
  beige:     '#E8E2D9',
  wood:      '#D4CEC4',
  ink:       '#2C2420',
  inkMid:    'rgba(44,36,32,0.45)',
  inkFaint:  'rgba(44,36,32,0.12)',
  yellow:    '#FFFDE7',
  gold:      '#D97706',
  blue:      '#EFF6FF',
  teal:      '#0D9488',
  tealSoft:  '#CCF0EB',
  amber:     '#F59E0B',
}

function Shadow({ id, dy = 5, blur = 10, op = 0.10 }) {
  return (
    <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy={dy} stdDeviation={blur} floodColor={C.ink} floodOpacity={op} />
    </filter>
  )
}

/* ── Shared recurring objects ─────────────────────────────────── */

/** Open notebook spread — coral spine left, grid pages right */
function Notebook({ x = 0, y = 0, w = 260, rotate = 0, filter }) {
  const h = w * 0.72
  const spine = w * 0.115
  const rx = 6
  const lineCount = 8
  const lineSpacing = (h - 48) / (lineCount - 1)
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate},${w / 2},${h / 2})`} filter={filter}>
      {/* Left page */}
      <rect x={0} y={0} width={w / 2} height={h} rx={rx} fill={C.cream} />
      {/* Right page */}
      <rect x={w / 2} y={0} width={w / 2} height={h} rx={rx} fill={C.cream} />
      {/* Spine */}
      <rect x={w / 2 - spine / 2} y={0} width={spine} height={h} rx={4} fill={C.coral} />
      {/* Grid on left page */}
      {Array.from({ length: lineCount }).map((_, i) => (
        <line
          key={i}
          x1={spine / 2 + 12} y1={24 + i * lineSpacing}
          x2={w / 2 - spine / 2 - 12} y2={24 + i * lineSpacing}
          stroke={C.inkFaint} strokeWidth="1"
        />
      ))}
      {/* Grid on right page */}
      {Array.from({ length: lineCount }).map((_, i) => (
        <line
          key={`r${i}`}
          x1={w / 2 + spine / 2 + 12} y1={24 + i * lineSpacing}
          x2={w - 12} y2={24 + i * lineSpacing}
          stroke={C.inkFaint} strokeWidth="1"
        />
      ))}
      {/* Writing lines on left — coral ink */}
      <line x1={spine / 2 + 12} y1={24} x2={w / 2 - spine / 2 - 30} y2={24} stroke={C.coral} strokeWidth="1.4" opacity="0.5" />
      <line x1={spine / 2 + 12} y1={24 + lineSpacing} x2={w / 2 - spine / 2 - 50} y2={24 + lineSpacing} stroke={C.coral} strokeWidth="1.4" opacity="0.35" />
      <line x1={spine / 2 + 12} y1={24 + lineSpacing * 2} x2={w / 2 - spine / 2 - 20} y2={24 + lineSpacing * 2} stroke={C.coral} strokeWidth="1.4" opacity="0.3" />
      {/* Bookmark ribbon */}
      <path d={`M${w - 20} 0 L${w - 14} 0 L${w - 14} ${h * 0.38} L${w - 17} ${h * 0.34} L${w - 20} ${h * 0.38} Z`} fill={C.teal} />
      {/* Centre divide shadow */}
      <line x1={w / 2} y1={4} x2={w / 2} y2={h - 4} stroke={C.inkFaint} strokeWidth="3" />
    </g>
  )
}

/** Closed notebook */
function ClosedNotebook({ x = 0, y = 0, w = 180, rotate = 0, filter }) {
  const h = w * 0.72
  const spine = w * 0.115
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate},${w / 2},${h / 2})`} filter={filter}>
      <rect x={0} y={0} width={w} height={h} rx={6} fill={C.cream} />
      <rect x={0} y={0} width={spine} height={h} rx={4} fill={C.coral} />
      <line x1={spine + 12} y1={h * 0.35} x2={w - 12} y2={h * 0.35} stroke={C.inkFaint} strokeWidth="1.5" />
      <line x1={spine + 12} y1={h * 0.50} x2={w - 20} y2={h * 0.50} stroke={C.inkFaint} strokeWidth="1.5" />
      <line x1={spine + 12} y1={h * 0.65} x2={w - 16} y2={h * 0.65} stroke={C.inkFaint} strokeWidth="1.5" />
      {/* Bookmark */}
      <path d={`M${w - 16} 0 L${w - 10} 0 L${w - 10} ${h * 0.32} L${w - 13} ${h * 0.28} L${w - 16} ${h * 0.32} Z`} fill={C.teal} />
    </g>
  )
}

/** Coffee mug */
function Coffee({ x = 0, y = 0, scale = 1 }) {
  const s = scale
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* Mug body */}
      <path d="M8 14 H52 V46 C52 56 44 64 30 64 C16 64 8 56 8 46 Z" fill={C.cream} />
      {/* Coral band */}
      <rect x={8} y={14} width={44} height={11} fill={C.coral} opacity="0.85" />
      {/* Handle */}
      <path d="M52 22 H64 C72 22 78 28 78 36 C78 44 72 50 64 50 H52" stroke={C.beige} strokeWidth="5" fill="none" />
      {/* Steam */}
      <path d="M22 8 Q26 0 30 8" stroke={C.coral} strokeWidth="1.8" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M34 4 Q38 -4 42 4" stroke={C.coral} strokeWidth="1.8" fill="none" opacity="0.35" strokeLinecap="round" />
      {/* Saucer ellipse */}
      <ellipse cx="30" cy="66" rx="30" ry="5" fill={C.beige} />
    </g>
  )
}

/** Pencil — horizontal, amber body, coral eraser */
function Pencil({ x = 0, y = 0, w = 140, rotate = 0 }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate},${w / 2},5)`}>
      {/* Body */}
      <rect x={14} y={0} width={w - 28} height={10} rx={2} fill={C.amber} />
      {/* Eraser end */}
      <rect x={w - 14} y={0} width={14} height={10} rx={2} fill={C.coral} />
      {/* Metal band */}
      <rect x={w - 18} y={0} width={6} height={10} fill={C.wood} />
      {/* Tip */}
      <path d={`M14 0 L0 5 L14 10 Z`} fill="#F5E6C8" />
      {/* Shading stripe */}
      <rect x={16} y={3} width={w - 34} height={3} rx={1} fill="rgba(255,255,255,0.3)" />
    </g>
  )
}

/** Sticky note */
function StickyNote({ x = 0, y = 0, w = 72, rotate = 0, color, lines = 2 }) {
  const bg = color || C.yellow
  const h = w * 0.85
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate},${w / 2},${h / 2})`}>
      <rect x={0} y={0} width={w} height={h} rx={3} fill={bg} />
      {Array.from({ length: lines }).map((_, i) => (
        <line
          key={i}
          x1={10} y1={20 + i * 16}
          x2={w - 10} y2={20 + i * 16}
          stroke={C.inkFaint} strokeWidth="1.5"
        />
      ))}
    </g>
  )
}

/** Formula card */
function FormulaCard({ x = 0, y = 0, w = 88, formula = 'E = mc²', rotate = 0 }) {
  const h = w * 0.62
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate},${w / 2},${h / 2})`}>
      <rect x={0} y={0} width={w} height={h} rx={4} fill={C.cream} stroke={C.inkFaint} strokeWidth="1" />
      <text
        x={w / 2} y={h / 2 + 5}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize={w * 0.185}
        fill={C.coralDark}
        opacity="0.8"
      >
        {formula}
      </text>
    </g>
  )
}

/** Paperclip */
function Paperclip({ x = 0, y = 0, scale = 1, rotate = 0 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale}) rotate(${rotate},12,20)`}>
      <path
        d="M12 4 C6 4 2 8 2 14 L2 32 C2 38 6 42 12 42 C18 42 22 38 22 32 L22 16 C22 12 19 9 16 9 C13 9 10 12 10 16 L10 30 C10 32 11 34 13 34 C15 34 16 32 16 30 L16 16"
        stroke={C.wood} strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
    </g>
  )
}

/** Beaker */
function Beaker({ x = 0, y = 0, scale = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M14 8 H34 L44 60 H4 Z" fill={C.blue} opacity="0.7" />
      <path d="M18 36 H34 V60 H18 Z" fill={C.teal} opacity="0.55" />
      <path d="M12 8 H36" stroke={C.beige} strokeWidth="3" strokeLinecap="round" />
      <line x1="14" y1="8" x2="14" y2="4" stroke={C.beige} strokeWidth="2" />
      <line x1="34" y1="8" x2="34" y2="4" stroke={C.beige} strokeWidth="2" />
    </g>
  )
}

/** Desk surface — curved plank at the bottom of hero */
function Desk({ y = 0, width = 960 }) {
  return (
    <path
      d={`M0 ${y} Q${width / 2} ${y - 18} ${width} ${y} L${width} ${y + 36} Q${width / 2} ${y + 54} 0 ${y + 36} Z`}
      fill={C.beige}
    />
  )
}


/* ═══════════════════════════════════════════════════════════════
   SCENE 1 — Hero: full lab desk
   ═══════════════════════════════════════════════════════════════ */
export function LandingHeroLabScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 960 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <Shadow id="sh-hero" dy={8} blur={18} op={0.12} />
        <Shadow id="sh-light" dy={3} blur={8} op={0.07} />
      </defs>

      <Desk y={418} width={960} />

      <ellipse cx="480" cy="420" rx="220" ry="10" fill="rgba(44,36,32,0.08)" />

      {/* ═══ NOTEBOOK — the product, ~2× visual weight of any other object ═══ */}
      <g className={anim.notebookAnchor}>
        <Notebook x={250} y={108} w={460} rotate={-1.5} filter="url(#sh-hero)" />
      </g>

      {/* Satellite objects — smaller, touching desk / notebook */}
      <FormulaCard x={168} y={318} w={92} formula="ΔG = ΔH–TΔS" rotate={-5} />
      <StickyNote x={258} y={112} w={72} rotate={4} color={C.yellow} lines={3} />
      <Pencil x={598} y={368} w={148} rotate={-14} />
      <Coffee x={748} y={318} scale={0.82} />
      <Beaker x={148} y={348} scale={0.95} />
      <Paperclip x={248} y={298} scale={0.65} rotate={12} />

      <g className={anim.atomDrift} transform="translate(820,140)" opacity="0.22">
        <circle cx="20" cy="20" r="4" fill={C.coral} />
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke={C.coral} strokeWidth="1.2" fill="none" />
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke={C.coral} strokeWidth="1.2" fill="none" transform="rotate(60,20,20)" />
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke={C.coral} strokeWidth="1.2" fill="none" transform="rotate(120,20,20)" />
      </g>
    </svg>
  )
}


/* ═══════════════════════════════════════════════════════════════
   SCENE 2 — Features: microscope with floating formula particles
   ═══════════════════════════════════════════════════════════════ */
export function LandingMicroscopeScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 480 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <Shadow id="sh-micro" dy={8} blur={16} op={0.12} />
        <Shadow id="sh-card" dy={3} blur={7} op={0.08} />
      </defs>

      {/* Desk surface at bottom */}
      <path d="M0 490 Q240 474 480 490 L480 520 Q240 536 0 520 Z" fill={C.beige} />
      <ellipse cx="240" cy="491" rx="110" ry="6" fill="rgba(44,36,32,0.07)" />

      {/* Microscope body */}
      <g filter="url(#sh-micro)" transform="translate(148,120)">
        {/* Arm */}
        <rect x="78" y="20" width="28" height="180" rx="8" fill={C.tealSoft} />
        {/* Head */}
        <rect x="56" y="10" width="72" height="50" rx="10" fill={C.teal} />
        {/* Eyepiece */}
        <rect x="82" y="0" width="20" height="24" rx="4" fill={C.teal} />
        <ellipse cx="92" cy="0" rx="10" ry="5" fill={C.tealSoft} />
        {/* Objective lenses */}
        <rect x="64" y="55" width="14" height="36" rx="4" fill={C.coralDark} />
        <rect x="106" y="55" width="14" height="48" rx="4" fill={C.coralDark} opacity="0.6" />
        {/* Stage */}
        <rect x="42" y="200" width="100" height="18" rx="5" fill={C.teal} />
        {/* Slide on stage */}
        <rect x="62" y="196" width="60" height="10" rx="2" fill={C.cream} opacity="0.9" />
        {/* Base */}
        <ellipse cx="92" cy="230" rx="68" ry="18" fill={C.wood} />
        <rect x="42" y="218" width="100" height="14" rx="4" fill={C.wood} />
        {/* Focus knob */}
        <circle cx="140" cy="170" r="10" fill={C.coralDark} />
        <circle cx="140" cy="140" r="8"  fill={C.coralDark} opacity="0.7" />
      </g>

      {/* Formula cards floating around microscope */}
      <FormulaCard x={30}  y={140} w={96} formula="ΔG = ΔH–TΔS" rotate={-6} />
      <FormulaCard x={330} y={100} w={88} formula="pH = –log[H⁺]" rotate={5} />
      <FormulaCard x={350} y={280} w={92} formula="E = mc²" rotate={-3} />

      {/* Sticky note leaning against the microscope */}
      <StickyNote x={54} y={300} w={80} rotate={4} color={C.yellow} lines={3} />

      {/* Pencil resting on desk */}
      <Pencil x={120} y={468} w={160} rotate={3} />

      {/* Atom decoration top right */}
      <g transform="translate(390,50)" opacity="0.2">
        <circle cx="22" cy="22" r="5" fill={C.coral} />
        <ellipse cx="22" cy="22" rx="20" ry="8" stroke={C.coral} strokeWidth="1.3" fill="none" />
        <ellipse cx="22" cy="22" rx="20" ry="8" stroke={C.coral} strokeWidth="1.3" fill="none" transform="rotate(60,22,22)" />
        <ellipse cx="22" cy="22" rx="20" ry="8" stroke={C.coral} strokeWidth="1.3" fill="none" transform="rotate(120,22,22)" />
      </g>
    </svg>
  )
}


/* ═══════════════════════════════════════════════════════════════
   SCENE 3 — About: stack of three research notebooks
   ═══════════════════════════════════════════════════════════════ */
export function LandingJournalScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 440 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <Shadow id="sh-jnl" dy={6} blur={12} op={0.10} />
        <Shadow id="sh-jnl2" dy={3} blur={7} op={0.07} />
      </defs>

      {/* Shelf surface */}
      <rect x={20} y={418} width={400} height={14} rx={4} fill={C.wood} />
      <rect x={30} y={430} width={380} height={6}  rx={3} fill={C.beige} opacity="0.7" />

      {/* Bottom notebook — largest, rotated slightly left */}
      <g filter="url(#sh-jnl)" transform="translate(60,230) rotate(-3,130,90)">
        <rect x={0}  y={0} width={260} height={190} rx={6} fill="#F5EDE8" />
        <rect x={0}  y={0} width={22}  height={190} rx={4} fill={C.coralDark} />
        {/* Label */}
        <rect x={36} y={56} width={160} height={22} rx={3} fill={C.cream} opacity="0.9" />
        <line x1={36} y1={100} x2={196} y2={100} stroke={C.inkFaint} strokeWidth="1.5" />
        <line x1={36} y1={118} x2={178} y2={118} stroke={C.inkFaint} strokeWidth="1.5" />
        <line x1={36} y1={136} x2={188} y2={136} stroke={C.inkFaint} strokeWidth="1.5" />
        {/* Bookmark green */}
        <path d="M230 0 L242 0 L242 70 L236 62 L230 70 Z" fill={C.teal} />
        {/* Coffee stain ring */}
        <ellipse cx={190} cy={168} rx={22} ry={16} stroke={C.gold} strokeWidth="1.5" fill="none" opacity="0.25" />
        <ellipse cx={190} cy={168} rx={16} ry={11} stroke={C.gold} strokeWidth="1"   fill="none" opacity="0.15" />
      </g>

      {/* Middle notebook — teal spine, upright */}
      <g filter="url(#sh-jnl2)" transform="translate(82,140) rotate(1,110,80)">
        <rect x={0}  y={0} width={222} height={162} rx={6} fill={C.cream} />
        <rect x={0}  y={0} width={20}  height={162} rx={4} fill={C.teal} />
        <line x1={32} y1={42} x2={188} y2={42} stroke={C.inkFaint} strokeWidth="1.5" />
        <line x1={32} y1={62} x2={168} y2={62} stroke={C.inkFaint} strokeWidth="1.5" />
        <line x1={32} y1={82} x2={180} y2={82} stroke={C.inkFaint} strokeWidth="1.5" />
        <line x1={32} y1={102} x2={160} y2={102} stroke={C.inkFaint} strokeWidth="1.5" />
        {/* coral writing lines */}
        <line x1={32} y1={42} x2={120} y2={42} stroke={C.coral} strokeWidth="1.6" opacity="0.4" />
        <line x1={32} y1={62} x2={98}  y2={62} stroke={C.coral} strokeWidth="1.6" opacity="0.3" />
        {/* Bookmark coral */}
        <path d="M196 0 L206 0 L206 56 L201 50 L196 56 Z" fill={C.coral} />
      </g>

      {/* Top notebook — cream spine, leans right */}
      <g filter="url(#sh-jnl2)" transform="translate(120,64) rotate(4,90,66)">
        <rect x={0}  y={0} width={182} height={132} rx={6} fill="#FBF7F0" />
        <rect x={0}  y={0} width={16}  height={132} rx={4} fill={C.gold} />
        <line x1={26} y1={34} x2={156} y2={34} stroke={C.inkFaint} strokeWidth="1.4" />
        <line x1={26} y1={54} x2={140} y2={54} stroke={C.inkFaint} strokeWidth="1.4" />
        <line x1={26} y1={74} x2={148} y2={74} stroke={C.inkFaint} strokeWidth="1.4" />
        {/* Paperclip on cover */}
        <Paperclip x={130} y={6} scale={0.55} rotate={10} />
        {/* Sticky note corner */}
        <StickyNote x={116} y={84} w={50} rotate={-5} color={C.yellow} lines={2} />
      </g>

      {/* Loose papers behind the stack */}
      <g transform="translate(310,260) rotate(8,50,80)" opacity="0.7">
        <rect x={0} y={0} width={100} height={140} rx={3} fill={C.cream} />
        <line x1={12} y1={24} x2={88} y2={24} stroke={C.inkFaint} strokeWidth="1.5" />
        <line x1={12} y1={40} x2={80} y2={40} stroke={C.inkFaint} strokeWidth="1.5" />
        <line x1={12} y1={56} x2={85} y2={56} stroke={C.inkFaint} strokeWidth="1.5" />
      </g>

      {/* Pencil resting against the stack */}
      <Pencil x={310} y={396} w={120} rotate={-80} />

      {/* Formula card leaning on shelf */}
      <FormulaCard x={340} y={298} w={86} formula="E = mc²" rotate={6} />
    </svg>
  )
}


/* ═══════════════════════════════════════════════════════════════
   SCENE 4 — Contact: closed notebook, pencil, coffee, plant
   ═══════════════════════════════════════════════════════════════ */
export function LandingCloseScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 420 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <Shadow id="sh-close" dy={6} blur={14} op={0.10} />
        <Shadow id="sh-close2" dy={3} blur={7} op={0.07} />
      </defs>

      {/* Desk surface */}
      <path d="M0 388 Q210 372 420 388 L420 416 Q210 432 0 416 Z" fill={C.beige} />
      <ellipse cx="210" cy="389" rx="140" ry="7" fill="rgba(44,36,32,0.06)" />

      {/* Closed notebook — centre, slight tilt */}
      <ClosedNotebook x={90} y={188} w={230} rotate={-1} filter="url(#sh-close)" />

      {/* Thank-you card on top of notebook */}
      <g filter="url(#sh-close2)" transform="translate(128,214) rotate(3,90,56)">
        <rect x={0} y={0} width={180} height={112} rx={5} fill={C.cream} />
        <rect x={0} y={0} width={180} height={6}  rx={3} fill={C.coral} opacity="0.6" />
        {/* Text lines */}
        <line x1={16} y1={36} x2={164} y2={36} stroke={C.inkFaint} strokeWidth="1.4" />
        <line x1={16} y1={54} x2={148} y2={54} stroke={C.inkFaint} strokeWidth="1.4" />
        <line x1={16} y1={72} x2={156} y2={72} stroke={C.inkFaint} strokeWidth="1.4" />
        {/* "signed," in Caveat style */}
        <text x={16} y={98} fontFamily="'Caveat',cursive" fontSize="13" fill={C.coralDark} opacity="0.6">
          signed, The NoteLab team
        </text>
      </g>

      {/* Pencil diagonal across lower-right of notebook */}
      <Pencil x={228} y={354} w={150} rotate={-18} />

      {/* Coffee mug — right side */}
      <Coffee x={302} y={288} scale={0.82} />

      {/* Small potted plant — left */}
      <g transform="translate(38,300)">
        {/* Pot */}
        <path d="M18 54 L6 86 H42 L30 54 Z" fill={C.coral} opacity="0.75" />
        <rect x={4} y={48} width={40} height={10} rx={3} fill={C.coralDark} opacity="0.6" />
        {/* Soil */}
        <ellipse cx={24} cy={48} rx={20} ry={5} fill={C.wood} />
        {/* Stems */}
        <path d="M24 48 Q16 32 10 18" stroke={C.teal} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M24 44 Q28 28 36 16" stroke={C.teal} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M24 42 Q24 26 24 12" stroke={C.teal} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Leaves */}
        <ellipse cx={9}  cy={16} rx={10} ry={6} fill={C.teal} opacity="0.8" transform="rotate(-30,9,16)" />
        <ellipse cx={37} cy={14} rx={10} ry={6} fill={C.teal} opacity="0.7" transform="rotate(20,37,14)" />
        <ellipse cx={24} cy={10} rx={8}  ry={5} fill={C.teal} opacity="0.75" />
      </g>

      {/* Paperclip on the thank-you card */}
      <Paperclip x={286} y={208} scale={0.65} rotate={-10} />

      {/* Atom doodle top-right corner — very faint */}
      <g transform="translate(366,30)" opacity="0.18">
        <circle cx={18} cy={18} r={4} fill={C.coral} />
        <ellipse cx={18} cy={18} rx={16} ry={6} stroke={C.coral} strokeWidth="1.2" fill="none" />
        <ellipse cx={18} cy={18} rx={16} ry={6} stroke={C.coral} strokeWidth="1.2" fill="none" transform="rotate(60,18,18)" />
        <ellipse cx={18} cy={18} rx={16} ry={6} stroke={C.coral} strokeWidth="1.2" fill="none" transform="rotate(120,18,18)" />
      </g>
    </svg>
  )
}
