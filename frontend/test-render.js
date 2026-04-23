import puppeteer from 'puppeteer-core';

async function testRender() {
  console.log('Testing website rendering...');
  let browser;
  
  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Capture console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-render.png', fullPage: false });
    console.log('Screenshot saved to test-render.png');
    
    // Check for error boundary
    const hasErrorBoundary = await page.evaluate(() => {
      return !!document.querySelector('[data-error-boundary]') || 
             document.body.innerText.includes('Something went wrong');
    });
    
    // Check for Three.js canvas
    const hasCanvas = await page.evaluate(() => {
      return !!document.querySelector('canvas');
    });
    
    // Check for React content
    const hasReactContent = await page.evaluate(() => {
      return document.getElementById('root')?.children?.length > 0;
    });
    
    console.log('\n=== Test Results ===');
    console.log(`Error Boundary Visible: ${hasErrorBoundary ? '❌ YES - Error!' : '✅ No'}`);
    console.log(`Canvas Element Found: ${hasCanvas ? '✅ Yes' : '❌ No'}`);
    console.log(`React Content Rendered: ${hasReactContent ? '✅ Yes' : '❌ No'}`);
    console.log(`Console Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n=== Console Errors ===');
      errors.slice(0, 3).forEach((err, i) => console.log(`${i + 1}. ${err}`));
    }
    
    if (hasErrorBoundary) {
      console.log('\n❌ ERROR: Website is showing error boundary!');
      console.log('The Three.js hooks error may still be present.');
    } else if (!hasCanvas) {
      console.log('\n⚠️  WARNING: Canvas not found. 3D may not be rendering.');
    } else if (errors.length === 0) {
      console.log('\n✅ SUCCESS: Website appears to be rendering correctly!');
      console.log('No console errors detected.');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

testRender();