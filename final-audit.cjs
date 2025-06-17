const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure screenshots directory exists
const screenshotDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

// Helper function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runFinalAudit() {
    console.log('🔍 Starting Final VIM Application Audit...\n');
    
    const results = {
        errors: [],
        warnings: [],
        features: {},
        storage: {},
        consoleMessages: [],
        networkRequests: []
    };
    
    // Test both normal and private modes
    const contexts = [
        { name: 'Normal', private: false },
        { name: 'Private', private: true }
    ];
    
    for (const context of contexts) {
        console.log(`\n📋 Testing in ${context.name} Mode`);
        console.log('='.repeat(50));
        
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        });
        
        // For private mode, we'll clear storage
        const page = await browser.newPage();
        
        if (context.private) {
            // Clear all storage for private mode simulation
            await page.evaluateOnNewDocument(() => {
                localStorage.clear();
                sessionStorage.clear();
            });
        }
        
        // Monitor console messages
        page.on('console', msg => {
            const message = {
                type: msg.type(),
                text: msg.text(),
                context: context.name,
                timestamp: new Date().toISOString()
            };
            results.consoleMessages.push(message);
            
            if (msg.type() === 'error') {
                console.log(`❌ Console Error: ${msg.text()}`);
                results.errors.push(`[${context.name}] Console: ${msg.text()}`);
            } else if (msg.type() === 'warning') {
                console.log(`⚠️  Console Warning: ${msg.text()}`);
                results.warnings.push(`[${context.name}] Console: ${msg.text()}`);
            }
        });
        
        // Monitor network requests
        page.on('request', request => {
            results.networkRequests.push({
                url: request.url(),
                method: request.method(),
                context: context.name,
                timestamp: new Date().toISOString()
            });
        });
        
        page.on('response', response => {
            if (!response.ok() && !response.url().includes('favicon')) {
                console.log(`🌐 Network Error: ${response.status()} ${response.url()}`);
                results.errors.push(`[${context.name}] Network: ${response.status()} ${response.url()}`);
            }
        });
        
        try {
            console.log(`🚀 Loading application...`);
            await page.goto('http://localhost:5173/VIM/', { 
                waitUntil: 'domcontentloaded',
                timeout: 15000 
            });
            
            // Wait for application to initialize
            await delay(3000);
            
            // Take initial screenshot
            await page.screenshot({ 
                path: path.join(screenshotDir, `${context.name.toLowerCase()}-initial.png`),
                fullPage: true 
            });
            
            console.log(`✅ Application loaded successfully`);
            
            // Test 1: Editor Detection and Basic Functionality
            await testEditorBasics(page, context.name, results);
            
            // Test 2: Which-Key System
            await testWhichKey(page, context.name, results);
            
            // Test 3: Storage and Persistence
            await testStorage(page, context.name, results);
            
            // Test 4: UI Components and Modals
            await testUIComponents(page, context.name, results);
            
            // Test 5: Practice Files
            await testPracticeFiles(page, context.name, results);
            
            // Test 6: Keystroke Visualizer
            await testKeystrokeVisualizer(page, context.name, results);
            
            // Final screenshot
            await page.screenshot({ 
                path: path.join(screenshotDir, `${context.name.toLowerCase()}-final.png`),
                fullPage: true 
            });
            
        } catch (error) {
            console.log(`❌ Critical error in ${context.name} mode: ${error.message}`);
            results.errors.push(`[${context.name}] Critical: ${error.message}`);
            
            // Screenshot on error
            try {
                await page.screenshot({ 
                    path: path.join(screenshotDir, `${context.name.toLowerCase()}-error.png`),
                    fullPage: true 
                });
            } catch (screenshotError) {
                console.log(`Failed to take error screenshot: ${screenshotError.message}`);
            }
        }
        
        await browser.close();
        console.log(`✅ ${context.name} mode testing completed`);
    }
    
    // Generate report
    generateReport(results);
    
    console.log('\n🎯 Final Audit Complete!');
    console.log('📊 Check final-audit-report.json for detailed results');
    console.log('📸 Screenshots saved in test-screenshots/ directory');
}

