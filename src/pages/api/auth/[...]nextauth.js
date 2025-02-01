import NextAuth from "next-auth";
import MicrosoftProvider from "next-auth/providers/microsoft";

export default NextAuth({
    providers: [
        MicrosoftProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            authorization: { params: { scope: "openid profile email User.Read" } },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = profile.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.id = token.id;
            return session;
        },
    },
});
