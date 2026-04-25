import { useState } from 'react'
import { parseMarkdown, formatTime } from '@utils/helpers'

export default function MessageBubble({ message, prevMessage }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const showAvatar = !prevMessage || prevMessage.role !== message.role
  const sameGroup = prevMessage && prevMessage.role === message.role

  function handleCopy() {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  if (isUser) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: '8px',
        marginBottom: '4px',
        marginTop: sameGroup ? '2px' : '12px',
        alignItems: 'flex-end',
        animation: 'slideInRight 0.2s ease',
      }}>
        {showAvatar && (
          <div className="avatar avatar-sm" aria-hidden="true" style={{ flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        )}
        {!showAvatar && <div style={{ width: '28px', flexShrink: 0 }} />}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '68%' }}>
          <div
            className="message-bubble-user"
            style={{
              background: 'linear-gradient(135deg, var(--violet-700), var(--violet-500))',
              color: 'white',
              padding: '11px 15px',
              borderRadius: '18px 18px 4px 18px',
              fontSize: '14px',
              lineHeight: 1.65,
              boxShadow: 'var(--shadow-sm)',
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
            color: 'var(--text-muted)', marginTop: '3px',
          }}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    )
  }

  // Assistant bubble
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
      marginBottom: '4px',
      marginTop: sameGroup ? '2px' : '12px',
      alignItems: 'flex-end',
      animation: 'slideInLeft 0.2s ease',
    }}>
      {showAvatar ? (
        <div
          className="avatar avatar-sm"
          aria-hidden="true"
          style={{
            background: 'var(--violet-100)',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
      ) : (
        <div style={{ width: '28px', flexShrink: 0 }} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '75%' }}>
        <div
          className="message-bubble-assistant"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            padding: '12px 16px',
            borderRadius: '18px 18px 18px 4px',
            fontSize: '14px',
            lineHeight: 1.7,
            boxShadow: 'var(--shadow-xs)',
            position: 'relative',
            wordBreak: 'break-word',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget.querySelector('.copy-btn')
            if (btn) btn.style.opacity = '1'
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget.querySelector('.copy-btn')
            if (btn) btn.style.opacity = '0'
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
            style={{ position: 'relative' }}
          />

          {/* Copy button */}
          <div style={{ position: 'relative' }}>
            <button
              className="copy-btn"
              onClick={handleCopy}
              aria-label="Copy message"
              title="Copy"
              style={{
                position: 'absolute', top: '-36px', right: '-8px',
                width: '26px', height: '26px', borderRadius: 'var(--radius-xs)',
                border: 'none', background: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s',
                color: 'var(--text-muted)',
              }}
            >
              {copied ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              )}
            </button>
            {copied && (
              <div style={{
                position: 'absolute', top: '-60px', right: '-8px',
                background: 'var(--violet-500)', color: 'white',
                fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                padding: '3px 8px', borderRadius: 'var(--radius-full)',
                animation: 'fadeIn 0.15s ease',
                whiteSpace: 'nowrap',
              }}>
                Copied!
              </div>
            )}
          </div>
        </div>

        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
          color: 'var(--text-muted)', marginTop: '3px',
        }}>
          ProjectChat AI · {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
