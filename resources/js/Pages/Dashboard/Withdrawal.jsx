import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, Button, Badge } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';

function resolveFeePercent(amount, feeSettings) {
    const threshold = parseFloat(feeSettings?.threshold_usd ?? 100);
    const below = parseFloat(feeSettings?.percent_below ?? 10);
    const above = parseFloat(feeSettings?.percent_at_or_above ?? 3);
    if (!Number.isFinite(amount) || amount <= 0) {
        return 0;
    }
    return amount < threshold ? below : above;
}

export default function Withdrawal({
    wallet,
    withdrawals,
    withdrawal_min_usd,
    withdrawal_fee_settings,
    withdrawal_allowed_today,
    withdrawal_allowed_day_labels,
    kyc_required_for_withdrawal,
    has_kyc_approved,
    show_kyc_required_notice,
    errors: serverErrors,
}) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        transaction_password: '',
    });

    const err = (f) => serverErrors?.[f] || errors[f];
    const available = parseFloat(wallet?.withdrawal_wallet ?? 0);
    const minUsd = parseFloat(withdrawal_min_usd ?? 20);
    const threshold = parseFloat(withdrawal_fee_settings?.threshold_usd ?? 100);
    const feeBelow = parseFloat(withdrawal_fee_settings?.percent_below ?? 10);
    const feeAbove = parseFloat(withdrawal_fee_settings?.percent_at_or_above ?? 3);
    const allowedToday = withdrawal_allowed_today !== false;
    const canWithdraw = allowedToday && (!kyc_required_for_withdrawal || has_kyc_approved);

    const amountNum = parseFloat(data.amount || 0);
    const appliedFeePercent = resolveFeePercent(amountNum, withdrawal_fee_settings);
    const appliedFeeAmount = amountNum > 0 ? (amountNum * appliedFeePercent) / 100 : 0;
    const totalDeduct = amountNum > 0 ? amountNum + appliedFeeAmount : 0;

    return (
        <DashboardLayout title="Withdrawal">
            <div className="max-w-2xl space-y-6">
                <Card className="bg-amber-500/10 border-amber-500/30">
                    <CardBody>
                        <p className="text-sm text-slate-300">
                            Available for withdrawal (USDT): <strong className="text-amber-300">${available.toFixed(2)}</strong>
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            Minimum ${minUsd.toFixed(2)} USDT. Company withdrawal fee:{' '}
                            <strong className="text-slate-200">{feeBelow}%</strong> below ${threshold.toFixed(2)},{' '}
                            <strong className="text-slate-200">{feeAbove}%</strong> at ${threshold.toFixed(2)} or above.
                        </p>
                    </CardBody>
                </Card>

                {show_kyc_required_notice && (
                    <Card className="bg-amber-500/10 border-amber-500/30">
                        <CardBody>
                            <p className="text-amber-200 font-medium">Withdrawal se pehle apna KYC approve karwao. Admin ne withdraw ke liye KYC mandatory kar rakha hai. Please go to Profile → KYC documents, upload your documents and wait for approval.</p>
                            <Link href="/dashboard/profile" className="inline-block mt-2 text-amber-300 font-medium hover:underline">Go to Profile & KYC →</Link>
                        </CardBody>
                    </Card>
                )}

                {!allowedToday && (
                    <Card className="bg-amber-500/10 border-amber-500/30">
                        <CardBody>
                            <p className="text-amber-200 font-medium">
                                Withdrawal available on (Dubai time):
                            </p>
                            <p className="text-amber-100 text-lg font-semibold mt-1">
                                {withdrawal_allowed_day_labels || '—'}
                            </p>
                        </CardBody>
                    </Card>
                )}

                <Card>
                    <CardHeader title="Request withdrawal" subtitle="Enter amount and transaction password" />
                    <CardBody>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                post('/dashboard/withdrawal');
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Amount (USDT) — min ${minUsd}</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={minUsd}
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    disabled={!canWithdraw}
                                    className="block w-full rounded-xl border border-amber-500/30 bg-[#1a1c28] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                                {amountNum > 0 && appliedFeePercent > 0 && (
                                    <p className="text-xs text-slate-400 mt-1">
                                        Fee: {appliedFeePercent}% (${appliedFeeAmount.toFixed(2)}) · Total deducted: ${totalDeduct.toFixed(2)}
                                    </p>
                                )}
                                {err('amount') && <p className="text-sm text-red-600 mt-1">{err('amount')}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Transaction password</label>
                                <input
                                    type="password"
                                    value={data.transaction_password}
                                    onChange={(e) => setData('transaction_password', e.target.value)}
                                    className="block w-full rounded-xl border border-amber-500/30 bg-[#1a1c28] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                />
                                {err('transaction_password') && <p className="text-sm text-red-600 mt-1">{err('transaction_password')}</p>}
                            </div>
                            <Button type="submit" variant="primary" disabled={processing || !canWithdraw}>
                                Submit request
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="Withdrawal history" />
                    <CardBody className="p-0">
                        <Table>
                            <TableHeader>
                                <Th align="right">Amount</Th>
                                <Th align="right">Fee</Th>
                                <Th>Address</Th>
                                <Th>Status</Th>
                                <Th>Date</Th>
                            </TableHeader>
                            <TableBody>
                                {withdrawals?.length ? (
                                    withdrawals.map((w, i) => (
                                        <TableRow key={w.id} className={i % 2 === 1 ? 'bg-[#1f2231]' : ''}>
                                            <Td align="right" className="font-medium">${parseFloat(w.amount).toFixed(2)}</Td>
                                            <Td align="right" className="text-slate-400">${parseFloat(w.fee_amount ?? 0).toFixed(2)}</Td>
                                            <Td className="truncate max-w-[150px]">{w.usdt_address}</Td>
                                            <Td><Badge variant={w.status === 'approved' ? 'success' : w.status === 'rejected' ? 'danger' : 'pending'}>{w.status}</Badge></Td>
                                            <Td className="text-slate-400">{new Date(w.requested_at).toLocaleString()}</Td>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableEmpty message="No withdrawals yet" />
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        </DashboardLayout>
    );
}
