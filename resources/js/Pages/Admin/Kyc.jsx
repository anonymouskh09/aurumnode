import { router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';

export default function AdminKyc({ documents }) {
    const submitDecision = (docId, action) => {
        router.post(
            `/admin/kyc/${docId}/${action}`,
            {},
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            }
        );
    };

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
                            <Th>Documents</Th>
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
                                        <Td>
                                            {(doc.documents ?? []).length > 0 ? (
                                                <div className="space-y-1">
                                                    {(doc.documents ?? []).map((item) => (
                                                        <a
                                                            key={item.id}
                                                            href={item.view_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center justify-between rounded-lg border border-amber-500/20 px-2.5 py-1 text-xs text-amber-300 transition hover:bg-amber-500/10"
                                                        >
                                                            <span>{item.document_type}</span>
                                                            <span className="uppercase text-[10px] text-slate-300">{item.status}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-slate-500 text-xs">No files</span>
                                            )}
                                        </Td>
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
                                                        type="button"
                                                        onClick={() => submitDecision(doc.id, 'approve')}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="text-sm text-red-700 border-red-300 hover:bg-red-50"
                                                        type="button"
                                                        onClick={() => submitDecision(doc.id, 'reject')}
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
