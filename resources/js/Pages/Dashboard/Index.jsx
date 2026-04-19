import { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import {
    WalletCard,
    StatCard,
    Card,
    CardHeader,
    CardBody,
    CopyInput,
    Button,
    ProgressBar,
} from '@/Components/ui';
import {
    Wallet,
    TrendingUp,
    DollarSign,
    PiggyBank,
    Lock,
    ArrowUpRight,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

const walletIcons = {
    deposit_wallet: Wallet,
    investment_wallet: Lock,
    withdrawal_wallet: Wallet,
    direct_bonus_wallet: TrendingUp,
    binary_bonus_wallet: PiggyBank,
    roi_wallet: DollarSign,
};

const formatPercent = (value) => `${Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;

export default function DashboardIndex({
    referralLinks,
    wallet,
    totalInvestment,
    totalVolumeUsdt,
    activePackageCard,
    packageCards = [],
    totalCap = 0,
    totalEarningsFromPackages = 0,
    investmentBalance,
    earningsBalance,
    withdrawnOutAmount = 0,
    directBonusPercent = 10,
}) {
    const totalEarned = parseFloat(wallet?.total_bonus ?? 0) + parseFloat(wallet?.total_roi ?? 0);
    const inv = parseFloat(totalInvestment ?? 0);
    const cap = (totalCap || activePackageCard?.cap) ?? 0;
    const totalEarningsFromCap = (totalEarningsFromPackages ?? activePackageCard?.total_earnings) ?? 0;
    const maxEarning = cap > 0 ? cap : inv * 4;
    const remaining = Math.max(0, maxEarning - (cap > 0 ? totalEarningsFromCap : totalEarned));

    const walletCards = [
        { key: 'deposit_wallet', label: 'Deposit Wallet (USDT)', subtitle: 'Use for packages or transfer to users', locked: false },
        { key: 'investment_wallet', label: 'My Package', subtitle: 'Withdrawal not available', locked: true },
        { key: 'withdrawal_wallet', label: 'Withdrawal Wallet', subtitle: 'Ready to withdraw', locked: false },
        { key: 'direct_bonus_wallet', label: 'Direct Bonus', subtitle: `${formatPercent(directBonusPercent)} from referrals`, locked: false },
        { key: 'binary_bonus_wallet', label: 'Binary Bonus', subtitle: 'Daily matching bonus', locked: false },
        { key: 'roi_wallet', label: 'ROI Wallet', subtitle: 'Returns on investment', locked: false },
    ];

    const stats = [
        { label: 'Total volume (USDT)', value: `$${Number(totalVolumeUsdt ?? 0).toFixed(2)}`, icon: TrendingUp },
        { label: 'Earnings balance (USDT)', value: `$${Number(earningsBalance ?? 0).toFixed(2)}`, icon: PiggyBank },
        { label: 'Earned (all packages)', value: `$${Number(totalEarningsFromCap).toFixed(2)}`, icon: DollarSign },
        { label: 'Remaining to cap', value: `$${remaining.toFixed(2)}`, icon: Wallet },
    ];

    const [showActivePackages, setShowActivePackages] = useState(false);

    return (
        <DashboardLayout title="Dashboard">
            <div className="space-y-8">
                {/* Deposit / Investment Section */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <Card className="border-2 border-amber-500/25 bg-[#1f2231]">
                            <CardBody className="flex flex-col">
                                <div className="flex items-center gap-2 text-amber-200">
                                    <Wallet className="w-5 h-5 shrink-0" />
                                    <span className="font-semibold">Deposit Wallet (USDT)</span>
                                </div>
                                <p className="text-2xl font-bold text-emerald-400 mt-2">${Number(wallet?.deposit_wallet ?? 0).toFixed(2)}</p>
                                <p className="text-sm text-slate-300 mt-1">Use for packages or transfer to other users.</p>
                                <Link href="/dashboard/transfers" className="mt-3">
                                    <Button variant="primary" size="sm">Transfer to user</Button>
                                </Link>
                            </CardBody>
                        </Card>
                        <Card className="border-2 border-amber-500/25 bg-[#1f2231]">
                            <CardBody className="flex flex-col">
                                <div className="flex items-center gap-2 text-amber-200">
                                    <Lock className="w-5 h-5 shrink-0" />
                                    <span className="font-semibold">My Package</span>
                                </div>
                                <p className="text-2xl font-bold text-emerald-400 mt-2">${Number(investmentBalance ?? 0).toFixed(2)}</p>
                                <div className="mt-3 flex items-center gap-2 text-sm text-amber-300" title="Investment locked. Withdrawal not available.">
                                    <Lock className="w-4 h-4" />
                                    <span>Withdraw disabled</span>
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="flex flex-col">
                                <div className="flex items-center gap-2 text-amber-200">
                                    <PiggyBank className="w-5 h-5 shrink-0" />
                                    <span className="font-semibold">Earnings (Withdrawable)</span>
                                </div>
                                <p className="text-2xl font-bold text-emerald-400 mt-2">${Number(earningsBalance ?? 0).toFixed(2)}</p>
                                <p className="text-sm text-slate-300 mt-1">Includes earnings wallets and Withdrawal Wallet balance.</p>
                                <Link href="/dashboard/transfers" className="mt-3">
                                    <Button variant="primary" size="sm">Transfer to withdrawal</Button>
                                </Link>
                            </CardBody>
                        </Card>
                        <Card className="border-2 border-rose-500/35 bg-[#1f2231]">
                            <CardBody className="flex flex-col">
                                <div className="flex items-center gap-2 text-rose-300">
                                    <ArrowUpRight className="w-5 h-5 shrink-0" />
                                    <span className="font-semibold">Total Withdrawn / Sent</span>
                                </div>
                                <p className="text-2xl font-bold text-rose-400 mt-2">${Number(withdrawnOutAmount ?? 0).toFixed(2)}</p>
                                <p className="text-sm text-slate-300 mt-1">From Withdrawal Wallet (user transfers + withdrawal requests).</p>
                            </CardBody>
                        </Card>
                    </div>
                </section>

                {/* Active packages dropdown – click to show list */}
                {packageCards.length > 0 && (
                    <section>
                        <button
                            type="button"
                            onClick={() => setShowActivePackages((v) => !v)}
                            className="w-full flex items-center justify-between gap-2 rounded-xl border-2 border-amber-500/20 bg-[#1f2231] px-4 py-3 text-left hover:border-amber-300 hover:bg-[#1f2231] transition-colors"
                        >
                            <span className="text-lg font-semibold text-slate-100">Active packages ({packageCards.length})</span>
                            {showActivePackages ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                        </button>
                        {showActivePackages && (
                            <div className="mt-4 space-y-4">
                                {packageCards.map((p) => (
                                    <Card key={p.id} className={p.is_active ? 'border-2 border-amber-300 bg-amber-500/10' : ''}>
                                        <CardBody>
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-sm text-slate-400">
                                                        {p.display_name} (${Number(p.price).toFixed(2)})
                                                        {p.is_active && <span className="ml-2 text-amber-300 font-medium">• Active</span>}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1a1c28] text-slate-300 border border-amber-500/20">
                                                            Status: {p.status}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="min-w-[200px]">
                                                    <p className="text-sm text-slate-400 mb-1">Cap progress (4X)</p>
                                                    <p className="text-lg font-semibold text-emerald-400">${Number(p.total_earnings).toFixed(2)} / ${Number(p.cap).toFixed(2)}</p>
                                                    <ProgressBar value={p.total_earnings} max={p.cap || 1} showLabel className="mt-2" />
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                                <Card className="bg-[#1f2231] border-amber-500/20">
                                    <CardBody>
                                        <p className="text-sm text-slate-300 mb-1">Total (all packages)</p>
                                        <p className="text-xl font-bold text-slate-100">
                                            Earned: <span className="text-emerald-400">${Number(totalEarningsFromCap).toFixed(2)}</span> / Cap: <span className="text-emerald-400">${Number(cap).toFixed(2)}</span> • Remaining: <span className="text-emerald-400">${remaining.toFixed(2)}</span>
                                        </p>
                                        <ProgressBar value={totalEarningsFromCap} max={cap || 1} showLabel className="mt-2" />
                                    </CardBody>
                                </Card>
                            </div>
                        )}
                    </section>
                )}

                {/* Wallet Cards Grid */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-100 mb-4">Wallets (USDT)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {walletCards.map(({ key, label, subtitle, locked }) => {
                            const Icon = walletIcons[key] || Wallet;
                            return (
                                <div key={key} className="min-h-[120px] flex" title={locked ? 'Investment locked. Withdrawal not available.' : ''}>
                                    <WalletCard
                                        label={label}
                                        value={wallet?.[key] ?? 0}
                                        subtitle={subtitle}
                                        icon={Icon}
                                        className="w-full h-full"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Stats Strip */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-100 mb-4">Overview</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map(({ label, value, icon: Icon }) => (
                            <StatCard key={label} label={label} value={value} icon={Icon} />
                        ))}
                    </div>
                    {packageCards.length > 0 && cap > 0 && (
                        <div className="mt-3">
                            <p className="text-sm text-slate-400 mb-2">Total cap progress (all packages, 4X)</p>
                            <ProgressBar value={totalEarningsFromCap} max={cap || 1} showLabel />
                        </div>
                    )}
                </section>

                {/* Packages / Membership Section */}
                <section>
                    <Card>
                        <CardHeader
                            title="Packages"
                            subtitle="Activate a package to start earning"
                            action={
                                <Link href="/dashboard/packages">
                                    <Button variant="primary">View all packages</Button>
                                </Link>
                            }
                        />
                        <CardBody>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                {['$100', '$500', '$1000', '$2500', '$5000', '$10000'].map((price) => (
                                    <Link
                                        key={price}
                                        href="/dashboard/packages"
                                        className="block p-4 rounded-xl border-2 border-amber-500/20 hover:border-amber-500 hover:bg-[#1f2231] transition-all duration-200 text-center"
                                    >
                                        <p className="text-lg font-bold text-amber-300">{price}</p>
                                        <p className="text-xs text-slate-400 mt-1">USD</p>
                                    </Link>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </section>

                {/* Referral Links */}
                <section>
                    <Card>
                        <CardHeader title="Your referral links" subtitle="Share with your network" />
                        <CardBody className="space-y-4">
                            <CopyInput label="Left" value={referralLinks?.left} />
                            <CopyInput label="Right" value={referralLinks?.right} />
                        </CardBody>
                    </Card>
                </section>
            </div>
        </DashboardLayout>
    );
}





