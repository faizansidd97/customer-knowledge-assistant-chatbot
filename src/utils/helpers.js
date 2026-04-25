export function getInitials(fullName) {
  if (!fullName) return ''
  return fullName
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase())
    .join('')
    .slice(0, 2)
}

export function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatRelativeTime(date) {
  const d = date instanceof Date ? date : new Date(date)
  const now = Date.now()
  const diff = now - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds} seconds ago`
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function parseMarkdown(text) {
  if (!text) return ''

  // Escape HTML special chars first (basic safety)
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Process line by line for list handling
  const lines = html.split('\n')
  const result = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Bold: **text**
    line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

    // Italic with asterisks: *(text)* — avoid conflict with bold
    line = line.replace(/\*(?!\*)(.+?)(?<!\*)\*/g, '<em>$1</em>')

    // Inline code: `code`
    line = line.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

    // List item
    if (/^- (.+)/.test(line)) {
      if (!inList) {
        result.push('<ul style="padding-left:16px;margin:8px 0">')
        inList = true
      }
      result.push(`<li style="margin-bottom:4px;list-style:disc">${line.replace(/^- /, '')}</li>`)
    } else {
      if (inList) {
        result.push('</ul>')
        inList = false
      }
      if (line.trim() === '') {
        result.push('<br />')
      } else {
        result.push(line + (i < lines.length - 1 ? '' : ''))
      }
    }
  }

  if (inList) result.push('</ul>')

  // Join and add line breaks for non-list consecutive lines
  return result.join('\n').replace(/([^>])\n([^<])/g, '$1<br />$2')
}
