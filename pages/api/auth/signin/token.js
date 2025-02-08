import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ token });
}
