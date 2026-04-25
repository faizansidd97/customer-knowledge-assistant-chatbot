import apiClient from './apiClient'

/**
 * Extract plain-text content from a typical RAG / chat API response body.
 * Handles a few common field names; extend here if the backend shape is fixed.
 */
function extractAiText(payload) {
  if (payload == null) return ''
  if (typeof payload === 'string') return payload

  const p = payload
  const nested =
    p.response ?? p.message ?? p.text ?? p.content ?? p.answer ?? p.data ?? p.result
  if (typeof nested === 'string') return nested
  if (nested && typeof nested === 'object' && typeof nested !== 'string') {
    return (
      nested.text ??
      nested.content ??
      nested.message ??
      String(nested)
    )
  }
  return typeof payload === 'object' ? JSON.stringify(payload) : String(payload)
}

/**
 * POST /ai/rag
 * Body: { "message": "<user message>" }
 * Returns the AI reply as a string, or throws on network / HTTP error.
 */
export async function sendMessageToAI(message) {
  const { data } = await apiClient.post('/ai/rag', { message })
  return extractAiText(data)
}
