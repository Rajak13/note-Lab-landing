/**
 * FlaskLoader.tsx
 * Erlenmeyer flask loading animation.
 *
 *  - The fluid body is no longer a fixed-width rectangle floating
 *    inside the glass. Below the surface it follows the actual
 *    flask taper (via hwAtY) all the way to the base, so it is
 *    always visually fused to the walls — never a clipped block
 *    with gaps at the corners.
 *  - Filling isn't a flat line rising uniformly: a localized
 *    "pour impact" depresses the surface at the stream's landing
 *    point and displaces mass outward/upward toward the walls,
 *    with turbulence layered on top while the fill is fast.
 *  - A small particle system throws off splash droplets at the
 *    impact point during rapid fill; they arc under gravity, slide
 *    down the glass if they hit a wall, and merge back into the
 *    surface (with a little impulse) when they land.
 *  - Damping/spring stiffness are phase-dependent: loose and
 *    springy while filling (so the surface can overshoot and slosh
 *    against the walls), tight while holding (so it settles).
 *  - A soft standing-wave hum keeps the surface from ever looking
 *    perfectly frozen, even in hold/pause.
 *  - A wall-adhesion (meniscus) curl at the glass edges.
 *  - No graduation ticks — this is a loading indicator, not an
 *    instrument, so it doesn't pretend to measure anything.
 *  - Respects prefers-reduced-motion with a single static frame.
 */
import { useEffect, useRef } from 'react'
import s from './FlaskLoader.module.css'

/* ── Props ────────────────────────────────────────────────── */
export interface FlaskLoaderProps {
  /** Canvas logical size in px (default 220) */
  size?: number
  /** Primary fluid / accent colour */
  primaryColor?: string
  /** Fluid fill colour (reserved — derived from primaryColor) */
  fluidColor?: string
  /** Glass outline colour */
  glassColor?: string
  /** Canvas background (default transparent) */
  background?: string
}

/* ── Surface physics (base values; overridden per-phase below) ── */
const NODE_COUNT = 18 // fewer nodes = smoother wave

interface PhysParams { damping: number; springK: number; tension: number }

// Loose & springy while pouring — lets energy build up so the
// surface can overshoot and slosh against the walls. Tight while
// holding/paused — lets it settle instead of humming forever.
const PHASE_PHYSICS: Record<Phase, PhysParams> = {
  fill:  { damping: 0.945, springK: 0.007, tension: 0.032 },
  hold:  { damping: 0.860, springK: 0.016, tension: 0.046 },
  drain: { damping: 0.910, springK: 0.010, tension: 0.038 },
  pause: { damping: 0.860, springK: 0.016, tension: 0.046 },
}

const IMPULSE_SCALE = 60 // generic level-change kick (used outside the pour phase)

// Ambient forcing — a slow standing-wave hum that never fully dies,
// so the liquid always reads as a fluid under tension rather than a
// static fill graphic during "hold" and "pause".
const AMBIENT_AMPLITUDE = 0.0034
const AMBIENT_FREQ      = 0.0017 // rad/ms

// Meniscus — liquid climbs the glass wall slightly at the edges due
// to surface tension / adhesion. This is a render-time bias only
// (kept out of the physics loop so it can't feed back into it).
const MENISCUS_STRENGTH = 0.16 // fraction of canvas size

/* ── Pour-impact (inflow) ─────────────────────────────────── */
const IMPACT_OFFSET_FRAC = -0.16   // stream lands slightly left of centre
const IMPACT_SIGMA_NODES = 2.1     // how many node-widths the impact stays localized to
const IMPACT_DOWN_FORCE  = 0.11    // depression at the impact point
const IMPACT_UP_FORCE    = 0.065   // mass pushed outward, rising toward the walls
const IMPACT_TURB_SCALE  = 0.05    // chaotic jitter while pouring
const IMPACT_PEAK_DELTA  = 0.0055  // approx. per-frame level delta at the fastest part of the fill ease

/* ── Splash / spindrift particles ────────────────────────────*/
interface Splash {
  x: number; y: number
  vx: number; vy: number
  r: number
  life: number; maxLife: number
  sliding: boolean
}
const SPLASH_MAX             = 22
const SPLASH_GRAVITY         = 0.017   // px / ms^2 (scaled for our dt units)
const SPLASH_SPAWN_PROB      = 0.55    // per eligible frame
const SPLASH_RATE_THRESHOLD  = 0.0018  // minimum per-frame level delta to spawn splashes

