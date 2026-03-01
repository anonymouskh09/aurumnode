import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, StatCard } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function Roi({ logs, totalEarned, balance, totalRoiReceived }) {
    return (
        <DashboardLayout title="My ROI">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard
                    icon={TrendingUp}
                    label="Total ROI earned"
                    value={`$${(totalEarned ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                />
                <StatCard
                    icon={DollarSign}
                    label="ROI wallet balance"
                    value={`$${(balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Lifetime ROI received"
                    value={`$${(totalRoiReceived ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                />
            </div>

            <Card>
                <CardHeader
                    title="ROI credit history"
                    subtitle="Returns earned from your activated packages"
                />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>Date</Th>
                            <Th>Package</Th>
                            <Th align="right">Amount</Th>
                            <Th align="right">Rate</Th>
                        </TableHeader>
                        <TableBody>
                            {logs?.length ? (
                                logs.map((log, i) => (
                                    <TableRow key={log.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                        <Td className="text-slate-600">
                                            {new Date(log.date).toLocaleDateString()}
                                        </Td>
                                        <Td>{log.user_package?.package?.name ?? '—'}</Td>
                                        <Td align="right" className="font-semibold text-green-600">
                                            +${parseFloat(log.amount).toFixed(2)}
                                        </Td>
                                        <Td align="right" className="text-slate-500">
                                            {log.rate ? `${(parseFloat(log.rate) * 100).toFixed(2)}%` : '—'}
                                        </Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No ROI credits yet. Purchase and activate packages to earn ROI." />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </DashboardLayout>
    );
}
