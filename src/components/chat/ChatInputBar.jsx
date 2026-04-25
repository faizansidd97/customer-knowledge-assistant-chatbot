import { useState, useRef, useEffect } from 'react'
import { useChat } from '@hooks/useChat'
import { useVoiceInput } from '@hooks/useVoiceInput'
import { generateId } from '@utils/helpers'
import { sendMessageToAI } from '@services/aiService'
import ProjectSelector from './ProjectSelector'

export default function ChatInputBar({ isTyping, setIsTyping, inputRef: externalRef }) {
  const { activeTab, activeTabId, addMessage, renameTab } = useChat()
  const [inputValue, setInputValue] = useState('')
  const [showNoProjectTooltip, setShowNoProjectTooltip] = useState(false)
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false)
  const internalRef = useRef(null)
  const textareaRef = externalRef || internalRef
  const selectorRef = useRef(null)
  const {
    isRecording, transcript, interimTranscript,
    isSupported, startRecording, stopRecording, resetTranscript,
  } = useVoiceInput()

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [inputValue])

  // Apply voice transcript to input
  useEffect(() => {
    if (transcript) {
      setInputValue(prev => prev + transcript)
      resetTranscript()
    }
  }, [transcript])

  // Show interim transcript
  const displayValue = isRecording && interimTranscript
    ? inputValue + interimTranscript
    : inputValue

  function triggerShake() {
    if (selectorRef.current) {
      selectorRef.current.style.animation = 'shake 0.4s ease'
      setTimeout(() => { if (selectorRef.current) selectorRef.current.style.animation = '' }, 400)
    }
    setShowNoProjectTooltip(true)
    setTimeout(() => setShowNoProjectTooltip(false), 2000)
  }

  async function handleSend() {
    const text = inputValue.trim()
    if (!text) return
    if (!activeTab?.projectId) {
      triggerShake()
      return
    }

    const userMsg = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      status: 'sent',
    }
    addMessage(activeTabId, userMsg)
    setInputValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    // Update status to delivered
    setTimeout(() => {
      // status is already in message, no external state needed
    }, 500)

    // Auto-rename tab
    if (activeTab?.title === 'New Chat') {
      renameTab(activeTabId, text.slice(0, 40))
    }

    setIsTyping(true)
    try {
      const responseText = await sendMessageToAI(text)
      const aiMsg = {
        id: generateId(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      }
      addMessage(activeTabId, aiMsg)
    } catch (e) {
      console.error(e)
    } finally {
      setIsTyping(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleVoiceClick() {
    if (!isSupported) {
      setShowVoiceTooltip(true)
      setTimeout(() => setShowVoiceTooltip(false), 3000)
      return
    }
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const canSend = inputValue.trim().length > 0 && !!activeTab?.projectId && !isTyping

  return (
    <div
      className="chat-input-bar"
      style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
        padding: '10px 16px 14px',
        position: 'relative',
      }}
    >
      {/* Project selector row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', position: 'relative' }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>
          Project:
        </span>
        <ProjectSelector shakeRef={selectorRef} />

        {/* No project tooltip */}
        {showNoProjectTooltip && (
          <div style={{
            position: 'absolute', left: '80px', bottom: 'calc(100% + 6px)',
            background: 'var(--violet-500)', color: 'white',
            fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
            padding: '5px 12px', borderRadius: 'var(--radius-full)',
            animation: 'fadeIn 0.15s ease', whiteSpace: 'nowrap',
            zIndex: 10,
          }}>
            Please select a project first
          </div>
        )}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        {/* Textarea */}
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={displayValue}
            onChange={e => {
              if (!isRecording) setInputValue(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your project..."
            disabled={isTyping}
            aria-label="Chat input"
            style={{
              width: '100%',
              minHeight: '44px',
              maxHeight: '160px',
              borderRadius: 'var(--radius-xl)',
              padding: '11px 16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: isRecording && interimTranscript ? 'var(--text-muted)' : 'var(--text-primary)',
              fontStyle: isRecording && interimTranscript ? 'italic' : 'normal',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              lineHeight: '1.5',
              display: 'block',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--violet-500)'
              e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border)'
              e.target.style.boxShadow = 'none'
            }}
          />
          {/* Char count */}
          {inputValue.length > 200 && (
            <div style={{
              position: 'absolute', bottom: '6px', right: '12px',
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
              color: inputValue.length > 1900 ? 'var(--danger)' : 'var(--text-muted)',
              pointerEvents: 'none',
            }}>
              {inputValue.length} / 2000
            </div>
          )}
        </div>

        {/* Voice button */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon-round"
            onClick={handleVoiceClick}
            aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            title={isRecording ? 'Stop recording' : 'Voice input'}
            style={isRecording ? {
              borderColor: 'var(--danger)',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              animation: 'pulse 1.5s ease-in-out infinite',
              position: 'relative',
            } : {}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>

          {/* Voice not supported tooltip */}
          {showVoiceTooltip && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 8px)', right: 0,
              background: 'var(--text-primary)', color: 'var(--bg-primary)',
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
              padding: '6px 10px', borderRadius: 'var(--radius-sm)',
              width: '200px', textAlign: 'center', lineHeight: 1.4,
              animation: 'fadeIn 0.15s ease', zIndex: 10,
            }}>
              Voice input not supported. Try Chrome or Edge.
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          style={{
            width: '44px', height: '44px', borderRadius: 'var(--radius-full)',
            border: 'none', cursor: canSend ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'var(--transition-bounce)',
            background: canSend ? 'var(--violet-500)' : 'var(--violet-200)',
            color: canSend ? 'white' : 'var(--violet-400)',
            boxShadow: canSend ? 'var(--glow-sm)' : 'none',
          }}
          onMouseEnter={e => {
            if (canSend) {
              e.currentTarget.style.background = 'var(--violet-700)'
              e.currentTarget.style.transform = 'scale(1.08)'
            }
          }}
          onMouseLeave={e => {
            if (canSend) {
              e.currentTarget.style.background = 'var(--violet-500)'
              e.currentTarget.style.transform = 'scale(1)'
            }
          }}
          onMouseDown={e => { if (canSend) e.currentTarget.style.transform = 'scale(0.92)' }}
          onMouseUp={e => { if (canSend) e.currentTarget.style.transform = 'scale(1)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
