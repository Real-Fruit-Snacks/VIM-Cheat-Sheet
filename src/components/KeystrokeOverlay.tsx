import { useEffect, useState } from 'react'
import type { Keystroke, KeystrokeVisualizerConfig } from '../hooks/useKeystrokeVisualizer'

interface KeystrokeOverlayProps {
  keystrokes: Keystroke[]
  config: KeystrokeVisualizerConfig
}

export default function KeystrokeOverlay({ keystrokes, config }: KeystrokeOverlayProps) {
  const [visibleKeystrokes, setVisibleKeystrokes] = useState<(Keystroke & { opacity: number })[]>([])

  // Update visible keystrokes with opacity calculations
  useEffect(() => {
    const updateOpacities = () => {
      const now = Date.now()
      const updated = keystrokes.map(k => {
        const timeLeft = k.fadeOutAt - now
        const opacity = Math.max(0, Math.min(1, timeLeft / 500)) // Fade out over last 500ms
        return { ...k, opacity }
      }).filter(k => k.opacity > 0)

      setVisibleKeystrokes(updated)
    }

    updateOpacities()
    const interval = setInterval(updateOpacities, 50) // Update at 20fps

    return () => clearInterval(interval)
  }, [keystrokes])

  if (!config.enabled || visibleKeystrokes.length === 0) return null

  // Position classes
  const positionClasses = {
    'bottom-left': 'bottom-8 left-8',
    'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-8 right-8',
    'top-left': 'top-8 left-8',
    'top-center': 'top-8 left-1/2 -translate-x-1/2',
    'top-right': 'top-8 right-8'
  }

  // Font size classes
  const fontSizeClasses = {
    xs: 'text-xs',
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div
      className={`fixed z-50 pointer-events-none ${positionClasses[config.position]}`}
      style={{ isolation: 'isolate' }}
    >
      <div className="flex items-center gap-2">
        {visibleKeystrokes.map((keystroke, index) => (
          <div
            key={keystroke.id}
            className={`
              flex items-center gap-1 px-3 py-2 
              bg-gray-800/90 backdrop-blur-sm 
              border border-gray-700 rounded-lg 
              shadow-lg transition-all duration-300
              ${fontSizeClasses[config.fontSize]}
            `}
            style={{
              opacity: keystroke.opacity,
              transform: `translateY(${(1 - keystroke.opacity) * 10}px)`,
              animation: index === visibleKeystrokes.length - 1 ? 'keystroke-bounce 0.3s ease-out' : undefined
            }}
          >
            {/* Modifiers */}
            {keystroke.modifiers.map((mod, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center px-2 py-1 
                         bg-blue-600/20 text-blue-400 rounded 
                         font-mono font-semibold min-w-[2.5rem]"
              >
                {mod}
              </span>
            ))}
            
            {/* Separator */}
            {keystroke.modifiers.length > 0 && (
              <span className="text-gray-500">+</span>
            )}
            
            {/* Main key */}
            <span
              className="inline-flex items-center justify-center px-2 py-1 
                       bg-green-600/20 text-green-400 rounded 
                       font-mono font-semibold min-w-[2.5rem]"
            >
              {keystroke.key}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes keystroke-bounce {
          0% {
            transform: scale(0.8) translateY(10px);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) translateY(-2px);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}