/* ── Bubble constants ─────────────────────────────────────── */
const BUBBLE_MAX     = 6
const BUBBLE_RATE    = 0.03  // spawn probability per frame
const BUBBLE_IMPULSE = 1.2   // surface ripple on bubble break
const BUBBLE_FADE_MS = 220   // birth fade-in
const BUBBLE_RISE_BASE  = 0.5   // starting rise speed
const BUBBLE_RISE_GAIN  = 0.7   // extra speed gained approaching the surface (falling pressure)
const BUBBLE_GROW_GAIN  = 0.5   // fractional radius growth approaching the surface

/* ── Fill-cycle timing (ms) ───────────────────────────────── */
const FILL_DURATION  = 2600
const HOLD_DURATION  = 1200
const DRAIN_DURATION = 2400
const PAUSE_DURATION =  700
const FILL_MIN = 0.10
const FILL_MAX = 0.72

/* ── Easing ───────────────────────────────────────────────── */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
const easeInOutSine = (t: number) =>
  -(Math.cos(Math.PI * t) - 1) / 2

/* ── Geometry ─────────────────────────────────────────────── */
interface G {
  cx:        number  // canvas centre x
  neckTop:   number  // y: top rim of neck
  neckBot:   number  // y: bottom of neck (where shoulder starts)
  neckW:     number  // half-width of neck interior
  bodyBot:   number  // y: inside base of flask
  bodyHalfW: number  // half-width of body at widest (base)
  sz:        number  // canvas logical size (convenience)
}

function makeGeometry(sz: number): G {
  return {
    cx:        sz / 2,
    neckTop:   sz * 0.05,
    neckBot:   sz * 0.38,
    neckW:     sz * 0.066,
    bodyBot:   sz * 0.90,
    bodyHalfW: sz * 0.295,
    sz,
  }
}

/**
 * Build the Erlenmeyer outline as a Path2D.
 * The body is a true triangle (straight sides) so the shape reads
 * clearly at small sizes. The shoulder is a single cubic bezier
 * that flares cleanly from neck to body.
 */
function buildPath(g: G): Path2D {
  const { cx, neckTop, neckBot, neckW, bodyBot, bodyHalfW, sz } = g
  const p = new Path2D()

  // Top rim
  p.moveTo(cx - neckW, neckTop)
  p.lineTo(cx + neckW, neckTop)

  // Right neck, straight down
  p.lineTo(cx + neckW, neckBot)

  // Right shoulder: cubic bezier — flares out to body width
  const shH = bodyBot - neckBot  // total shoulder+body height
  p.bezierCurveTo(
    cx + neckW,            neckBot + shH * 0.26,  // cp1: still near neck width
    cx + bodyHalfW * 0.92, neckBot + shH * 0.46,  // cp2: easing toward body width
    cx + bodyHalfW,        bodyBot,               // end: bottom-right corner
  )

  // Base — very slight downward arc (realistic rounded base)
  p.quadraticCurveTo(cx, bodyBot + sz * 0.016, cx - bodyHalfW, bodyBot)

  // Left body up to shoulder
  p.bezierCurveTo(
    cx - bodyHalfW * 0.92, neckBot + shH * 0.46,
    cx - neckW,            neckBot + shH * 0.26,
    cx - neckW,            neckBot,
  )

  // Left neck up to rim
  p.lineTo(cx - neckW, neckTop)
  p.closePath()
  return p
}

/* ── Wall position at a given Y — exact cubic bezier inverse ─
 *
 * The right shoulder is defined by:
 *   P0 = (neckW,           neckBot)
 *   P1 = (neckW,           neckBot + shH*0.26)   ← cp1
 *   P2 = (bodyHalfW*0.92,  neckBot + shH*0.46)   ← cp2
 *   P3 = (bodyHalfW,       bodyBot)
 *
 * Given a target Y we solve for bezier parameter t using Newton's
 * method on the Y component, then evaluate X at that t.
 * This is exact — no approximation — so the fluid edge always
 * lands precisely on the glass wall.
 */
