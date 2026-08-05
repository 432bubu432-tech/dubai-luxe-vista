import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxy GET /api/drive/[fileId] -> connector-gateway.lovable.dev
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { fileId } = req.query;
  if (!fileId || Array.isArray(fileId)) return res.status(400).send('missing fileId');

  const key = process.env.LOVABLE_API_KEY;
  const connKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!key || !connKey) return res.status(500).send('Drive connector not configured');

  const url = `https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${encodeURIComponent(
    String(fileId),
  )}?alt=media`;

  try {
    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${key}`,
        'X-Connection-Api-Key': connKey,
      },
    });
    if (!r.ok) {
      const body = await r.text();
      return res.status(r.status).send(`Drive error: ${body}`);
    }
    // forward content-type and cache-control
    const ct = r.headers.get('content-type');
    if (ct) res.setHeader('content-type', ct);
    res.setHeader('cache-control', 'public, max-age=604800, immutable');

    const buffer = await r.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(502).send('Proxy error');
  }
}