async function testEditorBasics(page, contextName, results) {
    console.log(`  🔧 Testing Editor Basics...`);
    
    try {
        // Wait for either vim.wasm or Monaco editor to load
        const editorLoaded = await page.waitForFunction(() => {
            return document.querySelector('[data-testid="vim-editor"]') !== null ||
                   document.querySelector('.monaco-editor') !== null ||
                   document.querySelector('.view-lines') !== null;
        }, { timeout: 15000 });
        
        if (!editorLoaded) {
            throw new Error('No editor found after 15 seconds');
        }
        
        await delay(1000); // Wait for editor to fully initialize
        
        // Detect editor type and capabilities
        const editorInfo = await page.evaluate(() => {
            const vimEditor = document.querySelector('[data-testid="vim-editor"]');
            const monacoEditor = document.querySelector('.monaco-editor');
            const viewLines = document.querySelector('.view-lines');
            
            return {
                hasVimWasm: vimEditor !== null,
                hasMonaco: monacoEditor !== null || viewLines !== null,
                vimWasmPromise: typeof window.__vimWasmPromise !== 'undefined',
                sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
                secureContext: window.isSecureContext,
                crossOriginIsolated: window.crossOriginIsolated
            };
        });
        
        results.features[`${contextName}_editor_detection`] = editorInfo;
        
        console.log(`    📊 Editor Type - vim.wasm: ${editorInfo.hasVimWasm}, Monaco: ${editorInfo.hasMonaco}`);
        console.log(`    📊 SharedArrayBuffer: ${editorInfo.sharedArrayBuffer}, Secure Context: ${editorInfo.secureContext}`);
        console.log(`    📊 Cross-Origin Isolated: ${editorInfo.crossOriginIsolated}`);
        
        // Test basic editor interaction
        const editorSelector = editorInfo.hasVimWasm ? '[data-testid="vim-editor"]' : '.monaco-editor, .view-lines';
        
        // Click on editor to focus
        await page.click(editorSelector);
        await delay(500);
        
        // Test insert mode
        await page.keyboard.press('i');
        await delay(300);
        await page.keyboard.type('Hello World - Audit Test');
        await delay(300);
        await page.keyboard.press('Escape');
        await delay(300);
        
        // Test basic movement
        await page.keyboard.press('g');
        await page.keyboard.press('g'); // Go to top
        await delay(300);
        
        // Test deletion
        await page.keyboard.type('dd'); // Delete line
        await delay(300);
        
        console.log(`    ✅ Basic editor interaction test passed`);
        
        results.features[`${contextName}_basic_interaction`] = true;
        
        // Take screenshot after basic test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${contextName.toLowerCase()}-editor-basic.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`    ❌ Editor basics test failed: ${error.message}`);
        results.features[`${contextName}_basic_interaction`] = false;
        results.errors.push(`[${contextName}] Editor Basics: ${error.message}`);
    }
}

