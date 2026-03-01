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
} from 'lucide-react';

const walletIcons = {
    deposit_wallet: Wallet,
    investment_wallet: Lock,
    withdrawal_wallet: Wallet,
    direct_bonus_wallet: TrendingUp,
    binary_bonus_wallet: PiggyBank,
    roi_wallet: DollarSign,
};

export default function DashboardIndex({
    referralLinks,
    wallet,
    totalInvestment,
    totalPV,
    activePackageCard,
    investmentBalance,
    earningsBalance,
}) {
    const totalEarned = parseFloat(wallet?.total_bonus ?? 0) + parseFloat(wallet?.total_roi ?? 0);
    const inv = parseFloat(totalInvestment ?? 0);
    const cap = activePackageCard?.cap ?? 0;
    const totalEarningsFromCap = activePackageCard?.total_earnings ?? 0;
    const maxEarning = cap > 0 ? cap : inv * 4;
    const remaining = Math.max(0, maxEarning - (cap > 0 ? totalEarningsFromCap : totalEarned));

    const walletCards = [
        { key: 'investment_wallet', label: 'Locked Investment', subtitle: 'Withdrawal not available', locked: true },
        { key: 'withdrawal_wallet', label: 'Withdrawal Wallet', subtitle: 'Ready to withdraw', locked: false },
        { key: 'direct_bonus_wallet', label: 'Direct Bonus', subtitle: '10% from referrals', locked: false },
        { key: 'binary_bonus_wallet', label: 'Binary Bonus', subtitle: 'Daily matching bonus', locked: false },
        { key: 'roi_wallet', label: 'ROI Wallet', subtitle: 'Returns on investment', locked: false },
    ];

    const stats = [
        { label: 'Total PV', value: (totalPV ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' pts', icon: TrendingUp },
        { label: 'Earnings balance', value: `$${Number(earningsBalance ?? 0).toFixed(2)}`, icon: PiggyBank },
        { label: 'Earned (cap)', value: `$${totalEarningsFromCap.toFixed(2)}`, icon: DollarSign },
        { label: 'Remaining to cap', value: `$${remaining.toFixed(2)}`, icon: Wallet },
    ];

    return (
        <DashboardLayout title="Dashboard">
            <div className="space-y-8">
                {/* Deposit / Investment Section */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Deposit / Investment</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="border-2 border-amber-200 bg-amber-50/50">
                            <CardBody className="flex flex-col">
                                <div className="flex items-center gap-2 text-amber-800">
                                    <Lock className="w-5 h-5 shrink-0" />
                                    <span className="font-semibold">Locked Investment</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mt-2">${Number(investmentBalance ?? 0).toFixed(2)}</p>
                                <div className="mt-3 flex items-center gap-2 text-sm text-amber-700" title="Investment locked. Withdrawal not available.">
                                    <Lock className="w-4 h-4" />
                                    <span>Withdraw disabled</span>
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="flex flex-col">
                                <div className="flex items-center gap-2 text-teal-700">
                                    <PiggyBank className="w-5 h-5 shrink-0" />
                                    <span className="font-semibold">Earnings (Withdrawable)</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mt-2">${Number(earningsBalance ?? 0).toFixed(2)}</p>
                                <p className="text-sm text-slate-600 mt-1">Transfer to Withdrawal Wallet to request payout.</p>
                                <Link href="/dashboard/transfers" className="mt-3">
                                    <Button variant="primary" size="sm">Transfer to withdrawal</Button>
                                </Link>
                            </CardBody>
                        </Card>
                    </div>
                </section>

                {/* Active Package Card */}
                {activePackageCard && (
                    <section>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Package</h2>
                        <Card>
                            <CardBody>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">Active Package</p>
                                        <p className="text-xl font-bold text-slate-900">{activePackageCard.display_name} (${Number(activePackageCard.price).toFixed(2)})</p>
                                        <p className="mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                                Status: {activePackageCard.status}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="min-w-[200px]">
                                        <p className="text-sm text-slate-500 mb-1">Cap progress</p>
                                        <p className="text-lg font-semibold">${Number(activePackageCard.total_earnings).toFixed(2)} / ${Number(activePackageCard.cap).toFixed(2)}</p>
                                        <ProgressBar value={activePackageCard.total_earnings} max={activePackageCard.cap || 1} showLabel className="mt-2" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </section>
                )}

                {/* Wallet Cards Grid */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Wallets</h2>
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
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Overview</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map(({ label, value, icon: Icon }) => (
                            <StatCard key={label} label={label} value={value} icon={Icon} />
                        ))}
                    </div>
                    {activePackageCard && activePackageCard.cap > 0 && (
                        <div className="mt-3">
                            <p className="text-sm text-slate-500 mb-2">Cap progress (4X)</p>
                            <ProgressBar value={totalEarningsFromCap} max={activePackageCard.cap || 1} showLabel />
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
                                        className="block p-4 rounded-xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all duration-200 text-center"
                                    >
                                        <p className="text-lg font-bold text-teal-700">{price}</p>
                                        <p className="text-xs text-slate-500 mt-1">USD</p>
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
