export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end(); // Only allow POST

    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Authorization code is missing" });

    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const TENANT_ID = process.env.TENANT_ID;
    const REDIRECT_URI = process.env.REDIRECT_URI;

    try {
        const response = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI,
                scope: "openid profile email",
            }),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Token exchange failed", error);
        res.status(500).json({ error: "Failed to exchange token" });
    }
}