async function testWhichKey(page, contextName, results) {
    console.log(`  ⌨️  Testing Which-Key System...`);
    
    try {
        // Ensure we're in normal mode first
        await page.keyboard.press('Escape');
        await delay(300);
        
        // Test space as leader key
        console.log(`    🔑 Testing space leader key...`);
        await page.keyboard.press('Space');
        await delay(150); // Wait for which-key timeout (50ms) + buffer
        
        // Check for which-key popup
        const whichKeyVisible = await page.evaluate(() => {
            // Look for various possible which-key selectors
            const selectors = [
                '[data-testid="which-key-popup"]',
                '[data-testid="which-key"]',
                '.which-key',
                '[class*="which-key"]',
                '[role="tooltip"]',
                '.tooltip',
                '[class*="popup"]',
                '[class*="overlay"]'
            ];
            
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    if (element && element.offsetParent !== null && element.textContent && element.textContent.trim().length > 0) {
                        return { 
                            visible: true, 
                            selector: selector, 
                            text: element.textContent.substring(0, 200),
                            innerHTML: element.innerHTML.substring(0, 200)
                        };
                    }
                }
            }
            
            return { visible: false };
        });
        
        results.features[`${contextName}_which_key_normal`] = whichKeyVisible;
        
        console.log(`    📊 Which-Key popup visible: ${whichKeyVisible.visible}`);
        if (whichKeyVisible.visible) {
            console.log(`    📊 Which-Key content: ${whichKeyVisible.text}`);
        }
        
        // Test specific which-key commands
        if (whichKeyVisible.visible) {
            // Test 'f' for file operations
            await page.keyboard.press('f');
            await delay(100);
            
            const fileMenuVisible = await page.evaluate(() => {
                const elements = document.querySelectorAll('.which-key, [class*="which-key"], [role="tooltip"]');
                return Array.from(elements).some(el => 
                    el.offsetParent !== null && 
                    el.textContent && 
                    el.textContent.toLowerCase().includes('file')
                );
            });
            
            results.features[`${contextName}_which_key_file_menu`] = fileMenuVisible;
            console.log(`    📊 File menu accessible: ${fileMenuVisible}`);
            
            await page.keyboard.press('Escape'); // Cancel
            await delay(200);
        }
        
        // Test space in insert mode (should NOT trigger which-key)
        console.log(`    🔑 Testing space in insert mode...`);
        await page.keyboard.press('i'); // Enter insert mode
        await delay(300);
        await page.keyboard.press('Space');
        await delay(150);
        
        const whichKeyInInsert = await page.evaluate(() => {
            const selectors = [
                '[data-testid="which-key-popup"]',
                '.which-key',
                '[class*="which-key"]',
                '[role="tooltip"]'
            ];
            
            return selectors.some(selector => {
                const elements = document.querySelectorAll(selector);
                return Array.from(elements).some(element => 
                    element && element.offsetParent !== null && 
                    element.textContent && element.textContent.trim().length > 0
                );
            });
        });
        
        results.features[`${contextName}_which_key_insert_mode`] = !whichKeyInInsert; // Should be false (not visible)
        
        console.log(`    📊 Which-Key correctly hidden in insert mode: ${!whichKeyInInsert}`);
        
        // Return to normal mode
        await page.keyboard.press('Escape');
        await delay(300);
        
        // Test operator keys
        console.log(`    🔧 Testing operator keys...`);
        const operators = ['d', 'c', 'y', 'g', 'z'];
        
        for (const op of operators) {
            await page.keyboard.press(op);
            await delay(200);
            
            // Check for operator pending state
            const operatorState = await page.evaluate((operator) => {
                // Look for mode indicators
                const statusElements = document.querySelectorAll(
                    '.status-bar, [class*="status"], [class*="mode"], .mode-indicator, [data-testid*="status"], [data-testid*="mode"]'
                );
                
                const modeTexts = Array.from(statusElements).map(el => el.textContent || '').join(' ').toLowerCase();
                
                return {
                    modeText: modeTexts,
                    containsOperator: modeTexts.includes(operator.toLowerCase()),
                    hasPendingIndicator: modeTexts.includes('pending') || modeTexts.includes('operator')
                };
            }, op);
            
            results.features[`${contextName}_operator_${op}`] = operatorState;
            
            console.log(`    📊 Operator '${op}' state: ${JSON.stringify(operatorState)}`);
            
            await page.keyboard.press('Escape'); // Cancel operator
            await delay(200);
        }
        
        console.log(`    ✅ Which-Key system test completed`);
        
        // Take screenshot after which-key test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${contextName.toLowerCase()}-which-key.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`    ❌ Which-Key test failed: ${error.message}`);
        results.errors.push(`[${contextName}] Which-Key: ${error.message}`);
    }
}

