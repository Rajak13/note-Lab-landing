import { useState } from 'react'
import { Link } from 'react-router-dom'
import LockKeyIllo  from '../components/Auth/illustrations/LockKeyIllo'
import EnvelopeIllo from '../components/Auth/illustrations/EnvelopeIllo'
import s from './ResetPasswordPage.module.css'

/* ── Mail icon for the input field ────────────────────────── */
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

/* ── Step 1: email entry ───────────────────────────────────── */
function RequestStep({ onSubmit }) {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulate network delay — swap with real API call
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    onSubmit(email)
  }

  return (
    <div className={s.stepEnter}>
      <div className={s.illoWrap} aria-hidden="true">
        <LockKeyIllo />
      </div>

      <h1 className={s.heading}>Reset your password</h1>

      <p className={s.subtext}>
        Enter the email address linked to your note&#8209;Lab account and
        we&apos;ll send you a reset link.
      </p>

      <form className={s.fields} onSubmit={handleSubmit} noValidate>
        <div className={s.fieldGroup}>
          <label htmlFor="reset-email" className={s.label}>
            Email Address
          </label>
          <div className={s.inputWrap}>
            <span className={s.inputIcon}><MailIcon /></span>
            <input
              id="reset-email"
              type="email"
              className={s.input}
              placeholder="example@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={s.submitBtn}
          disabled={loading || !email}
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <div className={s.divider} />

      <p className={s.footer}>
        Remembered it?{' '}
        <Link to="/login" className={s.textBtn}>Log in</Link>
      </p>
    </div>
  )
}

/* ── Step 2: success confirmation ─────────────────────────── */
function SuccessStep({ email, onResend }) {
  const [resent,   setResent]   = useState(false)
  const [counting, setCounting] = useState(false)

  function handleResend() {
    if (counting) return
    setResent(true)
    setCounting(true)
    onResend()
    // Lock resend for 30 s to prevent spam
    setTimeout(() => {
      setResent(false)
      setCounting(false)
    }, 30_000)
  }

  return (
    <div className={s.stepEnter}>
      <div className={s.illoWrap} aria-hidden="true">
        <EnvelopeIllo />
      </div>

      <span className={s.successBadge}>
        <span className={s.successBadgeDot} aria-hidden="true" />
        Email sent
      </span>

      <h1 className={s.successHeading}>Check your inbox</h1>

      <p className={s.subtext}>
        We sent a reset link to{' '}
        <span className={s.subtextEmail}>{email}</span>.
        It expires in&nbsp;15&nbsp;minutes.
      </p>

      <p className={s.subtext} style={{ marginTop: '-8px' }}>
        Can&apos;t find it? Check your spam folder, or{' '}
        <button
          type="button"
          className={s.textBtn}
          onClick={handleResend}
          disabled={counting}
        >
          {resent ? 'Resent!' : 'resend the link'}
        </button>
        .
      </p>

      <div className={s.divider} />

      <p className={s.footer}>
        <Link to="/login" className={s.textBtn}>← Back to login</Link>
      </p>
    </div>
  )
}

/* ── Page root ─────────────────────────────────────────────── */
export default function ResetPasswordPage() {
  const [step,  setStep]  = useState('request')  // 'request' | 'success'
  const [email, setEmail] = useState('')

  function handleSubmit(submittedEmail) {
    setEmail(submittedEmail)
    setStep('success')
  }

  function handleResend() {
    // TODO: POST /api/auth/forgot-password { email }
    console.log('Resend reset link to', email)
  }

  return (
    <div className={s.page}>
      <Link to="/login" className={s.backLink} aria-label="Back to login">
        <span className={s.backArrow} aria-hidden="true">←</span>
        Back to login
      </Link>

      <a href="/" className={s.logo} aria-label="note-Lab home">
        note<span className={s.logoDash}>–</span>Lab
      </a>

      <div className={s.card}>
        {step === 'request'
          ? <RequestStep onSubmit={handleSubmit} />
          : <SuccessStep email={email} onResend={handleResend} />
        }
      </div>
    </div>
  )
}