function wallHWAtY(y: number, g: G): number {
  const { neckBot, neckW, bodyBot, bodyHalfW, sz: _sz } = g

  // Outside shoulder region — straight segments
  if (y <= neckBot)  return neckW
  if (y >= bodyBot)  return bodyHalfW

  // Bezier Y control points (right shoulder)
  const shH = bodyBot - neckBot
  const y0 = neckBot
  const y1 = neckBot + shH * 0.26
  const y2 = neckBot + shH * 0.46
  const y3 = bodyBot

  // Bezier X control points (right shoulder — half-widths from cx)
  const x0 = neckW
  const x1 = neckW
  const x2 = bodyHalfW * 0.92
  const x3 = bodyHalfW

  // Solve Y(t) = y  via Newton's method
  // Y(t) = (1-t)³y0 + 3(1-t)²t·y1 + 3(1-t)t²·y2 + t³·y3
  // Y'(t) = 3[(y1-y0)(1-t)² + 2(y2-y1)(1-t)t + (y3-y2)t²]
  let t = (y - y0) / (y3 - y0)  // linear initial guess
  for (let i = 0; i < 8; i++) {
    const mt = 1 - t
    const Yt = mt*mt*mt*y0 + 3*mt*mt*t*y1 + 3*mt*t*t*y2 + t*t*t*y3
    const dY = 3*(mt*mt*(y1-y0) + 2*mt*t*(y2-y1) + t*t*(y3-y2))
    if (Math.abs(dY) < 1e-9) break
    t -= (Yt - y) / dY
    t  = Math.max(0, Math.min(1, t))
  }

  // Evaluate X at solved t
  const mt = 1 - t
  return mt*mt*mt*x0 + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t*t*t*x3
}

/* ── Interior clearance at a given Y (inset — for bubble/node clamping) ── */
function hwAtY(y: number, g: G): number {
  return wallHWAtY(y, g) - g.sz * 0.012
}

/* ── Fill level → mean surface Y ─────────────────────────── */
function levelToY(frac: number, g: G): number {
  const top = g.neckBot + (g.bodyBot - g.neckBot) * 0.04  // just inside shoulder
  const bot = g.bodyBot - g.sz * 0.010                    // just above base
  return bot - frac * (bot - top)
}

/* ── Surface nodes ────────────────────────────────────────── */
interface Node { y: number; vy: number }

function makeSurface(n: number, y: number): Node[] {
  return Array.from({ length: n }, () => ({ y, vy: 0 }))
}

function stepSurface(nodes: Node[], targetY: number, phys: PhysParams): void {
  const n = nodes.length
  const acc = new Float32Array(n)

  for (let i = 0; i < n; i++) {
    // Hooke restore to mean level
    acc[i] += phys.springK * (targetY - nodes[i].y)
    // Surface tension: pull toward neighbours
    const lY = nodes[i - 1]?.y ?? nodes[i].y
    const rY = nodes[i + 1]?.y ?? nodes[i].y
    acc[i] += phys.tension * (lY + rY - 2 * nodes[i].y)
  }

  for (let i = 0; i < n; i++) {
    nodes[i].vy = nodes[i].vy * phys.damping + acc[i]
    nodes[i].y += nodes[i].vy
  }
}

/** A slow standing-wave hum applied every frame, independent of the
 *  fill cycle, so the liquid never goes dead-still. */
function ambientForce(nodes: Node[], tMs: number): void {
  const n = nodes.length
  for (let i = 0; i < n; i++) {
    const phase = (i / (n - 1)) * Math.PI * 2
    nodes[i].vy += Math.sin(tMs * AMBIENT_FREQ + phase) * AMBIENT_AMPLITUDE
  }
}

/** Generic kick used outside the pour phase (e.g. sloshing while draining). */
function injectImpulse(nodes: Node[], delta: number): void {
  const mag = Math.abs(delta) * IMPULSE_SCALE
  if (mag < 0.5) return
  const dir  = delta > 0 ? -1 : 1
  const hits = 1 + Math.floor(Math.random() * 2)
  for (let i = 0; i < hits; i++) {
    const idx = Math.floor(Math.random() * nodes.length)
    nodes[idx].vy += dir * mag * (0.6 + Math.random() * 0.8)
  }
}

/**
 * Localized inflow impact, active while filling. The stream lands at
 * one point: that point gets pushed down (depression), while mass is
 * displaced outward — nodes further from the impact, especially those
 * near the walls, get pushed up. Intensity scales with how fast the
 * level is currently rising, so a slow trickle barely disturbs the
 * surface while the fast middle of the fill curve throws it around.
 */
