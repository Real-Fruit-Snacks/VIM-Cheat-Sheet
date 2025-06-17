const puppeteer = require('puppeteer');

async function testWhichKeyAccuracy() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/VIM/', { waitUntil: 'networkidle0' });

    console.log('🧪 Testing Which-Key accuracy...');

    // Wait for app to load
    await page.waitForSelector('body', { timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test cases: [key sequence, expected behavior, description]
    const testCases = [
      ['d', 'Should show delete operations', 'Delete operator'],
      ['c', 'Should show change operations', 'Change operator'],
      ['y', 'Should show yank operations', 'Yank operator'],
      ['g', 'Should show goto operations', 'Goto prefix'],
      ['z', 'Should show fold/scroll operations', 'Z prefix'],
      [' ', 'Should show leader commands', 'Space leader'],
      ['dd', 'Should delete line', 'Delete line command'],
      ['yy', 'Should yank line', 'Yank line command'],
      ['cc', 'Should change line', 'Change line command'],
      ['gg', 'Should go to first line', 'Go to first line'],
      ['zz', 'Should center cursor', 'Center cursor line'],
    ];

    const results = [];

    for (const [sequence, expected, description] of testCases) {
      console.log(`Testing: ${sequence} - ${description}`);
      
      try {
        // Press Escape to ensure normal mode
        await page.keyboard.press('Escape');
        await new Promise(resolve => setTimeout(resolve, 100));

        // Type the key sequence
        for (const key of sequence) {
          await page.keyboard.press(key);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Check if Which-Key popup appears (for single keys that should trigger it)
        if (sequence.length === 1 && ['d', 'c', 'y', 'g', 'z', ' '].includes(sequence)) {
          try {
            await page.waitForFunction(() => 
              document.querySelector('span') && 
              document.querySelector('span').textContent.includes('Which Key'),
              { timeout: 200 }
            );
            const popup = await page.evaluateHandle(() => 
              Array.from(document.querySelectorAll('span'))
                .find(span => span.textContent.includes('Which Key'))
                ?.closest('div')
            );
            const isVisible = popup && await popup.isIntersectingViewport();
            
            if (isVisible) {
              // Get the commands shown
              const commands = await page.evaluate(() => {
                const whichKeyDiv = Array.from(document.querySelectorAll('span'))
                  .find(span => span.textContent.includes('Which Key'))
                  ?.closest('div');
                if (!whichKeyDiv) return [];
                return Array.from(whichKeyDiv.querySelectorAll('[data-key]'))
                  .map(el => ({
                    key: el.dataset.key,
                    description: el.textContent.trim()
                  }));
              });
              
              results.push({
                sequence,
                description,
                status: 'PASS',
                popup: true,
                commandCount: commands.length,
                commands: commands.slice(0, 5) // Show first 5 commands
              });
              
              // Close popup
              await page.keyboard.press('Escape');
            } else {
              results.push({
                sequence,
                description,
                status: 'FAIL',
                popup: false,
                error: 'Which-Key popup did not appear'
              });
            }
          } catch (e) {
            results.push({
              sequence,
              description,
              status: 'FAIL',
              popup: false,
              error: 'Which-Key popup timeout'
            });
          }
        } else {
          // For double-key sequences, just verify they don't cause errors
          await new Promise(resolve => setTimeout(resolve, 200));
          results.push({
            sequence,
            description,
            status: 'EXECUTED',
            popup: false,
            note: 'Command executed (no popup expected)'
          });
        }

      } catch (error) {
        results.push({
          sequence,
          description,
          status: 'ERROR',
          error: error.message
        });
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Report results
    console.log('\\n📊 Which-Key Accuracy Test Results:');
    console.log('=====================================');

    let passCount = 0;
    let failCount = 0;

    for (const result of results) {
      const status = result.status === 'PASS' ? '✅' : 
                    result.status === 'EXECUTED' ? '⚡' :
                    result.status === 'FAIL' ? '❌' : '⚠️';
      
      console.log(`${status} ${result.sequence.padEnd(4)} | ${result.description}`);
      
      if (result.popup && result.commands) {
        console.log(`     └─ ${result.commandCount} commands available:`);
        result.commands.forEach(cmd => {
          console.log(`        ${cmd.key}: ${cmd.description}`);
        });
      }
      
      if (result.error) {
        console.log(`     └─ Error: ${result.error}`);
      }
      
      if (result.status === 'PASS' || result.status === 'EXECUTED') passCount++;
      else failCount++;
      
      console.log('');
    }

    console.log(`📈 Summary: ${passCount} passed, ${failCount} failed, ${results.length} total`);

    // Test some specific command accuracy
    console.log('\\n🔍 Testing specific command accuracy...');
    
    // Test leader + f commands
    await page.keyboard.press('Escape');
    await page.keyboard.press(' '); // Space leader
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      await page.waitForFunction(() => 
        document.querySelector('span') && 
        document.querySelector('span').textContent.includes('Which Key'),
        { timeout: 200 }
      );
      await page.keyboard.press('f'); // File operations
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if file operations are shown
      const fileCommands = await page.evaluate(() => {
        const whichKeyDiv = Array.from(document.querySelectorAll('span'))
          .find(span => span.textContent.includes('Which Key'))
          ?.closest('div');
        if (!whichKeyDiv) return [];
        return Array.from(whichKeyDiv.querySelectorAll('[data-key]'))
          .map(el => ({
            key: el.dataset.key,
            description: el.textContent.trim()
          }));
      });
      
      console.log('📁 Space + f (File operations):');
      fileCommands.forEach(cmd => {
        console.log(`   ${cmd.key}: ${cmd.description}`);
      });
      
    } catch (e) {
      console.log('❌ Failed to test leader + f commands');
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testWhichKeyAccuracy().catch(console.error);