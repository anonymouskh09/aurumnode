import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardBody, Button } from '@/Components/ui';
import { Package, Wallet } from 'lucide-react';

export default function Packages({ packages, deposit_balance_usdt, withdrawal_balance_usdt }) {
    const depositBalance = parseFloat(deposit_balance_usdt ?? 0);
    const withdrawalBalance = parseFloat(withdrawal_balance_usdt ?? 0);

    return (
        <DashboardLayout title="Packages">
            <div className="mb-6 space-y-4">
                <Card className="border-teal-200 bg-teal-50/50">
                    <CardBody className="flex flex-row items-center gap-3">
                        <Wallet className="w-8 h-8 text-teal-600 shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-slate-900">Deposit Wallet: ${depositBalance.toFixed(2)} USDT</p>
                            <p className="text-sm text-slate-600">Withdrawal Wallet: ${withdrawalBalance.toFixed(2)} USDT</p>
                            <p className="text-sm text-slate-500 mt-1">Pay for packages from either wallet.</p>
                        </div>
                    </CardBody>
                </Card>
                <Card className="border-amber-200 bg-amber-50/50">
                    <CardBody>
                        <p className="text-sm font-medium text-amber-800 mb-2">Demo: Add to Deposit Wallet</p>
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
                <label className="block text-xs text-slate-600 mb-1">Amount (USDT)</label>
                <input
                    type="number"
                    step="1"
                    min="1"
                    max="100000"
                    value={data.amount}
                    onChange={(e) => setData('amount', e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
            </div>
            <Button type="submit" variant="primary" disabled={processing}>
                {processing ? 'Adding...' : 'Add to Deposit'}
            </Button>
        </form>
    );
}

function PackageCard({ pkg, depositBalance, withdrawalBalance }) {
    const { data, setData, post, processing } = useForm({
        package_id: pkg.id,
        pay_from: 'deposit_wallet',
    });
    const price = parseFloat(pkg.price_usd);
    const balanceFromSource =
        data.pay_from === 'withdrawal_wallet' ? withdrawalBalance : depositBalance;
    const canAfford = balanceFromSource >= price;
    const cooldownActive = !!pkg.same_package_cooldown_active;
    const cooldownDays = Number(pkg.same_package_cooldown_remaining_days ?? 0);
    const canBuyNow = pkg.status === 'active' && canAfford && !cooldownActive;

    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                    <Package className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{pkg.display_name ?? pkg.name}</h3>
                <p className="text-2xl font-bold text-teal-600 mt-2">${price.toFixed(2)} USDT</p>
                <p className="text-sm text-slate-500 mt-1">Status: {pkg.status ?? 'active'}</p>
                <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Pay from</label>
                    <select
                        value={data.pay_from}
                        onChange={(e) => setData('pay_from', e.target.value)}
                        className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="deposit_wallet">Deposit Wallet (${depositBalance.toFixed(2)})</option>
                        <option value="withdrawal_wallet">Withdrawal Wallet (${withdrawalBalance.toFixed(2)})</option>
                    </select>
                </div>
                {!canAfford && price > 0 && (
                    <p className="text-sm text-amber-600 mt-2">
                        Insufficient balance. Need ${price.toFixed(2)} in {data.pay_from === 'withdrawal_wallet' ? 'Withdrawal' : 'Deposit'} Wallet.
                    </p>
                )}
                {cooldownActive && (
                    <p className="text-sm text-amber-700 mt-2">
                        Cooldown: {cooldownDays} day{cooldownDays === 1 ? '' : 's'} left for this package.
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
