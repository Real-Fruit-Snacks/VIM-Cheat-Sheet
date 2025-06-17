const puppeteer = require('puppeteer');

async function extendedWaitTest() {
    console.log('🕐 Extended Wait Test - Giving vim.wasm more time to initialize...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Monitor all console messages
    const consoleMessages = [];
    page.on('console', msg => {
        const message = `[${msg.type()}] ${msg.text()}`;
        consoleMessages.push(message);
        console.log(`💬 ${message}`);
    });
    
    try {
        console.log('🚀 Loading application...');
        await page.goto('http://localhost:5173/VIM/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        console.log('⏳ Waiting 30 seconds for vim.wasm to fully initialize...');
        
        // Check state every 5 seconds for 30 seconds
        for (let i = 1; i <= 6; i++) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const state = await page.evaluate(() => {
                return {
                    loading: document.body.textContent.includes('Loading VIM'),
                    hasVimEditor: document.querySelector('[data-testid="vim-editor"]') !== null,
                    hasMonaco: document.querySelector('.monaco-editor') !== null,
                    hasViewLines: document.querySelector('.view-lines') !== null,
                    bodyText: document.body.textContent.substring(0, 200)
                };
            });
            
            console.log(`⏰ ${i*5}s - Loading: ${state.loading}, VIM Editor: ${state.hasVimEditor}, Monaco: ${state.hasMonaco}, ViewLines: ${state.hasViewLines}`);
            
            if (!state.loading || state.hasVimEditor || state.hasMonaco || state.hasViewLines) {
                console.log('✅ Editor state changed! Breaking wait loop.');
                break;
            }
        }
        
        // Final check
        const finalState = await page.evaluate(() => {
            return {
                loading: document.body.textContent.includes('Loading VIM'),
                hasVimEditor: document.querySelector('[data-testid="vim-editor"]') !== null,
                hasMonaco: document.querySelector('.monaco-editor') !== null,
                hasViewLines: document.querySelector('.view-lines') !== null,
                hasTextArea: document.querySelector('textarea') !== null,
                hasCanvas: document.querySelector('canvas') !== null,
                allDivs: document.querySelectorAll('div').length,
                bodyHTML: document.body.innerHTML.length,
                windowVim: typeof window.vim !== 'undefined',
                windowVimWasm: typeof window.__vimWasmPromise !== 'undefined'
            };
        });
        
        console.log('\n📊 Final State After 30s:');
        console.log(`   Still Loading: ${finalState.loading}`);
        console.log(`   Has VIM Editor: ${finalState.hasVimEditor}`);
        console.log(`   Has Monaco: ${finalState.hasMonaco}`);
        console.log(`   Has View Lines: ${finalState.hasViewLines}`);
        console.log(`   Has Textarea: ${finalState.hasTextArea}`);
        console.log(`   Has Canvas: ${finalState.hasCanvas}`);
        console.log(`   Total Divs: ${finalState.allDivs}`);
        console.log(`   Body HTML Size: ${finalState.bodyHTML} chars`);
        console.log(`   Window VIM: ${finalState.windowVim}`);
        console.log(`   Window VIM WASM: ${finalState.windowVimWasm}`);
        
        // Try to interact if editor is loaded
        if (finalState.hasVimEditor || finalState.hasMonaco || finalState.hasTextArea) {
            console.log('\n🎯 Attempting to interact with editor...');
            
            const selector = finalState.hasVimEditor ? '[data-testid="vim-editor"]' : 
                           finalState.hasMonaco ? '.monaco-editor' : 
                           'textarea';
            
            await page.click(selector);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await page.keyboard.press('i');
            await new Promise(resolve => setTimeout(resolve, 200));
            await page.keyboard.type('Test from extended wait');
            await new Promise(resolve => setTimeout(resolve, 200));
            await page.keyboard.press('Escape');
            
            console.log('✅ Editor interaction attempted');
            
            // Test which-key
            await page.keyboard.press('Space');
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const whichKeyVisible = await page.evaluate(() => {
                const elements = document.querySelectorAll('.which-key, [data-testid*="which-key"], [class*="which-key"]');
                return Array.from(elements).some(el => el.offsetParent !== null && el.textContent.trim().length > 0);
            });
            
            console.log(`🔑 Which-Key visible after space: ${whichKeyVisible}`);
        }
        
        // Final screenshot
        await page.screenshot({ 
            path: '/home/user/Projects/VIM/test-screenshots/extended-wait-final.png',
            fullPage: true 
        });
        
        console.log('\n📄 Console Messages Summary:');
        consoleMessages.forEach((msg, i) => {
            console.log(`   ${i+1}. ${msg}`);
        });
        
    } catch (error) {
        console.log(`❌ Extended wait test failed: ${error.message}`);
    }
    
    await browser.close();
    console.log('\n🏁 Extended wait test complete!');
}

extendedWaitTest().catch(console.error);