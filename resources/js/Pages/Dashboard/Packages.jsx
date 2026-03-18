import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardBody, Button } from '@/Components/ui';
import { Package, Wallet } from 'lucide-react';

const packageMetaByPrice = {
    100: { weekly: 'up to 2%', monthly: 'up to 8%', cap: '4X', directBonus: '10%', binaryBonus: '8%' },
    500: { weekly: 'up to 2.25%', monthly: 'up to 9%', cap: '4X', directBonus: '10%', binaryBonus: '8%' },
    1000: { weekly: 'up to 2.5%', monthly: 'up to 10%', cap: '4X', directBonus: '10%', binaryBonus: '8%' },
    2500: { weekly: 'up to 2.75%', monthly: 'up to 11%', cap: '4X', directBonus: '10%', binaryBonus: '9%' },
    5000: { weekly: 'up to 3%', monthly: 'up to 12%', cap: '4X', directBonus: '10%', binaryBonus: '9%' },
    10000: { weekly: 'up to 3%', monthly: 'up to 12%', cap: '4X', directBonus: '10%', binaryBonus: '10%' },
};

export default function Packages({ packages, deposit_balance_usdt, withdrawal_balance_usdt, highest_purchased_amount }) {
    const depositBalance = parseFloat(deposit_balance_usdt ?? 0);
    const withdrawalBalance = parseFloat(withdrawal_balance_usdt ?? 0);
    const highestPurchasedAmount = parseFloat(highest_purchased_amount ?? 0);

    return (
        <DashboardLayout title="Packages">
            <div className="mb-6 space-y-4">
                <Card className="border-amber-500/30 bg-amber-500/10">
                    <CardBody className="flex flex-row items-center gap-3">
                        <Wallet className="w-8 h-8 text-amber-300 shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-slate-100">Deposit Wallet: ${depositBalance.toFixed(2)} USDT</p>
                            <p className="text-sm text-slate-300">Withdrawal Wallet: ${withdrawalBalance.toFixed(2)} USDT</p>
                            <p className="text-sm text-slate-400 mt-1">Pay for packages from either wallet.</p>
                        </div>
                    </CardBody>
                </Card>
                <Card className="border-amber-500/30 bg-amber-500/10">
                    <CardBody>
                        <p className="text-sm font-medium text-amber-200 mb-2">Demo: Add to Deposit Wallet</p>
                        <DemoDepositForm />
                    </CardBody>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.map((pkg) => (
                    <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        depositBalance={depositBalance}
                        withdrawalBalance={withdrawalBalance}
                        highestPurchasedAmount={highestPurchasedAmount}
                    />
                ))}
            </div>
        </DashboardLayout>
    );
}

function DemoDepositForm() {
    const { data, setData, post, processing } = useForm({ amount: '100' });
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                post('/dashboard/packages/demo-deposit');
            }}
            className="flex flex-wrap items-end gap-2"
        >
            <div className="min-w-[120px]">
                <label className="block text-xs text-slate-300 mb-1">Amount (USDT)</label>
                <input
                    type="number"
                    step="1"
                    min="1"
                    max="100000"
                    value={data.amount}
                    onChange={(e) => setData('amount', e.target.value)}
                    className="block w-full rounded-lg border border-amber-500/20 px-3 py-2 text-sm"
                />
            </div>
            <Button type="submit" variant="primary" disabled={processing}>
                {processing ? 'Adding...' : 'Add to Deposit'}
            </Button>
        </form>
    );
}

function PackageCard({ pkg, depositBalance, withdrawalBalance, highestPurchasedAmount }) {
    const { data, setData, post, processing } = useForm({
        package_id: pkg.id,
        pay_from: 'deposit_wallet',
    });
    const price = parseFloat(pkg.price_usd);
    const balanceFromSource =
        data.pay_from === 'withdrawal_wallet' ? withdrawalBalance : depositBalance;
    const canAfford = balanceFromSource >= price;
    const blockedByUpgradeRule = highestPurchasedAmount > 0 && price < highestPurchasedAmount;
    const canBuyNow = pkg.status === 'active' && canAfford && !blockedByUpgradeRule;
    const packageMeta = packageMetaByPrice[Math.round(price)] ?? null;

    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-300 mb-4">
                    <Package className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">{pkg.display_name ?? pkg.name}</h3>
                <p className="text-2xl font-bold text-amber-300 mt-2">${price.toFixed(2)} USDT</p>
                <p className="text-sm text-slate-400 mt-1">Status: {pkg.status ?? 'active'}</p>
                {blockedByUpgradeRule ? (
                    <p className="text-sm text-rose-600 mt-1">
                        Blocked: lower than your highest package (${highestPurchasedAmount.toFixed(2)}).
                    </p>
                ) : (
                    <p className="text-sm text-amber-300 mt-1">Available for purchase.</p>
                )}
                {packageMeta && (
                    <div className="mt-3 rounded-lg border border-amber-500/20 bg-[#1a1c28] p-3">
                        <p className="mb-2 text-xs uppercase tracking-wide text-amber-300">Package details</p>
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="rounded-md border border-amber-500/15 bg-[#20263a] px-2 py-1.5">
                                <p className="text-slate-400">Weekly</p>
                                <p className="font-medium text-slate-100">{packageMeta.weekly}</p>
                            </div>
                            <div className="rounded-md border border-amber-500/15 bg-[#20263a] px-2 py-1.5">
                                <p className="text-slate-400">Monthly</p>
                                <p className="font-medium text-slate-100">{packageMeta.monthly}</p>
                            </div>
                            <div className="rounded-md border border-amber-500/15 bg-[#20263a] px-2 py-1.5">
                                <p className="text-slate-400">Total Cap</p>
                                <p className="font-medium text-slate-100">{packageMeta.cap}</p>
                            </div>
                            <div className="rounded-md border border-amber-500/15 bg-[#20263a] px-2 py-1.5">
                                <p className="text-slate-400">Direct Bonus</p>
                                <p className="font-medium text-slate-100">{packageMeta.directBonus}</p>
                            </div>
                            <div className="col-span-2 rounded-md border border-amber-500/15 bg-[#20263a] px-2 py-1.5">
                                <p className="text-slate-400">Binary Bonus</p>
                                <p className="font-medium text-slate-100">{packageMeta.binaryBonus}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-300 mb-1">Pay from</label>
                    <select
                        value={data.pay_from}
                        onChange={(e) => setData('pay_from', e.target.value)}
                        className="block w-full rounded-lg border border-amber-500/20 px-3 py-2 text-sm"
                    >
                        <option value="deposit_wallet">Deposit Wallet (${depositBalance.toFixed(2)})</option>
                        <option value="withdrawal_wallet">Withdrawal Wallet (${withdrawalBalance.toFixed(2)})</option>
                    </select>
                </div>
                {!canAfford && price > 0 && (
                    <p className="text-sm text-amber-300 mt-2">
                        Insufficient balance. Need ${price.toFixed(2)} in {data.pay_from === 'withdrawal_wallet' ? 'Withdrawal' : 'Deposit'} Wallet.
                    </p>
                )}
                {blockedByUpgradeRule && (
                    <p className="text-sm text-rose-600 mt-2">
                        Buy ${highestPurchasedAmount.toFixed(2)} or any higher package.
                    </p>
                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/dashboard/packages/buy');
                    }}
                    className="mt-6"
                >
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing || !canBuyNow}
                        className="w-full"
                    >
                        {processing ? 'Processing...' : 'Buy with USDT'}
                    </Button>
                </form>
            </div>
        </Card>
    );
}




