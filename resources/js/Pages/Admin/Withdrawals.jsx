import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Copy, Check } from 'lucide-react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';

function CopyableAddress({ address }) {
    const [copied, setCopied] = useState(false);

    if (!address) {
        return <span className="text-slate-500">—</span>;
    }

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const input = document.createElement('textarea');
            input.value = address;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-xs flex flex-col gap-2">
            <span className="font-mono text-sm text-slate-200 break-all">{address}</span>
            <Button
                type="button"
                variant="primary"
                onClick={copy}
                title={copied ? 'Copied!' : 'Copy address'}
                className="w-fit text-xs py-1.5 px-3 rounded-full"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
            </Button>
        </div>
    );
}

export default function AdminWithdrawals({ withdrawals }) {
    const [processingId, setProcessingId] = useState(null);
    const [action, setAction] = useState(null);

    const handleAction = (withdrawalId, type) => {
        const isApprove = type === 'approve';
        const message = isApprove
            ? 'Approve this withdrawal request?'
            : 'Reject this withdrawal? The user will be refunded (amount + fee) and notified by email to update their USDT BEP20 address.';

        if (!window.confirm(message)) {
            return;
        }

        const url = `/admin/withdrawals/${withdrawalId}/${type}`;
        setProcessingId(withdrawalId);
        setAction(type);

        router.post(url, {}, {
            preserveScroll: true,
            onFinish: () => {
                setProcessingId(null);
                setAction(null);
            },
        });
    };

    return (
        <AdminLayout title="Withdrawals">
            <Card>
                <CardHeader
                    title="Withdrawal requests"
                    subtitle="Approve or reject pending requests. Processed requests stay listed with their status."
                />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>User</Th>
                            <Th align="right">Amount</Th>
                            <Th align="right">Fee</Th>
                            <Th>Address</Th>
                            <Th>Status</Th>
                            <Th>Date</Th>
                            <Th>Actions</Th>
                        </TableHeader>
                        <TableBody>
                            {withdrawals?.data?.length ? (
                                withdrawals.data.map((w, i) => {
                                    const isProcessing = processingId === w.id;
                                    return (
                                        <TableRow key={w.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                            <Td>
                                                <span className="font-medium">{w.user?.username}</span>
                                                {w.user?.name && <span className="text-slate-500 block text-xs">{w.user.name}</span>}
                                            </Td>
                                            <Td align="right" className="font-semibold">${parseFloat(w.amount).toFixed(2)}</Td>
                                            <Td align="right" className="text-slate-500">${parseFloat(w.fee_amount ?? 0).toFixed(2)}</Td>
                                            <Td className="align-top">
                                                <CopyableAddress address={w.usdt_address} />
                                            </Td>
                                            <Td>
                                                <Badge variant={w.status === 'approved' ? 'success' : w.status === 'rejected' ? 'danger' : 'pending'}>
                                                    {w.status}
                                                </Badge>
                                            </Td>
                                            <Td className="text-slate-500 text-sm">{w.requested_at ? new Date(w.requested_at).toLocaleString() : '—'}</Td>
                                            <Td>
                                                {w.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            disabled={isProcessing}
                                                            className="text-sm text-green-700 border-green-300 hover:bg-green-50"
                                                            onClick={() => handleAction(w.id, 'approve')}
                                                        >
                                                            {isProcessing && action === 'approve' ? 'Approving…' : 'Approve'}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            disabled={isProcessing}
                                                            className="text-sm text-red-700 border-red-300 hover:bg-red-50"
                                                            onClick={() => handleAction(w.id, 'reject')}
                                                        >
                                                            {isProcessing && action === 'reject' ? 'Rejecting…' : 'Reject'}
                                                        </Button>
                                                    </div>
                                                ) : w.status === 'approved' ? (
                                                    <span className="text-sm font-medium text-emerald-400">Approved</span>
                                                ) : w.status === 'rejected' ? (
                                                    <span className="text-sm font-medium text-red-400">Rejected</span>
                                                ) : (
                                                    <span className="text-sm text-slate-400 capitalize">{w.status}</span>
                                                )}
                                            </Td>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableEmpty message="No withdrawal requests yet" />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </AdminLayout>
    );
}
