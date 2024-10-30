// api/proxy.js
export default async function handler(req, res) {
  const { target, path } = req.query;

  if (!target) {
    return res.status(400).json({ error: "Target URL is required" });
  }

  const targetUrl = `${target}${path ? `/${path}` : ''}`;

  // Log the request method and URL for debugging
  console.log(`Request method: ${req.method}`);
  console.log(`Target URL: ${targetUrl}`);

  // Log and capture the request body
  let requestBody;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    requestBody = await getRawBody(req);
    console.log('Request body:', requestBody);
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(target).host,
        'Content-Type': req.headers['content-type'] || 'application/json', // Set content type
      },
      body: requestBody || null, // Set body or null for GET/HEAD
    });

    const responseData = await response.text();

    // Set CORS headers on the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(response.status).send(responseData);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}

// Helper function to parse raw body
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}
