import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';

export default function Transactions({ transactions }) {
    return (
        <DashboardLayout title="Transaction History">
            <Card>
                <CardHeader title="Recent transactions" />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>Type</Th>
                            <Th align="right">Amount</Th>
                            <Th>Date</Th>
                        </TableHeader>
                        <TableBody>
                            {transactions?.length ? (
                                transactions.map((t, i) => (
                                    <TableRow key={t.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                        <Td className="font-medium">{t.type}</Td>
                                        <Td align="right" className={parseFloat(t.amount) >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                            {parseFloat(t.amount) >= 0 ? '+' : ''}${parseFloat(t.amount).toFixed(2)}
                                        </Td>
                                        <Td className="text-slate-500">{new Date(t.created_at).toLocaleString()}</Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No transactions yet" />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </DashboardLayout>
    );
}
