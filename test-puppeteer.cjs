const puppeteer = require('puppeteer');
const path = require('path');

class VimTestRunner {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async init() {
    console.log('🚀 Starting VIMora comprehensive testing...\n');
    
    this.browser = await puppeteer.launch({
      headless: false, // Keep visible for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-running-insecure-content',
        '--enable-features=SharedArrayBuffer',
        '--cross-origin-isolated'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Listen to console logs
    this.page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[CONSOLE ${type.toUpperCase()}] ${text}`);
    });
    
    // Listen to errors
    this.page.on('pageerror', (error) => {
      console.log(`[PAGE ERROR] ${error.message}`);
    });
    
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async test(name, testFn) {
    console.log(`\n🧪 Running test: ${name}`);
    try {
      await testFn();
      console.log(`✅ ${name} - PASSED`);
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED' });
    } catch (error) {
      console.log(`❌ ${name} - FAILED: ${error.message}`);
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', error: error.message });
    }
  }

  async screenshot(name) {
    const filename = `test-screenshots/${name}-${Date.now()}.png`;
    await this.page.screenshot({ 
      path: filename, 
      fullPage: true 
    });
    console.log(`📸 Screenshot saved: ${filename}`);
    return filename;
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitForLoad() {
    // Wait for main app to load - look for the app container structure
    await this.page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 30000 });
    await this.page.waitForFunction(() => {
      return window.document.readyState === 'complete';
    });
    // Additional wait for React to settle and VIM to initialize
    await this.wait(3000);
  }

  async testApplicationStartup() {
    await this.test('Application Startup', async () => {
      await this.page.goto('http://localhost:5174/VIM/', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      await this.waitForLoad();
      await this.screenshot('startup');
      
      // Check if the main container is present
      const appContainer = await this.page.$('div.h-screen.bg-gray-950');
      if (!appContainer) throw new Error('App container not found');
      
      // Check for error messages
      const errorDisplay = await this.page.evaluate(() => {
        const errorHeading = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Unable to load VIM'));
        return errorHeading !== undefined;
      });
      if (errorDisplay) throw new Error('VIM failed to load');
    });
  }

  async testBrowserDetection() {
    await this.test('Browser Detection System', async () => {
      // Check if browser capabilities were detected
      const capabilities = await this.page.evaluate(() => {
        return window.__browserCapabilities;
      });
      
      if (!capabilities) throw new Error('Browser capabilities not detected');
      
      console.log('Browser capabilities:', capabilities);
      
      // Check if the correct editor mode was selected
      const editorMode = await this.page.evaluate(() => {
        const hybrid = document.querySelector('[data-testid="vim-editor-hybrid"]');
        return hybrid ? hybrid.dataset.mode : null;
      });
      
      console.log('Editor mode selected:', editorMode);
    });
  }

  async testVimWasmMode() {
    await this.test('vim.wasm Mode Functionality', async () => {
      // Check if vim.wasm loaded successfully
      const vimWasmLoaded = await this.page.evaluate(() => {
        return typeof window.VimWasm !== 'undefined';
      });
      
      if (vimWasmLoaded) {
        console.log('vim.wasm detected, testing functionality...');
        
        // Wait for VIM to be fully ready
        await this.page.waitForFunction(() => {
          const readyElements = Array.from(document.querySelectorAll('.text-green-400'));
          return readyElements.some(el => el.textContent.includes('VIM Ready'));
        }, { timeout: 10000 }).catch(() => {
          console.log('VIM Ready indicator not found, proceeding anyway...');
        });
        
        // Test basic VIM operations - focus on vim container
        const vimContainer = await this.page.$('div[ref="containerRef"], div.w-full.h-full.relative');
        if (vimContainer) {
          await vimContainer.click();
          await this.page.keyboard.type('Hello VIM World!');
          await this.page.keyboard.press('Escape');
          
          await this.screenshot('vim-wasm-typing');
          
          // Test VIM command
          await this.page.keyboard.type(':');
          await this.page.keyboard.type('echo "VIM command test"');
          await this.page.keyboard.press('Enter');
          
          await this.screenshot('vim-wasm-command');
        }
      } else {
        console.log('vim.wasm not loaded, testing Monaco fallback...');
      }
    });
  }

  async testMonacoVimMode() {
    await this.test('Monaco-vim Fallback Mode', async () => {
      // Look for Monaco editor
      const monacoEditor = await this.page.$('.monaco-editor');
      
      if (monacoEditor) {
        console.log('Monaco editor detected, testing VIM bindings...');
        
        await this.page.focus('.monaco-editor textarea');
        await this.page.keyboard.type('Hello Monaco VIM!');
        await this.page.keyboard.press('Escape');
        
        await this.screenshot('monaco-vim-typing');
        
        // Test basic VIM navigation
        await this.page.keyboard.press('0'); // Go to beginning of line
        await this.page.keyboard.press('w'); // Jump to next word
        
        await this.screenshot('monaco-vim-navigation');
      }
    });
  }

  async testWhichKeySystem() {
    await this.test('Which-Key System and Space Handling', async () => {
      // Ensure we're in normal mode
      await this.page.keyboard.press('Escape');
      await this.wait(500);
      
      // Test space key as leader
      await this.page.keyboard.press(' ');
      await this.wait(500);
      
      await this.screenshot('which-key-activated');
      
      // Check if Which-Key overlay appeared
      const whichKeyOverlay = await this.page.$('.fixed.inset-0, [class*="which-key"]');
      if (!whichKeyOverlay) {
        console.log('Which-Key overlay not found - may be disabled or not triggered');
      }
      
      // Test escape to close
      await this.page.keyboard.press('Escape');
      await this.wait(500);
      
      // Test space in insert mode (should type space, not trigger which-key)
      await this.page.keyboard.press('i'); // Enter insert mode
      await this.wait(200);
      await this.page.keyboard.press(' '); // Should type space
      await this.page.keyboard.press(' '); // Should type another space
      
      await this.screenshot('space-in-insert-mode');
      
      // Check that spaces were typed (content should have spaces)
      const hasSpaces = await this.page.evaluate(() => {
        const editor = document.querySelector('.monaco-editor') || document.querySelector('[class*="vim"]');
        return editor && (editor.textContent.includes('  ') || editor.innerText.includes('  ')); // Two spaces
      });
      
      console.log('Spaces detected in insert mode:', hasSpaces);
    });
  }

  async testKeystrokeVisualizer() {
    await this.test('Keystroke Visualizer', async () => {
      // Open settings/preferences to enable keystroke visualizer
      await this.page.keyboard.press('Escape');
      
      // Look for keystroke visualizer toggle
      const toggleButton = await this.page.$('[data-testid="keystroke-toggle"]');
      if (toggleButton) {
        await toggleButton.click();
        await this.wait(500);
        
        // Test if visualizer shows keystrokes
        await this.page.keyboard.press('j');
        await this.page.keyboard.press('k');
        await this.page.keyboard.press('h');
        await this.page.keyboard.press('l');
        
        await this.screenshot('keystroke-visualizer');
        
        // Check if keystroke overlay is visible
        const keystrokeOverlay = await this.page.$('.keystroke-overlay');
        if (!keystrokeOverlay) throw new Error('Keystroke overlay not found');
      } else {
        console.log('Keystroke visualizer toggle not found, may be in different location');
      }
    });
  }

  async testVimrcEditor() {
    await this.test('Vimrc Editor and Configuration', async () => {
      // Look for vimrc editor button/link - search by text content
      const vimrcButton = await this.page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => 
          btn.textContent.toLowerCase().includes('vimrc') || 
          btn.textContent.toLowerCase().includes('config') ||
          btn.getAttribute('title')?.toLowerCase().includes('vimrc')
        );
      });
      
      if (vimrcButton.asElement()) {
        await vimrcButton.asElement().click();
        await this.wait(1000);
        
        await this.screenshot('vimrc-editor-open');
        
        // Test adding a vimrc command
        const vimrcTextarea = await this.page.$('.vimrc-editor textarea, .monaco-editor textarea');
        if (vimrcTextarea) {
          await vimrcTextarea.focus();
          await this.page.keyboard.type('set number\nset relativenumber');
          
          await this.screenshot('vimrc-editing');
          
          // Look for apply/save button
          const applyButton = await this.page.evaluateHandle(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(btn => 
              btn.textContent.toLowerCase().includes('apply') || 
              btn.textContent.toLowerCase().includes('save')
            );
          });
          
          if (applyButton.asElement()) {
            await applyButton.asElement().click();
            await this.wait(1000);
            
            await this.screenshot('vimrc-applied');
          }
        }
      } else {
        console.log('Vimrc editor button not found, may be in different location');
      }
    });
  }

  async testPracticeFiles() {
    await this.test('Practice Files System', async () => {
      // Look for practice files button
      const practiceButton = await this.page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => 
          btn.textContent.toLowerCase().includes('practice') || 
          btn.textContent.toLowerCase().includes('examples') ||
          btn.textContent.toLowerCase().includes('files') ||
          btn.getAttribute('title')?.toLowerCase().includes('practice')
        );
      });
      
      if (practiceButton.asElement()) {
        await practiceButton.asElement().click();
        await this.wait(1000);
        
        await this.screenshot('practice-files-modal');
        
        // Look for file options
        const fileOptions = await this.page.$$('.practice-file-option, .file-option');
        if (fileOptions.length > 0) {
          // Click on first practice file
          await fileOptions[0].click();
          await this.wait(1000);
          
          await this.screenshot('practice-file-loaded');
          
          // Check if content was loaded into editor
          const hasContent = await this.page.evaluate(() => {
            const editor = document.querySelector('.monaco-editor') || document.querySelector('.vim-screen');
            return editor && editor.textContent.trim().length > 10;
          });
          
          if (!hasContent) throw new Error('Practice file content not loaded');
        }
      } else {
        console.log('Practice files button not found, may be in different location');
      }
    });
  }

  async testErrorHandling() {
    await this.test('Error Handling and Edge Cases', async () => {
      // Test invalid vimrc command
      await this.page.evaluate(() => {
        // Simulate an invalid vimrc command
        if (window.vimInstance && window.vimInstance.cmdline) {
          window.vimInstance.cmdline('invalid_command_that_should_fail').catch(() => {
            console.log('Expected error handled correctly');
          });
        }
      });
      
      await this.wait(1000);
      
      // Test rapid key presses
      await this.page.keyboard.press('Escape');
      for (let i = 0; i < 10; i++) {
        await this.page.keyboard.press('j');
        await this.wait(50);
      }
      
      await this.screenshot('rapid-keypresses-test');
      
      // Test mode switching
      await this.page.keyboard.press('i');
      await this.wait(100);
      await this.page.keyboard.press('Escape');
      await this.wait(100);
      await this.page.keyboard.press('v');
      await this.wait(100);
      await this.page.keyboard.press('Escape');
      
      await this.screenshot('mode-switching-test');
    });
  }

  async testCrossBrowserScenarios() {
    await this.test('Cross-browser Compatibility Scenarios', async () => {
      // Test different browser capability scenarios
      const scenarios = [
        { name: 'SharedArrayBuffer disabled', code: 'delete window.SharedArrayBuffer' },
        { name: 'WebAssembly disabled', code: 'delete window.WebAssembly' }
      ];
      
      for (const scenario of scenarios) {
        console.log(`Testing scenario: ${scenario.name}`);
        
        // Create new page for isolation
        const testPage = await this.browser.newPage();
        
        // Disable the capability
        await testPage.evaluateOnNewDocument(scenario.code);
        
        try {
          await testPage.goto('http://localhost:5174/VIM/', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
          });
          
          await testPage.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
          await this.wait(2000);
          
          await testPage.screenshot({ 
            path: `test-screenshots/scenario-${scenario.name.replace(/\s+/g, '-')}.png`,
            fullPage: true 
          });
          
          // Check if fallback mode is working
          const monacoEditor = await testPage.$('.monaco-editor');
          if (!monacoEditor) {
            throw new Error(`Fallback editor not loaded for scenario: ${scenario.name}`);
          }
          
          console.log(`✅ Scenario ${scenario.name} handled correctly`);
          
        } catch (error) {
          console.log(`❌ Scenario ${scenario.name} failed: ${error.message}`);
          throw error;
        } finally {
          await testPage.close();
        }
      }
    });
  }

  async analyzeConsoleIssues() {
    await this.test('Console Log Analysis', async () => {
      // Collect and analyze console logs
      const logs = [];
      
      this.page.on('console', (msg) => {
        logs.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: new Date().toISOString()
        });
      });
      
      // Perform various actions to generate logs
      await this.page.reload({ waitUntil: 'networkidle0' });
      await this.waitForLoad();
      
      // Analyze logs for issues
      const errors = logs.filter(log => log.type === 'error');
      const warnings = logs.filter(log => log.type === 'warning');
      
      console.log(`\n📊 Console Analysis:`);
      console.log(`   Errors: ${errors.length}`);
      console.log(`   Warnings: ${warnings.length}`);
      console.log(`   Total logs: ${logs.length}`);
      
      if (errors.length > 0) {
        console.log('\n🚨 Console Errors Found:');
        errors.forEach(error => {
          console.log(`   - ${error.text}`);
        });
      }
      
      if (warnings.length > 0) {
        console.log('\n⚠️  Console Warnings Found:');
        warnings.forEach(warning => {
          console.log(`   - ${warning.text}`);
        });
      }
      
      // Fail test if critical errors found
      const criticalErrors = errors.filter(error => 
        !error.text.includes('DevTools') && 
        !error.text.includes('Extension') &&
        !error.text.includes('favicon')
      );
      
      if (criticalErrors.length > 0) {
        throw new Error(`Found ${criticalErrors.length} critical console errors`);
      }
    });
  }

  async runAllTests() {
    try {
      // Create screenshots directory
      await this.page.evaluate(() => {
        // Create directory if it doesn't exist (handled by Node.js mkdir)
      });
      
      // Run all tests
      await this.testApplicationStartup();
      await this.testBrowserDetection();
      await this.testVimWasmMode();
      await this.testMonacoVimMode();
      await this.testWhichKeySystem();
      await this.testKeystrokeVisualizer();
      await this.testVimrcEditor();
      await this.testPracticeFiles();
      await this.testErrorHandling();
      await this.testCrossBrowserScenarios();
      await this.analyzeConsoleIssues();
      
    } catch (error) {
      console.log(`\n💥 Test execution failed: ${error.message}`);
      await this.screenshot('test-failure');
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    
    console.log('\n📋 Test Results Summary:');
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    console.log(`   📊 Total: ${this.results.passed + this.results.failed}`);
    
    if (this.results.failed > 0) {
      console.log('\n🚨 Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   - ${test.name}: ${test.error}`);
        });
    }
    
    return this.results.failed === 0;
  }
}

// Main execution
async function main() {
  const fs = require('fs').promises;
  
  // Create screenshots directory
  try {
    await fs.mkdir('test-screenshots', { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  const testRunner = new VimTestRunner();
  
  try {
    await testRunner.init();
    await testRunner.runAllTests();
  } catch (error) {
    console.error('Test runner failed:', error);
  } finally {
    const success = await testRunner.cleanup();
    process.exit(success ? 0 : 1);
  }
}

if (require.main === module) {
  main();
}

module.exports = VimTestRunner;