import { useState, useEffect } from 'react'
import { safeGetItem, safeSetItem } from '../utils/safeStorage'

type Theme = 'light' | 'dark'

export function useTheme() {
  // Helper function to safely check system theme preference
  const getSystemTheme = (): Theme => {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light'
      }
    } catch (error) {
      console.warn('matchMedia blocked, defaulting to dark theme:', error)
    }
    return 'dark' // Default to dark theme if matchMedia is blocked
  }

  // Initialize theme from storage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = safeGetItem('vim-cheatsheet-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    
    // Check system preference with fallback
    return getSystemTheme()
  })
  
  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    safeSetItem('vim-cheatsheet-theme', theme)
  }, [theme])
  
  // Listen for system theme changes
  useEffect(() => {
    try {
      // Only set up listener if matchMedia is available
      if (!window.matchMedia) {
        return // No cleanup needed
      }
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        try {
          // Only update if user hasn't explicitly set a theme
          const savedTheme = safeGetItem('vim-cheatsheet-theme')
          if (!savedTheme) {
            setTheme(e.matches ? 'light' : 'dark')
          }
        } catch (error) {
          console.warn('Error handling theme change:', error)
        }
      }
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => {
          try {
            mediaQuery.removeEventListener('change', handleChange)
          } catch (error) {
            console.warn('Error removing theme listener:', error)
          }
        }
      } 
      // Fallback for older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange)
        return () => {
          try {
            mediaQuery.removeListener(handleChange)
          } catch (error) {
            console.warn('Error removing theme listener:', error)
          }
        }
      }
    } catch (error) {
      console.warn('matchMedia blocked, theme auto-switching disabled:', error)
      // No cleanup needed if setup failed
    }
  }, [])
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return { theme, toggleTheme }
}