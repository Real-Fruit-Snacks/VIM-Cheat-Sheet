import { useEffect, useRef } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

interface SwipeOptions {
  threshold?: number
  preventScroll?: boolean
  enabled?: boolean
}

export function useSwipeGesture(
  elementRef: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const {
    threshold = 50,
    preventScroll = false,
    enabled = true
  } = options

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!enabled || !elementRef.current) return

    const element = elementRef.current

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
      touchEnd.current = null
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault()
      }
      
      touchEnd.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
    }

    const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return

      const deltaX = touchEnd.current.x - touchStart.current.x
      const deltaY = touchEnd.current.y - touchStart.current.y
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Determine if it's a horizontal or vertical swipe
      if (absX > absY && absX > threshold) {
        // Horizontal swipe
        if (deltaX > 0) {
          handlers.onSwipeRight?.()
        } else {
          handlers.onSwipeLeft?.()
        }
      } else if (absY > absX && absY > threshold) {
        // Vertical swipe
        if (deltaY > 0) {
          handlers.onSwipeDown?.()
        } else {
          handlers.onSwipeUp?.()
        }
      }

      // Reset
      touchStart.current = null
      touchEnd.current = null
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [elementRef, handlers, threshold, preventScroll, enabled])
}