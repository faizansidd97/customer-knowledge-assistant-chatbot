import { createContext, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  loginThunk,
  logout as logoutAction,
  clearError,
  initFromStorage,
  setInitialized,
  selectCurrentUser,
  selectToken,
  selectAuthLoading,
  selectAuthError,
  selectIsInitialized,
} from '@store/slices/authSlice'

const AuthContext = createContext(null)

// ── Provider ─────────────────────────────────────────────────────────────────
// This component is a thin bridge: it reads from the Redux store and exposes
// the same interface that all existing useAuth() consumers already expect.
// No local state lives here — Redux is the single source of truth.

export function AuthProvider({ children }) {
  const dispatch = useDispatch()

  const user         = useSelector(selectCurrentUser)
  const token        = useSelector(selectToken)
  const apiLoading   = useSelector(selectAuthLoading)
  const error        = useSelector(selectAuthError)
  const isInitialized = useSelector(selectIsInitialized)

  // On first mount: restore session from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('pc_auth_token')
      const storedUser  = localStorage.getItem('pc_auth_user')

      if (storedToken && storedUser) {
        dispatch(initFromStorage({
          token: storedToken,
          user: JSON.parse(storedUser),
        }))
      } else {
        dispatch(setInitialized())
      }
    } catch {
      localStorage.removeItem('pc_auth_token')
      localStorage.removeItem('pc_auth_user')
      dispatch(setInitialized())
    }
  }, [dispatch])

  // ── login() ──────────────────────────────────────────────────────────────
  // Dispatches the async thunk and returns a simple { success, error } object
  // so call-sites (LoginPage) don't need to know about Redux at all.
  async function login(username, password) {
    const result = await dispatch(loginThunk({ username, password }))

    if (loginThunk.fulfilled.match(result)) {
      return { success: true }
    }
    // rejectWithValue payload is the error message string
    return { success: false, error: result.payload ?? 'Login failed.' }
  }

  // ── logout() ─────────────────────────────────────────────────────────────
  function logout() {
    dispatch(logoutAction())
  }

  // ── dismissError() ────────────────────────────────────────────────────────
  function dismissError() {
    dispatch(clearError())
  }

  // isLoading is true when:
  //   • the app has not yet checked localStorage (isInitialized = false), OR
  //   • a login API call is in-flight
  // This keeps the ProtectedRoute spinner behaviour identical to before.
  const isLoading = !isInitialized || apiLoading

  return (
    <AuthContext.Provider value={{
      currentUser: user,  // existing consumers read this field
      token,
      isLoading,
      error,
      login,
      logout,
      dismissError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