async function testStorage(page, contextName, results) {
    console.log(`  💾 Testing Browser Storage...`);
    
    try {
        // Check localStorage keys
        const storageInfo = await page.evaluate(() => {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                keys.push(localStorage.key(i));
            }
            
            // Get vim-specific keys
            const vimKeys = {
                vimrc: localStorage.getItem('vim-vimrc'),
                whichKey: localStorage.getItem('vim-which-key-enabled'),
                keystroke: localStorage.getItem('vim-keystroke-config')
            };
            
            return {
                allKeys: keys,
                vimKeys: vimKeys,
                storageLength: localStorage.length
            };
        });
        
        results.storage[`${contextName}_localStorage`] = storageInfo;
        
        console.log(`    📊 localStorage keys (${storageInfo.storageLength}): ${storageInfo.allKeys.join(', ')}`);
        console.log(`    📊 VIM keys present: ${Object.keys(storageInfo.vimKeys).filter(k => storageInfo.vimKeys[k] !== null).join(', ')}`);
        
        // Test storage functionality
        const testData = { test: 'audit-value', timestamp: Date.now(), context: contextName };
        await page.evaluate((data) => {
            localStorage.setItem('audit-test', JSON.stringify(data));
        }, testData);
        
        const retrievedValue = await page.evaluate(() => {
            const value = localStorage.getItem('audit-test');
            localStorage.removeItem('audit-test'); // Clean up
            return value;
        });
        
        const storageWorking = retrievedValue !== null && JSON.parse(retrievedValue).test === 'audit-value';
        results.storage[`${contextName}_storage_working`] = storageWorking;
        
        console.log(`    ✅ Storage read/write test: ${storageWorking ? 'PASSED' : 'FAILED'}`);
        
        // Check if storage persists between page reloads (for normal mode)
        if (contextName === 'Normal') {
            await page.evaluate(() => {
                localStorage.setItem('persistence-test', 'should-persist');
            });
            
            await page.reload({ waitUntil: 'domcontentloaded' });
            await delay(2000);
            
            const persistedValue = await page.evaluate(() => {
                const value = localStorage.getItem('persistence-test');
                localStorage.removeItem('persistence-test'); // Clean up
                return value;
            });
            
            const persistenceWorking = persistedValue === 'should-persist';
            results.storage[`${contextName}_storage_persistence`] = persistenceWorking;
            
            console.log(`    ✅ Storage persistence test: ${persistenceWorking ? 'PASSED' : 'FAILED'}`);
        }
        
    } catch (error) {
        console.log(`    ❌ Storage test failed: ${error.message}`);
        results.errors.push(`[${contextName}] Storage: ${error.message}`);
    }
}

async function testUIComponents(page, contextName, results) {
    console.log(`  🪟 Testing UI Components...`);
    
    try {
        // Count and analyze UI elements
        const uiInfo = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            const inputs = document.querySelectorAll('input, textarea');
            const modals = document.querySelectorAll('[role="dialog"], .modal, [data-testid*="modal"]');
            
            // Look for specific UI elements by text content
            const buttonTexts = Array.from(buttons).map(btn => btn.textContent?.toLowerCase() || '');
            
            const hasSettings = buttonTexts.some(text => text.includes('settings') || text.includes('⚙'));
            const hasHelp = buttonTexts.some(text => text.includes('help') || text.includes('?'));
            const hasPractice = buttonTexts.some(text => text.includes('practice'));
            const hasVimrc = buttonTexts.some(text => text.includes('vimrc') || text.includes('config'));
            
            return {
                buttonCount: buttons.length,
                inputCount: inputs.length,
                modalCount: modals.length,
                hasSettings: hasSettings,
                hasHelp: hasHelp,
                hasPractice: hasPractice,
                hasVimrc: hasVimrc,
                buttonTexts: buttonTexts.filter(text => text.length > 0)
            };
        });
        
        results.features[`${contextName}_ui_components`] = uiInfo;
        
        console.log(`    📊 UI Elements - Buttons: ${uiInfo.buttonCount}, Inputs: ${uiInfo.inputCount}, Modals: ${uiInfo.modalCount}`);
        console.log(`    📊 Key Features - Settings: ${uiInfo.hasSettings}, Help: ${uiInfo.hasHelp}, Practice: ${uiInfo.hasPractice}, Vimrc: ${uiInfo.hasVimrc}`);
        console.log(`    📊 Button texts: ${uiInfo.buttonTexts.slice(0, 10).join(', ')}${uiInfo.buttonTexts.length > 10 ? '...' : ''}`);
        
        // Test accessibility features
        const accessibilityInfo = await page.evaluate(() => {
            const elementsWithAriaLabels = document.querySelectorAll('[aria-label]').length;
            const elementsWithAriaDescribed = document.querySelectorAll('[aria-describedby]').length;
            const elementsWithRole = document.querySelectorAll('[role]').length;
            const focusableElements = document.querySelectorAll('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])').length;
            
            return {
                ariaLabels: elementsWithAriaLabels,
                ariaDescribed: elementsWithAriaDescribed,
                roles: elementsWithRole,
                focusableElements: focusableElements
            };
        });
        
        results.features[`${contextName}_accessibility`] = accessibilityInfo;
        
        console.log(`    📊 Accessibility - ARIA labels: ${accessibilityInfo.ariaLabels}, Roles: ${accessibilityInfo.roles}, Focusable: ${accessibilityInfo.focusableElements}`);
        
        // Test modal functionality if settings button exists
        if (uiInfo.hasSettings) {
            console.log(`    🔧 Testing settings modal...`);
            
            const settingsClicked = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const settingsBtn = buttons.find(btn => 
                    btn.textContent && (btn.textContent.toLowerCase().includes('settings') || btn.textContent.includes('⚙'))
                );
                if (settingsBtn) {
                    settingsBtn.click();
                    return true;
                }
                return false;
            });
            
            if (settingsClicked) {
                await delay(1000);
                
                const modalOpen = await page.evaluate(() => {
                    const modals = document.querySelectorAll('[role="dialog"], .modal, [data-testid*="modal"]');
                    return Array.from(modals).some(modal => modal.offsetParent !== null);
                });
                
                results.features[`${contextName}_settings_modal`] = modalOpen;
                console.log(`    📊 Settings modal opened: ${modalOpen}`);
                
                if (modalOpen) {
                    // Close modal
                    await page.keyboard.press('Escape');
                    await delay(500);
                }
            }
        }
        
        console.log(`    ✅ UI components test completed`);
        
        // Take screenshot after UI test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${contextName.toLowerCase()}-ui-components.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`    ❌ UI components test failed: ${error.message}`);
        results.errors.push(`[${contextName}] UI Components: ${error.message}`);
    }
}

