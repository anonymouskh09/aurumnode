import { Link } from '@inertiajs/react';

export default function Contact() {
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
                            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
                            <Link href="/contact" className="text-amber-600 font-medium">Contact</Link>
                            <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                            <Link href="/register" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">Register</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
                <p className="text-gray-600 mb-4">
                    Placeholder: Contact form or support email will be available here.
                </p>
                <p className="text-gray-600">
                    For support, use your dashboard or reach out via the channels we will define.
                </p>
            </main>
        </div>
    );
}
