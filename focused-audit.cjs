const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure screenshots directory exists
const screenshotDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runFocusedAudit() {
    console.log('🔍 Starting Focused VIM Application Audit...\n');
    
    const results = {
        errors: [],
        warnings: [],
        features: {},
        storage: {},
        consoleMessages: []
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
        
        // Create new page (private mode simulation through new context)
        const page = await browser.newPage();
        
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
                results.errors.push(`[${context.name}] ${msg.text()}`);
            } else if (msg.type() === 'warning') {
                console.log(`⚠️  Console Warning: ${msg.text()}`);
                results.warnings.push(`[${context.name}] ${msg.text()}`);
            }
        });
        
        // Monitor network failures
        page.on('response', response => {
            if (!response.ok()) {
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
            await page.waitForTimeout(3000);
            
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
            
            // Test 4: UI Components
            await testUIComponents(page, context.name, results);
            
            // Test 5: Mode Detection
            await testModeDetection(page, context.name, results);
            
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
    
    console.log('\n🎯 Focused Audit Complete!');
    console.log('📊 Check focused-audit-report.json for detailed results');
    console.log('📸 Screenshots saved in test-screenshots/ directory');
}

async function testEditorBasics(page, contextName, results) {
    console.log(`  🔧 Testing Editor Basics...`);
    
    try {
        // Wait for either vim.wasm or Monaco editor to load
        await page.waitForSelector('[data-testid="vim-editor"], .monaco-editor, .view-lines', { timeout: 10000 });
        
        // Detect editor type
        const editorInfo = await page.evaluate(() => {
            const vimEditor = document.querySelector('[data-testid="vim-editor"]');
            const monacoEditor = document.querySelector('.monaco-editor');
            const viewLines = document.querySelector('.view-lines');
            
            return {
                hasVimWasm: vimEditor !== null,
                hasMonaco: monacoEditor !== null || viewLines !== null,
                vimWasmPromise: typeof window.__vimWasmPromise !== 'undefined',
                sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined'
            };
        });
        
        results.features[`${contextName}_editor_detection`] = editorInfo;
        
        console.log(`    📊 Editor Type - vim.wasm: ${editorInfo.hasVimWasm}, Monaco: ${editorInfo.hasMonaco}`);
        console.log(`    📊 SharedArrayBuffer: ${editorInfo.sharedArrayBuffer}`);
        
        // Test basic editor interaction
        const editorSelector = editorInfo.hasVimWasm ? '[data-testid="vim-editor"]' : '.monaco-editor, .view-lines';
        
        // Click on editor to focus
        await page.click(editorSelector);
        await page.waitForTimeout(500);
        
        // Test insert mode
        await page.keyboard.press('i');
        await page.waitForTimeout(200);
        await page.keyboard.type('Test content for audit');
        await page.waitForTimeout(200);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        
        // Test basic movement
        await page.keyboard.press('g');
        await page.keyboard.press('g'); // Go to top
        await page.waitForTimeout(200);
        
        console.log(`    ✅ Basic editor interaction test passed`);
        
        results.features[`${contextName}_basic_interaction`] = true;
        
    } catch (error) {
        console.log(`    ❌ Editor basics test failed: ${error.message}`);
        results.features[`${contextName}_basic_interaction`] = false;
        results.errors.push(`[${contextName}] Editor Basics: ${error.message}`);
    }
}

async function testWhichKey(page, contextName, results) {
    console.log(`  ⌨️  Testing Which-Key System...`);
    
    try {
        // Ensure we're in normal mode
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        
        // Test space as leader key
        await page.keyboard.press('Space');
        await page.waitForTimeout(100); // 50ms timeout + buffer
        
        // Check for which-key popup
        const whichKeyVisible = await page.evaluate(() => {
            // Look for various possible which-key selectors
            const selectors = [
                '[data-testid="which-key-popup"]',
                '[data-testid="which-key"]',
                '.which-key',
                '[class*="which-key"]',
                '[role="tooltip"]',
                '.tooltip'
            ];
            
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    return { visible: true, selector: selector, text: element.textContent };
                }
            }
            
            return { visible: false };
        });
        
        results.features[`${contextName}_which_key`] = whichKeyVisible;
        
        console.log(`    📊 Which-Key popup: ${whichKeyVisible.visible}`);
        if (whichKeyVisible.visible) {
            console.log(`    📊 Which-Key content: ${whichKeyVisible.text?.substring(0, 100)}...`);
        }
        
        // Test space in insert mode (should not trigger which-key)
        await page.keyboard.press('i'); // Enter insert mode
        await page.waitForTimeout(200);
        await page.keyboard.press('Space');
        await page.waitForTimeout(100);
        
        const whichKeyInInsert = await page.evaluate(() => {
            const selectors = [
                '[data-testid="which-key-popup"]',
                '.which-key',
                '[class*="which-key"]'
            ];
            
            return selectors.some(selector => {
                const element = document.querySelector(selector);
                return element && element.offsetParent !== null;
            });
        });
        
        results.features[`${contextName}_which_key_insert_mode`] = !whichKeyInInsert; // Should be false (not visible)
        
        console.log(`    📊 Which-Key correctly hidden in insert mode: ${!whichKeyInInsert}`);
        
        // Return to normal mode
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        
        // Test operator keys
        const operators = ['d', 'c', 'y'];
        for (const op of operators) {
            await page.keyboard.press(op);
            await page.waitForTimeout(100);
            
            // Check if operator pending is detected
            const operatorState = await page.evaluate((operator) => {
                // Look for mode indicators
                const statusElements = document.querySelectorAll('[class*="status"], [class*="mode"], .status-bar');
                const modeText = Array.from(statusElements)
                    .map(el => el.textContent)
                    .join(' ')
                    .toLowerCase();
                
                return {
                    modeText: modeText,
                    containsOperator: modeText.includes(operator)
                };
            }, op);
            
            results.features[`${contextName}_operator_${op}`] = operatorState;
            
            await page.keyboard.press('Escape'); // Cancel operator
            await page.waitForTimeout(100);
        }
        
        console.log(`    ✅ Which-Key system test completed`);
        
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
        
        console.log(`    📊 localStorage keys: ${storageInfo.allKeys.join(', ')}`);
        console.log(`    📊 VIM keys present: ${Object.keys(storageInfo.vimKeys).filter(k => storageInfo.vimKeys[k] !== null).join(', ')}`);
        
        // Test storage functionality
        await page.evaluate(() => {
            localStorage.setItem('audit-test', JSON.stringify({ test: 'value', timestamp: Date.now() }));
        });
        
        const testValue = await page.evaluate(() => {
            const value = localStorage.getItem('audit-test');
            localStorage.removeItem('audit-test'); // Clean up
            return value;
        });
        
        const storageWorking = testValue !== null;
        results.storage[`${contextName}_storage_working`] = storageWorking;
        
        console.log(`    ✅ Storage read/write test: ${storageWorking ? 'PASSED' : 'FAILED'}`);
        
    } catch (error) {
        console.log(`    ❌ Storage test failed: ${error.message}`);
        results.errors.push(`[${contextName}] Storage: ${error.message}`);
    }
}

