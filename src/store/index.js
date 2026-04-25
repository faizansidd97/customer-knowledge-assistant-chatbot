import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import projectsReducer from './slices/projectsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
  },
  devTools: import.meta.env.DEV,
})

export default store