function injectPourImpact(nodes: Node[], perFrameDelta: number): { x: number } | null {
  if (perFrameDelta <= 0) return null
  const n = nodes.length
  const intensity = Math.min(1.4, perFrameDelta / IMPACT_PEAK_DELTA)
  if (intensity < 0.05) return null

  const impactIdx = (n - 1) * (0.5 + IMPACT_OFFSET_FRAC * 0.5)
  const mid = (n - 1) / 2

  for (let i = 0; i < n; i++) {
    const dist = i - impactIdx
    const near = Math.exp(-(dist * dist) / (2 * IMPACT_SIGMA_NODES * IMPACT_SIGMA_NODES))
    const edgeWeight = Math.abs(i - mid) / mid // 0 centre → 1 walls

    nodes[i].vy += intensity * IMPACT_DOWN_FORCE * near
    nodes[i].vy -= intensity * IMPACT_UP_FORCE * (1 - near) * (0.4 + 0.6 * edgeWeight)
    nodes[i].vy += (Math.random() - 0.5) * intensity * IMPACT_TURB_SCALE
  }

  return { x: impactIdx }
}

/** Render-only meniscus bias: the liquid climbs the wall slightly at
 *  each edge. Kept separate from node.y so it can never destabilise
 *  the spring simulation. */
function meniscusBias(i: number, n: number, g: G): number {
  const t = i / (n - 1)                       // 0..1 across the surface
  const distFromEdge = Math.min(t, 1 - t) * 2 // 0 at edges, 1 at centre
  const curl = (1 - distFromEdge) ** 2
  return -curl * g.sz * MENISCUS_STRENGTH * 0.02
}

/* ── Splash / spindrift particles ────────────────────────────*/
function spawnSplash(g: G, impactX: number, surfaceY: number): Splash {
  // Mostly-upward cone, biased slightly outward from the impact point
  const angle = (Math.random() * 2 - 1) * Math.PI * 0.4
  const speed = 1.3 + Math.random() * 2.0
  return {
    x: impactX + (Math.random() * 2 - 1) * g.sz * 0.012,
    y: surfaceY - g.sz * 0.006,
    vx: Math.sin(angle) * speed,
    vy: -Math.cos(angle) * speed - 0.7,
    r: 0.9 + Math.random() * 1.5,
    life: 0,
    maxLife: 450 + Math.random() * 350,
    sliding: false,
  }
}

/** Steps splash particles; returns node indices that were hit by a
 *  particle merging back into the surface, so callers can add a
 *  small local impulse there. */
function stepSplashes(splashes: Splash[], g: G, fillLevel: number, dt: number): number[] {
  const surfaceY = levelToY(fillLevel, g)
  const hw = hwAtY(surfaceY, g)
  const hits: number[] = []
  const steps = Math.max(1, dt / 16)

  for (let i = splashes.length - 1; i >= 0; i--) {
    const p = splashes[i]
    p.life += dt
    p.vy += SPLASH_GRAVITY * steps
    p.x  += p.vx * steps
    p.y  += p.vy * steps

    const wallHw = hwAtY(p.y, g) - p.r
    if (p.x < g.cx - wallHw) { p.x = g.cx - wallHw; p.vx *= 0.15; p.sliding = true }
    if (p.x > g.cx + wallHw) { p.x = g.cx + wallHw; p.vx *= 0.15; p.sliding = true }
    if (p.sliding) p.vx *= 0.85 // friction sliding down the glass

    const reachedSurface = p.y >= surfaceY - g.sz * 0.004
    const expired        = p.life > p.maxLife
    const sankTooFar      = p.y > g.bodyBot

    if (reachedSurface || expired || sankTooFar) {
      if (reachedSurface) {
        const nodeIdx = Math.round(((p.x - (g.cx - hw)) / (2 * hw)) * (NODE_COUNT - 1))
        hits.push(Math.max(0, Math.min(NODE_COUNT - 1, nodeIdx)))
      }
      splashes.splice(i, 1)
    }
  }
  return hits
}

