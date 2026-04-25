import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@store/index'
import { AuthProvider } from '@context/AuthContext'
import { ChatProvider } from '@context/ChatContext'
import { ToastProvider } from '@components/common/Toast'
import LoginPage from '@pages/LoginPage'
import ChatPage from '@pages/ChatPage'
import ProtectedRoute from '@components/auth/ProtectedRoute'
import { useAuth } from '@hooks/useAuth'
import { useChat } from '@hooks/useChat'

function TitleUpdater() {
  const location = useLocation()
  const { activeTab } = useChat()

  useEffect(() => {
    if (location.pathname.startsWith('/chat')) {
      const title = activeTab?.title ?? 'Chat'
      document.title = `${title} — ProjectChat`
    } else if (location.pathname === '/login') {
      document.title = 'Sign In — ProjectChat'
    } else {
      document.title = 'ProjectChat'
    }
  }, [location.pathname, activeTab?.title])

  return null
}

function AuthRedirect({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (isAuthenticated) return <Navigate to="/chat" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <TitleUpdater />
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:tabId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem('pc_theme') ?? 'light'
    document.documentElement.dataset.theme = saved
  }, [])

  return (
    // Redux Provider must wrap everything — AuthProvider reads from the store
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}
