import nextConnect from "next-connect";
import passport from "passport";

const handler = nextConnect();

// ✅ Redirects user to Azure AD for authentication
handler.get((req, res, next) => {
    passport.authenticate("saml")(req, res, next);
});

export default handler;