function drawSplashes(
  ctx:          CanvasRenderingContext2D,
  splashes:     Splash[],
  path:         Path2D,
  primaryColor: string,
): void {
  if (!splashes.length) return
  const rgb = hexRgb(primaryColor)
  ctx.save()
  ctx.clip(path)
  for (const p of splashes) {
    const fade = Math.max(0, 1 - p.life / p.maxLife)
    const speed = Math.hypot(p.vx, p.vy)
    const stretch = Math.min(2.2, 1 + speed * 0.18)
    ctx.save()
    ctx.translate(p.x, p.y)
    if (speed > 0.1) ctx.rotate(Math.atan2(p.vy, p.vx) + Math.PI / 2)
    ctx.beginPath()
    ctx.ellipse(0, 0, p.r, p.r * stretch, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.55 * fade})`
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(-p.r * 0.25, -p.r * 0.25, p.r * 0.3, p.r * 0.3, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,248,244,${0.5 * fade})`
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}

/* ── Bubbles ──────────────────────────────────────────────── */
interface Bubble {
  x: number; y: number
  spawnY: number
  baseR: number
  vx: number; vy: number
  age: number
  targetOpacity: number
  escaped: boolean  // true once it has broken the surface
}

function spawnBubble(g: G): Bubble {
  const bot = g.bodyBot - g.sz * 0.04
  const hw  = hwAtY(bot, g) * 0.75
  const y   = bot - Math.random() * g.sz * 0.04
  return {
    x: g.cx + (Math.random() * 2 - 1) * hw,
    y,
    spawnY: y,
    baseR: 1.6 + Math.random() * 2.2,
    vx: (Math.random() - 0.5) * 0.28,
    vy: -BUBBLE_RISE_BASE,
    age: 0,
    targetOpacity: 0.5 + Math.random() * 0.3,
    escaped: false,
  }
}

function stepBubbles(
  bubbles: Bubble[],
  nodes:   Node[],
  g:       G,
  fillLevel: number,
  dt: number,
): number[] {
  const hit: number[] = []
  const surfaceY = levelToY(fillLevel, g)
  const surfaceHW = hwAtY(surfaceY, g)

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i]
    b.age += dt

    const span = Math.max(1, b.spawnY - surfaceY)
    const progress = b.escaped ? 1 : Math.min(1, Math.max(0, (b.spawnY - b.y) / span))
    b.vy = -(BUBBLE_RISE_BASE + progress * BUBBLE_RISE_GAIN)

    b.vx += (Math.random() - 0.5) * 0.03
    b.vx *= 0.95
    b.x  += b.vx
    b.y  += b.vy

    const r = b.baseR * (1 + progress * BUBBLE_GROW_GAIN)

    if (!b.escaped) {
      const hw = hwAtY(b.y, g) - r
      if (b.x < g.cx - hw) { b.x = g.cx - hw; b.vx *= -0.4 }
      if (b.x > g.cx + hw) { b.x = g.cx + hw; b.vx *= -0.4 }

      const nodeIdx = Math.round(
        ((b.x - (g.cx - surfaceHW)) / (2 * surfaceHW)) * (nodes.length - 1)
      )
      const ni = Math.max(0, Math.min(nodes.length - 1, nodeIdx))
      if (b.y - r <= nodes[ni].y) {
        hit.push(ni)
        b.escaped = true
        b.vy = -(0.9 + Math.random() * 0.5)
        b.vx *= 0.3
      }
    } else {
      if (b.y > g.neckTop) {
        const nw = g.neckW * 0.7
        if (b.x < g.cx - nw) b.x = g.cx - nw
        if (b.x > g.cx + nw) b.x = g.cx + nw
      }
    }

    if (b.y + r < g.neckTop - g.sz * 0.14 || b.y > g.bodyBot) {
      bubbles.splice(i, 1)
    }
  }
  return hit
}

function bubbleRadius(b: Bubble, g: G, fillLevel: number): number {
  const surfaceY = levelToY(fillLevel, g)
  const span = Math.max(1, b.spawnY - surfaceY)
  const progress = b.escaped ? 1 : Math.min(1, Math.max(0, (b.spawnY - b.y) / span))
  return b.baseR * (1 + progress * BUBBLE_GROW_GAIN)
}

function bubbleAlpha(b: Bubble): number {
  return Math.min(1, b.age / BUBBLE_FADE_MS) * b.targetOpacity
}

/* ── Fill cycle ───────────────────────────────────────────── */
type Phase = 'fill' | 'hold' | 'drain' | 'pause'
interface Cycle { phase: Phase; elapsed: number; level: number }

