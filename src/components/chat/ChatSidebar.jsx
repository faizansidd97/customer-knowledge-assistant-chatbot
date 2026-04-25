import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useChat } from '@hooks/useChat'
import { MOCK_PROJECTS } from '@utils/mockData'
import { formatRelativeTime } from '@utils/helpers'
import ThemeToggle from '@components/common/ThemeToggle'

export default function ChatSidebar({ isOpen, onClose, isMobile }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { tabs, activeTabId, createTab, deleteTab, setActiveTab } = useChat()

  const sortedTabs = [...tabs].sort((a, b) => b.lastActivity - a.lastActivity)

  function handleNewChat() {
    createTab()
    if (onClose) onClose()
  }

  function handleTabClick(tabId) {
    setActiveTab(tabId)
    if (onClose) onClose()
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="chat-sidebar-overlay visible"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`chat-sidebar${isMobile && isOpen ? ' open' : ''}`}
        style={{
          width: 'var(--chat-sidebar-width)',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--sidebar-bg)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {/* Top bar */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ProjectChat
              </span>
            </div>
            <ThemeToggle />
          </div>

          {/* New Chat button */}
          <button
            className="btn btn-primary"
            onClick={handleNewChat}
            style={{ width: '100%', height: '40px', marginTop: '12px', fontSize: '13px' }}
            aria-label="Create new chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Chat
          </button>
        </div>

        {/* Tab list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase',
            color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '6px 8px 4px',
          }}>
            Conversations
          </div>

          {sortedTabs.length === 0 ? (
            <div style={{ padding: '24px 12px', textAlign: 'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--violet-300)" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-muted)', marginTop: '10px' }}>
                No chats yet
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Click "New Chat" to start
              </p>
            </div>
          ) : (
            sortedTabs.map(tab => {
              const isActive = tab.id === activeTabId
              const project = MOCK_PROJECTS.find(p => p.id === tab.projectId)
              const lastMsg = tab.messages[tab.messages.length - 1]

              return (
                <div
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  style={{
                    padding: isActive ? '10px 10px 10px 8px' : '10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    position: 'relative',
                    marginBottom: '2px',
                    transition: 'var(--transition-fast)',
                    background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--violet-500)' : '3px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(139,92,246,0.05)'
                    e.currentTarget.querySelector('.tab-delete-btn').style.opacity = '1'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                    e.currentTarget.querySelector('.tab-delete-btn').style.opacity = '0'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Chat: ${tab.title}`}
                  onKeyDown={e => { if (e.key === 'Enter') handleTabClick(tab.id) }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                    <span className="truncate" style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500,
                      color: isActive ? 'var(--violet-600)' : 'var(--text-primary)',
                      flex: 1, minWidth: 0,
                    }}>
                      {tab.title}
                    </span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>
                      {formatRelativeTime(tab.lastActivity).replace(' ago', '').replace('just now', 'now')}
                    </span>
                  </div>

                  {project && (
                    <span className="badge badge-project" style={{ marginTop: '4px' }}>
                      {project.name}
                    </span>
                  )}

                  {lastMsg && (
                    <div className="truncate" style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                      color: 'var(--text-muted)', marginTop: '3px',
                    }}>
                      {lastMsg.content.slice(0, 40)}
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    className="tab-delete-btn"
                    onClick={e => { e.stopPropagation(); deleteTab(tab.id) }}
                    aria-label={`Delete chat: ${tab.title}`}
                    style={{
                      position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                      width: '24px', height: '24px', borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border)', background: 'var(--bg-card)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Bottom user bar */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="avatar avatar-md" aria-hidden="true">
              {currentUser?.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="truncate" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {currentUser?.fullName}
              </div>
              <span className="badge badge-role" style={{ fontSize: '11px', marginTop: '2px' }}>
                {currentUser?.role}
              </span>
            </div>
            <button
              className="btn-icon"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
              style={{ marginLeft: 'auto' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
