/**
 * Browser Compatibility Test Suite
 * Tests the progressive fallback system with Puppeteer in different browser modes
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BrowserCompatibilityTester {
  constructor() {
    this.results = {
      normal: null,
      private: null,
      restricted: null,
      timestamp: new Date().toISOString(),
      testDuration: 0
    };
    this.devServer = null;
    this.serverReady = false;
    this.serverPort = '5173'; // Default port
  }

  async startDevServer() {
    console.log('🚀 Starting development server...');
    
    return new Promise((resolve, reject) => {
      this.devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        detached: false
      });

      let output = '';
      
      this.devServer.stdout.on('data', (data) => {
        output += data.toString();
        console.log(`[Dev Server] ${data.toString().trim()}`);
        
        // Look for the port number in the output
        const portMatch = data.toString().match(/Local:\s+http:\/\/localhost:(\d+)/);
        if (portMatch) {
          this.serverPort = portMatch[1];
          console.log(`📍 Server detected on port: ${this.serverPort}`);
        }
        
        // Look for the "ready" message
        if (data.toString().includes('ready in') || data.toString().includes('Local:')) {
          console.log('✅ Development server is ready');
          this.serverReady = true;
          setTimeout(resolve, 2000); // Give server extra time to fully initialize
        }
      });

      this.devServer.stderr.on('data', (data) => {
        console.error(`[Dev Server Error] ${data.toString().trim()}`);
      });

      this.devServer.on('error', (error) => {
        console.error('Failed to start dev server:', error);
        reject(error);
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!this.serverReady) {
          reject(new Error('Dev server failed to start within 30 seconds'));
        }
      }, 30000);
    });
  }

  async stopDevServer() {
    if (this.devServer) {
      console.log('🛑 Stopping development server...');
      this.devServer.kill('SIGTERM');
      
      // Force kill after 5 seconds if it doesn't stop gracefully
      setTimeout(() => {
        if (this.devServer) {
          this.devServer.kill('SIGKILL');
        }
      }, 5000);
    }
  }

  async testBrowserMode(mode = 'normal') {
    console.log(`\n🧪 Testing ${mode} browser mode...`);
    
    let browserArgs = ['--disable-dev-shm-usage', '--no-sandbox'];
    
    if (mode === 'private') {
      browserArgs.push(
        '--incognito',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      );
    } else if (mode === 'restricted') {
      // Artificially restrict browser capabilities to test fallbacks
      browserArgs.push(
        '--disable-web-security',
        '--disable-features=SharedArrayBuffer,VizDisplayCompositor',
        '--disable-background-sync',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-sync',
        '--no-first-run',
        '--disable-shared-array-buffer' // This should trigger fallback
      );
    }
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: browserArgs
    });

    try {
      let page;
      
      if (mode === 'private' || mode === 'restricted') {
        // Create a separate context for private/restricted modes
        const context = await browser.createBrowserContext();
        page = await context.newPage();
      } else {
        // Use default context
        page = await browser.newPage();
      }
      
      // Set up console log capture
      const consoleLogs = [];
      page.on('console', (msg) => {
        const text = msg.text();
        consoleLogs.push({
          type: msg.type(),
          text: text,
          timestamp: new Date().toISOString()
        });
        console.log(`[${mode.toUpperCase()} Browser] ${msg.type()}: ${text}`);
      });

      // Set up error capture
      const errors = [];
      page.on('pageerror', (error) => {
        errors.push({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
        console.error(`[${mode.toUpperCase()} Browser] Page Error:`, error.message);
      });

      // Navigate to the application
      const url = `http://localhost:${this.serverPort}/VIM/`;
      console.log(`📍 Navigating to ${url}`);
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for the application to initialize
      console.log(`⏳ Waiting for application to initialize...`);
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Extract browser compatibility results
      const compatibilityResults = await page.evaluate(() => {
        // Try to get compatibility data from the browser
        const ultraEarly = window.__browserCapabilities;
        const canUseVimWasm = window.__canUseVimWasm;
        const skipVimWasm = window.__skipVimWasmLoad;
        const vimWasmError = window.__vimWasmLoadError;
        
        // Try to determine what editor is actually loaded
        let editorMode = 'unknown';
        let editorInfo = {};
        
        // Check for Monaco editor
        if (window.monaco) {
          editorMode = 'monaco';
          editorInfo.monaco = true;
        }
        
        // Check for vim.wasm
        if (window.VimWasm) {
          editorMode = 'vim-wasm';
          editorInfo.vimWasm = true;
        }
        
        // Check DOM for editor indicators
        const vimWasmIndicator = document.querySelector('[class*="vim-wasm"]');
        const monacoIndicator = document.querySelector('[class*="monaco"]');
        const basicIndicator = document.querySelector('textarea');
        const bannerElement = document.querySelector('[class*="bg-yellow-900"], [class*="bg-red-900"]');
        
        if (vimWasmIndicator && !monacoIndicator) {
          editorMode = 'vim-wasm';
        } else if (monacoIndicator && !vimWasmIndicator) {
          editorMode = 'monaco';
        } else if (basicIndicator && bannerElement) {
          editorMode = 'basic';
        }
        
        // Get banner information
        let bannerInfo = null;
        if (bannerElement) {
          bannerInfo = {
            text: bannerElement.textContent,
            classes: bannerElement.className
          };
        }
        
        return {
          ultraEarlyCapabilities: ultraEarly,
          canUseVimWasm,
          skipVimWasm,
          vimWasmError: vimWasmError ? vimWasmError.message : null,
          detectedEditorMode: editorMode,
          editorInfo,
          bannerInfo,
          pageTitle: document.title,
          pageUrl: window.location.href
        };
      });

      // Take a screenshot
      const screenshotPath = `test-screenshot-${mode}-${Date.now()}.png`;
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      // Get performance metrics
      const metrics = await page.metrics();

      const result = {
        mode,
        success: true,
        compatibility: compatibilityResults,
        consoleLogs: consoleLogs.slice(-20), // Last 20 logs
        errors,
        screenshot: screenshotPath,
        metrics: {
          JSEventListeners: metrics.JSEventListeners,
          Nodes: metrics.Nodes,
          JSHeapUsedSize: Math.round(metrics.JSHeapUsedSize / 1024 / 1024 * 100) / 100, // MB
          JSHeapTotalSize: Math.round(metrics.JSHeapTotalSize / 1024 / 1024 * 100) / 100 // MB
        },
        testCompletedAt: new Date().toISOString()
      };

      console.log(`✅ ${mode} mode test completed`);
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      console.log(`🎯 Detected editor mode: ${compatibilityResults.detectedEditorMode}`);
      
      return result;

    } catch (error) {
      console.error(`❌ ${mode} mode test failed:`, error.message);
      return {
        mode,
        success: false,
        error: {
          message: error.message,
          stack: error.stack
        },
        testCompletedAt: new Date().toISOString()
      };
    } finally {
      await browser.close();
    }
  }

  async runAllTests() {
    const startTime = Date.now();
    
    try {
      console.log('🎯 Starting Browser Compatibility Test Suite');
      console.log('='.repeat(60));
      
      // Start the development server
      await this.startDevServer();
      
      // Test normal browser mode
      this.results.normal = await this.testBrowserMode('normal');
      
      // Test private browser mode
      this.results.private = await this.testBrowserMode('private');
      
      // Test restricted browser mode (artificially limited)
      this.results.restricted = await this.testBrowserMode('restricted');
      
      this.results.testDuration = Date.now() - startTime;
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.error = {
        message: error.message,
        stack: error.stack
      };
    } finally {
      // Always stop the dev server
      await this.stopDevServer();
    }
    
    return this.results;
  }

  generateReport() {
    console.log('\n📊 Test Results Summary');
    console.log('='.repeat(60));
    
    const normalResult = this.results.normal;
    const privateResult = this.results.private;
    const restrictedResult = this.results.restricted;
    
    if (normalResult?.success) {
      console.log(`\n🌐 NORMAL BROWSER MODE:`);
      console.log(`   Editor Mode: ${normalResult.compatibility.detectedEditorMode}`);
      console.log(`   Can Use vim.wasm: ${normalResult.compatibility.canUseVimWasm}`);
      console.log(`   Skip vim.wasm: ${normalResult.compatibility.skipVimWasm}`);
      console.log(`   Memory Usage: ${normalResult.metrics.JSHeapUsedSize}MB`);
      console.log(`   Screenshot: ${normalResult.screenshot}`);
      
      if (normalResult.compatibility.bannerInfo) {
        console.log(`   Banner: ${normalResult.compatibility.bannerInfo.text.substring(0, 100)}...`);
      }
    } else {
      console.log(`\n❌ NORMAL BROWSER MODE: FAILED`);
      console.log(`   Error: ${normalResult?.error?.message}`);
    }
    
    if (privateResult?.success) {
      console.log(`\n🕵️ PRIVATE BROWSER MODE:`);
      console.log(`   Editor Mode: ${privateResult.compatibility.detectedEditorMode}`);
      console.log(`   Can Use vim.wasm: ${privateResult.compatibility.canUseVimWasm}`);
      console.log(`   Skip vim.wasm: ${privateResult.compatibility.skipVimWasm}`);
      console.log(`   Memory Usage: ${privateResult.metrics.JSHeapUsedSize}MB`);
      console.log(`   Screenshot: ${privateResult.screenshot}`);
      
      if (privateResult.compatibility.bannerInfo) {
        console.log(`   Banner: ${privateResult.compatibility.bannerInfo.text.substring(0, 100)}...`);
      }
    } else {
      console.log(`\n❌ PRIVATE BROWSER MODE: FAILED`);
      console.log(`   Error: ${privateResult?.error?.message}`);
    }
    
    if (restrictedResult?.success) {
      console.log(`\n🔒 RESTRICTED BROWSER MODE:`);
      console.log(`   Editor Mode: ${restrictedResult.compatibility.detectedEditorMode}`);
      console.log(`   Can Use vim.wasm: ${restrictedResult.compatibility.canUseVimWasm}`);
      console.log(`   Skip vim.wasm: ${restrictedResult.compatibility.skipVimWasm}`);
      console.log(`   Memory Usage: ${restrictedResult.metrics.JSHeapUsedSize}MB`);
      console.log(`   Screenshot: ${restrictedResult.screenshot}`);
      
      if (restrictedResult.compatibility.bannerInfo) {
        console.log(`   Banner: ${restrictedResult.compatibility.bannerInfo.text.substring(0, 100)}...`);
      }
    } else {
      console.log(`\n❌ RESTRICTED BROWSER MODE: FAILED`);
      console.log(`   Error: ${restrictedResult?.error?.message}`);
    }
    
    console.log(`\n⏱️ Total test duration: ${(this.results.testDuration / 1000).toFixed(2)} seconds`);
    
    // Save detailed results to file
    const reportPath = `browser-test-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}`);
    
    // Verify fallback system
    this.verifyFallbackSystem();
  }

  verifyFallbackSystem() {
    console.log('\n🔍 Fallback System Verification');
    console.log('='.repeat(60));
    
    const normal = this.results.normal;
    const privateResult = this.results.private;
    const restrictedResult = this.results.restricted;
    
    if (!normal?.success || !privateResult?.success || !restrictedResult?.success) {
      console.log('❌ Cannot verify fallback system - some tests failed');
      return;
    }
    
    const normalMode = normal.compatibility.detectedEditorMode;
    const privateMode = privateResult.compatibility.detectedEditorMode;
    const restrictedMode = restrictedResult.compatibility.detectedEditorMode;
    
    console.log(`Normal browser: ${normalMode}`);
    console.log(`Private browser: ${privateMode}`);
    console.log(`Restricted browser: ${restrictedMode}`);
    
    // Verify expectations
    let verificationResult = '✅ PASS';
    let verificationNotes = [];
    
    // Normal browser should prefer vim.wasm if possible
    if (normalMode === 'vim-wasm') {
      verificationNotes.push('✅ Normal browser successfully loaded vim.wasm');
    } else if (normalMode === 'monaco') {
      verificationNotes.push('⚠️ Normal browser fell back to Monaco (expected if no SharedArrayBuffer)');
    } else if (normalMode === 'basic') {
      verificationNotes.push('🔧 Normal browser fell back to basic editor (very restrictive environment)');
    } else {
      verificationNotes.push('❌ Normal browser mode unknown');
      verificationResult = '❌ FAIL';
    }
    
    // Private browser should likely fall back
    if (privateMode === 'basic' || privateMode === 'monaco') {
      verificationNotes.push('✅ Private browser correctly fell back due to restrictions');
    } else if (privateMode === 'vim-wasm') {
      verificationNotes.push('⚠️ Private browser loaded vim.wasm (unexpected but possible)');
    } else {
      verificationNotes.push('❌ Private browser mode unknown');
      verificationResult = '❌ FAIL';
    }
    
    // Restricted browser should definitely fall back
    if (restrictedMode === 'monaco' || restrictedMode === 'basic') {
      verificationNotes.push('✅ Restricted browser correctly fell back due to disabled features');
    } else if (restrictedMode === 'vim-wasm') {
      verificationNotes.push('⚠️ Restricted browser still loaded vim.wasm (flags may not have worked)');
    } else {
      verificationNotes.push('❌ Restricted browser mode unknown');
      verificationResult = '❌ FAIL';
    }
    
    // All should have loaded something
    if (normalMode !== 'unknown' && privateMode !== 'unknown' && restrictedMode !== 'unknown') {
      verificationNotes.push('✅ All modes successfully loaded an editor');
    } else {
      verificationNotes.push('❌ One or more modes failed to load an editor');
      verificationResult = '❌ FAIL';
    }
    
    console.log(`\nResult: ${verificationResult}`);
    verificationNotes.forEach(note => console.log(`  ${note}`));
  }
}

// Run the tests
async function main() {
  const tester = new BrowserCompatibilityTester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (import.meta.url === `file://${__filename}`) {
  main().catch(console.error);
}

export default BrowserCompatibilityTester;