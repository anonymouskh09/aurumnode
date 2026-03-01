import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, Badge } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import { Users } from 'lucide-react';

export default function Team({ team }) {
    return (
        <DashboardLayout title="My Team">
            <Card>
                <CardHeader title="Direct Team" subtitle="Members you referred directly" />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>Name</Th>
                            <Th>Username</Th>
                            <Th>Package</Th>
                            <Th>Join date</Th>
                            <Th align="right">Status</Th>
                        </TableHeader>
                        <TableBody>
                            {team?.length ? (
                                team.map((member, i) => (
                                    <TableRow key={member.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                        <Td className="font-medium text-slate-900">{member.name}</Td>
                                        <Td>@{member.username}</Td>
                                        <Td>{member.latest_package?.name ?? '—'}</Td>
                                        <Td>{member.created_at ? new Date(member.created_at).toLocaleDateString() : '—'}</Td>
                                        <Td align="right">
                                            <Badge variant={member.status === 'paid' ? 'paid' : 'pending'}>
                                                {member.status}
                                            </Badge>
                                        </Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No team members yet" />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </DashboardLayout>
    );
}
