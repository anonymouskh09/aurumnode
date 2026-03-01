import { router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminAuditLogsIndex({ logs, filters }) {
    const applyFilters = (e) => {
        e.preventDefault();
        const f = e.target;
        router.get('/admin/audit-logs', {
            admin_id: f.admin_id?.value || undefined,
            target_user_id: f.target_user_id?.value || undefined,
            action: f.action?.value || undefined,
            from: f.from?.value || undefined,
            to: f.to?.value || undefined,
        });
    };
    return (
        <AdminLayout title="Audit Logs">
            <form onSubmit={applyFilters} className="mb-4 flex flex-wrap gap-2">
                <input name="admin_id" type="number" placeholder="Admin ID" defaultValue={filters?.admin_id} className="rounded border px-2 py-1 w-24" />
                <input name="target_user_id" type="number" placeholder="Target user ID" defaultValue={filters?.target_user_id} className="rounded border px-2 py-1 w-28" />
                <input name="action" type="text" placeholder="Action" defaultValue={filters?.action} className="rounded border px-2 py-1" />
                <input name="from" type="date" defaultValue={filters?.from} className="rounded border px-2 py-1" />
                <input name="to" type="date" defaultValue={filters?.to} className="rounded border px-2 py-1" />
                <button type="submit" className="px-3 py-1 bg-slate-700 text-white rounded">Filter</button>
            </form>
            <div className="overflow-x-auto">
                <table className="w-full border border-slate-200 rounded-xl">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">Admin</th>
                            <th className="text-left p-3">Target user</th>
                            <th className="text-left p-3">Action</th>
                            <th className="text-left p-3">Payload</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(logs?.data ?? []).length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-slate-500">No audit logs found.</td></tr>
                        ) : (logs?.data ?? []).map((log) => (
                            <tr key={log.id} className="border-t border-slate-200">
                                <td className="p-3 text-sm">{log.created_at}</td>
                                <td className="p-3">{log.admin?.username ?? log.admin_id}</td>
                                <td className="p-3">{log.target_user?.username ?? log.target_user_id ?? '—'}</td>
                                <td className="p-3">{log.action}</td>
                                <td className="p-3 text-sm max-w-xs truncate">{JSON.stringify(log.payload)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-2 items-center">
                {logs?.prev_page_url && <a href={logs.prev_page_url} className="text-teal-600 hover:underline">← Previous</a>}
                <span className="text-slate-500">Page {logs?.current_page ?? 1} of {logs?.last_page ?? 1}</span>
                {logs?.next_page_url && <a href={logs.next_page_url} className="text-teal-600 hover:underline">Next →</a>}
            </div>
        </AdminLayout>
    );
}
