import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardBody, Button } from '@/Components/ui';
import { Package, Wallet } from 'lucide-react';

export default function Packages({ packages, deposit_balance_usdt }) {
    const balance = parseFloat(deposit_balance_usdt ?? 0);

    return (
        <DashboardLayout title="Packages">
            <Card className="mb-6 border-teal-200 bg-teal-50/50">
                <CardBody className="flex flex-row items-center gap-3">
                    <Wallet className="w-8 h-8 text-teal-600 shrink-0" />
                    <div>
                        <p className="font-semibold text-slate-900">Deposit Wallet (USDT): ${balance.toFixed(2)}</p>
                        <p className="text-sm text-slate-600">Packages are paid from your Deposit Wallet. Funds transferred to you by other users can be used here to buy a package.</p>
                    </div>
                </CardBody>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} depositBalance={balance} />
                ))}
            </div>
        </DashboardLayout>
    );
}

function PackageCard({ pkg, depositBalance }) {
    const { post, processing } = useForm({ package_id: pkg.id });
    const price = parseFloat(pkg.price_usd);
    const canAfford = depositBalance >= price;

    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                    <Package className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{pkg.display_name ?? pkg.name}</h3>
                <p className="text-2xl font-bold text-teal-600 mt-2">${price.toFixed(2)} USDT</p>
                <p className="text-sm text-slate-500 mt-1">Status: {pkg.status ?? 'active'}</p>
                {!canAfford && price > 0 && (
                    <p className="text-sm text-amber-600 mt-2">Insufficient balance. Need ${price.toFixed(2)} in Deposit Wallet.</p>
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
                        disabled={processing || pkg.status !== 'active' || !canAfford}
                        className="w-full"
                    >
                        {processing ? 'Processing...' : 'Buy with USDT'}
                    </Button>
                </form>
            </div>
        </Card>
    );
}
