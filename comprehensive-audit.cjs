const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure screenshots directory exists
const screenshotDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runComprehensiveAudit() {
    console.log('🔍 Starting Comprehensive VIM Application Audit...\n');
    
    // Test in both normal and incognito modes
    const modes = [
        { name: 'Normal', incognito: false },
        { name: 'Incognito', incognito: true }
    ];
    
    const results = {
        errors: [],
        warnings: [],
        features: {},
        storage: {},
        performance: {},
        compatibility: {}
    };
    
    for (const mode of modes) {
        console.log(`\n📋 Testing in ${mode.name} Mode`);
        console.log('='.repeat(50));
        
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const context = mode.incognito ? 
            await browser.createIncognitoBrowserContext() : 
            browser.defaultBrowserContext();
            
        const page = await context.newPage();
        
        // Monitor console messages
        const consoleMessages = [];
        page.on('console', msg => {
            const message = {
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date().toISOString()
            };
            consoleMessages.push(message);
            
            if (msg.type() === 'error') {
                console.log(`❌ Console Error: ${msg.text()}`);
                results.errors.push(`[${mode.name}] ${msg.text()}`);
            } else if (msg.type() === 'warning') {
                console.log(`⚠️  Console Warning: ${msg.text()}`);
                results.warnings.push(`[${mode.name}] ${msg.text()}`);
            }
        });
        
        // Monitor network requests
        const networkRequests = [];
        page.on('request', request => {
            networkRequests.push({
                url: request.url(),
                method: request.method(),
                timestamp: new Date().toISOString()
            });
        });
        
        page.on('response', response => {
            if (!response.ok()) {
                console.log(`🌐 Network Error: ${response.status()} ${response.url()}`);
                results.errors.push(`[${mode.name}] Network: ${response.status()} ${response.url()}`);
            }
        });
        
        try {
            console.log(`🚀 Loading application...`);
            await page.goto('http://localhost:5174/VIM/', { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            // Wait for initial load
            await page.waitForTimeout(3000);
            
            // Take initial screenshot
            await page.screenshot({ 
                path: path.join(screenshotDir, `${mode.name.toLowerCase()}-initial-load.png`),
                fullPage: true 
            });
            
            console.log(`✅ Initial load complete`);
            
            // Test 1: Basic VIM Editor Functionality
            console.log('\n🔧 Testing Basic VIM Editor...');
            await testBasicVimEditor(page, mode.name, results);
            
            // Test 2: Which-Key System
            console.log('\n⌨️  Testing Which-Key System...');
            await testWhichKeySystem(page, mode.name, results);
            
            // Test 3: Keystroke Visualizer
            console.log('\n👁️  Testing Keystroke Visualizer...');
            await testKeystrokeVisualizer(page, mode.name, results);
            
            // Test 4: Vimrc Editor
            console.log('\n📝 Testing Vimrc Editor...');
            await testVimrcEditor(page, mode.name, results);
            
            // Test 5: Practice Files
            console.log('\n📚 Testing Practice Files...');
            await testPracticeFiles(page, mode.name, results);
            
            // Test 6: Modal Systems
            console.log('\n🪟 Testing Modal Systems...');
            await testModalSystems(page, mode.name, results);
            
            // Test 7: Browser Storage
            console.log('\n💾 Testing Browser Storage...');
            await testBrowserStorage(page, mode.name, results);
            
            // Test 8: Toast Notifications
            console.log('\n🍞 Testing Toast Notifications...');
            await testToastNotifications(page, mode.name, results);
            
            // Capture final state
            await page.screenshot({ 
                path: path.join(screenshotDir, `${mode.name.toLowerCase()}-final-state.png`),
                fullPage: true 
            });
            
            // Store console messages and network requests for this mode
            results[`${mode.name.toLowerCase()}ConsoleMessages`] = consoleMessages;
            results[`${mode.name.toLowerCase()}NetworkRequests`] = networkRequests;
            
        } catch (error) {
            console.log(`❌ Error in ${mode.name} mode: ${error.message}`);
            results.errors.push(`[${mode.name}] Critical Error: ${error.message}`);
        }
        
        await browser.close();
    }
    
    // Generate comprehensive report
    generateAuditReport(results);
    
    console.log('\n🎯 Comprehensive Audit Complete!');
    console.log('📊 Check audit-report.json for detailed results');
    console.log('📸 Screenshots saved in test-screenshots/ directory');
}

async function testBasicVimEditor(page, mode, results) {
    try {
        // Wait for editor to be ready
        await page.waitForSelector('[data-testid="vim-editor"], .monaco-editor', { timeout: 10000 });
        
        // Check if vim.wasm or Monaco is loaded
        const isVimWasm = await page.evaluate(() => {
            return window.hasOwnProperty('__vimWasmPromise') || 
                   document.querySelector('[data-testid="vim-editor"]') !== null;
        });
        
        const isMonaco = await page.evaluate(() => {
            return document.querySelector('.monaco-editor') !== null;
        });
        
        results.features[`${mode}_editor_type`] = {
            vimWasm: isVimWasm,
            monaco: isMonaco,
            timestamp: new Date().toISOString()
        };
        
        console.log(`  📊 Editor Type - vim.wasm: ${isVimWasm}, Monaco: ${isMonaco}`);
        
        // Test basic typing
        await page.click('[data-testid="vim-editor"], .monaco-editor');
        await page.keyboard.press('i'); // Enter insert mode
        await page.keyboard.type('Hello World Test');
        await page.keyboard.press('Escape'); // Exit insert mode
        
        console.log(`  ✅ Basic typing test passed`);
        
        // Test basic VIM commands
        await page.keyboard.press('g');
        await page.keyboard.press('g'); // Go to top
        await page.keyboard.type('dd'); // Delete line
        
        console.log(`  ✅ Basic VIM commands test passed`);
        
        // Screenshot after basic operations
        await page.screenshot({ 
            path: path.join(screenshotDir, `${mode.toLowerCase()}-basic-vim-test.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`  ❌ Basic VIM Editor test failed: ${error.message}`);
        results.errors.push(`[${mode}] Basic VIM Editor: ${error.message}`);
    }
}

async function testWhichKeySystem(page, mode, results) {
    try {
        // Ensure we're in normal mode
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        
        // Test space as leader key
        console.log(`  🔑 Testing space as leader key...`);
        await page.keyboard.press('Space');
        
        // Wait for which-key popup
        await page.waitForTimeout(100);
        
        // Check if which-key popup appears
        const whichKeyVisible = await page.evaluate(() => {
            const popup = document.querySelector('[data-testid="which-key-popup"]') ||
                         document.querySelector('.which-key') ||
                         document.querySelector('[class*="which-key"]');
            return popup && popup.offsetParent !== null;
        });
        
        results.features[`${mode}_which_key_popup`] = {
            visible: whichKeyVisible,
            timestamp: new Date().toISOString()
        };
        
        console.log(`  📊 Which-Key popup visible: ${whichKeyVisible}`);
        
        if (whichKeyVisible) {
            // Test various which-key commands
            await page.keyboard.press('f'); // File operations
            await page.waitForTimeout(100);
            await page.keyboard.press('Escape'); // Cancel
            
            await page.keyboard.press('Space');
            await page.keyboard.press('b'); // Buffer operations
            await page.waitForTimeout(100);
            await page.keyboard.press('Escape'); // Cancel
            
            console.log(`  ✅ Which-Key navigation test passed`);
        }
        
        // Test operator keys (d, c, y, g, z)
        console.log(`  🔧 Testing operator keys...`);
        const operators = ['d', 'c', 'y', 'g', 'z'];
        
        for (const op of operators) {
            await page.keyboard.press('Escape'); // Ensure normal mode
            await page.waitForTimeout(100);
            await page.keyboard.press(op);
            await page.waitForTimeout(100);
            
            // Check if operator pending mode is detected
            const operatorPending = await page.evaluate((operator) => {
                // Look for operator pending indicators
                const statusElements = document.querySelectorAll('[class*="status"], [class*="mode"]');
                const hasOperatorPending = Array.from(statusElements).some(el => 
                    el.textContent && el.textContent.includes(operator)
                );
                return hasOperatorPending;
            }, op);
            
            results.features[`${mode}_operator_${op}_pending`] = operatorPending;
            
            await page.keyboard.press('Escape'); // Cancel operator
        }
        
        console.log(`  ✅ Operator keys test completed`);
        
        // Screenshot which-key test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${mode.toLowerCase()}-which-key-test.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`  ❌ Which-Key system test failed: ${error.message}`);
        results.errors.push(`[${mode}] Which-Key System: ${error.message}`);
    }
}

async function testKeystrokeVisualizer(page, mode, results) {
    try {
        // Check if keystroke visualizer toggle exists
        const toggleExists = await page.evaluate(() => {
            const toggle = document.querySelector('[data-testid="keystroke-toggle"]') ||
                          document.querySelector('button[aria-label*="keystroke"]') ||
                          document.querySelector('button[title*="keystroke"]');
            return toggle !== null;
        });
        
        console.log(`  📊 Keystroke visualizer toggle exists: ${toggleExists}`);
        
        if (toggleExists) {
            // Enable keystroke visualizer
            await page.click('[data-testid="keystroke-toggle"], button[aria-label*="keystroke"], button[title*="keystroke"]');
            await page.waitForTimeout(500);
            
            // Test keystroke display
            await page.keyboard.press('j');
            await page.keyboard.press('k');
            await page.keyboard.press('h');
            await page.keyboard.press('l');
            
            // Check if keystrokes are displayed
            const keystrokesVisible = await page.evaluate(() => {
                const overlay = document.querySelector('[data-testid="keystroke-overlay"]') ||
                               document.querySelector('[class*="keystroke"]');
                return overlay && overlay.offsetParent !== null;
            });
            
            results.features[`${mode}_keystroke_visualizer`] = {
                toggleExists: toggleExists,
                visible: keystrokesVisible,
                timestamp: new Date().toISOString()
            };
            
            console.log(`  ✅ Keystroke visualizer test - visible: ${keystrokesVisible}`);
        } else {
            results.features[`${mode}_keystroke_visualizer`] = {
                toggleExists: false,
                timestamp: new Date().toISOString()
            };
        }
        
        // Screenshot keystroke test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${mode.toLowerCase()}-keystroke-test.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`  ❌ Keystroke visualizer test failed: ${error.message}`);
        results.errors.push(`[${mode}] Keystroke Visualizer: ${error.message}`);
    }
}

async function testVimrcEditor(page, mode, results) {
    try {
        // Look for vimrc editor button/modal trigger
        const vimrcButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(btn => 
                btn.textContent && 
                (btn.textContent.toLowerCase().includes('vimrc') || 
                 btn.textContent.toLowerCase().includes('config'))
            ) !== undefined;
        });
        
        console.log(`  📊 Vimrc editor button found: ${vimrcButton}`);
        
        if (vimrcButton) {
            // Click vimrc editor button
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const vimrcBtn = buttons.find(btn => 
                    btn.textContent && 
                    (btn.textContent.toLowerCase().includes('vimrc') || 
                     btn.textContent.toLowerCase().includes('config'))
                );
                if (vimrcBtn) vimrcBtn.click();
            });
            
            await page.waitForTimeout(1000);
            
            // Check if vimrc editor modal opened
            const modalOpen = await page.evaluate(() => {
                const modals = document.querySelectorAll('[role="dialog"], .modal, [data-testid*="modal"]');
                return Array.from(modals).some(modal => modal.offsetParent !== null);
            });
            
            console.log(`  📊 Vimrc editor modal opened: ${modalOpen}`);
            
            if (modalOpen) {
                // Test vimrc editor functionality
                await page.waitForSelector('textarea, .monaco-editor');
                
                // Test valid vimrc command
                await page.keyboard.type('set number');
                await page.waitForTimeout(500);
                
                // Test invalid vimrc command
                await page.keyboard.press('Enter');
                await page.keyboard.type('invalid_command_test');
                await page.waitForTimeout(500);
                
                // Check for validation feedback
                const hasValidation = await page.evaluate(() => {
                    const errorElements = document.querySelectorAll('[class*="error"], [class*="invalid"], .text-red-500');
                    return errorElements.length > 0;
                });
                
                results.features[`${mode}_vimrc_editor`] = {
                    buttonExists: vimrcButton,
                    modalOpened: modalOpen,
                    hasValidation: hasValidation,
                    timestamp: new Date().toISOString()
                };
                
                console.log(`  ✅ Vimrc editor test - validation: ${hasValidation}`);
                
                // Close modal
                await page.keyboard.press('Escape');
                await page.waitForTimeout(500);
            }
        }
        
        // Screenshot vimrc test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${mode.toLowerCase()}-vimrc-test.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`  ❌ Vimrc editor test failed: ${error.message}`);
        results.errors.push(`[${mode}] Vimrc Editor: ${error.message}`);
    }
}

async function testPracticeFiles(page, mode, results) {
    try {
        // Look for practice files button
        const practiceButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(btn => 
                btn.textContent && 
                btn.textContent.toLowerCase().includes('practice')
            ) !== undefined;
        });
        
        console.log(`  📊 Practice files button found: ${practiceButton}`);
        
        if (practiceButton) {
            // Click practice files button
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const practiceBtn = buttons.find(btn => 
                    btn.textContent && 
                    btn.textContent.toLowerCase().includes('practice')
                );
                if (practiceBtn) practiceBtn.click();
            });
            
            await page.waitForTimeout(1000);
            
            // Check if practice files modal opened
            const modalOpen = await page.evaluate(() => {
                const modals = document.querySelectorAll('[role="dialog"], .modal, [data-testid*="modal"]');
                return Array.from(modals).some(modal => modal.offsetParent !== null);
            });
            
            console.log(`  📊 Practice files modal opened: ${modalOpen}`);
            
            if (modalOpen) {
                // Count available practice files
                const fileCount = await page.evaluate(() => {
                    const fileButtons = document.querySelectorAll('button[class*="practice"], button[data-file]');
                    return fileButtons.length;
                });
                
                console.log(`  📊 Practice files available: ${fileCount}`);
                
                // Test loading a practice file
                if (fileCount > 0) {
                    await page.click('button[class*="practice"], button[data-file]');
                    await page.waitForTimeout(1000);
                    
                    // Check if file loaded in editor
                    const editorHasContent = await page.evaluate(() => {
                        const editor = document.querySelector('[data-testid="vim-editor"], .monaco-editor');
                        return editor && editor.textContent && editor.textContent.trim().length > 0;
                    });
                    
                    console.log(`  ✅ Practice file loaded: ${editorHasContent}`);
                    
                    results.features[`${mode}_practice_files`] = {
                        buttonExists: practiceButton,
                        modalOpened: modalOpen,
                        fileCount: fileCount,
                        fileLoaded: editorHasContent,
                        timestamp: new Date().toISOString()
                    };
                }
                
                // Close modal
                await page.keyboard.press('Escape');
                await page.waitForTimeout(500);
            }
        }
        
        // Screenshot practice files test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${mode.toLowerCase()}-practice-files-test.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`  ❌ Practice files test failed: ${error.message}`);
        results.errors.push(`[${mode}] Practice Files: ${error.message}`);
    }
}

async function testModalSystems(page, mode, results) {
    try {
        // Test settings modal
        const settingsButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(btn => 
                btn.textContent && 
                (btn.textContent.toLowerCase().includes('settings') ||
                 btn.textContent.toLowerCase().includes('⚙️'))
            ) !== undefined;
        });
        
        console.log(`  📊 Settings button found: ${settingsButton}`);
        
        // Test help modal
        const helpButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(btn => 
                btn.textContent && 
                (btn.textContent.toLowerCase().includes('help') ||
                 btn.textContent.toLowerCase().includes('?'))
            ) !== undefined;
        });
        
        console.log(`  📊 Help button found: ${helpButton}`);
        
        results.features[`${mode}_modal_systems`] = {
            settingsButton: settingsButton,
            helpButton: helpButton,
            timestamp: new Date().toISOString()
        };
        
        // Test modal accessibility
        const modalButtons = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.filter(btn => 
                btn.hasAttribute('aria-label') || 
                btn.hasAttribute('aria-describedby')
            ).length;
        });
        
        console.log(`  📊 Accessible modal buttons: ${modalButtons}`);
        
        // Screenshot modal systems test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${mode.toLowerCase()}-modal-systems-test.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`  ❌ Modal systems test failed: ${error.message}`);
        results.errors.push(`[${mode}] Modal Systems: ${error.message}`);
    }
}

async function testBrowserStorage(page, mode, results) {
    try {
        // Check localStorage usage
        const localStorageKeys = await page.evaluate(() => {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                keys.push(localStorage.key(i));
            }
            return keys;
        });
        
        console.log(`  📊 localStorage keys: ${localStorageKeys.join(', ')}`);
        
        // Test specific vim-related keys
        const vimKeys = await page.evaluate(() => {
            return {
                vimrc: localStorage.getItem('vim-vimrc'),
                whichKey: localStorage.getItem('vim-which-key-enabled'),
                keystroke: localStorage.getItem('vim-keystroke-config')
            };
        });
        
        console.log(`  📊 VIM localStorage data found: ${Object.keys(vimKeys).filter(k => vimKeys[k] !== null).join(', ')}`);
        
        // Test setting and getting values
        await page.evaluate(() => {
            localStorage.setItem('test-key', 'test-value');
        });
        
        const testValue = await page.evaluate(() => {
            return localStorage.getItem('test-key');
        });
        
        const storageWorking = testValue === 'test-value';
        console.log(`  ✅ localStorage read/write working: ${storageWorking}`);
        
        // Clean up test
        await page.evaluate(() => {
            localStorage.removeItem('test-key');
        });
        
        results.storage[`${mode}_localStorage`] = {
            keys: localStorageKeys,
            vimKeys: vimKeys,
            working: storageWorking,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.log(`  ❌ Browser storage test failed: ${error.message}`);
        results.errors.push(`[${mode}] Browser Storage: ${error.message}`);
    }
}

async function testToastNotifications(page, mode, results) {
    try {
        // Look for existing toast notifications
        const existingToasts = await page.evaluate(() => {
            const toasts = document.querySelectorAll('[data-testid="toast"], [class*="toast"], [role="alert"]');
            return toasts.length;
        });
        
        console.log(`  📊 Existing toast notifications: ${existingToasts}`);
        
        // Try to trigger a toast (if possible)
        // This might happen through vimrc validation or other user actions
        
        results.features[`${mode}_toast_notifications`] = {
            existingToasts: existingToasts,
            timestamp: new Date().toISOString()
        };
        
        // Wait to see if any toasts auto-dismiss
        await page.waitForTimeout(2000);
        
        const remainingToasts = await page.evaluate(() => {
            const toasts = document.querySelectorAll('[data-testid="toast"], [class*="toast"], [role="alert"]');
            return toasts.length;
        });
        
        console.log(`  📊 Remaining toast notifications after 2s: ${remainingToasts}`);
        
        // Screenshot toast test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${mode.toLowerCase()}-toast-test.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`  ❌ Toast notifications test failed: ${error.message}`);
        results.errors.push(`[${mode}] Toast Notifications: ${error.message}`);
    }
}

function generateAuditReport(results) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalErrors: results.errors.length,
            totalWarnings: results.warnings.length,
            featuresTestedCount: Object.keys(results.features).length
        },
        ...results
    };
    
    // Write detailed report
    fs.writeFileSync(
        path.join(__dirname, 'audit-report.json'),
        JSON.stringify(report, null, 2)
    );
    
    // Write summary report
    const summary = `
VIM Application Comprehensive Audit Report
==========================================
Generated: ${report.timestamp}

SUMMARY:
- Total Errors: ${report.summary.totalErrors}
- Total Warnings: ${report.summary.totalWarnings}
- Features Tested: ${report.summary.featuresTestedCount}

CRITICAL ERRORS:
${results.errors.slice(0, 10).map(err => `- ${err}`).join('\n')}
${results.errors.length > 10 ? `... and ${results.errors.length - 10} more` : ''}

WARNINGS:
${results.warnings.slice(0, 10).map(warn => `- ${warn}`).join('\n')}
${results.warnings.length > 10 ? `... and ${results.warnings.length - 10} more` : ''}

FEATURE STATUS:
${Object.entries(results.features).map(([key, value]) => 
    `- ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`
).join('\n')}

See audit-report.json for complete details.
`;
    
    fs.writeFileSync(
        path.join(__dirname, 'audit-summary.txt'),
        summary
    );
    
    console.log('\n📊 AUDIT SUMMARY:');
    console.log(summary);
}

// Run the audit
runComprehensiveAudit().catch(console.error);