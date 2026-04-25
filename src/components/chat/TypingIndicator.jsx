export default function TypingIndicator() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
      marginBottom: '4px',
      marginTop: '12px',
      alignItems: 'flex-end',
      animation: 'slideInLeft 0.2s ease',
    }}>
      <div
        className="avatar avatar-sm"
        aria-hidden="true"
        style={{ background: 'var(--violet-100)', flexShrink: 0 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        padding: '14px 18px',
        borderRadius: '18px 18px 18px 4px',
        height: '44px',
        width: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: 'var(--shadow-xs)',
      }}
        aria-label="AI is typing"
        role="status"
      >
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--violet-400)', display: 'inline-block',
          animation: 'typingDot 1.2s ease-in-out infinite',
          animationDelay: '0s',
        }} />
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--violet-400)', display: 'inline-block',
          animation: 'typingDot 1.2s ease-in-out infinite',
          animationDelay: '0.15s',
        }} />
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--violet-400)', display: 'inline-block',
          animation: 'typingDot 1.2s ease-in-out infinite',
          animationDelay: '0.30s',
        }} />
      </div>
    </div>
  )
}
