import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'

// These are kept purely as a convenience quick-fill for testing.
// They only work if the real API has matching accounts.
const DEMO_ACCOUNTS = [
  { username: 'alice@demo.com', password: 'alice123', role: 'Manager' },
  { username: 'bob@demo.com',   password: 'bob123',   role: 'Developer' },
  { username: 'sara@demo.com',  password: 'sara123',  role: 'Developer' },
  { username: 'james@demo.com', password: 'james123', role: 'Viewer' },
]

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  // login() — async, returns { success, error }
  // isLoading — true while the API call is in-flight (from Redux)
  // error — last API error string (from Redux)
  // dismissError — clears the Redux error without logging out
  const { login, isLoading, error: reduxError, dismissError } = useAuth()

  const [username, setUsername]           = useState('')
  const [password, setPassword]           = useState('')
  const [showPassword, setShowPassword]   = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [errorMessage, setErrorMessage]   = useState('')

  // Show Redux API errors as the dismissable banner
  useEffect(() => {
    if (reduxError) setErrorMessage(reduxError)
  }, [reduxError])

  // Auto-dismiss the error banner after 5 seconds
  useEffect(() => {
    if (!errorMessage) return
    const t = setTimeout(() => {
      setErrorMessage('')
      dismissError?.()
    }, 5000)
    return () => clearTimeout(t)
  }, [errorMessage, dismissError])

  // ── Validation ─────────────────────────────────────────────────────────────

  function validateUsername(val) {
    if (!val.trim()) return 'Username is required'
    return ''
  }

  function validatePassword(val) {
    if (!val) return 'Password is required'
    if (val.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault()

    const uErr = validateUsername(username)
    const pErr = validatePassword(password)
    setUsernameError(uErr)
    setPasswordError(pErr)
    if (uErr || pErr) return

    // login() dispatches loginThunk → calls POST /login → normalizes response
    const result = await login(username.trim(), password)

    if (result.success) {
      navigate('/chat')
    } else {
      setErrorMessage(result.error ?? 'Login failed. Please try again.')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Left decorative panel ── */}
      <div className="login-left-panel" style={{
        width: '55%',
        background: 'linear-gradient(145deg, #0D0118 0%, #2D0A4E 45%, #5B21B6 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
      }}>
        {/* Blobs */}
        <div style={{
          position: 'absolute', top: '-60px', left: '-60px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'rgba(139,92,246,0.2)', filter: 'blur(70px)',
          animation: 'float 7s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', right: '-40px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(167,139,250,0.15)', filter: 'blur(60px)',
          animation: 'float 9s ease-in-out infinite reverse',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '14px', marginBottom: '16px',
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '38px', fontWeight: 700, color: 'white' }}>
            ProjectChat
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.65)', marginTop: '10px' }}>
            Your projects, your data, your answers.
          </p>

          {/* Feature pills */}
          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            {[
              '◆  Ask anything about your projects',
              '◆  Voice input supported',
              '◆  Multiple chat tabs',
            ].map((text, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 18px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
              }}>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-right-panel" style={{
        width: '45%',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 52px',
        animation: 'fadeUp 0.5s ease',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '380px', margin: 'auto' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Welcome back
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: '32px' }} noValidate>

            {/* ── Username ── */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  className={`form-input${usernameError ? ' error' : ''}`}
                  style={{ paddingLeft: '42px' }}
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setUsernameError('') }}
                  autoComplete="username"
                  aria-label="Username"
                  disabled={isLoading}
                />
              </div>
              {usernameError && <span className="form-error">{usernameError}</span>}
            </div>

            {/* ── Password ── */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${passwordError ? ' error' : ''}`}
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordError('') }}
                  autoComplete="current-password"
                  aria-label="Password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', padding: '4px',
                    width: '28px', height: '28px', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {passwordError && <span className="form-error">{passwordError}</span>}
            </div>

            {/* ── API error banner ── */}
            {errorMessage && (
              <div
                role="alert"
                style={{
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  color: 'var(--danger)',
                  fontSize: '13px',
                  marginBottom: '12px',
                  animation: 'fadeUp 0.2s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ flex: 1 }}>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => { setErrorMessage(''); dismissError?.() }}
                  aria-label="Dismiss error"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--danger)', padding: '2px', display: 'flex',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}

            {/* ── Submit button ── */}
            {/* isLoading comes directly from Redux (true during API call) */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', height: '46px', fontFamily: "'Syne', sans-serif", fontSize: '15px', marginTop: '8px' }}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner spinner-sm"
                    style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                    aria-hidden="true"
                  />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* ── Demo accounts quick-fill ── */}
          {/* <div style={{
            marginTop: '20px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500,
              color: 'var(--text-muted)', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: '10px',
            }}>
              Quick Fill (Demo)
            </div>
            {DEMO_ACCOUNTS.map(acc => (
              <div
                key={acc.username}
                onClick={() => {
                  if (isLoading) return
                  setUsername(acc.username)
                  setPassword(acc.password)
                  setUsernameError('')
                  setPasswordError('')
                }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', borderRadius: 'var(--radius-xs)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  transition: 'var(--transition-fast)',
                  marginBottom: '4px',
                }}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = 'rgba(139,92,246,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                role="button"
                tabIndex={isLoading ? -1 : 0}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !isLoading) {
                    setUsername(acc.username)
                    setPassword(acc.password)
                  }
                }}
                aria-label={`Quick fill with account ${acc.username}`}
              >
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text-primary)' }}>
                    {acc.username}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {acc.password}
                  </div>
                </div>
                <span className="badge badge-role" style={{ fontSize: '11px' }}>{acc.role}</span>
              </div>
            ))}
          </div> */}
        </div>

        <div style={{
          marginTop: 'auto', paddingTop: '24px',
          fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          © {new Date().getFullYear()} ProjectChat
        </div>
      </div>
    </div>
  )
}
