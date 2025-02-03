import { signIn, signOut, useSession } from "next-auth/react";

export default function LandingPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-600 text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl w-96 text-center">
                {!session ? (
                    <>
                        <h1 className="text-3xl font-bold mb-4">Welcome to ORIGIN</h1>
                        <p className="mb-6 text-gray-600">Access internal resources securely with your Azure account.</p>
                        <button
                            onClick={() => signIn("azure-ad")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
                        >
                            Sign In with Azure
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold mb-2">Welcome, {session.user.name}!</h1>
                        <p className="mb-4 text-gray-600">You are now logged in.</p>
                        <button
                            onClick={() => signOut()}
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
