import NextAuth from "next-auth";

export default NextAuth({
    providers: [], // ❌ SAML is handled externally in /api/auth/callback/saml
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" }, // ✅ Use JWT to store user session

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name,
                email: token.email,
            };
            return session;
        },
    },

    pages: {
        signIn: "/login",
        signOut: "/",
    },

    debug: true,
});
