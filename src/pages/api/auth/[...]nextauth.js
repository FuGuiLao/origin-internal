import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export default NextAuth({
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID || "common", // Defaults to 'common' if not specified
            authorization: { params: { scope: "openid profile email User.Read" } },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = profile?.oid || profile?.sub || profile?.id; // Ensure compatibility with different Azure claims
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.id = token.id;
            return session;
        },
    },
    pages: {
        signIn: "/login", // Redirect to custom login page if needed
        error: "/auth/error" // Custom error handling page
    },
    debug: process.env.NODE_ENV === "development", // Enable debugging in development mode
});
