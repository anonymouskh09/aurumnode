import { Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowRight, KeyRound, Mail, User, UserPlus, Users } from 'lucide-react';

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
        <div className="relative min-h-screen overflow-hidden bg-[#1a1c28] text-white">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="aurum-grid-overlay absolute inset-0 opacity-60" />
                <div className="aurum-orb aurum-orb-one" />
                <div className="aurum-orb aurum-orb-two" />
                <div className="aurum-orb aurum-orb-three" />
            </div>

            <div className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center px-6 py-10">
                <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-start">
                    <div className="hidden lg:block pt-10">
                        <p className="mb-4 inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-amber-300 aurum-chip">
                            Join The Ecosystem
                        </p>
                        <h1 className="aurum-title-glow mb-4 text-5xl font-semibold leading-tight">
                            Create Your
                            <span className="block text-amber-300">Aurum Node Account</span>
                        </h1>
                        <p className="max-w-lg leading-8 text-slate-300">
                            Build your profile, connect with your sponsor, and become part of a next-generation
                            digital opportunity network.
                        </p>
                    </div>

                    <div className="aurum-card mx-auto w-full max-w-[620px] rounded-2xl p-7 md:p-8">
                        <Link href="/" className="mb-5 inline-flex">
                            <img
                                src="/images/brand/AurumNodelogo.jpeg"
                                alt="Aurum Node"
                                className="h-11 w-auto object-contain"
                            />
                        </Link>
                        <h2 className="mb-2 text-2xl font-semibold">Create your account</h2>
                        <p className="mb-6 text-sm text-slate-300">
                            Sponsor is optional. You can register directly or with a referral link.
                        </p>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label htmlFor="sponsor_username" className="mb-2 flex items-center gap-2 text-sm text-slate-200">
                                        <Users className="h-4 w-4 text-amber-300" />
                                        Sponsor username <span className="text-slate-400">(optional)</span>
                                    </label>
                                    <input
                                        id="sponsor_username"
                                        type="text"
                                        value={data.sponsor_username}
                                        onChange={(e) => setData('sponsor_username', e.target.value)}
                                        placeholder="Optional sponsor username"
                                        className="w-full rounded-xl border border-amber-500/30 bg-[#1a1c28]/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                        readOnly={!!referralUsername}
                                    />
                                    {err('sponsor_username') && <p className="mt-1 text-sm text-red-300">{err('sponsor_username')}</p>}
                                </div>

                                <div>
                                    <label htmlFor="placement_side" className="mb-2 flex items-center gap-2 text-sm text-slate-200">
                                        <ArrowRight className="h-4 w-4 text-amber-300" />
                                        Placement
                                    </label>
                                    <select
                                        id="placement_side"
                                        value={data.placement_side}
                                        onChange={(e) => setData('placement_side', e.target.value)}
                                        className="w-full rounded-xl border border-amber-500/30 bg-[#1a1c28]/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                        disabled={!!referralSide}
                                    >
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                    </select>
                                    {err('placement_side') && <p className="mt-1 text-sm text-red-300">{err('placement_side')}</p>}
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm text-slate-200">
                                        <User className="h-4 w-4 text-amber-300" />
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-amber-500/30 bg-[#1a1c28]/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                    />
                                    {err('name') && <p className="mt-1 text-sm text-red-300">{err('name')}</p>}
                                </div>

                                <div>
                                    <label htmlFor="username" className="mb-2 flex items-center gap-2 text-sm text-slate-200">
                                        <UserPlus className="h-4 w-4 text-amber-300" />
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full rounded-xl border border-amber-500/30 bg-[#1a1c28]/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                    />
                                    {err('username') && <p className="mt-1 text-sm text-red-300">{err('username')}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm text-slate-200">
                                    <Mail className="h-4 w-4 text-amber-300" />
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-amber-500/30 bg-[#1a1c28]/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                />
                                {err('email') && <p className="mt-1 text-sm text-red-300">{err('email')}</p>}
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label htmlFor="password" className="mb-2 flex items-center gap-2 text-sm text-slate-200">
                                        <KeyRound className="h-4 w-4 text-amber-300" />
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full rounded-xl border border-amber-500/30 bg-[#1a1c28]/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                    />
                                    {err('password') && <p className="mt-1 text-sm text-red-300">{err('password')}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="mb-2 flex items-center gap-2 text-sm text-slate-200">
                                        <KeyRound className="h-4 w-4 text-amber-300" />
                                        Confirm password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-xl border border-amber-500/30 bg-[#1a1c28]/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                    />
                                    {err('password_confirmation') && <p className="mt-1 text-sm text-red-300">{err('password_confirmation')}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="aurum-btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Register
                            </button>
                        </form>

                        <p className="mt-5 text-center text-sm text-slate-300">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-amber-300 hover:text-amber-200">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
