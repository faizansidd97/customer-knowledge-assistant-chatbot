import { useState } from 'react'

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  function set(newValue) {
    const val = typeof newValue === 'function' ? newValue(value) : newValue
    setValue(val)
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      // ignore storage errors
    }
  }

  return [value, set]
}