function advanceCycle(c: Cycle, dt: number): { next: Cycle; delta: number } {
  const prev = c.level
  c.elapsed += dt
  let next = { ...c }

  switch (c.phase) {
    case 'fill': {
      const t = Math.min(c.elapsed / FILL_DURATION, 1)
      next.level = FILL_MIN + easeInOutCubic(t) * (FILL_MAX - FILL_MIN)
      if (c.elapsed >= FILL_DURATION) next = { phase: 'hold', elapsed: 0, level: FILL_MAX }
      break
    }
    case 'hold': {
      next.level = FILL_MAX
      if (c.elapsed >= HOLD_DURATION) next = { phase: 'drain', elapsed: 0, level: FILL_MAX }
      break
    }
    case 'drain': {
      const t = Math.min(c.elapsed / DRAIN_DURATION, 1)
      next.level = FILL_MAX - easeInOutSine(t) * (FILL_MAX - FILL_MIN)
      if (c.elapsed >= DRAIN_DURATION) next = { phase: 'pause', elapsed: 0, level: FILL_MIN }
      break
    }
    case 'pause': {
      next.level = FILL_MIN
      if (c.elapsed >= PAUSE_DURATION) next = { phase: 'fill', elapsed: 0, level: FILL_MIN }
      break
    }
  }

  return { next, delta: next.level - prev }
}

/* ── Colour helpers ───────────────────────────────────────── */
function rgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}
function hexRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

/* ── Draw: glass ──────────────────────────────────────────── */
function drawGlass(
  ctx:        CanvasRenderingContext2D,
  g:          G,
  path:       Path2D,
  glassColor: string,
): void {
  const { sz } = g

  ctx.save()
  ctx.strokeStyle = rgba(glassColor, 0.28)
  ctx.lineWidth   = sz * 0.028
  ctx.lineJoin    = 'round'
  ctx.lineCap     = 'round'
  ctx.stroke(path)

  ctx.strokeStyle = rgba(glassColor, 0.85)
  ctx.lineWidth   = sz * 0.010
  ctx.stroke(path)

  ctx.lineWidth = sz * 0.013
  ctx.beginPath()
  ctx.moveTo(g.cx - g.neckW - sz * 0.006, g.neckTop)
  ctx.lineTo(g.cx + g.neckW + sz * 0.006, g.neckTop)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.clip(path)
  const hlX = g.cx - g.bodyHalfW * 0.42
  const glint = ctx.createLinearGradient(hlX - sz * 0.05, g.neckTop, hlX + sz * 0.05, g.bodyBot)
  glint.addColorStop(0,   'rgba(255,255,255,0)')
  glint.addColorStop(0.5, 'rgba(255,255,255,0.16)')
  glint.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = glint
  ctx.fillRect(hlX - sz * 0.06, g.neckTop, sz * 0.12, g.bodyBot - g.neckTop)
  ctx.restore()
}

/* ── Draw: fluid ──────────────────────────────────────────── */
const WALL_STEPS = 16  // samples along the taper when closing the path

