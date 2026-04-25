import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useChat } from '@hooks/useChat'
import {
  fetchMyProjects,
  selectProjects,
  selectProjectsLoading,
  selectProjectsError,
} from '@store/slices/projectsSlice'

// Normalise the status field so both "Active" (API) and "active" (mock)
// map to a consistent lowercase value for CSS class and colour logic.
function normalizeStatus(status) {
  return status?.toLowerCase() ?? 'inactive'
}

export default function ProjectSelector({ shakeRef }) {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const { activeTab, activeTabId, setTabProject } = useChat()

  // ── Redux state ────────────────────────────────────────────────────────────
  const projects       = useSelector(selectProjects)
  const isLoading      = useSelector(selectProjectsLoading)
  const projectsError  = useSelector(selectProjectsError)

  // The currently selected project object (from API list or undefined)
  const selectedProject = projects.find(p => p.id === activeTab?.projectId)

  // ── Fetch on mount ─────────────────────────────────────────────────────────
  // The thunk's condition guard prevents duplicate network calls if the list
  // is already populated.
  useEffect(() => {
    dispatch(fetchMyProjects())
  }, [dispatch])

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    function onMouseDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // ── Selection handler ─────────────────────────────────────────────────────
  function select(project) {
    // Pass the project name so ChatContext can auto-rename the tab
    setTabProject(activeTabId, project.id, project.name)
    setIsOpen(false)
  }

  // ── Retry after error ─────────────────────────────────────────────────────
  function handleRetry() {
    // Clear the cached error so the condition guard lets the thunk run again
    dispatch({ type: 'projects/clearProjects' })
    dispatch(fetchMyProjects())
  }

  // ── Derived UI values ─────────────────────────────────────────────────────
  const statusColor = selectedProject
    ? normalizeStatus(selectedProject.status) === 'active' ? '#10b981' : 'var(--text-muted)'
    : 'var(--text-muted)'

  const triggerLabel = isLoading
    ? 'Loading projects…'
    : selectedProject?.name ?? 'Select a project'

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>

      {/* ── Trigger button ── */}
      <button
        ref={shakeRef}
        onClick={() => { if (!isLoading) setIsOpen(v => !v) }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select project"
        disabled={isLoading}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '5px 12px', borderRadius: 'var(--radius-full)',
          border: `1px solid ${isOpen ? 'var(--violet-500)' : 'var(--border)'}`,
          background: 'rgba(139,92,246,0.06)',
          fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
          transition: 'var(--transition)',
          boxShadow: isOpen ? '0 0 0 3px rgba(139,92,246,0.15)' : 'none',
          color: selectedProject ? 'var(--text-primary)' : 'var(--text-muted)',
        }}
      >
        {/* Status dot / spinner */}
        {isLoading ? (
          <span
            className="spinner spinner-sm"
            style={{ width: '10px', height: '10px', flexShrink: 0 }}
            aria-hidden="true"
          />
        ) : (
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            flexShrink: 0, background: statusColor,
          }} />
        )}

        <span>{triggerLabel}</span>

        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="2"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease', flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available projects"
          style={{
            position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
            padding: '6px', minWidth: '240px', maxHeight: '280px', overflowY: 'auto',
            zIndex: 100,
            animation: 'scaleIn 0.15s cubic-bezier(0.34,1.56,0.64,1)',
            transformOrigin: 'bottom left',
          }}
        >
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            padding: '6px 10px', letterSpacing: '0.07em',
          }}>
            Your Projects
          </div>

          {/* Error state */}
          {projectsError ? (
            <div style={{ padding: '14px 12px', textAlign: 'center' }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                color: 'var(--danger)', marginBottom: '8px', lineHeight: 1.5,
              }}>
                {projectsError}
              </div>
              <button
                onClick={handleRetry}
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '5px 14px' }}
              >
                Retry
              </button>
            </div>

          /* Loading state (shouldn't normally show since dropdown is disabled
             while loading, but kept as a safety net) */
          ) : isLoading ? (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '16px 12px',
              fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
              color: 'var(--text-muted)',
            }}>
              <span className="spinner spinner-sm" aria-hidden="true" />
              Loading projects…
            </div>

          /* Empty state */
          ) : projects.length === 0 ? (
            <div style={{
              padding: '16px 12px', textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
              color: 'var(--text-muted)',
            }}>
              No projects assigned to your account
            </div>

          /* Project list */
          ) : (
            projects.map(project => {
              const isSelected = project.id === activeTab?.projectId
              const dotColor   = normalizeStatus(project.status) === 'active'
                ? '#10b981' : 'var(--text-muted)'

              return (
                <div
                  key={project.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(project)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', transition: 'var(--transition-fast)',
                    background: isSelected ? 'rgba(139,92,246,0.1)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(139,92,246,0.06)' }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      flexShrink: 0, background: dotColor,
                    }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
                        color: isSelected ? 'var(--violet-500)' : 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {project.name}
                      </div>
                      {/* Datasource count badge */}
                      {Array.isArray(project.datasources) && project.datasources.length > 0 && (
                        <div style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                          color: 'var(--text-muted)', marginTop: '2px',
                        }}>
                          {project.datasources.length} datasource{project.datasources.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="var(--violet-500)" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
