import apiClient from './apiClient'

/**
 * POST /login
 * Payload: { username, password }
 *
 * Returns a normalized object regardless of what field names
 * the server uses for the token / user data.
 */
export async function loginApi(username, password) {
  const response = await apiClient.post('/api/auth/login', { username, password })
  const data = response.data

  // Normalize common token field names
  const token =
    data.token ??
    data.access_token ??
    data.accessToken ??
    data.jwt ??
    null

  // Normalize common user field names
  const user =
    data.user ??
    data.userData ??
    data.profile ??
    // Some APIs return user fields directly in the root object
    (data.id || data.username
      ? {
          id: data.id,
          username: data.username,
          fullName: data.fullName ?? data.full_name ?? data.name ?? data.username,
          email: data.email ?? '',
          role: data.role ?? data.userType ?? 'User',
          initials: getInitials(data.fullName ?? data.full_name ?? data.name ?? data.username ?? ''),
        }
      : null)

  return { token, user, raw: data }
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 2)
}
