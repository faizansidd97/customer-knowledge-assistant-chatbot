export default function Spinner({ size = 'md', color }) {
  const sizeClass = `spinner-${size}`
  return (
    <div
      className={`spinner ${sizeClass}`}
      style={color ? { borderTopColor: color } : undefined}
      role="status"
      aria-label="Loading"
    />
  )
}
