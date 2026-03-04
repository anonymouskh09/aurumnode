import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import { TrendingUp } from 'lucide-react';

export default function Top({ topByVolume, topByInvestment }) {
    return (
        <DashboardLayout title="Top Performers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader
                        title="Top by volume"
                        subtitle="Members with highest left + right leg volume (USDT)"
                    />
                    <CardBody className="p-0">
                        <Table>
                            <TableHeader>
                                <Th>#</Th>
                                <Th>Member</Th>
                                <Th align="right">Total volume (USDT)</Th>
                            </TableHeader>
                            <TableBody>
                                {topByVolume?.length ? (
                                    topByVolume.map((u, i) => (
                                        <TableRow key={u.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                            <Td>
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold ${
                                                    i === 0 ? 'bg-amber-100 text-amber-700' :
                                                    i === 1 ? 'bg-slate-200 text-slate-700' :
                                                    i === 2 ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {i + 1}
                                                </span>
                                            </Td>
                                            <Td>
                                                <span className="font-medium">{u.name}</span>
                                                <span className="text-slate-500 ml-1">@{u.username}</span>
                                            </Td>
                                            <Td align="right" className="font-semibold">
                                                ${parseFloat(u.total_volume ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </Td>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableEmpty message="No data yet" />
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader
                        title="Top by investment"
                        subtitle="Members with highest total package investment"
                    />
                    <CardBody className="p-0">
                        <Table>
                            <TableHeader>
                                <Th>#</Th>
                                <Th>Member</Th>
                                <Th align="right">Total invested (USDT)</Th>
                            </TableHeader>
                            <TableBody>
                                {topByInvestment?.length ? (
                                    topByInvestment.map((u, i) => (
                                        <TableRow key={u.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                            <Td>
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold ${
                                                    i === 0 ? 'bg-amber-100 text-amber-700' :
                                                    i === 1 ? 'bg-slate-200 text-slate-700' :
                                                    i === 2 ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {i + 1}
                                                </span>
                                            </Td>
                                            <Td>
                                                <span className="font-medium">{u.name}</span>
                                                <span className="text-slate-500 ml-1">@{u.username}</span>
                                            </Td>
                                            <Td align="right" className="font-semibold text-green-700">
                                                ${parseFloat(u.user_packages_sum_invested_amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </Td>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableEmpty message="No data yet" />
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        </DashboardLayout>
    );
}
