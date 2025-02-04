import NextAuth from "next-auth";
import { Credentials } from "next-auth/providers";
import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";

export const authOptions = {
    providers: [
        Credentials({
            id: "saml",
            name: "Azure AD SAML",
            async authorize(credentials, req) {
                if (!passport._strategy("saml")) {
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
                                    name: profile["http://schemas.microsoft.com/identity/claims/displayname"] ||
                                        `${profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]} ${profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]}`,
                                });
                            }
                        )
                    );
                }

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
};

export default NextAuth(authOptions);
