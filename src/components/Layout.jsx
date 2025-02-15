import Link from 'next/link';
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Logo } from '@/components/Logo';
import { Navigation } from '@/components/Navigation';
import { Prose } from '@/components/Prose';
import { SectionProvider } from '@/components/SectionProvider';
import { useSession, signIn, signOut } from "next-auth/react";

export function Layout({ children, sections = [] }) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-600 text-xl">Loading...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl w-96 text-center">
                    <h1 className="text-3xl font-bold mb-4">Welcome to ORIGIN</h1>
                    <p className="mb-6 text-gray-600">Access internal resources securely with your Microsoft 365 account.</p>
                    <button
                        onClick={() => signIn("microsoft")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
                    >
                        Sign In with Microsoft
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <SectionProvider sections={sections}>
                <div className="lg:ml-72 xl:ml-80">
                    <motion.header
                        layoutScroll
                        className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
                    >
                        <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
                            <div className="hidden lg:flex">
                                <Link href="/" aria-label="Home">
                                    <Logo className="h-6" />
                                </Link>
                            </div>
                            <Header />
                            <Navigation className="hidden lg:mt-10 lg:block" />
                        </div>
                    </motion.header>
                    <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
                        <main className="py-16">
                            <Prose as="article">{children}</Prose>
                        </main>
                        <Footer />
                        <button
                            onClick={() => signOut()}
                            className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </SectionProvider>
        </>
    );
}
