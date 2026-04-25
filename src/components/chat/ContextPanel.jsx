import { useChat } from '@hooks/useChat'
import { MOCK_USERS } from '@utils/mockData'

// Normalise "Active" (API) and "active" (mock) to a consistent lowercase value.
function normalizeStatus(status) {
  return status?.toLowerCase() ?? 'inactive'
}

// Datasources can be either:
//   API shape  → array of objects: [{ datasourceId, datasourceName, ... }]
//   Mock shape → array of strings: ["jira", "github"]
// Returns a uniform array of { key, label } objects for rendering.
function normalizeDatasources(datasources) {
  if (!Array.isArray(datasources) || datasources.length === 0) return []
  if (typeof datasources[0] === 'string') {
    return datasources.map(ds => ({ key: ds, label: ds }))
  }
  return datasources.map(ds => ({
    key: String(ds.datasourceId ?? ds.datasourceName),
    label: ds.datasourceName ?? `Source ${ds.datasourceId}`,
  }))
}

export default function ContextPanel({ isOpen }) {
  const { activeProject } = useChat()

  // Members are only available on mock data (real API doesn't return memberIds)
  const members = activeProject?.memberIds
    ? activeProject.memberIds
        .map(id => MOCK_USERS.find(u => u.id === id))
        .filter(Boolean)
    : []

  const datasources = normalizeDatasources(activeProject?.datasources)
  const status      = normalizeStatus(activeProject?.status)
  // Stats only present on mock data
  const stats       = activeProject?.stats ?? null
  // Recent activity only present on mock data
  const activity    = activeProject?.recentActivity ?? null

  return (
    <aside
      className={`context-panel${isOpen ? ' open' : ''}`}
      aria-label="Project context"
      style={{
        width: 'var(--context-panel-width)',
        height: '100vh',
        overflowY: 'auto',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
        padding: '20px 16px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!activeProject ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '40px 16px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="var(--violet-300)" strokeWidth="1.5" style={{ margin: '0 auto' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-muted)', marginTop: '12px' }}>
            No project selected
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
            Select a project to see context
          </p>
        </div>
      ) : (
        <>
          {/* ── Section 1: Project Info ── */}
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {activeProject.name}
            </h3>
            <span
              className={`badge badge-${status === 'active' ? 'active' : 'inactive'}`}
              style={{ marginTop: '6px' }}
            >
              {status === 'active' ? '● Active' : '● Inactive'}
            </span>
            {activeProject.description && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.6 }}>
                {activeProject.description}
              </p>
            )}
          </div>

          {/* ── Section 2: Datasources ── */}
          {datasources.length > 0 && (
            <>
              <Divider />
              <div>
                <SectionHeader>Datasources</SectionHeader>
                {datasources.map(ds => (
                  <div key={ds.key} style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '8px', marginBottom: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                        {ds.label}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--success)' }}>
                      Connected
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Section 3: Team (mock data only) ── */}
          {members.length > 0 && (
            <>
              <Divider />
              <div>
                <SectionHeader>Team Members</SectionHeader>
                {members.slice(0, 3).map(user => (
                  <div key={user.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                    <div className="avatar avatar-sm" aria-hidden="true">{user.initials}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {user.fullName}
                      </div>
                      <span className="badge badge-role" style={{ fontSize: '10px', marginTop: '2px' }}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
                {members.length > 3 && (
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)' }}>
                    + {members.length - 3} more members
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Section 4: Quick Stats (mock data only) ── */}
          {stats && (
            <>
              <Divider />
              <div>
                <SectionHeader>Quick Stats</SectionHeader>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Open Issues',  value: stats.openIssues },
                    { label: 'Sprint %',     value: `${stats.sprintProgress}%` },
                    { label: 'Team Size',    value: stats.teamSize },
                    { label: 'Velocity',     value: stats.velocity },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)', padding: '12px',
                    }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 600, color: 'var(--violet-500)' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Section 5: Recent Activity (mock data only) ── */}
          {activity && activity.length > 0 && (
            <>
              <Divider />
              <div>
                <SectionHeader>Recent Activity</SectionHeader>
                {activity.slice(0, 5).map((act, i) => {
                  const user = MOCK_USERS.find(u => u.id === act.userId)
                  return (
                    <div key={i} style={{
                      display: 'flex', gap: '8px', marginBottom: '10px',
                      borderLeft: '2px solid var(--border)', paddingLeft: '10px',
                    }}>
                      {user && (
                        <div className="avatar avatar-sm" style={{ flexShrink: 0 }} aria-hidden="true">
                          {user.initials}
                        </div>
                      )}
                      <div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                          {act.action}
                        </div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {act.time}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </aside>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0' }} />
}

function SectionHeader({ children }) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500,
      textTransform: 'uppercase', color: 'var(--text-muted)',
      letterSpacing: '0.07em', marginBottom: '10px',
    }}>
      {children}
    </div>
  )
}
