export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
    }}>
      {icon && (
        <div style={{ color: 'var(--violet-300)', marginBottom: '16px' }}>
          {icon}
        </div>
      )}
      {title && (
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500,
          color: 'var(--text-primary)', margin: 0,
        }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
          color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5,
        }}>
          {subtitle}
        </p>
      )}
      {action && (
        <button
          className={`btn btn-${action.variant ?? 'primary'}`}
          onClick={action.onClick}
          style={{ marginTop: '20px' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
