import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminPackagesEdit({ package: pkg }) {
    const form = useForm({
        name: pkg?.name ?? '',
        display_name: pkg?.display_name ?? pkg?.name ?? '',
        price_usd: pkg?.price_usd ?? 0,
        status: pkg?.status ?? 'active',
        binary_percent: pkg?.binary_percent ?? '',
        monthly_roi_rate: pkg?.monthly_roi_rate ?? '',
        roi_enabled: pkg?.roi_enabled ?? true,
        pays_direct_bonus: pkg?.pays_direct_bonus ?? true,
        is_admin_only: pkg?.is_admin_only ?? false,
    });

    return (
        <AdminLayout title={`Edit: ${pkg?.name}`}>
            <form onSubmit={(e) => { e.preventDefault(); form.put(`/admin/packages/${pkg.id}`); }} className="max-w-xl space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name (internal)</label>
                    <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Display name (UI)</label>
                    <input type="text" value={form.data.display_name} onChange={(e) => form.setData('display_name', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Shown in dashboard, packages" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Price USD</label>
                    <input type="number" step="0.01" value={form.data.price_usd} onChange={(e) => form.setData('price_usd', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Binary %</label>
                    <input type="number" step="0.01" value={form.data.binary_percent} onChange={(e) => form.setData('binary_percent', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="e.g. 8" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Monthly ROI %</label>
                    <input type="number" step="0.01" value={form.data.monthly_roi_rate} onChange={(e) => form.setData('monthly_roi_rate', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.data.roi_enabled} onChange={(e) => form.setData('roi_enabled', e.target.checked)} /> ROI enabled</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.data.pays_direct_bonus} onChange={(e) => form.setData('pays_direct_bonus', e.target.checked)} /> Pays direct bonus</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.data.is_admin_only} onChange={(e) => form.setData('is_admin_only', e.target.checked)} /> Admin only</label>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Save</button>
            </form>
        </AdminLayout>
    );
}
