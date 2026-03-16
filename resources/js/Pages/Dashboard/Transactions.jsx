import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';

export default function Transactions({ transactions }) {
    const prettyType = (type) => String(type || '')
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const detailText = (t) => {
        const meta = t?.meta_json || {};
        if (t?.type === 'direct_bonus') {
            const who = meta.from_username || meta.from_name || `User #${meta.from_user_id ?? ''}`;
            const pct = meta.percent ? ` (${meta.percent}%)` : '';
            return `From: ${who}${pct}`;
        }
        if (t?.type === 'transfer') {
            if (meta.to_username) return `To: ${meta.to_username}`;
            if (meta.from_username) return `From: ${meta.from_username}`;
        }
        if (t?.type === 'package_purchase' && meta.package_name) {
            return `Package: ${meta.package_name}`;
        }
        if (t?.type === 'deposit' && meta.to) {
            return `To: ${meta.to.replaceAll('_', ' ')}`;
        }
        return '—';
    };

    return (
        <DashboardLayout title="Transaction History">
            <Card>
                <CardHeader title="Recent transactions" />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>Type</Th>
                            <Th>Details</Th>
                            <Th align="right">Amount</Th>
                            <Th>Date</Th>
                        </TableHeader>
                        <TableBody>
                            {transactions?.length ? (
                                transactions.map((t, i) => (
                                    <TableRow key={t.id} className={i % 2 === 1 ? 'bg-[#1f2231]' : ''}>
                                        <Td className="font-medium">{prettyType(t.type)}</Td>
                                        <Td className="text-slate-300">{detailText(t)}</Td>
                                        <Td align="right" className={parseFloat(t.amount) >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                            {parseFloat(t.amount) >= 0 ? '+' : ''}${parseFloat(t.amount).toFixed(2)}
                                        </Td>
                                        <Td className="text-slate-400">{new Date(t.created_at).toLocaleString()}</Td>
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



