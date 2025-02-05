import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";

export default NextAuth({
    providers: [
        CredentialsProvider({
            id: "saml",
            name: "Azure AD SAML",
            credentials: {},
            async authorize(credentials, req) {
                if (req.method !== "GET") {
                    throw new Error("SAML authentication must be initiated via GET request");
                }

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
    useSecureCookies: process.env.NODE_ENV === "production",
    debug: true,
});
