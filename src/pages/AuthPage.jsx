import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/Auth/AuthLayout'
import MicroscopeIllo from '../components/Auth/illustrations/MicroscopeIllo'
import PetriDishIllo  from '../components/Auth/illustrations/PetriDishIllo'
import HelixIllo      from '../components/Auth/illustrations/HelixIllo'
import BeakerIllo     from '../components/Auth/illustrations/BeakerIllo'
import NotebookIllo   from '../components/Auth/illustrations/NotebookIllo'
import GraphIllo      from '../components/Auth/illustrations/GraphIllo'
import f from '../styles/forms.module.css'
import p from './AuthPage.module.css'
import { getApiUrl } from '../config/api'

/* ── Lab-themed decorative elements ── */
function LabDecoration() {
  return (
    <div className={p.labDecoration} aria-hidden="true">
      {/* Floating molecules */}
      <div className={p.floatingAtom1}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M12 12L12 4" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M12 4L8 2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M12 4L16 2" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="2" r="1.5" fill="currentColor"/>
        </svg>
      </div>
      <div className={p.floatingAtom2}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <path d="M12 12L12 5" stroke="currentColor" strokeWidth="1"/>
          <path d="M12 5L9 8" stroke="currentColor" strokeWidth="1"/>
          <path d="M12 5L15 8" stroke="currentColor" strokeWidth="1"/>
          <circle cx="9" cy="8" r="1" fill="currentColor"/>
          <circle cx="15" cy="8" r="1" fill="currentColor"/>
        </svg>
      </div>

      {/* Lab equipment */}
      <div className={p.flaskDecoration}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4L15 8H9L12 4Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M9 8L6 12H18L15 8" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M6 12C6 16.5 9 20 12 20C15 20 18 16.5 18 12" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M12 20L12 22" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M10 22H14" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        </svg>
      </div>
      <div className={p.testTubeDecoration}>
        <svg width="16" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="4" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M7 18H17" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M6 20H18" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M5 22H19" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        </svg>
      </div>

      {/* Scientific notation */}
      <div className={p.scientificEq}>
        <span className={p.equation}>ΔG = ΔH - TΔS</span>
      </div>
    </div>
  )
}

/* ── Illustration grid — same for both modes ──────────────── */
const SLOTS = [
  <MicroscopeIllo />,
  <PetriDishIllo  />,
  <HelixIllo      />,
  <BeakerIllo isAnimated />,
  <NotebookIllo   />,
  <GraphIllo      />
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
            stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="16" r="1.2" fill="currentColor"/>
    </svg>
  )
}

/* ── Login form ────────────────────────────────────────────── */
function LoginForm({ onSwitch, loading, error, setLoading, setError }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await res.json()

      if(!res.ok){
        setError(data.error || 'Login failed');
        toast.error(data.error || 'Login failed', 'Authentication Error');
        return;
      }

      toast.success('Welcome back to your laboratory!', 'Successfully Logged In');
      navigate('/dashboard')
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className={f.heading}>Log In</h1>

      {error && (
        <div className={f.errorMsg}>
          {error}
        </div>
      )}

      <form className={f.fields} onSubmit={handleSubmit} noValidate aria-label="Login form">
        <div className={f.fieldGroup}>
          <label htmlFor="login-email" className={f.label}>Email Address</label>
          <div className={f.inputWrap}>
            <span className={f.inputIcon}><MailIcon /></span>
            <input id="login-email" type="email" className={f.input}
                   placeholder="example@gmail.com" value={email}
                   onChange={e => setEmail(e.target.value)}
                   autoComplete="email"
                   required
                   disabled={loading} />
          </div>
        </div>

        <div className={f.fieldGroup}>
          <label htmlFor="login-password" className={f.label}>Password</label>
          <div className={`${f.inputWrap} ${f.passwordWrap}`}>
            <span className={f.inputIcon}><LockIcon /></span>
            <input id="login-password" type={showPw ? 'text' : 'password'}
                   className={f.input} placeholder="••••••••" value={password}
                   onChange={e => setPassword(e.target.value)}
                   autoComplete="current-password"
                   required
                   disabled={loading} />
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

        <button type="submit" className={f.submitBtn} disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        {/* ── Demo Account Pre-fill & Verified Login ── */}
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--color-coral, #E46757)',
              background: 'rgba(228, 103, 87, 0.08)',
              color: 'var(--color-coral-dark, #C94A3C)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.84375rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 180ms ease'
            }}
            disabled={loading}
            onClick={async () => {
              const demoEmail = 'demo@notelab.app';
              const demoPassword = 'DemoPass123!';
              setEmail(demoEmail);
              setPassword(demoPassword);
              
              setLoading(true);
              setError('');
              try {
                const res = await fetch(getApiUrl('/auth/login'), {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: demoEmail, password: demoPassword })
                });
                const data = await res.json();
                if (res.ok) {
                  toast.success('Welcome back, Dr. Eleanor Vance!', 'Demo Workspace Loaded');
                  navigate('/dashboard');
                } else {
                  setError(data.error || 'Login failed');
                  toast.error(data.error || 'Login failed');
                }
              } catch (err) {
                setError('Connection failed');
                toast.error('Connection failed');
              } finally {
                setLoading(false);
              }
            }}
          >
            Demo Login (Dr. Eleanor Vance)
          </button>
        </div>
      </form>

      <p className={f.footer}>
        Don&apos;t have an account yet?{' '}
        <button type="button" className={p.switchBtn} onClick={onSwitch} disabled={loading}>
          Sign Up
        </button>
      </p>
    </>
  )
}

