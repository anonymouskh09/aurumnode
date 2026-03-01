import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminEarningsLedgerIndex({ ledger, totals, filters }) {
    return (
        <AdminLayout title="Earnings Ledger">
            <div className="mb-4 flex flex-wrap gap-4 items-center">
                <span><strong>DIRECT total:</strong> ${Number(totals?.DIRECT ?? 0).toFixed(2)}</span>
                <span><strong>BINARY total:</strong> ${Number(totals?.BINARY ?? 0).toFixed(2)}</span>
                <span><strong>ROI total:</strong> ${Number(totals?.ROI ?? 0).toFixed(2)}</span>
                <form onSubmit={(e) => { e.preventDefault(); const f = e.target; router.get('/admin/earnings-ledger', { user_id: f.user_id?.value || undefined, type: f.type?.value || undefined, from: f.from?.value || undefined, to: f.to?.value || undefined }); }} className="flex flex-wrap gap-2">
                    <input name="user_id" type="number" placeholder="User ID" defaultValue={filters?.user_id} className="rounded border px-2 py-1 w-24" />
                    <select name="type" className="rounded border px-2 py-1">
                        <option value="">All</option>
                        <option value="DIRECT">DIRECT</option>
                        <option value="BINARY">BINARY</option>
                        <option value="ROI">ROI</option>
                    </select>
                    <input name="from" type="date" defaultValue={filters?.from} className="rounded border px-2 py-1" />
                    <input name="to" type="date" defaultValue={filters?.to} className="rounded border px-2 py-1" />
                    <button type="submit" className="px-3 py-1 bg-slate-700 text-white rounded">Filter</button>
                </form>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border border-slate-200 rounded-xl">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">User</th>
                            <th className="text-left p-3">Package</th>
                            <th className="text-left p-3">Type</th>
                            <th className="text-right p-3">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(ledger?.data ?? []).length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-slate-500">No ledger entries found.</td></tr>
                        ) : (ledger?.data ?? []).map((row) => (
                            <tr key={row.id} className="border-t border-slate-200">
                                <td className="p-3">{row.created_at}</td>
                                <td className="p-3">{row.user?.username} (#{row.user_id})</td>
                                <td className="p-3">{row.user_package?.package?.name}</td>
                                <td className="p-3">{row.type}</td>
                                <td className="p-3 text-right">${parseFloat(row.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-2 items-center">
                {ledger?.prev_page_url && <a href={ledger.prev_page_url} className="text-teal-600 hover:underline">← Previous</a>}
                <span className="text-slate-500">Page {ledger?.current_page ?? 1} of {ledger?.last_page ?? 1}</span>
                {ledger?.next_page_url && <a href={ledger.next_page_url} className="text-teal-600 hover:underline">Next →</a>}
            </div>
        </AdminLayout>
    );
}
