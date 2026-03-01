import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, StatCard } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import { PieChart, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BinaryBonus({ logs, totalEarned, balance, leftTotal, rightTotal }) {
    return (
        <DashboardLayout title="Binary Bonus">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    icon={PieChart}
                    label="Total binary earned"
                    value={`$${(totalEarned ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                />
                <StatCard
                    icon={DollarSign}
                    label="Binary bonus balance"
                    value={`$${(balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                />
                <StatCard
                    icon={ChevronLeft}
                    label="Left leg points"
                    value={(leftTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                />
                <StatCard
                    icon={ChevronRight}
                    label="Right leg points"
                    value={(rightTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                />
            </div>

            <Card>
                <CardHeader
                    title="Binary bonus history"
                    subtitle="Earned from matching left and right leg volume"
                />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>Date</Th>
                            <Th align="right">Left points</Th>
                            <Th align="right">Right points</Th>
                            <Th align="right">Matched (lesser)</Th>
                            <Th align="right">% used</Th>
                            <Th align="right">Payout</Th>
                        </TableHeader>
                        <TableBody>
                            {logs?.length ? (
                                logs.map((log, i) => (
                                    <TableRow key={log.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                        <Td className="text-slate-600">
                                            {new Date(log.date).toLocaleDateString()}
                                        </Td>
                                        <Td align="right">{parseFloat(log.left_points).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                                        <Td align="right">{parseFloat(log.right_points).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                                        <Td align="right">{parseFloat(log.lesser_points).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                                        <Td align="right">{parseFloat(log.percent_used)}%</Td>
                                        <Td align="right" className="font-semibold text-green-600">
                                            +${parseFloat(log.payout_amount).toFixed(2)}
                                        </Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No binary bonuses yet. Build both legs to earn matching bonuses." />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </DashboardLayout>
    );
}
