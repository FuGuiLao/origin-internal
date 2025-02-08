import nextConnect from "next-connect";
import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";

// ✅ Ensure SAML strategy is only set once
if (!passport._strategy("saml")) {
    passport.use(
        new SamlStrategy(
            {
                entryPoint: process.env.SAML_IDP_ENTRY_POINT,
                issuer: process.env.SAML_IDP_ISSUER,
                callbackUrl: process.env.SAML_SP_CALLBACK_URL,
                cert: process.env.SAML_IDP_CERT,
                privateKey: process.env.SAML_SP_PRIVATE_KEY,
                signatureAlgorithm: "sha256",
                wantAssertionsSigned: true,
                validateInResponseTo: true,
                disableRequestedAuthnContext: true,
            },
            (profile, done) => {
                console.log("🔍 SAML Profile Received:", profile);
                return done(null, {
                    id: profile.nameID,
                    email: profile.email || profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                    name: profile["http://schemas.microsoft.com/identity/claims/displayname"] ||
                        `${profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]} ${profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]
                        }`,
                });
            }
        )
    );
}

const handler = nextConnect();

// ✅ Redirect user to Azure AD SAML authentication
handler.get((req, res, next) => {
    passport.authenticate("saml")(req, res, next);
});

export default handler;