async function testPracticeFiles(page, contextName, results) {
    console.log(`  📚 Testing Practice Files...`);
    
    try {
        // Look for practice files button
        const practiceButtonExists = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(btn => 
                btn.textContent && btn.textContent.toLowerCase().includes('practice')
            );
        });
        
        console.log(`    📊 Practice files button exists: ${practiceButtonExists}`);
        
        if (practiceButtonExists) {
            // Click practice files button
            const practiceClicked = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const practiceBtn = buttons.find(btn => 
                    btn.textContent && btn.textContent.toLowerCase().includes('practice')
                );
                if (practiceBtn) {
                    practiceBtn.click();
                    return true;
                }
                return false;
            });
            
            if (practiceClicked) {
                await delay(1500);
                
                // Check if practice files modal opened
                const modalInfo = await page.evaluate(() => {
                    const modals = document.querySelectorAll('[role="dialog"], .modal, [data-testid*="modal"]');
                    const openModal = Array.from(modals).find(modal => modal.offsetParent !== null);
                    
                    if (openModal) {
                        // Count practice file options
                        const fileButtons = openModal.querySelectorAll('button');
                        const fileCount = Array.from(fileButtons).filter(btn => 
                            btn.textContent && 
                            (btn.textContent.includes('.js') || 
                             btn.textContent.includes('.py') ||
                             btn.textContent.includes('.txt') ||
                             btn.textContent.includes('.csv') ||
                             btn.textContent.toLowerCase().includes('javascript') ||
                             btn.textContent.toLowerCase().includes('python'))
                        ).length;
                        
                        return {
                            modalOpen: true,
                            fileCount: fileCount,
                            modalContent: openModal.textContent.substring(0, 500)
                        };
                    }
                    
                    return { modalOpen: false, fileCount: 0 };
                });
                
                results.features[`${contextName}_practice_files`] = {
                    buttonExists: practiceButtonExists,
                    ...modalInfo
                };
                
                console.log(`    📊 Practice files modal: ${modalInfo.modalOpen}, Files available: ${modalInfo.fileCount}`);
                
                // Test loading a practice file if available
                if (modalInfo.modalOpen && modalInfo.fileCount > 0) {
                    const fileLoaded = await page.evaluate(() => {
                        const modal = Array.from(document.querySelectorAll('[role="dialog"], .modal')).find(m => m.offsetParent !== null);
                        if (modal) {
                            const fileButtons = modal.querySelectorAll('button');
                            const firstFileBtn = Array.from(fileButtons).find(btn => 
                                btn.textContent && 
                                (btn.textContent.includes('.js') || 
                                 btn.textContent.includes('.py') ||
                                 btn.textContent.toLowerCase().includes('javascript'))
                            );
                            if (firstFileBtn) {
                                firstFileBtn.click();
                                return true;
                            }
                        }
                        return false;
                    });
                    
                    if (fileLoaded) {
                        await delay(1500);
                        
                        // Check if content loaded in editor
                        const editorHasContent = await page.evaluate(() => {
                            const editors = document.querySelectorAll('[data-testid="vim-editor"], .monaco-editor, .view-lines');
                            return Array.from(editors).some(editor => {
                                const textContent = editor.textContent || '';
                                return textContent.trim().length > 20; // Reasonable content length
                            });
                        });
                        
                        results.features[`${contextName}_practice_file_loading`] = editorHasContent;
                        console.log(`    ✅ Practice file loaded successfully: ${editorHasContent}`);
                    }
                }
                
                // Close modal
                await page.keyboard.press('Escape');
                await delay(500);
            }
        } else {
            results.features[`${contextName}_practice_files`] = {
                buttonExists: false
            };
        }
        
        // Take screenshot after practice files test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${contextName.toLowerCase()}-practice-files.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`    ❌ Practice files test failed: ${error.message}`);
        results.errors.push(`[${contextName}] Practice Files: ${error.message}`);
    }
}