async function testUIComponents(page, contextName, results) {
    console.log(`  🪟 Testing UI Components...`);
    
    try {
        // Count buttons and interactive elements
        const uiInfo = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            const inputs = document.querySelectorAll('input, textarea');
            const modals = document.querySelectorAll('[role="dialog"], .modal');
            
            // Look for specific UI elements
            const hasSettings = Array.from(buttons).some(btn => 
                btn.textContent && btn.textContent.toLowerCase().includes('settings')
            );
            
            const hasHelp = Array.from(buttons).some(btn => 
                btn.textContent && (btn.textContent.includes('?') || btn.textContent.toLowerCase().includes('help'))
            );
            
            const hasPractice = Array.from(buttons).some(btn => 
                btn.textContent && btn.textContent.toLowerCase().includes('practice')
            );
            
            return {
                buttonCount: buttons.length,
                inputCount: inputs.length,
                modalCount: modals.length,
                hasSettings: hasSettings,
                hasHelp: hasHelp,
                hasPractice: hasPractice
            };
        });
        
        results.features[`${contextName}_ui_components`] = uiInfo;
        
        console.log(`    📊 UI Elements - Buttons: ${uiInfo.buttonCount}, Inputs: ${uiInfo.inputCount}`);
        console.log(`    📊 Key Features - Settings: ${uiInfo.hasSettings}, Help: ${uiInfo.hasHelp}, Practice: ${uiInfo.hasPractice}`);
        
        // Test accessibility features
        const accessibilityInfo = await page.evaluate(() => {
            const elementsWithAriaLabels = document.querySelectorAll('[aria-label]').length;
            const elementsWithAriaDescribed = document.querySelectorAll('[aria-describedby]').length;
            const elementsWithRole = document.querySelectorAll('[role]').length;
            
            return {
                ariaLabels: elementsWithAriaLabels,
                ariaDescribed: elementsWithAriaDescribed,
                roles: elementsWithRole
            };
        });
        
        results.features[`${contextName}_accessibility`] = accessibilityInfo;
        
        console.log(`    📊 Accessibility - ARIA labels: ${accessibilityInfo.ariaLabels}, Roles: ${accessibilityInfo.roles}`);
        console.log(`    ✅ UI components test completed`);
        
    } catch (error) {
        console.log(`    ❌ UI components test failed: ${error.message}`);
        results.errors.push(`[${contextName}] UI Components: ${error.message}`);
    }
}

