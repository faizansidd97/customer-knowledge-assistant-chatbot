import { useState, useRef } from 'react'
import { useChat } from '@hooks/useChat'
import { MOCK_PROJECTS } from '@utils/mockData'
import ThemeToggle from '@components/common/ThemeToggle'

export default function ChatHeader({ onToggleSidebar, onToggleContext, contextPanelOpen, isMobile }) {
  const { activeTab, activeTabId, renameTab, clearMessages } = useChat()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const inputRef = useRef(null)

  const project = MOCK_PROJECTS.find(p => p.id === activeTab?.projectId)

  function startEdit() {
    setEditValue(activeTab?.title ?? '')
    setIsEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function finishEdit() {
    const trimmed = editValue.trim()
    if (trimmed && activeTabId) {
      renameTab(activeTabId, trimmed)
    }
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') finishEdit()
    if (e.key === 'Escape') setIsEditing(false)
  }

  function handleClear() {
    if (showClearConfirm) {
      clearMessages(activeTabId)
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
    }
  }

  return (
    <header style={{
      height: 'var(--navbar-height)',
      background: 'var(--navbar-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <button
          className="btn-icon"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          style={{ display: isMobile ? 'flex' : 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: 600,
              color: 'var(--text-primary)', background: 'transparent',
              border: 'none', borderBottom: '1.5px solid var(--violet-500)',
              outline: 'none', padding: '2px 4px', maxWidth: '260px',
            }}
            aria-label="Rename chat"
          />
        ) : (
          <span
            onDoubleClick={startEdit}
            title="Double-click to rename"
            style={{
              fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: 600,
              color: 'var(--text-primary)', cursor: 'default', userSelect: 'none',
              maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {activeTab?.title ?? 'New Chat'}
          </span>
        )}

        {project && (
          <span className="badge badge-project" style={{ marginLeft: '6px', flexShrink: 0 }}>
            {project.name}
          </span>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Clear confirm inline pill */}
        {showClearConfirm && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)', padding: '4px 10px',
            animation: 'fadeIn 0.15s ease',
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)' }}>
              Clear all messages?
            </span>
            <button
              onClick={() => { clearMessages(activeTabId); setShowClearConfirm(false) }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}
            >
              Yes
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Context panel toggle */}
        <button
          className="btn-icon"
          onClick={onToggleContext}
          aria-label={contextPanelOpen ? 'Hide context panel' : 'Show context panel'}
          title="Project context"
          style={contextPanelOpen ? { color: 'var(--violet-500)', background: 'rgba(139,92,246,0.1)', borderColor: 'var(--violet-300)' } : {}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </button>

        {/* Clear chat */}
        <button
          className="btn-icon"
          onClick={handleClear}
          aria-label="Clear chat messages"
          title="Clear chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>

        <ThemeToggle />
      </div>
    </header>
  )
}
