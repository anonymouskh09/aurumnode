import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    User,
    Wallet,
    Users,
    ArrowLeftRight,
    FileText,
    GitBranch,
    Gift,
    PieChart,
    Award,
    TrendingUp,
    Menu,
    X,
} from 'lucide-react';
import Button from '@/Components/ui/Button';

function FlashMessage() {
    const { flash } = usePage().props;
    const status = flash?.status;
    const error = flash?.error;
    if (!status && !error) return null;
    return (
        <div className={`mb-4 p-4 rounded-xl text-sm ${status ? 'bg-amber-500/10 text-amber-200 border border-amber-500/30' : 'bg-red-500/10 text-red-200 border border-red-500/30'}`}>
            {status || error}
        </div>
    );
}

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/packages', label: 'Packages', icon: Package },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
    { href: '/dashboard/withdrawal', label: 'Withdrawal', icon: Wallet },
    { href: '/dashboard/transfers', label: 'Fund Transfers', icon: ArrowLeftRight },
    { href: '/dashboard/team', label: 'My Team', icon: Users },
    { href: '/dashboard/transactions', label: 'Transactions', icon: FileText },
    { href: '/dashboard/binary-tree', label: 'My Binary Tree', icon: GitBranch },
    { href: '/dashboard/direct-bonus', label: 'Direct Bonus', icon: Gift },
    { href: '/dashboard/binary-bonus', label: 'Binary Bonus', icon: PieChart },
    { href: '/dashboard/roi', label: 'My ROI', icon: TrendingUp },
    { href: '/dashboard/rank', label: 'My Rank', icon: Award },
];

function NavLinks({ pathname, onLinkClick }) {
    return (
        <ul className="space-y-0.5">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/dashboard'
                    ? pathname === '/dashboard' || pathname === '/dashboard/'
                    : pathname.startsWith(item.href);
                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            onClick={onLinkClick}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-amber-500/12 text-amber-200 border-l-4 border-amber-400 -ml-[2px] pl-[14px]'
                                    : 'text-slate-300 hover:bg-amber-500/8 hover:text-amber-200'
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

export default function DashboardLayout({ children, title }) {
    const { auth } = usePage();
    const user = auth?.user;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const sponsorName = user?.sponsor?.name ?? 'None';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="dashboard-theme min-h-screen bg-[#1a1c28] flex text-slate-100">
            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar - on desktop fixed; on mobile drawer */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-64 bg-[#1f2231] border-r border-amber-500/20 flex flex-col shrink-0
                    transform transition-transform duration-300 ease-out
                    lg:translate-x-0
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-4 lg:p-5 border-b border-amber-500/15 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <img
                            src="/images/brand/AurumNodelogo.jpeg"
                            alt="Aurum Node"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-amber-500/10"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="dashboard-scroll flex-1 overflow-y-auto py-4 px-3">
                    <NavLinks pathname={pathname} onLinkClick={() => setMobileMenuOpen(false)} />
                </nav>
            </aside>

            {/* Main - on desktop add left margin so content is beside fixed sidebar */}
            <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-64">
                {/* Topbar - responsive */}
                <header className="sticky top-0 z-30 bg-[#1a1c28]/95 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-200 hover:bg-amber-500/10 shrink-0"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg sm:text-2xl font-semibold text-slate-100 truncate">{title}</h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <span className="hidden sm:inline-flex items-center px-2 sm:px-3 py-1 rounded-lg bg-amber-500/12 text-amber-200 text-xs sm:text-sm border border-amber-500/30 truncate max-w-[120px] sm:max-w-none" title={sponsorName}>
                            Sponsor: {sponsorName}
                        </span>
                        {user?.is_admin && (
                            <Link href="/admin">
                                <Button variant="outline" className="text-xs sm:text-sm py-1.5 sm:py-2">Admin</Button>
                            </Link>
                        )}
                        <Link href="/dashboard/packages">
                            <Button variant="primary" className="text-xs sm:text-sm py-1.5 sm:py-2">Deposit</Button>
                        </Link>
                        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-amber-500/20">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-200 font-semibold text-xs sm:text-sm shrink-0">
                                {user?.username?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                            <div className="hidden sm:block text-left min-w-0">
                                <p className="text-sm font-medium text-slate-100 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-400 truncate">@{user?.username}</p>
                            </div>
                            <Link href="/logout" method="post" as="button">
                                <Button variant="secondary" className="text-xs sm:text-sm py-1.5 sm:py-2">Logout</Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content - responsive padding */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-[#1a1c28]">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <FlashMessage />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
