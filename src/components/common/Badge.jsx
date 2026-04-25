export default function Badge({ children, variant = 'role' }) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  )
}
