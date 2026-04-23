import puppeteer from 'puppeteer-core';

async function checkConsole() {
  let browser;
  try {
    console.log('Launching headless browser...');
    
    // Try to find Chrome executable
    const chromePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Users\\Ganesh\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
      process.env.CHROME_PATH
    ].filter(Boolean);

    let executablePath = null;
    for (const path of chromePaths) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(path)) {
          executablePath = path;
          console.log(`Found Chrome at: ${path}`);
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    if (!executablePath) {
      console.log('Chrome not found in common locations, trying default...');
    }

    browser = await puppeteer.launch({
      executablePath: executablePath || undefined,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });

    // Capture page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    // Capture request failures
    const requestFailures = [];
    page.on('requestfailed', request => {
      requestFailures.push({
        url: request.url(),
        failure: request.failure()?.errorText || 'Unknown'
      });
    });

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });

    // Take a screenshot
    await page.screenshot({ path: 'diagnostic-screenshot.png', fullPage: true });
    console.log('Screenshot saved to diagnostic-screenshot.png');

    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);

    // Check page content
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        hasAppRoot: !!document.getElementById('root'),
        appRootChildren: document.getElementById('root')?.children?.length || 0,
        bodyChildren: document.body.children.length,
        computedStyle: window.getComputedStyle(document.body).backgroundColor,
        hasCanvas: !!document.querySelector('canvas'),
        hasThreeJs: !!window.THREE,
        hasReact: !!window.React,
        errorBoundaryVisible: document.querySelector('[data-error-boundary]')?.innerText || 'none'
      };
    });

    console.log('\n=== PAGE ANALYSIS ===');
    console.log(`Title: ${pageContent.title}`);
    console.log(`Has #root element: ${pageContent.hasAppRoot}`);
    console.log(`#root children: ${pageContent.appRootChildren}`);
    console.log(`Body children: ${pageContent.bodyChildren}`);
    console.log(`Body background color: ${pageContent.computedStyle}`);
    console.log(`Has Canvas: ${pageContent.hasCanvas}`);
    console.log(`Has THREE.js: ${pageContent.hasThreeJs}`);
    console.log(`Has React: ${pageContent.hasReact}`);
    console.log(`Error boundary visible: ${pageContent.errorBoundaryVisible}`);

    console.log('\n=== CONSOLE MESSAGES ===');
    if (consoleMessages.length === 0) {
      console.log('No console messages');
    } else {
      consoleMessages.forEach((msg, i) => {
        console.log(`${i + 1}. [${msg.type}] ${msg.text}`);
      });
    }

    console.log('\n=== PAGE ERRORS ===');
    if (pageErrors.length === 0) {
      console.log('No page errors');
    } else {
      pageErrors.forEach((error, i) => {
        console.log(`${i + 1}. ${error}`);
      });
    }

    console.log('\n=== REQUEST FAILURES ===');
    if (requestFailures.length === 0) {
      console.log('No request failures');
    } else {
      requestFailures.forEach((failure, i) => {
        console.log(`${i + 1}. ${failure.url}: ${failure.failure}`);
      });
    }

    // Check for React hydration errors
    const reactHydration = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      const reactScript = scripts.find(s => s.src && s.src.includes('react'));
      return {
        reactLoaded: !!window.React,
        reactDOMLoaded: !!window.ReactDOM,
        hasHydrationMismatch: document.querySelector('[data-reactroot]')?.innerHTML?.includes('<!--$-->') || false
      };
    });

    console.log('\n=== REACT STATUS ===');
    console.log(`React loaded: ${reactHydration.reactLoaded}`);
    console.log(`ReactDOM loaded: ${reactHydration.reactDOMLoaded}`);
    console.log(`Hydration mismatch detected: ${reactHydration.hasHydrationMismatch}`);

  } catch (error) {
    console.error('Diagnostic error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

checkConsole();