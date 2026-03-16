import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, StatCard } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import { Gift, DollarSign } from 'lucide-react';

export default function DirectBonus({ logs, totalEarned, balance }) {
    return (
        <DashboardLayout title="Direct Bonus">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard
                    icon={Gift}
                    label="Total earned"
                    value={`$${(totalEarned ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                />
                <StatCard
                    icon={DollarSign}
                    label="Direct bonus balance"
                    value={`$${(balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                />
            </div>

            <Card>
                <CardHeader
                    title="Direct bonus history"
                    subtitle="10% from each paid package purchased by your direct referrals"
                />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>Date</Th>
                            <Th>From (referral)</Th>
                            <Th align="right">Amount</Th>
                            <Th align="right">%</Th>
                        </TableHeader>
                        <TableBody>
                            {logs?.length ? (
                                logs.map((log, i) => (
                                    <TableRow key={log.id} className={i % 2 === 1 ? 'bg-[#1f2231]' : ''}>
                                        <Td className="text-slate-300">
                                            {new Date(log.created_at).toLocaleDateString()}
                                        </Td>
                                        <Td>
                                            <span className="font-medium">{log.from_user?.name ?? '—'}</span>
                                            {log.from_user?.username && (
                                                <span className="text-slate-400 ml-1">@{log.from_user.username}</span>
                                            )}
                                        </Td>
                                        <Td align="right" className="font-semibold text-green-600">
                                            +${parseFloat(log.amount).toFixed(2)}
                                        </Td>
                                        <Td align="right" className="text-slate-400">{log.percent}%</Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No direct bonuses yet. Earn 10% when your referrals purchase packages." />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </DashboardLayout>
    );
}



