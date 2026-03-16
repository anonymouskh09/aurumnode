import { Link, useForm } from '@inertiajs/react';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#1a1c28] text-white">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="aurum-grid-overlay absolute inset-0 opacity-60" />
                <div className="aurum-orb aurum-orb-one" />
                <div className="aurum-orb aurum-orb-two" />
                <div className="aurum-orb aurum-orb-three" />
            </div>

            <div className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center px-6 py-10">
                <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
                    <div className="hidden lg:block">
                        <p className="mb-4 inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-amber-300 aurum-chip">
                            Secure Member Access
                        </p>
                        <h1 className="aurum-title-glow mb-4 text-5xl font-semibold leading-tight">
                            Welcome Back to
                            <span className="block text-amber-300">Aurum Node</span>
                        </h1>
                        <p className="max-w-lg leading-8 text-slate-300">
                            Access your dashboard, track ecosystem activity, and continue growing with a secure
                            login experience built for a premium network.
                        </p>
                    </div>

                    <div className="aurum-card mx-auto w-full max-w-[470px] rounded-2xl p-7 md:p-8">
                        <Link href="/" className="mb-5 inline-flex">
                            <img
                                src="/images/brand/AurumNodelogo.jpeg"
                                alt="Aurum Node"
                                className="h-11 w-auto object-contain"
                            />
                        </Link>
                        <h2 className="mb-2 text-2xl font-semibold">Sign in to your account</h2>
                        <p className="mb-6 text-sm text-slate-300">Continue your journey in the Aurum Node ecosystem.</p>

                        {status && (
                            <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-sm text-amber-100">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
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
                                {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 flex items-center gap-2 text-sm text-slate-200">
                                    <KeyRound className="h-4 w-4 text-amber-300" />
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-xl border border-amber-500/30 bg-[#1a1c28]/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-300">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <label htmlFor="remember" className="inline-flex items-center gap-2 text-sm text-slate-300">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-amber-500/40 bg-transparent text-amber-400 focus:ring-amber-400"
                                    />
                                    Remember me
                                </label>
                                <Link href="/forgot-password" className="text-sm text-amber-300 hover:text-amber-200">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="aurum-btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Sign in
                            </button>
                        </form>

                        <p className="mt-5 text-center text-sm text-slate-300">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="font-medium text-amber-300 hover:text-amber-200">
                                Register with a referral
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
