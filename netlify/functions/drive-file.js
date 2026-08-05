// netlify/functions/drive-file.js
exports.handler = async function (event) {
  try {
    // fileId can come from query param (via redirect) or as last path segment
    const qs = event.queryStringParameters || {};
    let fileId = qs.fileId;
    if (!fileId) {
      const parts = event.path ? event.path.split("/") : [];
      fileId = parts[parts.length - 1];
    }
    if (!fileId) return { statusCode: 400, body: "missing fileId" };

    const key = process.env.LOVABLE_API_KEY;
    const connKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!key || !connKey) return { statusCode: 500, body: "Drive connector not configured" };

    const url = `https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${encodeURIComponent(
      fileId,
    )}?alt=media`;

    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${key}`,
        "X-Connection-Api-Key": connKey,
      },
    });

    if (!r.ok) {
      const body = await r.text();
      return { statusCode: r.status, body: `Drive error: ${body}` };
    }

    const arrayBuffer = await r.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ct = r.headers.get("content-type") || "application/octet-stream";
    const cache = r.headers.get("cache-control") || "public, max-age=604800, immutable";

    return {
      statusCode: 200,
      headers: {
        "content-type": ct,
        "cache-control": cache,
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 502, body: "Proxy error" };
  }
};
