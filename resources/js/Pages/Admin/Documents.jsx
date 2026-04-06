import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';

function formatBytes(bytes) {
    if (!bytes || Number.isNaN(Number(bytes))) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = Number(bytes);
    let unitIdx = 0;
    while (size >= 1024 && unitIdx < units.length - 1) {
        size /= 1024;
        unitIdx += 1;
    }
    return `${size.toFixed(size >= 10 || unitIdx === 0 ? 0 : 1)} ${units[unitIdx]}`;
}

export default function AdminDocuments({ documents }) {
    const form = useForm({
        title: '',
        description: '',
        document: null,
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/admin/documents', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.reset('title', 'description', 'document'),
        });
    };

    const toggle = (id) => {
        router.post(`/admin/documents/${id}/toggle`, {}, { preserveScroll: true });
    };

    const remove = (id) => {
        if (!window.confirm('Delete this document?')) return;
        router.delete(`/admin/documents/${id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Documents">
            <Card className="mb-5">
                <CardHeader title="Upload document" subtitle="Upload files that users can read and download" />
                <CardBody>
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="mb-1 block text-xs text-slate-300">Title</label>
                            <input
                                type="text"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                className="w-full rounded-lg border border-amber-500/25 bg-[#191d2a] px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                                required
                            />
                            {form.errors.title && <p className="mt-1 text-xs text-rose-300">{form.errors.title}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <label className="mb-1 block text-xs text-slate-300">File</label>
                            <input
                                type="file"
                                onChange={(e) => form.setData('document', e.target.files?.[0] ?? null)}
                                className="w-full rounded-lg border border-amber-500/25 bg-[#191d2a] px-3 py-2 text-sm text-slate-100 file:mr-3 file:rounded-md file:border-0 file:bg-amber-500/20 file:px-3 file:py-1.5 file:text-amber-200"
                                required
                            />
                            {form.errors.document && <p className="mt-1 text-xs text-rose-300">{form.errors.document}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs text-slate-300">Description (optional)</label>
                            <textarea
                                rows={3}
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="w-full rounded-lg border border-amber-500/25 bg-[#191d2a] px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                            />
                            {form.errors.description && <p className="mt-1 text-xs text-rose-300">{form.errors.description}</p>}
                        </div>
                        <div className="md:col-span-2 flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) => form.setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-amber-500/40 bg-[#191d2a] text-amber-500"
                                />
                                Publish for users immediately
                            </label>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Uploading...' : 'Upload'}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            <Card>
                <CardHeader title="All documents" subtitle="Manage visibility and downloads" />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>Title</Th>
                            <Th>File</Th>
                            <Th>Status</Th>
                            <Th>Created</Th>
                            <Th>Actions</Th>
                        </TableHeader>
                        <TableBody>
                            {documents?.data?.length ? (
                                documents.data.map((doc, i) => (
                                    <TableRow key={doc.id} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                                        <Td>
                                            <p className="font-medium text-slate-100">{doc.title}</p>
                                            {doc.description ? <p className="text-xs text-slate-400 mt-0.5">{doc.description}</p> : null}
                                        </Td>
                                        <Td>
                                            <p className="text-sm text-slate-200">{doc.original_name}</p>
                                            <p className="text-xs text-slate-400">{formatBytes(doc.file_size)}</p>
                                        </Td>
                                        <Td>
                                            <Badge variant={doc.is_active ? 'success' : 'pending'}>
                                                {doc.is_active ? 'published' : 'hidden'}
                                            </Badge>
                                        </Td>
                                        <Td className="text-sm text-slate-400">
                                            {doc.created_at ? new Date(doc.created_at).toLocaleString() : '-'}
                                        </Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-2">
                                                <a href={doc.download_url} className="inline-flex">
                                                    <Button type="button" variant="outline" className="text-xs">Download</Button>
                                                </a>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="text-xs"
                                                    onClick={() => toggle(doc.id)}
                                                >
                                                    {doc.is_active ? 'Hide' : 'Publish'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="text-xs text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                                                    onClick={() => remove(doc.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No documents uploaded" />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </AdminLayout>
    );
}

