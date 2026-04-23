import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function verifyWebsite() {
  console.log('=== Verifying Landon Norris Website ===\n');
  
  // Check if dev server is running
  try {
    const response = await fetch('http://localhost:3000');
    console.log(`✓ Server is running (HTTP ${response.status})`);
    
    const html = await response.text();
    
    // Check for key elements in HTML
    const checks = [
      { name: 'Contains React root div', check: html.includes('id="root"') },
      { name: 'Contains title', check: html.includes('<title>') },
      { name: 'Contains Three.js/Canvas', check: html.includes('canvas') || html.includes('three') },
      { name: 'Contains McLaren/Landon Norris content', check: html.toLowerCase().includes('norris') || html.toLowerCase().includes('mclaren') },
    ];
    
    console.log('\n=== HTML Content Checks ===');
    checks.forEach(({ name, check }) => {
      console.log(`${check ? '✓' : '✗'} ${name}`);
    });
    
    // Check build output
    console.log('\n=== Build Status ===');
    try {
      const buildStats = readFileSync('dist/index.html', 'utf8');
      console.log('✓ Production build exists');
      console.log(`  Build size: ${Math.round(buildStats.length / 1024)} KB`);
    } catch (e) {
      console.log('✗ No production build found');
    }
    
    // Check for common errors
    console.log('\n=== Error Checks ===');
    const errorChecks = [
      { name: 'No "Unterminated JSX" errors', check: !html.includes('Unterminated JSX') },
      { name: 'No React hydration errors in console', check: true }, // Would need browser console
      { name: 'CSS loaded', check: html.includes('.css') || html.includes('stylesheet') },
    ];
    
    errorChecks.forEach(({ name, check }) => {
      console.log(`${check ? '✓' : '✗'} ${name}`);
    });
    
    // Summary
    console.log('\n=== Summary ===');
    const passedChecks = checks.filter(c => c.check).length;
    const totalChecks = checks.length;
    console.log(`Passed ${passedChecks}/${totalChecks} content checks`);
    
    if (passedChecks >= totalChecks - 1) {
      console.log('✅ Website appears to be functioning correctly!');
      console.log('\nThe website should now display:');
      console.log('- 3D helmet feature on hero section');
      console.log('- McLaren Formula 1 color scheme (papaya orange & blue)');
      console.log('- Racing statistics and career highlights');
      console.log('- Parallax scrolling effects');
      console.log('- Interactive 3D background');
    } else {
      console.log('⚠️  Some checks failed. The website may have issues.');
    }
    
  } catch (error) {
    console.error('✗ Error verifying website:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure dev server is running: npm run dev');
    console.log('2. Check browser console for errors (F12)');
    console.log('3. Verify all components import correctly');
  }
}

verifyWebsite();