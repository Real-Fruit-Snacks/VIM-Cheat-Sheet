import { useState, useEffect } from 'react'
import { safeGetItem, safeSetItem } from '../utils/safeStorage'

type Theme = 'light' | 'dark'

export function useTheme() {
  // Initialize theme from storage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = safeGetItem('vim-cheatsheet-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
    
    return 'dark' // Default to dark theme
  })
  
  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    safeSetItem('vim-cheatsheet-theme', theme)
  }, [theme])
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a theme
      const savedTheme = safeGetItem('vim-cheatsheet-theme')
      if (!savedTheme) {
        setTheme(e.matches ? 'light' : 'dark')
      }
    }
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return { theme, toggleTheme }
}