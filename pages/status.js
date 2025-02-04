import { useSession } from "next-auth/react";

export default function Status() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Checking authentication...</p>;
    }

    return session ? (
        <p>✅ Logged in as {session.user.email}</p>
    ) : (
        <p>❌ Not logged in</p>
    );
}
