import { useEffect, useState, useRef } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
  index?: number
}

export function Toast({ message, type, onClose, duration = 4000, index = 0 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(100)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const remainingTimeRef = useRef<number>(duration)

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10 + (index * 50))
    
    return () => clearTimeout(enterTimer)
  }, [index])

  useEffect(() => {
    if (!isVisible || isPaused) return

    const startAnimation = () => {
      startTimeRef.current = Date.now()
      
      const updateProgress = () => {
        if (isPaused) return
        
        const elapsed = Date.now() - startTimeRef.current
        const remaining = Math.max(0, 100 - (elapsed / remainingTimeRef.current) * 100)
        setProgress(remaining)
        
        if (remaining > 0 && !isPaused) {
          progressRef.current = setTimeout(updateProgress, 30)
        }
      }
      
      updateProgress()
      
      // Set dismiss timer
      dismissTimerRef.current = setTimeout(() => {
        if (!isPaused) {
          handleClose()
        }
      }, remainingTimeRef.current)
    }

    startAnimation()

    return () => {
      if (progressRef.current) clearTimeout(progressRef.current)
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    }
  }, [isVisible, isPaused, duration])

  const handleMouseEnter = () => {
    setIsPaused(true)
    if (progressRef.current) clearTimeout(progressRef.current)
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    
    // Calculate remaining time based on progress
    remainingTimeRef.current = (progress / 100) * duration
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0"
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-status-success ${isVisible && !isExiting ? 'animate-icon-bounce' : ''}`} />
      case 'error':
        return <XCircle className={`${iconClass} text-status-error ${isVisible && !isExiting ? 'animate-icon-bounce' : ''}`} />
      case 'warning':
        return <AlertCircle className={`${iconClass} text-status-warning ${isVisible && !isExiting ? 'animate-icon-bounce' : ''}`} />
      case 'info':
        return <Info className={`${iconClass} text-status-info ${isVisible && !isExiting ? 'animate-icon-bounce' : ''}`} />
    }
  }

  const getGradient = () => {
    switch (type) {
      case 'success':
        return 'from-green-500/10 via-green-500/5 to-transparent'
      case 'error':
        return 'from-red-500/10 via-red-500/5 to-transparent'
      case 'warning':
        return 'from-amber-500/10 via-amber-500/5 to-transparent'
      case 'info':
        return 'from-blue-500/10 via-blue-500/5 to-transparent'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-green-500/30'
      case 'error': return 'border-red-500/30'
      case 'warning': return 'border-amber-500/30'
      case 'info': return 'border-blue-500/30'
    }
  }

  const getProgressColor = () => {
    switch (type) {
      case 'success': return 'bg-status-success'
      case 'error': return 'bg-status-error'
      case 'warning': return 'bg-status-warning'
      case 'info': return 'bg-status-info'
    }
  }

  const getShadow = () => {
    switch (type) {
      case 'success': return 'shadow-green-500/20'
      case 'error': return 'shadow-red-500/20'
      case 'warning': return 'shadow-amber-500/20'
      case 'info': return 'shadow-blue-500/20'
    }
  }

  return (
    <div
      className={`
        ${isVisible && !isExiting ? 'animate-toast-in' : ''}
        ${isExiting ? 'animate-toast-out' : ''}
        ${!isVisible && !isExiting ? 'opacity-0 translate-x-full' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`
        relative overflow-hidden
        bg-background-secondary/80 backdrop-blur-xl
        bg-gradient-to-r ${getGradient()}
        border ${getBorderColor()}
        rounded-xl
        shadow-2xl ${getShadow()}
        min-w-[350px] max-w-md
        transform transition-all duration-200
        ${isPaused ? 'scale-105' : 'scale-100'}
        hover:shadow-3xl
      `}>
        {/* Content */}
        <div className="flex items-start gap-3.5 p-4 pr-12">
          <div className="mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-100 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className={`
            absolute top-3 right-3
            text-gray-500 hover:text-gray-300
            transition-all duration-200
            p-1.5 rounded-lg
            hover:bg-gray-800/50
            group
          `}
          aria-label="Close notification"
        >
          <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/30 overflow-hidden">
          <div
            className={`
              h-full ${getProgressColor()}
              transition-all duration-300 ease-linear
              ${isPaused ? 'opacity-50' : 'opacity-100'}
            `}
            style={{ 
              width: `${progress}%`,
              boxShadow: `0 0 10px currentColor`
            }}
          />
        </div>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast, index) => (
          <div key={toast.id} className="mb-3">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => onClose(toast.id)}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  )
}