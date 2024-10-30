// api/proxy.js
export default async function handler(req, res) {
  const { target, path } = req.query;

  if (!target) {
    return res.status(400).json({ error: "Target URL is required" });
  }

  const targetUrl = `${target}${path ? `/${path}` : ''}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(target).host,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const responseData = await response.text();
    res.status(response.status).send(responseData);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
