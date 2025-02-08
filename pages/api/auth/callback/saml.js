import nextConnect from "next-connect";
import passport from "passport";
import { serialize } from "cookie";

const handler = nextConnect();

// ✅ Handle SAML callback from Azure AD
handler.post((req, res, next) => {
    console.log("🔍 SAML Callback Triggered");

    passport.authenticate("saml", async (err, user, info) => {
        if (err || !user) {
            console.error("❌ SAML Authentication Failed:", err, info);
            return res.status(401).json({ error: "SAML Authentication failed", details: err });
        }

        console.log("✅ SAML User Authenticated:", user);

        // 🔐 Create session manually using cookies
        const sessionToken = JSON.stringify({ user, expires: new Date(Date.now() + 86400 * 1000) });
        const cookie = serialize("next-auth.session-token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        res.setHeader("Set-Cookie", cookie);
        return res.redirect("/");
    })(req, res, next);
});

export default handler;
