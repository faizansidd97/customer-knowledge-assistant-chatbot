import { createContext, useContext, useState, useEffect } from 'react'
import { generateId } from '@utils/helpers'

const ChatContext = createContext(null)

function makeTab(overrides = {}) {
  return {
    id: generateId(),
    title: 'New Chat',
    projectId: null,
    messages: [],
    createdAt: Date.now(),
    lastActivity: Date.now(),
    ...overrides,
  }
}

export function ChatProvider({ children }) {
  const [tabs, setTabs] = useState(() => {
    try {
      const stored = localStorage.getItem('pc_chat_tabs')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    return [makeTab()]
  })

  const [activeTabId, setActiveTabId] = useState(() => {
    try {
      const stored = localStorage.getItem('pc_chat_tabs')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id
      }
    } catch {
      // ignore
    }
    return null
  })

  // Keep activeTabId in sync when tabs change
  useEffect(() => {
    if (!activeTabId && tabs.length > 0) {
      setActiveTabId(tabs[0].id)
    } else if (activeTabId && !tabs.find(t => t.id === activeTabId)) {
      setActiveTabId(tabs[tabs.length - 1]?.id ?? null)
    }
  }, [tabs, activeTabId])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('pc_chat_tabs', JSON.stringify(tabs.slice(-20)))
  }, [tabs])

  function createTab() {
    const tab = makeTab()
    setTabs(prev => [...prev, tab])
    setActiveTabId(tab.id)
    return tab
  }

  function deleteTab(id) {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id)
      if (next.length === 0) {
        const fresh = makeTab()
        setActiveTabId(fresh.id)
        return [fresh]
      }
      if (id === activeTabId) {
        const idx = prev.findIndex(t => t.id === id)
        const newActive = next[Math.max(0, idx - 1)]
        setActiveTabId(newActive.id)
      }
      return next
    })
  }

  function renameTab(id, title) {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, title } : t))
  }

  // projectName is optional — when provided the tab is auto-renamed from
  // the "New Chat" default to the selected project's name.
  function setTabProject(id, projectId, projectName) {
    setTabs(prev => prev.map(t => {
      if (t.id !== id) return t
      const title = t.title === 'New Chat' && projectName ? projectName : t.title
      return { ...t, projectId, title, lastActivity: Date.now() }
    }))
  }

  function addMessage(tabId, message) {
    setTabs(prev => prev.map(t => {
      if (t.id !== tabId) return t
      return {
        ...t,
        messages: [...t.messages, message],
        lastActivity: Date.now(),
      }
    }))
  }

  function clearMessages(tabId) {
    setTabs(prev => prev.map(t => {
      if (t.id !== tabId) return t
      return { ...t, messages: [], lastActivity: Date.now() }
    }))
  }

  return (
    <ChatContext.Provider value={{
      tabs,
      activeTabId,
      createTab,
      deleteTab,
      setActiveTab: setActiveTabId,
      renameTab,
      setTabProject,
      addMessage,
      clearMessages,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}
