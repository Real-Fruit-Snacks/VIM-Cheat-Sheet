/**
 * Comprehensive test suite for restricted browser compatibility
 * Tests all fallback mechanisms and safety features
 */

import { 
  detectRestrictedEnvironment, 
  safeConsole, 
  safeExecute,
  featureDetection
} from './restrictedBrowserSupport'
import { 
  safeGetItem, 
  safeSetItem, 
  safeCopyToClipboard, 
  isLocalStorageAvailable,
  getStorageStats 
} from './safeStorage'

export interface RestrictedBrowserTestResult {
  passed: boolean
  testName: string
  result: any
  error?: string
}

export interface RestrictedBrowserTestSuite {
  overall: boolean
  results: RestrictedBrowserTestResult[]
  environment: {
    isRestricted: boolean
    restrictions: string[]
    features: Record<string, boolean>
  }
  recommendations: string[]
}

/**
 * Run a comprehensive test of all restricted browser features
 */
export async function runRestrictedBrowserTests(): Promise<RestrictedBrowserTestSuite> {
  const results: RestrictedBrowserTestResult[] = []
  const recommendations: string[] = []

  // Test 1: Environment Detection
  const envTest: RestrictedBrowserTestResult = safeExecute((): RestrictedBrowserTestResult => {
    const detection = detectRestrictedEnvironment()
    return {
      passed: true,
      testName: 'Environment Detection',
      result: detection
    }
  }, {
    passed: false,
    testName: 'Environment Detection',
    result: { isRestricted: false, restrictions: [] },
    error: 'Environment detection failed'
  } as RestrictedBrowserTestResult)
  results.push(envTest)

  // Test 2: Safe Console
  const consoleTest: RestrictedBrowserTestResult = safeExecute((): RestrictedBrowserTestResult => {
    safeConsole.log('Test log message')
    safeConsole.warn('Test warning message')
    safeConsole.error('Test error message')
    return {
      passed: true,
      testName: 'Safe Console',
      result: 'All console methods executed without errors'
    }
  }, {
    passed: false,
    testName: 'Safe Console',
    result: 'Console operations failed',
    error: 'Console operations failed'
  } as RestrictedBrowserTestResult)
  results.push(consoleTest)

  // Test 3: Local Storage
  const storageTest: RestrictedBrowserTestResult = safeExecute((): RestrictedBrowserTestResult => {
    const testKey = 'restricted_browser_test'
    const testValue = 'test_value_' + Date.now()
    
    const setResult = safeSetItem(testKey, testValue)
    const getValue = safeGetItem(testKey)
    const isAvailable = isLocalStorageAvailable()
    const stats = getStorageStats()
    
    // Cleanup
    safeExecute(() => {
      if (isAvailable) {
        localStorage.removeItem(testKey)
      }
    }, undefined)
    
    return {
      passed: getValue === testValue,
      testName: 'Local Storage',
      result: {
        setValue: setResult,
        getValue: getValue,
        isAvailable: isAvailable,
        stats: stats
      }
    }
  }, {
    passed: false,
    testName: 'Local Storage',
    result: {
      setValue: false,
      getValue: null,
      isAvailable: false,
      stats: {
        localStorageAvailable: false,
        memoryStorageSize: 0,
        totalKeys: 0
      }
    },
    error: 'Storage operations failed'
  } as RestrictedBrowserTestResult)
  results.push(storageTest)

  // Test 4: Clipboard API
  let clipboardTest: RestrictedBrowserTestResult
  try {
    const testText = 'Restricted browser clipboard test'
    const result = await safeCopyToClipboard(testText)
    
    clipboardTest = {
      passed: result.success || result.fallbackUI || false,
      testName: 'Clipboard API',
      result: result
    }
  } catch (error) {
    clipboardTest = {
      passed: false,
      testName: 'Clipboard API',
      result: {
        success: false,
        method: 'all-failed',
        fallbackUI: false,
        userActionRequired: true
      },
      error: 'Clipboard operations failed'
    }
  }
  results.push(clipboardTest)

  // Test 5: Feature Detection
  const featureTest: RestrictedBrowserTestResult = safeExecute((): RestrictedBrowserTestResult => {
    const features = {
      localStorage: featureDetection.hasLocalStorage(),
      serviceWorkers: featureDetection.hasServiceWorkers(),
      clipboardAPI: featureDetection.hasClipboardAPI(),
      indexedDB: featureDetection.hasIndexedDB(),
      webWorkers: featureDetection.hasWebWorkers(),
      webGL: featureDetection.hasWebGL()
    }
    
    return {
      passed: true,
      testName: 'Feature Detection',
      result: features
    }
  }, {
    passed: false,
    testName: 'Feature Detection',
    result: {
      localStorage: false,
      serviceWorkers: false,
      clipboardAPI: false,
      indexedDB: false,
      webWorkers: false,
      webGL: false
    },
    error: 'Feature detection failed'
  } as RestrictedBrowserTestResult)
  results.push(featureTest)

  // Test 6: DOM Manipulation Safety
  const domTest: RestrictedBrowserTestResult = safeExecute((): RestrictedBrowserTestResult => {
    const testDiv = document.createElement('div')
    testDiv.style.display = 'none'
    testDiv.textContent = 'Test element'
    
    const appendSuccess = safeExecute(() => {
      document.body.appendChild(testDiv)
      return true
    }, false)
    
    const removeSuccess = safeExecute(() => {
      document.body.removeChild(testDiv)
      return true
    }, false)
    
    return {
      passed: appendSuccess && removeSuccess,
      testName: 'DOM Manipulation',
      result: {
        appendChild: appendSuccess,
        removeChild: removeSuccess
      }
    }
  }, {
    passed: false,
    testName: 'DOM Manipulation',
    result: {
      appendChild: false,
      removeChild: false
    },
    error: 'DOM manipulation failed'
  } as RestrictedBrowserTestResult)
  results.push(domTest)

  // Test 7: Event Handling
  const eventTest: RestrictedBrowserTestResult = safeExecute((): RestrictedBrowserTestResult => {
    let eventFired = false
    const testHandler = () => { eventFired = true }
    
    const addSuccess = safeExecute(() => {
      document.addEventListener('test-restricted-browser', testHandler)
      return true
    }, false)
    
    const fireSuccess = safeExecute(() => {
      document.dispatchEvent(new CustomEvent('test-restricted-browser'))
      return true
    }, false)
    
    const removeSuccess = safeExecute(() => {
      document.removeEventListener('test-restricted-browser', testHandler)
      return true
    }, false)
    
    return {
      passed: addSuccess && fireSuccess && removeSuccess && eventFired,
      testName: 'Event Handling',
      result: {
        addEventListener: addSuccess,
        dispatchEvent: fireSuccess,
        removeEventListener: removeSuccess,
        eventFired: eventFired
      }
    }
  }, {
    passed: false,
    testName: 'Event Handling',
    result: {
      addEventListener: false,
      dispatchEvent: false,
      removeEventListener: false,
      eventFired: false
    },
    error: 'Event handling failed'
  } as RestrictedBrowserTestResult)
  results.push(eventTest)

  // Generate Recommendations
  const environment = envTest.result || { restrictions: [], isRestricted: false }
  
  if (environment.restrictions.includes('localStorage')) {
    recommendations.push('localStorage is blocked - favorites and settings will be stored in memory only')
  }
  
  if (environment.restrictions.includes('serviceWorker')) {
    recommendations.push('Service Workers blocked - offline functionality limited')
  }
  
  if (environment.restrictions.includes('clipboardAPI')) {
    recommendations.push('Clipboard API blocked - copy operations will use fallback methods')
  }
  
  if (environment.restrictions.includes('eval')) {
    recommendations.push('Strict CSP detected - all unsafe operations disabled')
  }
  
  if (!storageTest.passed) {
    recommendations.push('Consider bookmarking important commands as browser storage is limited')
  }
  
  if (!clipboardTest.passed) {
    recommendations.push('Manual copy/paste may be required for commands')
  }

  // Overall pass/fail
  const criticalTests = ['Environment Detection', 'Safe Console', 'Local Storage']
  const criticalPassed = results
    .filter(r => criticalTests.includes(r.testName))
    .every(r => r.passed)

  return {
    overall: criticalPassed,
    results,
    environment: {
      isRestricted: environment.isRestricted,
      restrictions: environment.restrictions,
      features: featureTest.result || {}
    },
    recommendations
  }
}

