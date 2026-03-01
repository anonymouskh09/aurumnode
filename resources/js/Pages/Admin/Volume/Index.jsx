import { useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminVolumeIndex({ user }) {
    const searchForm = useForm({ user_id: '' });
    const addForm = useForm({ user_id: user?.id ?? '', leg: 'left', points: '', reason: '' });
    useEffect(() => { if (user?.id) addForm.setData('user_id', user.id); }, [user?.id]);

    return (
        <AdminLayout title="Manual Volume">
            <div className="space-y-6">
                <div className="p-4 border rounded-xl bg-white">
                    <h3 className="font-semibold mb-2">Look up user</h3>
                    <form onSubmit={(e) => { e.preventDefault(); router.get('/admin/volume', { user_id: searchForm.data.user_id }); }} className="flex gap-2">
                        <input type="number" placeholder="User ID" value={searchForm.data.user_id} onChange={(e) => searchForm.setData('user_id', e.target.value)} className="rounded border px-3 py-2 w-32" />
                        <button type="submit" className="px-4 py-2 bg-slate-700 text-white rounded-lg">Load</button>
                    </form>
                </div>
                {user && (
                    <>
                        <div className="p-4 border rounded-xl bg-white">
                            <p><strong>User:</strong> {user.username} (ID: {user.id})</p>
                            <p><strong>Left carry:</strong> {user.carry?.left_carry_total ?? 0} | <strong>Right carry:</strong> {user.carry?.right_carry_total ?? 0}</p>
                            <p><strong>Left points total:</strong> {user.left_points_total} | <strong>Right points total:</strong> {user.right_points_total}</p>
                        </div>
                        <div className="p-4 border rounded-xl bg-white">
                            <h3 className="font-semibold mb-2">Add volume</h3>
                            <form onSubmit={(e) => { e.preventDefault(); router.post('/admin/volume/add', { ...addForm.data, user_id: user.id }); }} className="space-y-2 max-w-sm">
                                <input type="hidden" name="user_id" value={user.id} />
                                <select value={addForm.data.leg} onChange={(e) => addForm.setData('leg', e.target.value)} className="w-full rounded border px-3 py-2">
                                    <option value="left">Left leg</option>
                                    <option value="right">Right leg</option>
                                </select>
                                <input type="number" step="0.01" min="0.01" placeholder="Points" value={addForm.data.points} onChange={(e) => addForm.setData('points', e.target.value)} className="w-full rounded border px-3 py-2" required />
                                <input type="text" placeholder="Reason (audit)" value={addForm.data.reason} onChange={(e) => addForm.setData('reason', e.target.value)} className="w-full rounded border px-3 py-2" />
                                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Add volume</button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
