import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, Button } from '@/Components/ui';
import { Lock } from 'lucide-react';

const inputClass = 'block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500';

const EARNINGS_WALLETS = [
    { key: 'direct_bonus_wallet', label: 'Direct Bonus' },
    { key: 'binary_bonus_wallet', label: 'Binary Bonus' },
    { key: 'roi_wallet', label: 'ROI' },
    { key: 'rank_award_wallet', label: 'Rank Award' },
];

export default function Transfers({ wallet }) {
    const transferToWithdrawal = useForm({ amount: '', from: 'direct_bonus_wallet' });
    const transferToUser = useForm({ amount: '', to_username: '', from: 'direct_bonus_wallet' });

    const wallets = EARNINGS_WALLETS;

    const getBalance = (key) => parseFloat(wallet?.[key] ?? 0).toFixed(2);

    const investmentBalance = parseFloat(wallet?.investment_wallet ?? 0);

    return (
        <DashboardLayout title="Fund Transfers">
            <div className="max-w-2xl space-y-6">
                {investmentBalance > 0 && (
                    <Card className="bg-amber-50/50 border-amber-200" title="Investment locked. Withdrawal not available.">
                        <CardBody className="flex items-center gap-3">
                            <Lock className="w-6 h-6 text-amber-600 shrink-0" />
                            <div>
                                <p className="font-medium text-slate-800">Locked Investment: ${investmentBalance.toFixed(2)}</p>
                                <p className="text-sm text-slate-600">Investment locked. Withdrawal not available.</p>
                            </div>
                        </CardBody>
                    </Card>
                )}
                <Card>
                    <CardHeader title="Transfer to withdrawal wallet" subtitle="Move funds to your withdrawal wallet" />
                    <CardBody>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                transferToWithdrawal.post('/dashboard/transfers/to-withdrawal');
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                                <select
                                    value={transferToWithdrawal.data.from}
                                    onChange={(e) => transferToWithdrawal.setData('from', e.target.value)}
                                    className={inputClass}
                                >
                                    {wallets.map((w) => (
                                        <option key={w.key} value={w.key}>
                                            {w.label} (${getBalance(w.key)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={transferToWithdrawal.data.amount}
                                    onChange={(e) => transferToWithdrawal.setData('amount', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <Button type="submit" variant="primary" disabled={transferToWithdrawal.processing}>
                                Transfer
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="Transfer to another user" subtitle="Send funds by username" />
                    <CardBody>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                transferToUser.post('/dashboard/transfers/to-user');
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient username</label>
                                <input
                                    type="text"
                                    value={transferToUser.data.to_username}
                                    onChange={(e) => transferToUser.setData('to_username', e.target.value)}
                                    placeholder="username"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">From wallet</label>
                                <select
                                    value={transferToUser.data.from}
                                    onChange={(e) => transferToUser.setData('from', e.target.value)}
                                    className={inputClass}
                                >
                                    {wallets.map((w) => (
                                        <option key={w.key} value={w.key}>
                                            {w.label} (${getBalance(w.key)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={transferToUser.data.amount}
                                    onChange={(e) => transferToUser.setData('amount', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <Button type="submit" variant="primary" disabled={transferToUser.processing}>
                                Transfer
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </DashboardLayout>
    );
}
