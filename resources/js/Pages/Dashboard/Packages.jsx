import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardBody, Button } from '@/Components/ui';
import { Package } from 'lucide-react';

export default function Packages({ packages }) {
    return (
        <DashboardLayout title="Packages">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                ))}
            </div>
        </DashboardLayout>
    );
}

function PackageCard({ pkg }) {
    const { post, processing } = useForm({ package_id: pkg.id });

    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                    <Package className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{pkg.display_name ?? pkg.name}</h3>
                <p className="text-2xl font-bold text-teal-600 mt-2">${parseFloat(pkg.price_usd).toFixed(2)}</p>
                <p className="text-sm text-slate-500 mt-1">USD · Status: {pkg.status ?? 'active'}</p>
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
                        disabled={processing || pkg.status !== 'active'}
                        className="w-full"
                    >
                        {processing ? 'Processing...' : 'Buy Package'}
                    </Button>
                </form>
            </div>
        </Card>
    );
}
