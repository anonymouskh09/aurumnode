import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    FileCheck,
    Settings,
    Shield,
    Menu,
    X,
    TrendingUp,
} from 'lucide-react';
import Button from '@/Components/ui/Button';

function FlashMessage() {
    const { flash } = usePage().props;
    const status = flash?.status;
    const error = flash?.error;
    if (!status && !error) return null;
    return (
        <div className={`mb-4 p-4 rounded-xl text-sm ${status ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {status || error}
        </div>
    );
}

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/members', label: 'Members', icon: Users },
    { href: '/admin/packages', label: 'Packages', icon: LayoutDashboard },
    { href: '/admin/user-package-controls', label: 'User Package Controls', icon: Users },
    { href: '/admin/volume', label: 'Volume Tool', icon: LayoutDashboard },
    { href: '/admin/earnings-ledger', label: 'Earnings Ledger', icon: CreditCard },
    { href: '/admin/payout-runs', label: 'Payout Runs', icon: CreditCard },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileCheck },
    { href: '/admin/withdrawals', label: 'Withdrawals', icon: CreditCard },
    { href: '/admin/kyc', label: 'KYC', icon: FileCheck },
    { href: '/admin/top', label: 'Top', icon: TrendingUp },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function NavLinks({ pathname, onLinkClick }) {
    return (
        <ul className="space-y-0.5">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/admin'
                    ? pathname === '/admin' || pathname === '/admin/'
                    : pathname.startsWith(item.href);
                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            onClick={onLinkClick}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600 -ml-[2px] pl-[14px]'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {item.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth } = usePage();
    const user = auth?.user;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar - on desktop fixed; on mobile drawer */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col shrink-0
                    transform transition-transform duration-300 ease-out
                    lg:translate-x-0
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-4 lg:p-5 border-b border-slate-100 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-slate-900">Admin</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-slate-500 px-5 pb-2 lg:block hidden">Aurum Node</p>
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <NavLinks pathname={pathname} onLinkClick={() => setMobileMenuOpen(false)} />
                </nav>
                <div className="p-3 border-t border-slate-100">
                    <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <LayoutDashboard className="w-5 h-5 shrink-0" />
                        User Panel
                    </Link>
                </div>
            </aside>

            {/* Main - on desktop add left margin so content is beside fixed sidebar */}
            <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-64">
                {/* Topbar - responsive */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg sm:text-2xl font-semibold text-slate-900 truncate">{title}</h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <Link href="/dashboard">
                            <Button variant="outline" className="text-xs sm:text-sm py-1.5 sm:py-2">User Dashboard</Button>
                        </Link>
                        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-xs sm:text-sm shrink-0">
                                {user?.username?.[0]?.toUpperCase() ?? 'A'}
                            </div>
                            <div className="hidden sm:block text-left min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500">Admin</p>
                            </div>
                            <Link href="/logout" method="post" as="button">
                                <Button variant="secondary" className="text-xs sm:text-sm py-1.5 sm:py-2">Logout</Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content - responsive padding */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-slate-50">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <FlashMessage />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
