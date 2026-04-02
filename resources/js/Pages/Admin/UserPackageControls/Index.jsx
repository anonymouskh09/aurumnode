import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminUserPackageControlsIndex({ members }) {
    return (
        <AdminLayout title="User Package Controls">
            <div className="mb-4">
                <form onSubmit={(e) => { e.preventDefault(); router.get('/admin/user-package-controls', { q: e.target.q?.value }); }} className="flex gap-2">
                    <input name="q" type="search" placeholder="Search username/email" className="rounded-lg border border-slate-300 px-3 py-2 flex-1 max-w-xs" />
                    <button type="submit" className="px-4 py-2 bg-slate-700 text-white rounded-lg">Search</button>
                </form>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border border-slate-200 rounded-xl">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="text-left p-3">User</th>
                            <th className="text-left p-3">Sponsor</th>
                            <th className="text-left p-3">Active package</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(members?.data ?? []).length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-slate-500">No members found.</td></tr>
                        ) : (members?.data ?? []).map((m) => (
                            <tr key={m.id} className="border-t border-slate-200">
                                <td className="p-3">{m.username} / {m.email}</td>
                                <td className="p-3">{m.sponsor?.username ?? m.sponsor?.name ?? '—'}</td>
                                <td className="p-3">{m.active_user_package?.package?.name ?? '—'}</td>
                                <td className="p-3">{m.active_user_package?.status ?? '—'}</td>
                                <td className="p-3">
                                    <Link href={`/admin/user-package-controls/${m.id}`} className="text-teal-600 hover:underline">Manage</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-2 items-center">
                {members?.prev_page_url && <a href={members.prev_page_url} className="text-teal-600 hover:underline">← Previous</a>}
                <span className="text-slate-500">Page {members?.current_page ?? 1} of {members?.last_page ?? 1}</span>
                {members?.next_page_url && <a href={members.next_page_url} className="text-teal-600 hover:underline">Next →</a>}
            </div>
        </AdminLayout>
    );
}
