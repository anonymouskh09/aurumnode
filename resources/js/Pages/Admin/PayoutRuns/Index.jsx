import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminPayoutRunsIndex({ runs, filters }) {
    const { props } = usePage();
    const status = props.flash?.status;

    const applyFilters = (e) => {
        e.preventDefault();
        const f = e.target;
        router.get('/admin/payout-runs', { run_type: f.run_type?.value || undefined, status: f.status?.value || undefined });
    };

    const runBinary = () => router.post('/admin/payout-runs/run-binary');
    const runRoi = () => router.post('/admin/payout-runs/run-roi');

    return (
        <AdminLayout title="Payout Runs">
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <button type="button" onClick={runBinary} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Run Binary Payout (today)
                </button>
                <button type="button" onClick={runRoi} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Run ROI Payout (previous week)
                </button>
                {status && <span className="text-slate-600 font-medium">{status}</span>}
            </div>
            <form onSubmit={applyFilters} className="mb-4 flex gap-2">
                <select name="run_type" defaultValue={filters?.run_type} className="rounded border px-3 py-2">
                    <option value="">All types</option>
                    <option value="binary_daily">binary_daily</option>
                    <option value="roi_weekly">roi_weekly</option>
                </select>
                <select name="status" defaultValue={filters?.status} className="rounded border px-3 py-2">
                    <option value="">All statuses</option>
                    <option value="pending">pending</option>
                    <option value="running">running</option>
                    <option value="completed">completed</option>
                    <option value="failed">failed</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-slate-700 text-white rounded-lg">Filter</button>
            </form>
            <div className="overflow-x-auto">
                <table className="w-full border border-slate-200 rounded-xl">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="text-left p-3">ID</th>
                            <th className="text-left p-3">Type</th>
                            <th className="text-left p-3">Period</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Started</th>
                            <th className="text-left p-3">Finished</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(runs?.data ?? []).length === 0 ? (
                            <tr><td colSpan={6} className="p-6 text-center text-slate-500">No payout runs found.</td></tr>
                        ) : (runs?.data ?? []).map((r) => (
                            <tr key={r.id} className="border-t border-slate-200">
                                <td className="p-3">{r.id}</td>
                                <td className="p-3">{r.run_type}</td>
                                <td className="p-3">{r.period_key}</td>
                                <td className="p-3">{r.status}</td>
                                <td className="p-3">{r.started_at ?? '—'}</td>
                                <td className="p-3">{r.finished_at ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-2 items-center">
                {runs?.prev_page_url && <a href={runs.prev_page_url} className="text-teal-600 hover:underline">← Previous</a>}
                <span className="text-slate-500">Page {runs?.current_page ?? 1} of {runs?.last_page ?? 1}</span>
                {runs?.next_page_url && <a href={runs.next_page_url} className="text-teal-600 hover:underline">Next →</a>}
            </div>
        </AdminLayout>
    );
}
