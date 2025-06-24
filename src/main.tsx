import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initializeRestrictedBrowserSupport } from './utils/restrictedBrowserSupport'
import { autoTestRestrictedBrowser } from './utils/restrictedBrowserTest'

// Initialize support for restricted browser environments
initializeRestrictedBrowserSupport()

// Run compatibility tests in development or when requested
autoTestRestrictedBrowser().catch(error => {
  console.warn('Auto-test failed:', error)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
