import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Capture SAML response from URL
        const urlParams = new URLSearchParams(window.location.search);
        const samlResponse = urlParams.get("samlResponse");

        if (samlResponse) {
            sessionStorage.setItem("samlToken", samlResponse);
            router.replace("/"); // Remove SAML response from URL
        }
    }, []);

    // Handle Login - Redirects user to /api/auth/signin/saml (GET Request)
    const handleLogin = () => {
        setLoading(true);
        window.location.href = `/api/auth/signin/saml`; // Forces GET request for NextAuth SAML
    };

    // Handle Logout
    const handleLogout = async () => {
        setLoading(true);
        await signOut({ callbackUrl: "/" });
        setLoading(false);
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-600 text-xl">Checking authentication...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl w-96 text-center">
                {!session ? (
                    <>
                        <h1 className="text-3xl font-bold mb-4">Welcome to ORIGIN</h1>
                        <p className="mb-6 text-gray-600">
                            Access internal resources securely with your Microsoft 365 account.
                        </p>
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} 
                                text-white font-semibold py-2 px-4 rounded-xl transition duration-300`}
                        >
                            {loading ? "Signing In..." : "Sign In with Microsoft 365"}
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold mb-2">Welcome, {session.user.name}!</h1>
                        <p className="mb-1 text-gray-600">{session.user.email || "No email available"}</p>
                        <p className="mb-4 text-gray-500">You are now logged in.</p>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className={`w-full ${loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"} 
                                text-white font-semibold py-2 px-4 rounded-xl transition duration-300`}
                        >
                            {loading ? "Signing Out..." : "Sign Out"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