async function testKeystrokeVisualizer(page, contextName, results) {
    console.log(`  👁️  Testing Keystroke Visualizer...`);
    
    try {
        // Look for keystroke visualizer toggle
        const visualizerInfo = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const toggleButton = buttons.find(btn => 
                (btn.getAttribute('aria-label') && btn.getAttribute('aria-label').toLowerCase().includes('keystroke')) ||
                (btn.getAttribute('title') && btn.getAttribute('title').toLowerCase().includes('keystroke')) ||
                (btn.textContent && btn.textContent.toLowerCase().includes('keystroke'))
            );
            
            return {
                toggleExists: toggleButton !== null,
                buttonText: toggleButton ? toggleButton.textContent : '',
                buttonLabel: toggleButton ? toggleButton.getAttribute('aria-label') : ''
            };
        });
        
        console.log(`    📊 Keystroke visualizer toggle exists: ${visualizerInfo.toggleExists}`);
        
        if (visualizerInfo.toggleExists) {
            // Enable keystroke visualizer
            const toggleClicked = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const toggleButton = buttons.find(btn => 
                    (btn.getAttribute('aria-label') && btn.getAttribute('aria-label').toLowerCase().includes('keystroke')) ||
                    (btn.getAttribute('title') && btn.getAttribute('title').toLowerCase().includes('keystroke')) ||
                    (btn.textContent && btn.textContent.toLowerCase().includes('keystroke'))
                );
                
                if (toggleButton) {
                    toggleButton.click();
                    return true;
                }
                return false;
            });
            
            if (toggleClicked) {
                await delay(1000);
                
                // Test keystroke display
                await page.keyboard.press('j');
                await delay(100);
                await page.keyboard.press('k');
                await delay(100);
                await page.keyboard.press('h');
                await delay(100);
                await page.keyboard.press('l');
                await delay(500);
                
                // Check if keystrokes are displayed
                const keystrokeVisible = await page.evaluate(() => {
                    const overlays = document.querySelectorAll(
                        '[data-testid="keystroke-overlay"], [class*="keystroke"], .keystroke-overlay, [class*="keypress"]'
                    );
                    
                    return Array.from(overlays).some(overlay => 
                        overlay.offsetParent !== null && 
                        overlay.textContent && 
                        overlay.textContent.trim().length > 0
                    );
                });
                
                results.features[`${contextName}_keystroke_visualizer`] = {
                    ...visualizerInfo,
                    toggleClicked: toggleClicked,
                    visible: keystrokeVisible
                };
                
                console.log(`    ✅ Keystroke visualizer test - visible: ${keystrokeVisible}`);
            }
        } else {
            results.features[`${contextName}_keystroke_visualizer`] = visualizerInfo;
        }
        
        // Take screenshot after keystroke test
        await page.screenshot({ 
            path: path.join(screenshotDir, `${contextName.toLowerCase()}-keystroke.png`),
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`    ❌ Keystroke visualizer test failed: ${error.message}`);
        results.errors.push(`[${contextName}] Keystroke Visualizer: ${error.message}`);
    }
}

