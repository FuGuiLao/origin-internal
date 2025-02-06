import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const samlResponse = urlParams.get("samlResponse");

        if (samlResponse) {
            sessionStorage.setItem("samlToken", samlResponse);
            router.replace("/");
        }
    }, []);

    // Handle SAML Login - Redirects user to our custom SAML API route
    const handleLogin = () => {
        setLoading(true);
        window.location.href = `/api/auth/saml`;
    };

    // Handle Logout
    const handleLogout = () => {
        setLoading(true);
        document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl w-96 text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to ORIGIN</h1>
                <p className="mb-6 text-gray-600">Access internal resources securely with your Microsoft 365 account.</p>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} 
                        text-white font-semibold py-2 px-4 rounded-xl transition duration-300`}
                >
                    {loading ? "Signing In..." : "Sign In with Microsoft 365"}
                </button>
            </div>
        </div>
    );
}