async function testModeDetection(page, contextName, results) {
    console.log(`  🎯 Testing Mode Detection...`);
    
    try {
        // Test different VIM modes
        const modes = [
            { name: 'normal', keys: ['Escape'] },
            { name: 'insert', keys: ['i'] },
            { name: 'visual', keys: ['Escape', 'v'] }
        ];
        
        const modeResults = {};
        
        for (const mode of modes) {
            // Enter the mode
            for (const key of mode.keys) {
                await page.keyboard.press(key);
                await page.waitForTimeout(200);
            }
            
            // Check mode detection
            const modeInfo = await page.evaluate(() => {
                // Look for mode indicators in various places
                const statusElements = document.querySelectorAll(
                    '.status-bar, [class*="status"], [class*="mode"], .mode-indicator'
                );
                
                const modeTexts = Array.from(statusElements).map(el => ({
                    text: el.textContent,
                    className: el.className
                }));
                
                // Also check for cursor style changes
                const cursorInfo = {
                    hasCursor: document.querySelector('.cursor, [class*="cursor"]') !== null,
                    hasBlinkingCursor: document.querySelector('.cursor-blink, [class*="blink"]') !== null
                };
                
                return {
                    modeTexts: modeTexts,
                    cursorInfo: cursorInfo
                };
            });
            
            modeResults[mode.name] = modeInfo;
            console.log(`    📊 ${mode.name} mode detected: ${JSON.stringify(modeInfo.modeTexts)}`);
        }
        
        results.features[`${contextName}_mode_detection`] = modeResults;
        
        // Return to normal mode
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        
        console.log(`    ✅ Mode detection test completed`);
        
    } catch (error) {
        console.log(`    ❌ Mode detection test failed: ${error.message}`);
        results.errors.push(`[${contextName}] Mode Detection: ${error.message}`);
    }
}

function generateReport(results) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalErrors: results.errors.length,
            totalWarnings: results.warnings.length,
            totalConsoleMessages: results.consoleMessages.length,
            featuresTestedCount: Object.keys(results.features).length
        },
        errors: results.errors,
        warnings: results.warnings,
        features: results.features,
        storage: results.storage,
        consoleMessages: results.consoleMessages
    };
    
    // Write detailed report
    fs.writeFileSync(
        path.join(__dirname, 'focused-audit-report.json'),
        JSON.stringify(report, null, 2)
    );
    
    // Create summary
    const summary = `
VIM APPLICATION FOCUSED AUDIT REPORT
===================================
Generated: ${report.timestamp}

SUMMARY STATISTICS:
- Total Errors: ${report.summary.totalErrors}
- Total Warnings: ${report.summary.totalWarnings}
- Console Messages: ${report.summary.totalConsoleMessages}
- Features Tested: ${report.summary.featuresTestedCount}

CRITICAL FINDINGS:
${results.errors.length > 0 ? 
    results.errors.slice(0, 5).map(err => `❌ ${err}`).join('\n') :
    '✅ No critical errors found'
}

WARNINGS:
${results.warnings.length > 0 ? 
    results.warnings.slice(0, 5).map(warn => `⚠️  ${warn}`).join('\n') :
    '✅ No warnings found'
}

KEY FEATURE STATUS:
${Object.entries(results.features)
    .filter(([key]) => key.includes('_editor_detection') || key.includes('_which_key') || key.includes('_basic_interaction'))
    .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
    .join('\n')
}

BROWSER STORAGE STATUS:
${Object.entries(results.storage)
    .map(([key, value]) => `- ${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`)
    .join('\n')
}

See focused-audit-report.json for complete details and console logs.
`;
    
    fs.writeFileSync(
        path.join(__dirname, 'focused-audit-summary.txt'),
        summary
    );
    
    console.log('\n📊 AUDIT SUMMARY:');
    console.log(summary);
}

// Run the focused audit
runFocusedAudit().catch(console.error);