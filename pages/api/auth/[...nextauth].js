import NextAuth from "next-auth";

export default NextAuth({
    providers: [],
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

    debug: true,
});
