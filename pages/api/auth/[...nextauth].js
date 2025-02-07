import NextAuth from "next-auth";
import Passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";
import CredentialsProvider from "next-auth/providers/credentials";

// ✅ Initialize Passport globally (prevents multiple strategy registrations)
if (!Passport._strategy("saml")) {
    Passport.use(
        new SamlStrategy(
            {
                entryPoint: process.env.SAML_IDP_ENTRY_POINT,
                issuer: process.env.SAML_IDP_ISSUER,
                callbackUrl: process.env.NEXTAUTH_URL, // Ensure Azure AD matches this
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
                    email:
                        profile.email ||
                        profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                    name:
                        profile["http://schemas.microsoft.com/identity/claims/displayname"] ||
                        `${profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]} ${profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]
                        }`,
                });
            }
        )
    );
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            id: "saml",
            name: "Azure AD SAML",
            credentials: {},

            async authorize(_, req) {
                return new Promise((resolve, reject) => {
                    Passport.authenticate("saml", (err, user) => {
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
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },

    events: {
        async signIn({ user }) {
            console.log("✅ User signed in:", user);
        },
        async signOut({ session }) {
            console.log("🚪 User signed out:", session);
        },
    },

    debug: true,
});
