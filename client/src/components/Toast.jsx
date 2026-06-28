import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext({ notify: () => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const handle = timers.current.get(id)
    if (handle) {
      clearTimeout(handle)
      timers.current.delete(id)
    }
  }, [])

  const notify = useCallback((message, opts = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const tone = opts.tone || 'default'
    setToasts(prev => [...prev, { id, message, tone }])
    const handle = setTimeout(() => dismiss(id), opts.duration ?? 2400)
    timers.current.set(id, handle)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite" aria-atomic="false">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
