import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi } from '@services/authService'

// ── Async thunk ──────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi(username, password)
      return data // { token, user, raw }
    } catch (error) {
      // rejectWithValue gives the reducer a serializable error payload
      return rejectWithValue(error.message || 'Login failed. Please try again.')
    }
  }
)

// ── Initial state ─────────────────────────────────────────────────────────────

const initialState = {
  user: null,         // Authenticated user object
  token: null,        // Bearer token string
  isLoading: false,   // True during loginThunk API call
  error: null,        // Error message string (null = no error)
  isInitialized: false, // True after localStorage has been read on first load
}

// ── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called on app boot after reading localStorage
    initFromStorage(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isInitialized = true
    },
    // Called on app boot when there is nothing in localStorage
    setInitialized(state) {
      state.isInitialized = true
    },
    // Clear Redux + localStorage
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('pc_auth_token')
      localStorage.removeItem('pc_auth_user')
    },
    // Clear the error banner without logging out
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token

        // Persist token + user to survive page refresh
        if (action.payload.token) {
          localStorage.setItem('pc_auth_token', action.payload.token)
        }
        if (action.payload.user) {
          localStorage.setItem('pc_auth_user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload // human-readable string from rejectWithValue
      })
  },
})

export const { initFromStorage, setInitialized, logout, clearError } = authSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectCurrentUser   = (state) => state.auth.user
export const selectToken         = (state) => state.auth.token
export const selectAuthLoading   = (state) => state.auth.isLoading
export const selectAuthError     = (state) => state.auth.error
export const selectIsInitialized = (state) => state.auth.isInitialized
export const selectIsAuthenticated = (state) =>
  !!state.auth.token && !!state.auth.user

export default authSlice.reducer
