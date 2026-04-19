import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import Button from '@/Components/ui/Button';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminSettings({ settings, packages }) {
    const form = useForm({
        withdrawal_min_usd: settings?.withdrawal_min_usd ?? 20,
        withdrawal_fee_percent: settings?.withdrawal_fee_percent ?? 2,
        withdrawal_allowed_days: settings?.withdrawal_allowed_days ?? [0, 1, 2, 3, 4, 5, 6],
        kyc_required_for_withdrawal: settings?.kyc_required_for_withdrawal ?? false,
        direct_bonus_percent: settings?.direct_bonus_percent ?? 10,
        binary_bonus_percent: settings?.binary_bonus_percent ?? 10,
        binary_run_at_dubai_time: settings?.binary_run_at_dubai_time ?? '00:00',
        roi_global_enabled: settings?.roi_global_enabled ?? true,
        roi_contract_cap_percent: settings?.roi_contract_cap_percent ?? 250,
        roi_distribution_mode: settings?.roi_distribution_mode ?? 'weekly',
        contract_network_cap_multiplier: settings?.contract_network_cap_multiplier ?? 5,
    });

    const toggleDay = (dayIndex) => {
        const days = Array.isArray(form.data.withdrawal_allowed_days) ? [...form.data.withdrawal_allowed_days] : [];
        const i = days.indexOf(dayIndex);
        if (i >= 0) days.splice(i, 1);
        else days.push(dayIndex);
        days.sort((a, b) => a - b);
        form.setData('withdrawal_allowed_days', days);
    };

    return (
        <AdminLayout title="Settings">
            <form onSubmit={(e) => { e.preventDefault(); form.post('/admin/settings'); }} className="space-y-6">
                <Card>
                    <CardHeader title="Withdrawals" />
                    <CardBody className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Minimum withdrawal (USD)</label>
                            <input type="number" step="0.01" min="0" value={form.data.withdrawal_min_usd} onChange={(e) => form.setData('withdrawal_min_usd', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Fee % (company withdrawals)</label>
                            <input type="number" step="0.01" min="0" max="100" value={form.data.withdrawal_fee_percent} onChange={(e) => form.setData('withdrawal_fee_percent', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Allowed days (uncheck to restrict; all checked = any time)</label>
                            <div className="flex flex-wrap gap-2">
                                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                                    <label key={d} className="flex items-center gap-1">
                                        <input type="checkbox" checked={(form.data.withdrawal_allowed_days || []).includes(d)} onChange={() => toggleDay(d)} />
                                        <span>{DAY_NAMES[d]}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={form.data.kyc_required_for_withdrawal} onChange={(e) => form.setData('kyc_required_for_withdrawal', e.target.checked)} />
                                <span>Require KYC approval for withdrawal</span>
                            </label>
                            <p className="text-xs text-slate-500 mt-1">When enabled, users must have at least one approved KYC document before they can request a withdrawal.</p>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="Bonus rates" />
                    <CardBody className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Direct bonus %</label>
                            <input type="number" step="0.01" min="0" max="100" value={form.data.direct_bonus_percent} onChange={(e) => form.setData('direct_bonus_percent', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                            <p className="text-xs text-slate-500 mt-1">Applied globally to all qualifying direct bonus payouts.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Default binary %</label>
                            <input type="number" step="0.01" min="0" max="100" value={form.data.binary_bonus_percent} onChange={(e) => form.setData('binary_bonus_percent', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Run at (Dubai time)</label>
                            <input type="time" value={form.data.binary_run_at_dubai_time} onChange={(e) => form.setData('binary_run_at_dubai_time', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="ROI & contract" />
                    <CardBody className="space-y-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={form.data.roi_global_enabled} onChange={(e) => form.setData('roi_global_enabled', e.target.checked)} />
                            <span>ROI globally enabled</span>
                        </label>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contract expiry: ROI cap % (e.g. 250 = 250% of investment)</label>
                            <input type="number" min="100" value={form.data.roi_contract_cap_percent} onChange={(e) => form.setData('roi_contract_cap_percent', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Network-active package cap: X times investment (e.g. 5 = 5X)</label>
                            <input type="number" min="1" value={form.data.contract_network_cap_multiplier} onChange={(e) => form.setData('contract_network_cap_multiplier', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ROI distribution</label>
                            <select value={form.data.roi_distribution_mode} onChange={(e) => form.setData('roi_distribution_mode', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                                <option value="weekly">Weekly (cron)</option>
                                <option value="manual">Manual only</option>
                            </select>
                        </div>
                    </CardBody>
                </Card>

                <Button type="submit" variant="primary" disabled={form.processing}>Save settings</Button>
            </form>
        </AdminLayout>
    );
}
