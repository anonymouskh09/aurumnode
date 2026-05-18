import { useEffect } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminVolumeIndex({ user, searchResults = [], filters = {}, searchMessage }) {
    const { flash } = usePage().props;
    const searchForm = useForm({ search: filters?.search ?? '' });
    const addForm = useForm({ user_id: user?.id ?? '', leg: 'left', amount_usdt: '', reason: '' });

    useEffect(() => {
        if (user?.id) {
            addForm.setData('user_id', user.id);
        }
    }, [user?.id]);

    useEffect(() => {
        searchForm.setData('search', filters?.search ?? '');
    }, [filters?.search]);

    const submitSearch = (e) => {
        e.preventDefault();
        router.get('/admin/volume', { search: searchForm.data.search.trim() || undefined });
    };

    const selectUser = (userId) => {
        router.get('/admin/volume', {
            search: filters?.search || searchForm.data.search || undefined,
            user_id: userId,
        });
    };

    return (
        <AdminLayout title="Manual Volume">
            <div className="space-y-6">
                {flash?.status && (
                    <p className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-800">
                        {flash.status}
                    </p>
                )}

                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                    <h3 className="mb-2 font-semibold text-white">Look up user</h3>
                    <form onSubmit={submitSearch} className="flex flex-wrap gap-2">
                        <input
                            type="search"
                            placeholder="Username, email, or name..."
                            value={searchForm.data.search}
                            onChange={(e) => searchForm.setData('search', e.target.value)}
                            className="min-w-[200px] flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
                        >
                            Search
                        </button>
                    </form>
                    {searchMessage && (
                        <p className="mt-3 text-sm text-amber-400">{searchMessage}</p>
                    )}
                </div>

                {searchResults.length > 0 && (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                        <h3 className="mb-3 font-semibold text-white">
                            Select user ({searchResults.length})
                        </h3>
                        <ul className="divide-y divide-slate-700">
                            {searchResults.map((u) => (
                                <li
                                    key={u.id}
                                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="text-sm text-slate-200">
                                        <span className="font-medium text-white">{u.username}</span>
                                        {u.name ? ` · ${u.name}` : ''}
                                        {u.email ? (
                                            <span className="block text-slate-400">{u.email}</span>
                                        ) : null}
                                        <span className="mt-1 block text-xs text-slate-500">
                                            ID {u.id} · L ${Number(u.left_points_total ?? 0).toFixed(2)} · R $
                                            {Number(u.right_points_total ?? 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => selectUser(u.id)}
                                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-500"
                                    >
                                        Select
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {user && (
                    <>
                        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-sm text-slate-200">
                            <p>
                                <strong className="text-white">User:</strong> {user.username}
                                {user.name ? ` (${user.name})` : ''} · ID {user.id}
                            </p>
                            {user.email && (
                                <p>
                                    <strong className="text-white">Email:</strong> {user.email}
                                </p>
                            )}
                            <p className="mt-2">
                                <strong className="text-white">Left carry:</strong>{' '}
                                {user.carry?.left_carry_total ?? 0} |{' '}
                                <strong className="text-white">Right carry:</strong>{' '}
                                {user.carry?.right_carry_total ?? 0}
                            </p>
                            <p>
                                <strong className="text-white">Left volume (USDT):</strong> $
                                {Number(user.left_points_total ?? 0).toFixed(2)} |{' '}
                                <strong className="text-white">Right volume (USDT):</strong> $
                                {Number(user.right_points_total ?? 0).toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                            <h3 className="mb-2 font-semibold text-white">Add volume</h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    router.post('/admin/volume/add', {
                                        ...addForm.data,
                                        user_id: user.id,
                                        points: addForm.data.amount_usdt,
                                        search: filters?.search || undefined,
                                    });
                                }}
                                className="max-w-sm space-y-2"
                            >
                                <select
                                    value={addForm.data.leg}
                                    onChange={(e) => addForm.setData('leg', e.target.value)}
                                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                                >
                                    <option value="left">Left leg</option>
                                    <option value="right">Right leg</option>
                                </select>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="Amount (USDT)"
                                    value={addForm.data.amount_usdt}
                                    onChange={(e) => addForm.setData('amount_usdt', e.target.value)}
                                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Reason (audit)"
                                    value={addForm.data.reason}
                                    onChange={(e) => addForm.setData('reason', e.target.value)}
                                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-500"
                                >
                                    Add volume
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
