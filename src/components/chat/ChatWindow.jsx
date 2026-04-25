import { useEffect, useRef } from 'react'
import { useChat } from '@hooks/useChat'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import SuggestionChips from './SuggestionChips'

export default function ChatWindow({ isTyping, onChipSelect }) {
  const { activeMessages } = useChat()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages, isTyping])

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {activeMessages.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}>
          {/* Animated icon */}
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--violet-700), var(--violet-400))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'float 3s ease-in-out infinite',
          }}
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 700,
            color: 'var(--text-primary)', marginTop: '20px',
          }}>
            How can I help?
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '15px',
            color: 'var(--text-muted)', marginTop: '8px',
          }}>
            Ask anything about your project
          </p>

          <div style={{ marginTop: '28px', maxWidth: '520px' }}>
            <SuggestionChips onSelect={onChipSelect} />
          </div>
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {activeMessages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              prevMessage={i > 0 ? activeMessages[i - 1] : null}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
