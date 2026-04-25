const CHIPS = [
  'Summarize this project',
  'Show open issues',
  "What's the sprint status?",
  'Who is on the team?',
  'What are upcoming deadlines?',
  'Check datasource connections',
]

export default function SuggestionChips({ onSelect }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      justifyContent: 'center',
    }}>
      {CHIPS.map(chip => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          style={{
            padding: '9px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
            background: 'transparent',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'var(--transition-bounce)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
            e.currentTarget.style.borderColor = 'var(--violet-400)'
            e.currentTarget.style.color = 'var(--violet-600)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
