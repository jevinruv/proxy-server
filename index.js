export default async function handler(req, res) {
  const { target, path } = req.query;

  if (!target) {
    return res.status(400).json({ error: "Target URL is required" });
  }

  const targetUrl = `${target}${path ? `/${path}` : ''}`;

  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins; adjust if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  try {

    const data = {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(target).host,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    };

    console.log(data);

    const response = await fetch(targetUrl, data);
    const responseData = await response.text();
    
    // Set CORS headers on the response
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins; adjust if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(response.status).send(responseData);
  } 
  catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
