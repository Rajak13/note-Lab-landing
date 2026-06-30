import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthLayout from '../components/Auth/AuthLayout'
import MicroscopeIllo from '../components/Auth/illustrations/MicroscopeIllo'
import PetriDishIllo  from '../components/Auth/illustrations/PetriDishIllo'
import HelixIllo      from '../components/Auth/illustrations/HelixIllo'
import BeakerIllo     from '../components/Auth/illustrations/BeakerIllo'
import NotebookIllo   from '../components/Auth/illustrations/NotebookIllo'
import GraphIllo      from '../components/Auth/illustrations/GraphIllo'
import f from '../styles/forms.module.css'
import p from './AuthPage.module.css'

/* ── Illustration grid — same for both modes ──────────────── */
const SLOTS = [
  <MicroscopeIllo />,
  <PetriDishIllo  />,
  <HelixIllo      />,
  <BeakerIllo isAnimated />,
  <NotebookIllo   />,
  <GraphIllo      />,
]

/* ── Eye icons ─────────────────────────────────────────────── */
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12C1 12 5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z"
            stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  )
}
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.1 18.1 0 0 1 5.06-5.94"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="2" y1="2" x2="22" y2="22"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

/* ── Field icons ───────────────────────────────────────────── */
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2"
            stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 7l9 6 9-6"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2"
            stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.2" fill="currentColor"/>
    </svg>
  )
}

/* ── Login form ────────────────────────────────────────────── */
function LoginForm({ onSwitch }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: POST /api/auth/login { email, password, remember }
    console.log('Login submit', { email, password, remember })
  }

  return (
    <>
      <h1 className={f.heading}>Log In</h1>

      <form className={f.fields} onSubmit={handleSubmit} noValidate aria-label="Login form">
        <div className={f.fieldGroup}>
          <label htmlFor="login-email" className={f.label}>Email Address</label>
          <div className={f.inputWrap}>
            <span className={f.inputIcon}><MailIcon /></span>
            <input id="login-email" type="email" className={f.input}
                   placeholder="example@gmail.com" value={email}
                   onChange={e => setEmail(e.target.value)}
                   autoComplete="email" required />
          </div>
        </div>

        <div className={f.fieldGroup}>
          <label htmlFor="login-password" className={f.label}>Password</label>
          <div className={`${f.inputWrap} ${f.passwordWrap}`}>
            <span className={f.inputIcon}><LockIcon /></span>
            <input id="login-password" type={showPw ? 'text' : 'password'}
                   className={f.input} placeholder="••••••••" value={password}
                   onChange={e => setPassword(e.target.value)}
                   autoComplete="current-password" required />
            <button type="button" className={f.passwordToggle}
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className={f.checkRow}>
          <label className={f.checkLabel}>
            <input type="checkbox" className={f.checkbox}
                   checked={remember} onChange={e => setRemember(e.target.checked)} />
            Remember me
          </label>
          <Link to="/reset-password" className={p.textBtn}>Reset Password?</Link>
        </div>

        <button type="submit" className={f.submitBtn}>Log in</button>
      </form>

      <p className={f.footer}>
        Don&apos;t have an account yet?{' '}
        <button type="button" className={p.switchBtn} onClick={onSwitch}>
          Sign Up
        </button>
      </p>
    </>
  )
}

