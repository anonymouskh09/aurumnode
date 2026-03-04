import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminUserPackageControlsShow({ member, ledgerTotal }) {
    const accessForm = useForm({ leg: 'left', cap_multiplier: '' });
    const baseUrl = `/admin/user-package-controls/${member?.id}`;

    return (
        <AdminLayout title={`Package controls: ${member?.username}`}>
            <div className="mb-4"><Link href="/admin/user-package-controls" className="text-teal-600">← Back to list</Link></div>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-xl bg-white">
                    <h3 className="font-semibold mb-2">User packages</h3>
                    <ul className="space-y-2">
                        {(member?.user_packages ?? []).map((up) => (
                            <li key={up.id}>Package: {up.package?.display_name ?? up.package?.name}, Invested: ${up.invested_amount}, Status: {up.status}, Total earned: {up.total_earned}, Cap: {up.max_cap}</li>
                        ))}
                    </ul>
                    <p className="mt-2 text-sm text-slate-600">Ledger total (all packages): ${Number(ledgerTotal ?? 0).toFixed(2)}</p>
                </div>
                <div className="p-4 border rounded-xl bg-white">
                    <h3 className="font-semibold mb-2">Activate Access Package (Leader)</h3>
                    <form onSubmit={(e) => { e.preventDefault(); accessForm.post(`${baseUrl}/activate-access-package`); }} className="space-y-2">
                        <select value={accessForm.data.leg} onChange={(e) => accessForm.setData('leg', e.target.value)} className="rounded border px-3 py-2 w-full">
                            <option value="left">Left leg (1M USDT volume)</option>
                            <option value="right">Right leg (1M USDT volume)</option>
                        </select>
                        <input type="number" step="0.01" placeholder="Cap multiplier (default 4)" value={accessForm.data.cap_multiplier} onChange={(e) => accessForm.setData('cap_multiplier', e.target.value)} className="block w-full rounded border px-3 py-2" />
                        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Activate Access Package</button>
                    </form>
                    <button type="button" onClick={() => router.post(`${baseUrl}/pause-earnings`)} className="mt-4 block px-4 py-2 bg-amber-500 text-white rounded-lg">Pause earnings</button>
                    <button type="button" onClick={() => router.post(`${baseUrl}/resume-earnings`)} className="mt-2 block px-4 py-2 bg-green-600 text-white rounded-lg">Resume earnings</button>
                </div>
            </div>
        </AdminLayout>
    );
}
