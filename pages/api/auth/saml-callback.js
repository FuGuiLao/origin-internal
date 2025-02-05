import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const samlResponse = req.body.SAMLResponse; // Capture the SAML response
        if (!samlResponse) {
            throw new Error("Missing SAML response");
        }

        // Redirect user to frontend app after authentication
        return res.redirect(`/dashboard?samlResponse=${encodeURIComponent(samlResponse)}`);
    } catch (error) {
        console.error("SAML authentication failed:", error);
        return res.status(400).json({ error: "Invalid SAML response" });
    }
}
