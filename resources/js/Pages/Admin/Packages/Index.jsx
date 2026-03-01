import { Link } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminPackagesIndex({ packages }) {
    return (
        <AdminLayout title="Packages">
            <div className="overflow-x-auto">
                <table className="w-full border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="text-left p-3">Display name</th>
                            <th className="text-left p-3">Price (USD)</th>
                            <th className="text-left p-3">Binary %</th>
                            <th className="text-left p-3">Monthly ROI %</th>
                            <th className="text-left p-3">ROI</th>
                            <th className="text-left p-3">Admin only</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages?.map((p) => (
                            <tr key={p.id} className="border-t border-slate-200">
                                <td className="p-3">{p.display_name ?? p.name}</td>
                                <td className="p-3">{p.price_usd}</td>
                                <td className="p-3">{p.binary_percent ?? '—'}</td>
                                <td className="p-3">{p.monthly_roi_rate ?? '—'}</td>
                                <td className="p-3">{p.roi_enabled ? 'Yes' : 'No'}</td>
                                <td className="p-3">{p.is_admin_only ? 'Yes' : 'No'}</td>
                                <td className="p-3">
                                    <Link href={`/admin/packages/${p.id}/edit`} className="text-teal-600 hover:underline">Edit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
