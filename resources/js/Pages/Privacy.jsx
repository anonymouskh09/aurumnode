import { Link } from '@inertiajs/react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="text-xl font-semibold text-gray-800">
                            Aurum Node
                        </Link>
                        <div className="flex gap-4">
                            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                            <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
                            <Link href="/privacy" className="text-amber-600 font-medium">Privacy</Link>
                            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                            <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                            <Link href="/register" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">Register</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <p className="text-gray-600 mb-4">
                    Placeholder: Privacy policy for Aurum Node. We store your name, username, email, and referral data.
                </p>
                <p className="text-gray-600">
                    Your data is used only for account and referral management. No wallet or bonus logic in Phase 1.
                </p>
            </main>
        </div>
    );
}
