import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Start fade-out animation 300ms before removal
    const fadeTimer = setTimeout(() => {
      setIsExiting(true)
    }, duration - 300)

    // Remove toast after fade-out completes
    const removeTimer = setTimeout(onClose, duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-400" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-700'
      case 'error':
        return 'bg-red-900 border-red-700'
      case 'warning':
        return 'bg-yellow-900 border-yellow-700'
      case 'info':
        return 'bg-blue-900 border-blue-700'
    }
  }

  return (
    <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg ${getStyles()} ${
      isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
    }`}>
      {getIcon()}
      <p className="flex-1 text-sm text-gray-100">{message}</p>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-20 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  )
}