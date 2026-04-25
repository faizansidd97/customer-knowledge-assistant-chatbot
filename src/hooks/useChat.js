import { useSelector } from 'react-redux'
import { useChatContext } from '@context/ChatContext'
import { selectProjects } from '@store/slices/projectsSlice'
import { MOCK_PROJECTS } from '@utils/mockData'

export function useChat() {
  const ctx = useChatContext()
  const { tabs, activeTabId } = ctx

  // Real projects fetched from the API (Redux store)
  const apiProjects = useSelector(selectProjects)

  const activeTab      = tabs.find(t => t.id === activeTabId) ?? null
  const activeMessages = activeTab?.messages ?? []

  // Resolution order:
  //  1. API projects (real data from /api/management/projects/my)
  //  2. MOCK_PROJECTS fallback (keeps existing chat tabs functional even if
  //     they stored a mock project ID before the API was integrated)
  const activeProject =
    apiProjects.find(p => p.id === activeTab?.projectId) ??
    MOCK_PROJECTS.find(p => p.id === activeTab?.projectId) ??
    null

  return { ...ctx, activeTab, activeMessages, activeProject }
}
