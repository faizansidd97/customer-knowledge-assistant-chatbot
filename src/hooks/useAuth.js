import { useAuthContext } from '@context/AuthContext'

export function useAuth() {
  const ctx = useAuthContext()

  // isAuthenticated: true only when both a user object AND a token are present
  const isAuthenticated = !!ctx.currentUser && !!ctx.token

  return { ...ctx, isAuthenticated }
}
