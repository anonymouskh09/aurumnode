import { Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center text-2xl font-bold text-amber-600">
                    Aurum Node
                </Link>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                    Forgot your password?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email and we&apos;ll send you a reset link.
                </p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    {status && (
                        <div className="mb-4 p-3 rounded bg-green-50 text-green-800 text-sm">
                            {status}
                        </div>
                    )}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                            >
                                Email password reset link
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        <Link href="/login" className="font-medium text-amber-600 hover:text-amber-700">
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
