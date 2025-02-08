import { serialize } from "cookie";
import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";
import nextConnect from "next-connect";

// ✅ Initialize Passport SAML Strategy
passport.use(
    new SamlStrategy(
        {
            entryPoint: process.env.SAML_IDP_ENTRY_POINT,
            issuer: process.env.SAML_IDP_ISSUER,
            callbackUrl: process.env.SAML_SP_CALLBACK_URL, // ✅ Ensure this matches Azure
            cert: process.env.SAML_IDP_CERT,
            privateKey: process.env.SAML_SP_PRIVATE_KEY,
            signatureAlgorithm: "sha256",
            wantAssertionsSigned: true,
            validateInResponseTo: true,
            disableRequestedAuthnContext: true,
        },
        (profile, done) => {
            console.log("🔍 RAW SAML PROFILE:", profile);

            const userProfile = {
                id: profile.nameID,
                email:
                    profile.email ||
                    profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                name: profile["http://schemas.microsoft.com/identity/claims/displayname"] ||
                    `${profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]} ${profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]
                    }`,
            };

            console.log("✅ Fixed SAML Profile:", userProfile);
            return done(null, userProfile);
        }
    )
);

const handler = nextConnect();

// ✅ Log Incoming SAML Callback Request
handler.post((req, res, next) => {
    console.log("🔍 SAML Callback Triggered");

    passport.authenticate("saml", async (err, user, info) => {
        if (err || !user) {
            console.error("❌ SAML Authentication Failed:", err, info);
            return res.status(401).json({ error: "SAML Authentication failed", details: err });
        }

        console.log("✅ SAML User Authenticated:", user);

        // 🔐 Create a session manually
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
