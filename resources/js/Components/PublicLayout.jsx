import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function SocialIcon({ href, label, children }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-[#1a1c28]/60 text-slate-200 transition hover:-translate-y-1 hover:border-amber-400 hover:text-amber-300"
        >
            {children}
        </a>
    );
}

function FooterLink({ href, children }) {
    return (
        <Link href={href} className="group flex items-center gap-2 transition hover:text-amber-300">
            <span className="text-amber-400 transition group-hover:translate-x-0.5">&gt;</span>
            <span>{children}</span>
        </Link>
    );
}

export default function PublicLayout({ children }) {
    const page = usePage();
    const url = page?.url || '';
    const { auth } = page?.props || {};
    const isLoggedIn = !!auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/legal-compliance', label: 'Policy Info' },
    ];

    useEffect(() => {
        setMobileOpen(false);
    }, [url]);

    useEffect(() => {
        if (!mobileOpen) {
            document.body.style.removeProperty('overflow');
            return undefined;
        }

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.removeProperty('overflow');
        };
    }, [mobileOpen]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#1a1c28] text-white">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="aurum-grid-overlay absolute inset-0 opacity-60" />
                <div className="aurum-orb aurum-orb-one" />
                <div className="aurum-orb aurum-orb-two" />
                <div className="aurum-orb aurum-orb-three" />
            </div>

            <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-[#1a1c28]/90 backdrop-blur-xl">
                <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/images/brand/AurumNodelogo.jpeg"
                            alt="Aurum Node"
                            className="h-11 w-auto object-contain"
                        />
                    </Link>

                    <nav className="hidden items-center gap-6 lg:flex">
                        {navItems.map((item) => {
                            const active = url === item.href || (item.href !== '/' && url.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`text-sm transition ${
                                        active ? 'text-amber-300' : 'text-slate-300 hover:text-amber-400'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        {!isLoggedIn && (
                            <Link
                                href="/login"
                                className="hidden rounded-lg border border-amber-500/40 px-4 py-2 text-sm text-white transition hover:border-amber-300 hover:text-amber-300 md:inline-flex"
                            >
                                Login
                            </Link>
                        )}
                        <Link
                            href={isLoggedIn ? '/dashboard' : '/register'}
                            className="hidden rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-amber-400 sm:inline-flex"
                        >
                            {isLoggedIn ? 'Dashboard' : 'Join Now'}
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/40 text-amber-300 transition hover:border-amber-300 hover:text-amber-200 lg:hidden"
                            aria-label="Open menu"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current">
                                <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                aria-hidden={!mobileOpen}
            >
                <div
                    className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
                        mobileOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => setMobileOpen(false)}
                />
                <aside
                    className={`absolute right-0 top-0 h-full w-[86%] max-w-sm border-l border-amber-500/30 bg-[#1a1c28]/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${
                        mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="mb-8 flex items-center justify-between">
                        <img
                            src="/images/brand/AurumNodelogo.jpeg"
                            alt="Aurum Node"
                            className="h-10 w-auto object-contain"
                        />
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/40 text-amber-300 transition hover:border-amber-300 hover:text-amber-200"
                            aria-label="Close menu"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current">
                                <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <nav className="space-y-3">
                        {navItems.map((item) => {
                            const active = url === item.href || (item.href !== '/' && url.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                                        active
                                            ? 'border-amber-400/70 bg-amber-500/10 text-amber-200'
                                            : 'border-amber-500/25 bg-white/[0.03] text-slate-200 hover:border-amber-400/50 hover:text-amber-200'
                                    }`}
                                >
                                    {item.label}
                                    <span className="text-amber-400">&gt;</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-6 space-y-3 border-t border-amber-500/20 pt-6">
                        {!isLoggedIn && (
                            <Link
                                href="/login"
                                className="flex w-full items-center justify-center rounded-xl border border-amber-500/40 px-4 py-3 text-sm text-slate-100 transition hover:border-amber-300 hover:text-amber-200"
                            >
                                Login
                            </Link>
                        )}
                        <Link
                            href={isLoggedIn ? '/dashboard' : '/register'}
                            className="aurum-btn-primary flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition"
                        >
                            {isLoggedIn ? 'Go to Dashboard' : 'Join the Network'}
                        </Link>
                    </div>
                </aside>
            </div>

            <div className="relative z-10">{children}</div>

            <footer className="relative z-10 mt-16 border-t border-amber-500/20 bg-[#1a1c28]/90 backdrop-blur">
                <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <img
                            src="/images/brand/AurumNodelogo.jpeg"
                            alt="Aurum Node"
                            className="mb-4 h-10 w-auto object-contain"
                        />
                        <p className="max-w-xs text-sm leading-7 text-slate-300">
                            Aurum Node enables individuals worldwide to access technology-powered opportunities through a secure and scalable ecosystem.
                        </p>
                        <div className="mt-5 flex items-center gap-3">
                            <SocialIcon href="https://instagram.com" label="Instagram">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm10.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="https://facebook.com" label="Facebook">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                    <path d="M13.5 9H16V6h-2.5C10.9 6 9 7.9 9 10.5V13H7v3h2v5h3v-5h2.5l.5-3H12v-2.5c0-.8.7-1.5 1.5-1.5z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="https://youtube.com" label="YouTube">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                    <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="https://t.me" label="Telegram">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                    <path d="M21.5 4.6c.3-.9-.6-1.7-1.5-1.4L3.6 9.1c-1 .3-1 1.7 0 2l4.2 1.2 1.6 4.8c.3 1 1.6 1.1 2 .2l2.2-4 4.8 3.5c.8.6 1.9.1 2.1-.9l1-11.3zM9.9 11.8l8.3-5.2-6.7 6.8-.6 2.1-1-3.7z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="https://tiktok.com" label="TikTok">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                    <path d="M14 3c.3 1.6 1.2 3 2.6 3.8.8.5 1.8.8 2.9.8v2.7c-1.2 0-2.4-.3-3.5-.8V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v2.8a3.2 3.2 0 1 0 2.9 3.1V3H14z" />
                                </svg>
                            </SocialIcon>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-amber-300">Navigate</h3>
                        <div className="mb-4 h-[2px] w-12 bg-amber-300/60" />
                        <div className="space-y-3 text-sm text-slate-300">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/contact">Contact Us</FooterLink>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-amber-300">Useful Links</h3>
                        <div className="mb-4 h-[2px] w-12 bg-amber-300/60" />
                        <div className="space-y-3 text-sm text-slate-300">
                            <FooterLink href="/#opportunity-ecosystem">Packages</FooterLink>
                            <FooterLink href="/#faq">FAQ&apos;s</FooterLink>
                            <FooterLink href="/acceptable-use-policy">AUP</FooterLink>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-amber-300">Policy Info</h3>
                        <div className="mb-4 h-[2px] w-12 bg-amber-300/60" />
                        <div className="space-y-3 text-sm text-slate-300">
                            <FooterLink href="/legal-compliance">Terms and conditions</FooterLink>
                            <FooterLink href="/legal-compliance">Privacy policy</FooterLink>
                            <FooterLink href="/risk-disclosure">Risk Disclosure</FooterLink>
                            <FooterLink href="/kyc-policy">KYC Policy</FooterLink>
                            <FooterLink href="/aml-policy">AML Policy</FooterLink>
                        </div>
                    </div>
                </div>

                <div className="border-t border-amber-500/20">
                    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-slate-400 md:flex-row">
                        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                        <p className="text-amber-300">Aurum Node</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

