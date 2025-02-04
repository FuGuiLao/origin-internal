import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
    providers: [
        Providers.Credentials({
            id: "saml",
            name: "Azure AD SAML",
            async authorize(credentials, req) {
                // Implement SAML authentication flow using passport-saml
                const passport = require("passport");
                const SamlStrategy = require("passport-saml").Strategy;

                passport.use(
                    new SamlStrategy(
                        {
                            entryPoint: process.env.SAML_IDP_ENTRY_POINT,
                            issuer: process.env.SAML_IDP_ISSUER,
                            callbackUrl: process.env.SAML_SP_CALLBACK_URL,
                            cert: process.env.SAML_IDP_CERT,
                            privateKey: process.env.SAML_SP_PRIVATE_KEY,
                            decryptionPvk: process.env.SAML_SP_PRIVATE_KEY,
                            signatureAlgorithm: "sha256",
                            wantAssertionsSigned: true,
                            validateInResponseTo: true,
                            disableRequestedAuthnContext: true,
                        },
                        (profile, done) => {
                            return done(null, {
                                id: profile.nameID,
                                email: profile.email || profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                                name: profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                            });
                        }
                    )
                );

                return new Promise((resolve, reject) => {
                    passport.authenticate("saml", (err, user) => {
                        if (err || !user) return reject(new Error("SAML Authentication failed"));
                        resolve(user);
                    })(req);
                });
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    debug: true,
});