/* ── Register form ─────────────────────────────────────────── */
function RegisterForm({ onSwitch, loading, error, setLoading, setError }) {
  const toast = useToast()
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [showCfm,  setShowCfm]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords do not match")
      toast.error("Passwords do not match", "Registration Error")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(getApiUrl('/auth/register'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        toast.error(data.error || 'Registration failed', 'Account Creation Failed')
        return
      }
      toast.success('Account created successfully! Please log in.', 'Welcome to NoteLab')
      onSwitch()
    } catch (err) {
      setError('Network error. Please try again.')
      toast.error('Network error. Please try again.', 'Connection Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className={f.heading}>Create Account</h1>

      {error && (
        <div className={f.errorMsg}>
          {error}
        </div>
      )}

      <form className={f.fields} onSubmit={handleSubmit} noValidate aria-label="Register form">
        <div className={f.fieldGroup}>
          <label htmlFor="reg-name" className={f.label}>Full Name</label>
          <div className={f.inputWrap}>
            <span className={f.inputIcon}><UserIcon /></span>
            <input id="reg-name" type="text" className={f.input}
                   placeholder="Dr. Jane Smith" value={name}
                   onChange={e => setName(e.target.value)}
                   autoComplete="name"
                   required
                   disabled={loading} />
          </div>
        </div>

        <div className={f.fieldGroup}>
          <label htmlFor="reg-email" className={f.label}>Email Address</label>
          <div className={f.inputWrap}>
            <span className={f.inputIcon}><MailIcon /></span>
            <input id="reg-email" type="email" className={f.input}
                   placeholder="example@gmail.com" value={email}
                   onChange={e => setEmail(e.target.value)}
                   autoComplete="email"
                   required
                   disabled={loading} />
          </div>
        </div>

        <div className={f.fieldGroup}>
          <label htmlFor="reg-password" className={f.label}>Password</label>
          <div className={`${f.inputWrap} ${f.passwordWrap}`}>
            <span className={f.inputIcon}><LockIcon /></span>
            <input id="reg-password" type={showPw ? 'text' : 'password'}
                   className={f.input} placeholder="••••••••" value={password}
                   onChange={e => setPassword(e.target.value)}
                   autoComplete="new-password"
                   required
                   disabled={loading} />
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
                   autoComplete="new-password"
                   required
                   disabled={loading} />
            <button type="button" className={f.passwordToggle}
                    onClick={() => setShowCfm(v => !v)}
                    aria-label={showCfm ? 'Hide confirm password' : 'Show confirm password'}>
              {showCfm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button type="submit" className={f.submitBtn} disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        
        <p style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 12, lineHeight: 1.4 }}>
          By creating an account, you agree to NoteLab&apos;s{' '}
          <Link to="/terms" style={{ color: 'var(--color-coral)', textDecoration: 'underline' }}>Terms of Service</Link>{' '}
          and{' '}
          <Link to="/privacy" style={{ color: 'var(--color-coral)', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </p>
      </form>

      <p className={f.footer}>
        Already have an account?{' '}
        <button type="button" className={p.switchBtn} onClick={onSwitch} disabled={loading}>
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
  const navigate = useNavigate()
  const location = useLocation()

  // Derive mode from URL so direct /login and /register links work
  const modeFromUrl = location.pathname === '/register' ? 'register' : 'login'

  const [mode, setMode] = useState(modeFromUrl)
  const [flipped, setFlipped] = useState(modeFromUrl === 'register')
  const [switching, setSwitching] = useState(false)
  // controls the form content crossfade independently
  const [formVisible, setFormVisible] = useState(true)
  const timerRef = useRef(null)

  // Form states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      mode={mode}
      flipped={flipped}
      switching={switching}
    >
      {/* Lab-themed decorative elements */}
      <LabDecoration />

      {/* Form content wrapper — crossfades independently */}
      <div className={`${p.formContent} ${formVisible ? p.formVisible : p.formHidden}`}>
        {mode === 'login'
          ? <LoginForm
              onSwitch={handleSwitch}
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
            />
          : <RegisterForm
              onSwitch={handleSwitch}
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
            />
        }
      </div>
    </AuthLayout>
  )
}