const puppeteer = require('puppeteer');

async function debugAudit() {
    console.log('🔍 Debug Audit - Understanding Editor Loading Issues...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Monitor all console messages
    page.on('console', msg => {
        console.log(`💬 Console [${msg.type()}]: ${msg.text()}`);
    });
    
    // Monitor network
    page.on('response', response => {
        if (!response.ok() && !response.url().includes('favicon')) {
            console.log(`🌐 Network [${response.status()}]: ${response.url()}`);
        }
    });
    
    try {
        console.log('🚀 Loading application...');
        await page.goto('http://localhost:5173/VIM/', { 
            waitUntil: 'networkidle2',
            timeout: 20000 
        });
        
        // Wait a bit for dynamic loading
        console.log('⏳ Waiting for initial load...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check what's actually on the page
        const pageInfo = await page.evaluate(() => {
            return {
                title: document.title,
                loadingText: document.body.textContent.includes('Loading VIM'),
                hasVimEditor: document.querySelector('[data-testid="vim-editor"]') !== null,
                hasMonacoEditor: document.querySelector('.monaco-editor') !== null,
                hasViewLines: document.querySelector('.view-lines') !== null,
                sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
                webAssembly: typeof WebAssembly !== 'undefined',
                secureContext: window.isSecureContext,
                crossOriginIsolated: window.crossOriginIsolated,
                vimWasmPromise: typeof window.__vimWasmPromise !== 'undefined',
                bodyText: document.body.textContent.substring(0, 500),
                allElements: Array.from(document.querySelectorAll('*')).length,
                buttons: Array.from(document.querySelectorAll('button')).map(btn => btn.textContent),
                errors: window.__errors || []
            };
        });
        
        console.log('\n📊 Page Analysis:');
        console.log(`   Title: ${pageInfo.title}`);
        console.log(`   Loading VIM: ${pageInfo.loadingText}`);
        console.log(`   Has VIM Editor: ${pageInfo.hasVimEditor}`);
        console.log(`   Has Monaco Editor: ${pageInfo.hasMonacoEditor}`);
        console.log(`   Has View Lines: ${pageInfo.hasViewLines}`);
        console.log(`   SharedArrayBuffer: ${pageInfo.sharedArrayBuffer}`);
        console.log(`   WebAssembly: ${pageInfo.webAssembly}`);
        console.log(`   Secure Context: ${pageInfo.secureContext}`);
        console.log(`   Cross Origin Isolated: ${pageInfo.crossOriginIsolated}`);
        console.log(`   VIM WASM Promise: ${pageInfo.vimWasmPromise}`);
        console.log(`   Total Elements: ${pageInfo.allElements}`);
        console.log(`   Buttons: ${pageInfo.buttons.join(', ')}`);
        console.log(`   Body Text: ${pageInfo.bodyText}`);
        
        // Try to wait for editor to appear
        console.log('\n⏳ Waiting for editor to load...');
        try {
            await page.waitForFunction(() => {
                return document.querySelector('[data-testid="vim-editor"]') !== null ||
                       document.querySelector('.monaco-editor') !== null ||
                       document.querySelector('.view-lines') !== null ||
                       !document.body.textContent.includes('Loading VIM');
            }, { timeout: 15000 });
            
            console.log('✅ Editor appeared or loading finished!');
            
            // Check final state
            const finalState = await page.evaluate(() => {
                return {
                    loadingText: document.body.textContent.includes('Loading VIM'),
                    hasVimEditor: document.querySelector('[data-testid="vim-editor"]') !== null,
                    hasMonacoEditor: document.querySelector('.monaco-editor') !== null,
                    hasViewLines: document.querySelector('.view-lines') !== null,
                    bodyText: document.body.textContent.substring(0, 500)
                };
            });
            
            console.log('\n📊 Final State:');
            console.log(`   Loading VIM: ${finalState.loadingText}`);
            console.log(`   Has VIM Editor: ${finalState.hasVimEditor}`);
            console.log(`   Has Monaco Editor: ${finalState.hasMonacoEditor}`);
            console.log(`   Has View Lines: ${finalState.hasViewLines}`);
            console.log(`   Body Text: ${finalState.bodyText}`);
            
        } catch (timeoutError) {
            console.log('❌ Editor loading timed out after 15 seconds');
            
            // Check what's on the page when timeout occurs
            const timeoutState = await page.evaluate(() => {
                return {
                    loadingText: document.body.textContent.includes('Loading VIM'),
                    bodyText: document.body.textContent,
                    innerHTML: document.body.innerHTML.substring(0, 1000)
                };
            });
            
            console.log('\n📊 Timeout State:');
            console.log(`   Still Loading: ${timeoutState.loadingText}`);
            console.log(`   Body Text: ${timeoutState.bodyText}`);
            console.log(`   Body HTML: ${timeoutState.innerHTML}`);
        }
        
        // Take a screenshot
        await page.screenshot({ 
            path: '/home/user/Projects/VIM/test-screenshots/debug-final.png',
            fullPage: true 
        });
        
    } catch (error) {
        console.log(`❌ Debug audit failed: ${error.message}`);
        
        // Screenshot on error
        try {
            await page.screenshot({ 
                path: '/home/user/Projects/VIM/test-screenshots/debug-error.png',
                fullPage: true 
            });
        } catch (screenshotError) {
            console.log(`Failed to take error screenshot: ${screenshotError.message}`);
        }
    }
    
    await browser.close();
    console.log('\n🏁 Debug audit complete!');
}

debugAudit().catch(console.error);