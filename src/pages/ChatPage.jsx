import { useState, useEffect, useCallback, useRef } from 'react'
import { useChat } from '@hooks/useChat'
import { sendMessageToAI } from '@services/aiService'
import { generateId } from '@utils/helpers'
import ChatSidebar from '@components/chat/ChatSidebar'
import ChatHeader from '@components/chat/ChatHeader'
import ChatWindow from '@components/chat/ChatWindow'
import ChatInputBar from '@components/chat/ChatInputBar'
import ContextPanel from '@components/chat/ContextPanel'

export default function ChatPage() {
  const { activeTabId, addMessage, activeTab, createTab } = useChat()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [contextPanelOpen, setContextPanelOpen] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const chatInputRef = useRef(null)

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    function handler(e) {
      setIsMobile(e.matches)
      if (!e.matches) setSidebarOpen(false) // on desktop sidebar is always shown inline
    }
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // On tablet, hide context panel by default
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    function handler(e) {
      setContextPanelOpen(!e.matches)
    }
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Keyboard shortcuts: Ctrl+N = new tab, Ctrl+K = focus input, Escape = close panels
  const handleKeyDown = useCallback((e) => {
    const isCtrl = e.ctrlKey || e.metaKey
    if (isCtrl && e.key === 'n') {
      e.preventDefault()
      createTab()
      setTimeout(() => chatInputRef.current?.focus(), 50)
    }
    if (isCtrl && e.key === 'k') {
      e.preventDefault()
      chatInputRef.current?.focus()
    }
    if (e.key === 'Escape') {
      setSidebarOpen(false)
    }
  }, [createTab])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  async function handleChipSelect(text) {
    if (!activeTab?.projectId) return
    const userMsg = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      status: 'sent',
    }
    addMessage(activeTabId, userMsg)
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      <ChatSidebar
        isOpen={isMobile ? sidebarOpen : true}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          onToggleContext={() => setContextPanelOpen(v => !v)}
          contextPanelOpen={contextPanelOpen}
          isMobile={isMobile}
        />
        <ChatWindow
          isTyping={isTyping}
          onChipSelect={handleChipSelect}
        />
        <ChatInputBar
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          inputRef={chatInputRef}
        />
      </main>

      <ContextPanel isOpen={contextPanelOpen} />
    </div>
  )
}
