import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const description = 'ORIGIN / Internal Resources.';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        window.location.href = `/api/auth/signin/saml`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="bg-white text-gray-900 p-12 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <h1 className="text-4xl font-bold mb-6">Welcome to ORIGIN</h1>
                <p className="mb-6 text-gray-600">
                    Access internal resources securely with your Microsoft 365 account.
                </p>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full py-3 px-6 text-lg font-semibold rounded-lg transition duration-300 ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                    {loading ? "Signing In..." : "Sign In with Microsoft 365"}
                </button>
            </div>
        </div>
    );
}