function drawFluid(
  ctx:          CanvasRenderingContext2D,
  nodes:        Node[],
  g:            G,
  path:         Path2D,
  fillLevel:    number,
  primaryColor: string,
): void {
  if (fillLevel < 0.005) return

  const { sz } = g
  const meanY = levelToY(fillLevel, g)
  const bot   = g.bodyBot - sz * 0.012
  const n     = nodes.length

  // Apply meniscus curl to edge nodes only (render-only, not physics)
  const vy = nodes.map((node, i) => node.y + meniscusBias(i, n, g))

  // Each surface node's X is pinned to the flask wall at THAT node's
  // current Y. Edge nodes track the moving glass wall exactly so there
  // is never a gap between fluid and glass regardless of wave height.
  const xs = vy.map((y, i) => {
    const frac = i / (n - 1)         // 0 = left edge, 1 = right edge
    const wall = wallHWAtY(y, g)
    // Lerp from left wall to right wall; edge nodes sit on the glass
    return g.cx - wall + frac * (2 * wall)
  })

  // --- Build fluid polygon ---
  const fluid = new Path2D()

  // Surface wave — left edge node touches the left wall
  fluid.moveTo(xs[0], vy[0])
  for (let i = 0; i < n - 1; i++) {
    const mx = (xs[i] + xs[i + 1]) / 2
    const my = (vy[i]  + vy[i + 1]) / 2
    fluid.quadraticCurveTo(xs[i], vy[i], mx, my)
  }
  // Final segment reaches the right wall
  fluid.lineTo(xs[n - 1], vy[n - 1])

  // Right wall: walk down the actual taper from the right edge node to the base
  for (let k = 1; k <= WALL_STEPS; k++) {
    const t = k / WALL_STEPS
    const y = vy[n - 1] + t * (bot - vy[n - 1])
    fluid.lineTo(g.cx + wallHWAtY(y, g), y)
  }

  // Base arc — slight downward bow matching the flask bottom
  fluid.quadraticCurveTo(g.cx, bot + sz * 0.014, g.cx - wallHWAtY(bot, g), bot)

  // Left wall: walk back up the taper to the left edge node
  for (let k = WALL_STEPS - 1; k >= 1; k--) {
    const t = k / WALL_STEPS
    const y = vy[0] + t * (bot - vy[0])
    fluid.lineTo(g.cx - wallHWAtY(y, g), y)
  }

  fluid.closePath()

  // --- Paint ---
  ctx.save()
  ctx.clip(path)   // still clip to the glass shape as a safety net

  const rgb  = hexRgb(primaryColor)
  const grad = ctx.createLinearGradient(0, meanY - sz * 0.03, 0, bot)
  grad.addColorStop(0,    `rgba(${rgb.r},${rgb.g},${rgb.b},0.50)`)
  grad.addColorStop(0.40, `rgba(${rgb.r},${rgb.g},${rgb.b},0.66)`)
  grad.addColorStop(1,    `rgba(${Math.max(0,rgb.r-20)},${Math.max(0,rgb.g-16)},${Math.max(0,rgb.b-10)},0.80)`)
  ctx.fillStyle = grad
  ctx.fill(fluid)

  // Thin meniscus sheen at the top of the fluid
  const sheen = ctx.createLinearGradient(0, meanY - sz * 0.004, 0, meanY + sz * 0.020)
  sheen.addColorStop(0, 'rgba(255,248,244,0.24)')
  sheen.addColorStop(1, 'rgba(255,248,244,0)')
  ctx.fillStyle = sheen
  ctx.fill(fluid)

  ctx.restore()
}

/* ── Draw: bubbles ────────────────────────────────────────── */
function drawBubbles(
  ctx:          CanvasRenderingContext2D,
  bubbles:      Bubble[],
  path:         Path2D,
  primaryColor: string,
  g:            G,
  fillLevel:    number,
): void {
  if (!bubbles.length) return
  const rgb = hexRgb(primaryColor)

  const inside  = bubbles.filter(b => !b.escaped || b.y >= g.neckTop)
  const escaped = bubbles.filter(b =>  b.escaped && b.y < g.neckTop)

  if (inside.length) {
    ctx.save()
    ctx.clip(path)
    for (const b of inside) {
      const r = bubbleRadius(b, g, fillLevel)
      const a = bubbleAlpha(b)
      ctx.beginPath()
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a * 0.5})`
      ctx.lineWidth   = 0.7
      ctx.fillStyle   = `rgba(255,248,244,${a * 0.10})`
      ctx.fill()
      ctx.stroke()
      if (r > 2) {
        ctx.beginPath()
        ctx.arc(b.x - r * 0.28, b.y - r * 0.30, r * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,248,244,${a * 0.38})`
        ctx.fill()
      }
    }
    ctx.restore()
  }

  for (const b of escaped) {
    const r = bubbleRadius(b, g, fillLevel)
    const fadeDist = g.sz * 0.10
    const alpha = Math.max(0, (b.y - (g.neckTop - fadeDist)) / fadeDist) * bubbleAlpha(b)
    ctx.beginPath()
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.55})`
    ctx.lineWidth   = 0.7
    ctx.fillStyle   = `rgba(255,248,244,${alpha * 0.12})`
    ctx.fill()
    ctx.stroke()
    if (r > 2) {
      ctx.beginPath()
      ctx.arc(b.x - r * 0.28, b.y - r * 0.30, r * 0.25, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,248,244,${alpha * 0.40})`
      ctx.fill()
    }
  }
}

