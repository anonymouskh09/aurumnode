import { router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';

export default function AdminWithdrawals({ withdrawals }) {
    return (
        <AdminLayout title="Withdrawals">
            <Card>
                <CardHeader
                    title="Pending withdrawal requests"
                    subtitle="Approve or reject member withdrawal requests"
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
                                withdrawals.data.map((w, i) => (
                                    <TableRow key={w.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                        <Td>
                                            <span className="font-medium">{w.user?.username}</span>
                                            {w.user?.name && <span className="text-slate-500 block text-xs">{w.user.name}</span>}
                                        </Td>
                                        <Td align="right" className="font-semibold">${parseFloat(w.amount).toFixed(2)}</Td>
                                        <Td align="right" className="text-slate-500">${parseFloat(w.fee_amount ?? 0).toFixed(2)}</Td>
                                        <Td className="truncate max-w-[180px] text-slate-600">{w.usdt_address}</Td>
                                        <Td>
                                            <Badge variant={w.status === 'approved' ? 'success' : w.status === 'rejected' ? 'danger' : 'pending'}>
                                                {w.status}
                                            </Badge>
                                        </Td>
                                        <Td className="text-slate-500 text-sm">{w.requested_at ? new Date(w.requested_at).toLocaleString() : '—'}</Td>
                                        <Td>
                                            {w.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="text-sm text-green-700 border-green-300 hover:bg-green-50"
                                                        onClick={() => router.post(`/admin/withdrawals/${w.id}/approve`, {}, { preserveScroll: true })}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="text-sm text-red-700 border-red-300 hover:bg-red-50"
                                                        onClick={() => router.post(`/admin/withdrawals/${w.id}/reject`, {}, { preserveScroll: true })}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No pending withdrawals" />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </AdminLayout>
    );
}
