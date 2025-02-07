import NextAuth from "next-auth";

export default NextAuth({
    providers: [], // No SAML here
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },

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
    },

    pages: {
        signIn: "/login",
        signOut: "/",
    },

    logger: {
        error(code, metadata) {
            console.error("❌ NextAuth Error:", code, metadata);
        },
        warn(code) {
            console.warn("⚠️ NextAuth Warning:", code);
        },
        debug(code, metadata) {
            console.debug("🔍 NextAuth Debug:", code, metadata);
        },
    },

    debug: true,  // ✅ Enables full debug logging
});