/* ── Register form ─────────────────────────────────────────── */
function RegisterForm({ onSwitch }) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [showCfm,  setShowCfm]  = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: POST /api/auth/register { name, email, password }
    console.log('Register submit', { name, email, password, confirm })
  }

  return (
    <>
      <h1 className={f.heading}>Create Account</h1>

      <form className={f.fields} onSubmit={handleSubmit} noValidate aria-label="Register form">
        <div className={f.fieldGroup}>
          <label htmlFor="reg-name" className={f.label}>Full Name</label>
          <div className={f.inputWrap}>
            <span className={f.inputIcon}><UserIcon /></span>
            <input id="reg-name" type="text" className={f.input}
                   placeholder="Dr. Jane Smith" value={name}
                   onChange={e => setName(e.target.value)}
                   autoComplete="name" required />
          </div>
        </div>

        <div className={f.fieldGroup}>
          <label htmlFor="reg-email" className={f.label}>Email Address</label>
          <div className={f.inputWrap}>
            <span className={f.inputIcon}><MailIcon /></span>
            <input id="reg-email" type="email" className={f.input}
                   placeholder="example@gmail.com" value={email}
                   onChange={e => setEmail(e.target.value)}
                   autoComplete="email" required />
          </div>
        </div>

        <div className={f.fieldGroup}>
          <label htmlFor="reg-password" className={f.label}>Password</label>
          <div className={`${f.inputWrap} ${f.passwordWrap}`}>
            <span className={f.inputIcon}><LockIcon /></span>
            <input id="reg-password" type={showPw ? 'text' : 'password'}
                   className={f.input} placeholder="••••••••" value={password}
                   onChange={e => setPassword(e.target.value)}
                   autoComplete="new-password" required />
            <button type="button" className={f.passwordToggle}
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className={f.fieldGroup}>
          <label htmlFor="reg-confirm" className={f.label}>Confirm Password</label>
          <div className={`${f.inputWrap} ${f.passwordWrap}`}>
            <span className={f.inputIcon}><LockIcon /></span>
            <input id="reg-confirm" type={showCfm ? 'text' : 'password'}
                   className={f.input} placeholder="••••••••" value={confirm}
                   onChange={e => setConfirm(e.target.value)}
                   autoComplete="new-password" required />
            <button type="button" className={f.passwordToggle}
                    onClick={() => setShowCfm(v => !v)}
                    aria-label={showCfm ? 'Hide confirm password' : 'Show confirm password'}>
              {showCfm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button type="submit" className={f.submitBtn}>Create account</button>
      </form>

      <p className={f.footer}>
        Already have an account?{' '}
        <button type="button" className={p.switchBtn} onClick={onSwitch}>
          Log in
        </button>
      </p>
    </>
  )
}

/* ── AuthPage — animation controller ──────────────────────── */
/*
 * Animation sequence on switch:
 *   1. Set switching=true  → card + panel fade out (300ms opacity transition)
 *   2. After 300ms         → flip mode + flipped state, remove switching
 *   3. Card + panel fade back in with the slide transition (520ms)
 *
 * The form content itself crossfades using a separate CSS class
 * on the inner form wrapper keyed to the mode.
 */
const SWITCH_FADE_MS = 280 // must be <= opacity transition duration in CSS

export default function AuthPage({ initialMode = 'login' }) {
  const navigate  = useNavigate()
  const location  = useLocation()

  // Derive mode from URL so direct /login and /register links work
  const modeFromUrl = location.pathname === '/register' ? 'register' : 'login'

  const [mode,       setMode]       = useState(modeFromUrl)
  const [flipped,    setFlipped]    = useState(modeFromUrl === 'register')
  const [switching,  setSwitching]  = useState(false)
  // controls the form content crossfade independently
  const [formVisible, setFormVisible] = useState(true)
  const timerRef = useRef(null)

  // Keep URL in sync without triggering our own switch animation
  useEffect(() => {
    const urlMode = location.pathname === '/register' ? 'register' : 'login'
    if (urlMode !== mode) {
      setMode(urlMode)
      setFlipped(urlMode === 'register')
    }
  }, [location.pathname])  // eslint-disable-line react-hooks/exhaustive-deps

  function handleSwitch() {
    if (switching) return
    const next = mode === 'login' ? 'register' : 'login'

    // Phase 1: fade everything out
    setSwitching(true)
    setFormVisible(false)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      // Phase 2: flip state — CSS transition slides the layout
      setMode(next)
      setFlipped(next === 'register')
      setSwitching(false)

      // Update URL to match (no navigation animation)
      navigate(next === 'register' ? '/register' : '/login', { replace: true })

      // Phase 3: fade form content back in slightly after layout settles
      setTimeout(() => setFormVisible(true), 60)
    }, SWITCH_FADE_MS)
  }

  return (
    <AuthLayout
      illustrationSlots={SLOTS}
      flipped={flipped}
      switching={switching}
    >
      {/* Form content wrapper — crossfades independently */}
      <div className={`${p.formContent} ${formVisible ? p.formVisible : p.formHidden}`}>
        {mode === 'login'
          ? <LoginForm    onSwitch={handleSwitch} />
          : <RegisterForm onSwitch={handleSwitch} />
        }
      </div>
    </AuthLayout>
  )
}
