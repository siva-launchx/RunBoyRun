// Vercel serverless function.
// Exchanges a Strava OAuth authorization code for an access token.
// Requires STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET set as environment
// variables in your Vercel project settings — never put the secret in
// the frontend code.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const tokenRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json(data);
    }

    // Only return what the frontend needs — access_token is short-lived (6hrs).
    res.status(200).json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      athlete: data.athlete ? { firstname: data.athlete.firstname } : null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Token exchange failed' });
  }
}
