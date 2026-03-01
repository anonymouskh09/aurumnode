import { Link, usePage } from '@inertiajs/react';

export default function Home() {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white/80 backdrop-blur border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="text-xl font-semibold text-slate-900">
                            Aurum Node
                        </Link>
                        <div className="flex gap-4 items-center">
                            <Link href="/about" className="text-slate-600 hover:text-teal-700">
                                About
                            </Link>
                            <Link href="/terms" className="text-slate-600 hover:text-teal-700">Terms</Link>
                            <Link href="/privacy" className="text-slate-600 hover:text-teal-700">Privacy</Link>
                            <Link href="/contact" className="text-slate-600 hover:text-teal-700">Contact</Link>
                            {isLoggedIn ? (
                                <Link href="/dashboard" className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition-all font-medium">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-slate-600 hover:text-teal-700">Login</Link>
                                    <Link href="/register" className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition-all">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-[1400px] mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Welcome to Aurum Node
                </h1>
                <p className="text-lg text-slate-600">
                    Your gateway to the Aurum Node network. Join with a referral to get started.
                </p>
            </main>
        </div>
    );
}
