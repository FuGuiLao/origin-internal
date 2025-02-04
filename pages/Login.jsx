import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { callbackUrl } = router.query;

    if (status === "loading") {
        return <p className="text-center text-gray-600 text-xl">Checking authentication...</p>;
    }

    // Extract user details safely
    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "No email available";

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl w-96 text-center">
                {!session ? (
                    <>
                        <h1 className="text-3xl font-bold mb-4">Welcome to ORIGIN</h1>
                        <p className="mb-6 text-gray-600">Access internal resources securely with your Microsoft 365 account.</p>
                        <button
                            onClick={() => signIn("saml", { callbackUrl: callbackUrl || "/" })} // ✅ Updated to use SAML
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
                        >
                            Sign In with Microsoft
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold mb-2">Welcome, {userName}!</h1>
                        <p className="mb-1 text-gray-600">{userEmail}</p>
                        <p className="mb-4 text-gray-500">You are now logged in.</p>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
                        >
                            Sign Out
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
