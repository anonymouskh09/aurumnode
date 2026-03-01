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
    ChevronDown,
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
    { href: '/dashboard/top', label: 'Top', icon: TrendingUp },
];

export default function DashboardLayout({ children, title }) {
    const { auth } = usePage();
    const user = auth?.user;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const sponsorName = user?.sponsor?.name ?? 'None';

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen shrink-0">
                <div className="p-5 border-b border-slate-100">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="text-xl font-semibold text-slate-900">Aurum Node</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3">
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
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-lg bg-teal-50 text-teal-700 text-sm border border-teal-200">
                            Sponsor: {sponsorName}
                        </span>
                        {user?.is_admin && (
                            <Link href="/admin">
                                <Button variant="outline" className="text-sm">Admin</Button>
                            </Link>
                        )}
                        <Link href="/dashboard/packages">
                            <Button variant="primary" className="text-sm">Deposit</Button>
                        </Link>
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
                                {user?.username?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                <p className="text-xs text-slate-500">@{user?.username}</p>
                            </div>
                            <Link href="/logout" method="post" as="button">
                                <Button variant="secondary" className="text-sm">Logout</Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto bg-slate-50">
                    <div className="max-w-[1400px] mx-auto">
                        <FlashMessage />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
