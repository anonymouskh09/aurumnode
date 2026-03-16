import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, Button } from '@/Components/ui';
import { Lock } from 'lucide-react';

const inputClass = 'block w-full rounded-xl border border-amber-500/20 px-4 py-2.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500';

const EARNINGS_WALLETS = [
    { key: 'direct_bonus_wallet', label: 'Direct Bonus' },
    { key: 'binary_bonus_wallet', label: 'Binary Bonus' },
    { key: 'roi_wallet', label: 'ROI' },
    { key: 'rank_award_wallet', label: 'Rank Award' },
];

const TRANSFER_TO_WITHDRAWAL_WALLETS = [
    { key: 'deposit_wallet', label: 'Deposit Wallet (USDT)' },
    ...EARNINGS_WALLETS,
];

export default function Transfers({ wallet }) {
    const transferToWithdrawal = useForm({ amount: '', from: 'deposit_wallet' });
    const transferToUser = useForm({ amount: '', to_username: '' });

    const transferToWithdrawalWallets = TRANSFER_TO_WITHDRAWAL_WALLETS;

    const getBalance = (key) => parseFloat(wallet?.[key] ?? 0).toFixed(2);

    const investmentBalance = parseFloat(wallet?.investment_wallet ?? 0);

    return (
        <DashboardLayout title="Fund Transfers">
            <div className="max-w-2xl space-y-6">
                {investmentBalance > 0 && (
                    <Card className="bg-amber-500/10 border-amber-500/30" title="Investment locked. Withdrawal not available.">
                        <CardBody className="flex items-center gap-3">
                            <Lock className="w-6 h-6 text-amber-300 shrink-0" />
                            <div>
                                <p className="font-medium text-slate-200">Locked Investment: ${investmentBalance.toFixed(2)}</p>
                                <p className="text-sm text-slate-300">Investment locked. Withdrawal not available.</p>
                            </div>
                        </CardBody>
                    </Card>
                )}
                <Card>
                    <CardHeader title="Transfer to withdrawal wallet (USDT)" subtitle="Move earnings to your withdrawal wallet to request payout" />
                    <CardBody>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                transferToWithdrawal.post('/dashboard/transfers/to-withdrawal');
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">From</label>
                                <select
                                    value={transferToWithdrawal.data.from}
                                    onChange={(e) => transferToWithdrawal.setData('from', e.target.value)}
                                    className={inputClass}
                                >
                                    {transferToWithdrawalWallets.map((w) => (
                                        <option key={w.key} value={w.key}>
                                            {w.label} (${getBalance(w.key)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Amount (USDT)</label>
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
                    <CardHeader title="Transfer to another user (USDT)" subtitle="Only from Withdrawal Wallet. Recipient receives in Deposit Wallet." />
                    <CardBody>
                        <p className="text-sm text-slate-300 mb-4">Available: <strong>${getBalance('withdrawal_wallet')}</strong> (Withdrawal Wallet)</p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                transferToUser.post('/dashboard/transfers/to-user');
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Recipient username</label>
                                <input
                                    type="text"
                                    value={transferToUser.data.to_username}
                                    onChange={(e) => transferToUser.setData('to_username', e.target.value)}
                                    placeholder="username"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Amount (USDT)</label>
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




