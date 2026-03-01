import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import Button from '@/Components/ui/Button';

export default function AdminMemberShow({ member, packages, activityLogs }) {
    const profileForm = useForm({
        name: member?.name ?? '',
        email: member?.email ?? '',
        mobile: member?.mobile ?? '',
        country: member?.country ?? '',
        city: member?.city ?? '',
        address: member?.address ?? '',
        usdt_address: member?.usdt_address ?? '',
        is_blocked: !!member?.is_blocked,
        status: member?.status ?? 'free',
    });

    const passwordForm = useForm({ password: '', password_confirmation: '' });
    const walletForm = useForm({ wallet: 'withdrawal_wallet', amount: '', reason: '' });

    return (
        <AdminLayout title={`Member: ${member?.username ?? ''}`}>
            <div className="mb-6">
                <Link href="/admin/members">
                    <Button variant="outline" className="text-sm">← Back to Members</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader title="Profile" />
                    <CardBody>
                        <form onSubmit={(e) => { e.preventDefault(); profileForm.put(`/admin/members/${member.id}`); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input type="text" value={profileForm.data.name} onChange={(e) => profileForm.setData('name', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" value={profileForm.data.email} onChange={(e) => profileForm.setData('email', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile</label>
                                <input type="text" value={profileForm.data.mobile} onChange={(e) => profileForm.setData('mobile', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country / City</label>
                                <div className="flex gap-2">
                                    <input type="text" value={profileForm.data.country} onChange={(e) => profileForm.setData('country', e.target.value)} placeholder="Country" className="flex-1 rounded-lg border border-slate-300 px-3 py-2" />
                                    <input type="text" value={profileForm.data.city} onChange={(e) => profileForm.setData('city', e.target.value)} placeholder="City" className="flex-1 rounded-lg border border-slate-300 px-3 py-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <textarea value={profileForm.data.address} onChange={(e) => profileForm.setData('address', e.target.value)} rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">USDT address</label>
                                <input type="text" value={profileForm.data.usdt_address} onChange={(e) => profileForm.setData('usdt_address', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                            </div>
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={profileForm.data.is_blocked} onChange={(e) => profileForm.setData('is_blocked', e.target.checked)} />
                                    <span className="text-sm">Blocked</span>
                                </label>
                                <select value={profileForm.data.status} onChange={(e) => profileForm.setData('status', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <Button type="submit" variant="primary" disabled={profileForm.processing}>Save</Button>
                        </form>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="Wallet" />
                    <CardBody>
                        {member?.wallet && (
                            <ul className="space-y-2 text-sm mb-4">
                                <li>Deposit: ${parseFloat(member.wallet.deposit_wallet ?? 0).toFixed(2)}</li>
                                <li>Withdrawal: ${parseFloat(member.wallet.withdrawal_wallet ?? 0).toFixed(2)}</li>
                                <li>Direct bonus: ${parseFloat(member.wallet.direct_bonus_wallet ?? 0).toFixed(2)}</li>
                                <li>Binary bonus: ${parseFloat(member.wallet.binary_bonus_wallet ?? 0).toFixed(2)}</li>
                                <li>ROI: ${parseFloat(member.wallet.roi_wallet ?? 0).toFixed(2)}</li>
                            </ul>
                        )}
                        <form onSubmit={(e) => { e.preventDefault(); walletForm.post(`/admin/members/${member.id}/wallet-adjust`); }} className="space-y-3">
                            <select value={walletForm.data.wallet} onChange={(e) => walletForm.setData('wallet', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                <option value="deposit_wallet">Deposit</option>
                                <option value="withdrawal_wallet">Withdrawal</option>
                                <option value="direct_bonus_wallet">Direct bonus</option>
                                <option value="binary_bonus_wallet">Binary bonus</option>
                                <option value="roi_wallet">ROI</option>
                            </select>
                            <input type="number" step="0.01" placeholder="Amount (+ or -)" value={walletForm.data.amount} onChange={(e) => walletForm.setData('amount', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
                            <input type="text" placeholder="Reason (optional)" value={walletForm.data.reason} onChange={(e) => walletForm.setData('reason', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                            <Button type="submit" variant="outline" className="text-sm" disabled={walletForm.processing}>Adjust</Button>
                        </form>
                    </CardBody>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader title="Reset password" />
                <CardBody>
                    <form onSubmit={(e) => { e.preventDefault(); passwordForm.post(`/admin/members/${member.id}/reset-password`); }} className="flex flex-wrap gap-3 items-end">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
                            <input type="password" value={passwordForm.data.password} onChange={(e) => passwordForm.setData('password', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" required minLength={8} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm</label>
                            <input type="password" value={passwordForm.data.password_confirmation} onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" required />
                        </div>
                        <Button type="submit" variant="outline" disabled={passwordForm.processing}>Reset password</Button>
                    </form>
                </CardBody>
            </Card>

            <Card className="mt-6">
                <CardHeader title="Activity logs" />
                <CardBody className="p-0">
                    <ul className="divide-y divide-slate-100">
                        {activityLogs?.length ? activityLogs.map((log) => (
                            <li key={log.id} className="px-6 py-3 text-sm">
                                <span className="font-medium">{log.action}</span>
                                <span className="text-slate-500 ml-2">{new Date(log.created_at).toLocaleString()}</span>
                                {log.payload && Object.keys(log.payload).length > 0 && (
                                    <pre className="mt-1 text-xs text-slate-600">{JSON.stringify(log.payload)}</pre>
                                )}
                            </li>
                        )) : (
                            <li className="px-6 py-8 text-slate-500 text-center">No activity logs</li>
                        )}
                    </ul>
                </CardBody>
            </Card>
        </AdminLayout>
    );
}
