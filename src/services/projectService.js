import apiClient from './apiClient'

/**
 * GET /api/management/projects/my
 * Returns the list of projects assigned to the currently authenticated user.
 * The Authorization header is automatically attached by the apiClient interceptor.
 */
export async function fetchMyProjectsApi() {
  const response = await apiClient.get('/api/management/projects/my')
  return response.data // Array<Project>
}
