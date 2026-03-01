import { Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register({ referralUsername, referralSide, errors: serverErrors }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        sponsor_username: referralUsername || '',
        placement_side: referralSide || 'left',
    });

    // Sync form when navigating with a referral link (props update after initial load)
    useEffect(() => {
        if (referralUsername) setData('sponsor_username', referralUsername);
        if (referralSide) setData('placement_side', referralSide);
    }, [referralUsername, referralSide]);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const err = (field) => serverErrors?.[field] || errors[field];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center text-2xl font-bold text-amber-600">
                    Aurum Node
                </Link>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sponsor is optional. You can register directly or with a referral link.
                </p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="sponsor_username" className="block text-sm font-medium text-gray-700">
                                Sponsor username <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                                id="sponsor_username"
                                type="text"
                                value={data.sponsor_username}
                                onChange={(e) => setData('sponsor_username', e.target.value)}
                                placeholder="Enter sponsor username from referral link (optional)"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                readOnly={!!referralUsername}
                            />
                            {err('sponsor_username') && (
                                <p className="mt-1 text-sm text-red-600">{err('sponsor_username')}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="placement_side" className="block text-sm font-medium text-gray-700">
                                Placement
                            </label>
                            <select
                                id="placement_side"
                                value={data.placement_side}
                                onChange={(e) => setData('placement_side', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                disabled={!!referralSide}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                            {err('placement_side') && (
                                <p className="mt-1 text-sm text-red-600">{err('placement_side')}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {err('name') && (
                                <p className="mt-1 text-sm text-red-600">{err('name')}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {err('username') && (
                                <p className="mt-1 text-sm text-red-600">{err('username')}</p>
                            )}
                        </div>
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
                            {err('email') && (
                                <p className="mt-1 text-sm text-red-600">{err('email')}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {err('password') && (
                                <p className="mt-1 text-sm text-red-600">{err('password')}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {err('password_confirmation') && (
                                <p className="mt-1 text-sm text-red-600">{err('password_confirmation')}</p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-amber-600 hover:text-amber-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