/**
 * Display test results in a user-friendly format
 */
export function displayTestResults(testSuite: RestrictedBrowserTestSuite): void {
  safeConsole.log('=== Restricted Browser Compatibility Test Results ===')
  safeConsole.log(`Overall Status: ${testSuite.overall ? 'PASS' : 'FAIL'}`)
  safeConsole.log(`Environment Restricted: ${testSuite.environment.isRestricted}`)
  
  if (testSuite.environment.restrictions.length > 0) {
    safeConsole.log('Detected Restrictions:', testSuite.environment.restrictions.join(', '))
  }
  
  safeConsole.log('\nIndividual Test Results:')
  testSuite.results.forEach(result => {
    const status = result.passed ? '✓ PASS' : '✗ FAIL'
    const error = result.error ? ` (${result.error})` : ''
    safeConsole.log(`  ${status} - ${result.testName}${error}`)
  })
  
  if (testSuite.recommendations.length > 0) {
    safeConsole.log('\nRecommendations:')
    testSuite.recommendations.forEach(rec => {
      safeConsole.log(`  • ${rec}`)
    })
  }
  
  safeConsole.log('\nFeature Availability:')
  Object.entries(testSuite.environment.features).forEach(([feature, available]) => {
    const status = available ? '✓' : '✗'
    safeConsole.log(`  ${status} ${feature}`)
  })
}

/**
 * Auto-run tests on app initialization (only in development)
 */
export async function autoTestRestrictedBrowser(): Promise<void> {
  // Only run in development or when explicitly requested
  if (process.env.NODE_ENV === 'development' || 
      window.location.search.includes('test-restricted')) {
    
    try {
      const results = await runRestrictedBrowserTests()
      displayTestResults(results)
      
      // Store results for debugging
      safeSetItem('restricted_browser_test_results', JSON.stringify(results))
      
    } catch (error) {
      safeConsole.error('Restricted browser test failed:', error)
    }
  }
}