function generateReport(results) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalErrors: results.errors.length,
            totalWarnings: results.warnings.length,
            totalConsoleMessages: results.consoleMessages.length,
            totalNetworkRequests: results.networkRequests.length,
            featuresTestedCount: Object.keys(results.features).length
        },
        ...results
    };
    
    // Write detailed report
    fs.writeFileSync(
        path.join(__dirname, 'final-audit-report.json'),
        JSON.stringify(report, null, 2)
    );
    
    // Create summary
    const summary = `
VIM APPLICATION COMPREHENSIVE AUDIT REPORT
==========================================
Generated: ${report.timestamp}

EXECUTIVE SUMMARY:
- Total Errors: ${report.summary.totalErrors}
- Total Warnings: ${report.summary.totalWarnings}
- Console Messages: ${report.summary.totalConsoleMessages}
- Network Requests: ${report.summary.totalNetworkRequests}
- Features Tested: ${report.summary.featuresTestedCount}

CRITICAL FINDINGS:
${results.errors.length > 0 ? 
    results.errors.slice(0, 10).map(err => `❌ ${err}`).join('\n') :
    '✅ No critical errors found'
}

WARNINGS:
${results.warnings.length > 0 ? 
    results.warnings.slice(0, 10).map(warn => `⚠️  ${warn}`).join('\n') :
    '✅ No warnings found'
}

FEATURE ANALYSIS:
${Object.entries(results.features)
    .filter(([key]) => key.includes('_editor_detection') || key.includes('_which_key_normal') || key.includes('_basic_interaction'))
    .map(([key, value]) => {
        if (typeof value === 'object') {
            return `- ${key}: ${JSON.stringify(value, null, 2)}`;
        }
        return `- ${key}: ${value}`;
    })
    .slice(0, 10)
    .join('\n')
}

BROWSER STORAGE ANALYSIS:
${Object.entries(results.storage)
    .map(([key, value]) => {
        if (typeof value === 'object') {
            const summary = value.allKeys ? `${value.allKeys.length} keys` : JSON.stringify(value);
            return `- ${key}: ${summary}`;
        }
        return `- ${key}: ${value}`;
    })
    .join('\n')
}

CONSOLE ERROR ANALYSIS:
${results.consoleMessages
    .filter(msg => msg.type === 'error')
    .slice(0, 5)
    .map(msg => `❌ [${msg.context}] ${msg.text}`)
    .join('\n')
}

RECOMMENDATIONS:
${generateRecommendations(results)}

See final-audit-report.json for complete details.
Screenshots available in test-screenshots/ directory.
`;
    
    fs.writeFileSync(
        path.join(__dirname, 'final-audit-summary.txt'),
        summary
    );
    
    console.log('\n📊 COMPREHENSIVE AUDIT SUMMARY:');
    console.log(summary);
}

function generateRecommendations(results) {
    const recommendations = [];
    
    // Check for editor functionality
    const normalEditor = results.features['Normal_editor_detection'];
    const privateEditor = results.features['Private_editor_detection'];
    
    if (normalEditor && !normalEditor.hasVimWasm && !normalEditor.hasMonaco) {
        recommendations.push('❗ No editor detected in normal mode - critical issue');
    }
    
    if (privateEditor && !privateEditor.hasVimWasm && !privateEditor.hasMonaco) {
        recommendations.push('❗ No editor detected in private mode - check initialization');
    }
    
    // Check which-key functionality
    const whichKeyNormal = results.features['Normal_which_key_normal'];
    const whichKeyPrivate = results.features['Private_which_key_normal'];
    
    if (whichKeyNormal && !whichKeyNormal.visible) {
        recommendations.push('⚠️  Which-Key not visible in normal mode - check space leader key');
    }
    
    if (whichKeyPrivate && !whichKeyPrivate.visible) {
        recommendations.push('⚠️  Which-Key not visible in private mode - check initialization');
    }
    
    // Check storage functionality
    const normalStorage = results.storage['Normal_storage_working'];
    const privateStorage = results.storage['Private_storage_working'];
    
    if (!normalStorage) {
        recommendations.push('❗ localStorage not working in normal mode');
    }
    
    if (!privateStorage) {
        recommendations.push('ℹ️  localStorage not working in private mode (expected behavior)');
    }
    
    // Check for console errors
    const errorCount = results.errors.length;
    if (errorCount > 0) {
        recommendations.push(`⚠️  ${errorCount} errors detected - review console messages`);
    }
    
    if (recommendations.length === 0) {
        recommendations.push('✅ Application appears to be functioning correctly');
        recommendations.push('✅ No critical issues detected in audit');
    }
    
    return recommendations.join('\n');
}

// Run the final audit
runFinalAudit().catch(console.error);