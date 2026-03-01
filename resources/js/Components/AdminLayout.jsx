import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    FileCheck,
    Settings,
    Shield,
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
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children, title }) {
    const { auth } = usePage();
    const user = auth?.user;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen shrink-0">
                <div className="p-5 border-b border-slate-100">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-slate-900">Admin</span>
                    </Link>
                    <p className="text-xs text-slate-500 mt-1">Aurum Node</p>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3">
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
                <div className="p-3 border-t border-slate-100">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <LayoutDashboard className="w-5 h-5 shrink-0" />
                        User Panel
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline" className="text-sm">User Dashboard</Button>
                        </Link>
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
                                {user?.username?.[0]?.toUpperCase() ?? 'A'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                <p className="text-xs text-slate-500">Admin</p>
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
