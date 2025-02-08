export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).end(); // Only allow GET

    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.status(401).json({ error: "Access token required" });

    try {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Failed to fetch user info", error);
        res.status(500).json({ error: "Failed to retrieve user info" });
    }
}
