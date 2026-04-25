import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchMyProjectsApi } from '@services/projectService'

// ── Async thunk ───────────────────────────────────────────────────────────────

export const fetchMyProjects = createAsyncThunk(
  'projects/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMyProjectsApi()
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load projects.')
    }
  },
  {
    // Skip the network call if the list is already populated and there is no
    // error — satisfies the "do not refetch unnecessarily on page refresh"
    // bonus requirement.
    condition: (_, { getState }) => {
      const { projects } = getState()
      return projects.list.length === 0 || !!projects.error
    },
  }
)

// ── Slice ─────────────────────────────────────────────────────────────────────

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],        // Array of project objects from the API
    isLoading: false,
    error: null,
  },
  reducers: {
    // Manually clear projects (e.g. after logout)
    clearProjects(state) {
      state.list = []
      state.error = null
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchMyProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to load projects.'
      })
      // Auto-clear projects when the user logs out
      // Using the string action type avoids importing authSlice (circular dep)
      .addCase('auth/logout', (state) => {
        state.list = []
        state.error = null
      })
  },
})

export const { clearProjects } = projectsSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectProjects        = (state) => state.projects.list
export const selectProjectsLoading = (state) => state.projects.isLoading
export const selectProjectsError   = (state) => state.projects.error

export default projectsSlice.reducer
