import { router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';

export default function AdminKyc({ documents }) {
    return (
        <AdminLayout title="KYC">
            <Card>
                <CardHeader
                    title="KYC documents"
                    subtitle="Approve or reject member KYC submissions"
                />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>User</Th>
                            <Th>Type</Th>
                            <Th>Status</Th>
                            <Th>Submitted</Th>
                            <Th>Actions</Th>
                        </TableHeader>
                        <TableBody>
                            {documents?.data?.length ? (
                                documents.data.map((doc, i) => (
                                    <TableRow key={doc.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                        <Td>
                                            <span className="font-medium">{doc.user?.username}</span>
                                            {doc.user?.name && <span className="text-slate-500 block text-xs">{doc.user.name}</span>}
                                        </Td>
                                        <Td className="text-slate-600">{doc.document_type}</Td>
                                        <Td>
                                            <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'pending'}>
                                                {doc.status}
                                            </Badge>
                                        </Td>
                                        <Td className="text-slate-500 text-sm">{doc.created_at ? new Date(doc.created_at).toLocaleString() : '—'}</Td>
                                        <Td>
                                            {doc.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="text-sm text-green-700 border-green-300 hover:bg-green-50"
                                                        onClick={() => router.post(`/admin/kyc/${doc.id}/approve`, {}, { preserveScroll: true })}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="text-sm text-red-700 border-red-300 hover:bg-red-50"
                                                        onClick={() => router.post(`/admin/kyc/${doc.id}/reject`, {}, { preserveScroll: true })}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No KYC documents" />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </AdminLayout>
    );
}