/* ── Static frame (prefers-reduced-motion) ────────────────── */
function drawStatic(
  ctx:          CanvasRenderingContext2D,
  g:            G,
  path:         Path2D,
  primaryColor: string,
  glassColor:   string,
): void {
  const level = (FILL_MIN + FILL_MAX) / 2
  const nodes = makeSurface(NODE_COUNT, levelToY(level, g))
  ctx.clearRect(0, 0, g.sz, g.sz)
  drawFluid(ctx, nodes, g, path, level, primaryColor)
  drawGlass(ctx, g, path, glassColor)
}

/* ── React component ──────────────────────────────────────── */
export default function FlaskLoader({
  size         = 220,
  primaryColor = '#E46757',   // brand coral
  fluidColor:  _fc,           // reserved
  glassColor   = '#2a2535',   // dark charcoal — readable on any bg
  background   = 'transparent',
}: Readonly<FlaskLoaderProps>) {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const context = ctx

    const dpr = window.devicePixelRatio || 1
    canvas.width  = size * dpr
    canvas.height = size * dpr
    canvas.style.width  = `${size}px`
    canvas.style.height = `${size}px`
    context.scale(dpr, dpr)

    const g    = makeGeometry(size)
    const path = buildPath(g)

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (background !== 'transparent') {
      context.fillStyle = background
      context.fillRect(0, 0, size, size)
    }
    if (reduceMotion) {
      drawStatic(context, g, path, primaryColor, glassColor)
      return
    }

    let cycle: Cycle = { phase: 'fill', elapsed: 0, level: FILL_MIN }
    const nodes    = makeSurface(NODE_COUNT, levelToY(FILL_MIN, g))
    const bubbles: Bubble[] = []
    const splashes: Splash[] = []

    let lastTs = 0
    let rafId  = 0

    function frame(ts: number) {
      rafId = requestAnimationFrame(frame)

      const dt = lastTs === 0 ? 16 : Math.min(ts - lastTs, 50)
      lastTs   = ts

      const { next, delta } = advanceCycle(cycle, dt)
      cycle = next

      const targetY = levelToY(cycle.level, g)
      const phys    = PHASE_PHYSICS[cycle.phase]

      ambientForce(nodes, ts)

      let impact: { x: number } | null = null
      if (cycle.phase === 'fill') {
        impact = injectPourImpact(nodes, delta)
      } else if (Math.abs(delta) > 0.0002) {
        injectImpulse(nodes, delta)
      }

      stepSurface(nodes, targetY, phys)

      // Spawn splash droplets at the impact point while the fill is fast
      if (impact && delta > SPLASH_RATE_THRESHOLD && splashes.length < SPLASH_MAX
          && Math.random() < SPLASH_SPAWN_PROB) {
        const hw = hwAtY(levelToY(cycle.level, g), g)
        const impactX = g.cx + IMPACT_OFFSET_FRAC * hw
        splashes.push(spawnSplash(g, impactX, levelToY(cycle.level, g)))
      }
      const splashHits = stepSplashes(splashes, g, cycle.level, dt)
      for (const idx of splashHits) {
        nodes[idx].vy += 0.35 + Math.random() * 0.2
      }

      if (cycle.level > 0.15 && bubbles.length < BUBBLE_MAX && Math.random() < BUBBLE_RATE) {
        bubbles.push(spawnBubble(g))
      }

      const hits = stepBubbles(bubbles, nodes, g, cycle.level, dt)
      for (const idx of hits) {
        for (let d = -1; d <= 1; d++) {
          const ni = idx + d
          if (ni >= 0 && ni < nodes.length) {
            nodes[ni].vy -= BUBBLE_IMPULSE * Math.exp(-Math.abs(d) * 1.2)
          }
        }
      }

      context.clearRect(0, 0, size, size)
      if (background !== 'transparent') {
        context.fillStyle = background
        context.fillRect(0, 0, size, size)
      }

      drawFluid(context, nodes, g, path, cycle.level, primaryColor)
      drawSplashes(context, splashes, path, primaryColor)
      drawBubbles(context, bubbles, path, primaryColor, g, cycle.level)
      drawGlass(context, g, path, glassColor)
    }

    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, primaryColor, glassColor, background])

  return (
    <div className={s.wrapper} style={{ width: size, height: size }}>
      <canvas ref={canvasRef} className={s.canvas} aria-label="Loading…" />
    </div>
  )
}