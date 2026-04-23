const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js Test'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\nHTML Preview (first 500 chars):`);
    console.log(data.substring(0, 500));
    
    // Check if root div exists
    if (data.includes('<div id="root"></div>')) {
      console.log('\n✓ Root div found in HTML');
    } else {
      console.log('\n✗ Root div NOT found in HTML');
    }
    
    // Check for script tags
    const scriptCount = (data.match(/<script/g) || []).length;
    console.log(`Found ${scriptCount} script tags`);
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.end();