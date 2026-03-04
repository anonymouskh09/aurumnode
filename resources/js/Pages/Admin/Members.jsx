import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { Table, TableHeader, TableBody, TableRow, Th, Td, TableEmpty } from '@/Components/ui';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';

export default function AdminMembers({ members, packages, ranks, filters }) {
    const applyFilter = (key, value) => {
        router.get('/admin/members', { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout title="Members">
            <Card className="mb-6">
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search username, email, name..."
                            defaultValue={filters?.search}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter('search', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <select
                            value={filters?.status ?? ''}
                            onChange={(e) => applyFilter('status', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="">All status</option>
                            <option value="free">Free</option>
                            <option value="paid">Paid</option>
                            <option value="blocked">Blocked</option>
                        </select>
                        <select
                            value={filters?.package_id ?? ''}
                            onChange={(e) => applyFilter('package_id', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="">All packages</option>
                            {packages?.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <select
                            value={filters?.rank_id ?? ''}
                            onChange={(e) => applyFilter('rank_id', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="">All ranks</option>
                            {ranks?.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader title="Member list" />
                <CardBody className="p-0">
                    <Table>
                        <TableHeader>
                            <Th>Member</Th>
                            <Th>Status</Th>
                            <Th>Package</Th>
                            <Th>Direct / Binary</Th>
                            <Th></Th>
                        </TableHeader>
                        <TableBody>
                            {members?.data?.length ? (
                                members.data.map((m) => (
                                    <TableRow key={m.id}>
                                        <Td>
                                            <div>
                                                <span className="font-medium">{m.name}</span>
                                                <span className="text-slate-500 ml-1">@{m.username}</span>
                                                <p className="text-xs text-slate-500">{m.email}</p>
                                            </div>
                                        </Td>
                                        <Td>
                                            {m.is_blocked ? (
                                                <Badge variant="danger">Blocked</Badge>
                                            ) : m.status === 'paid' ? (
                                                <Badge variant="success">Paid</Badge>
                                            ) : (
                                                <Badge variant="secondary">Free</Badge>
                                            )}
                                        </Td>
                                        <Td>
                                            {((m.user_packages || m.userPackages)?.length)
                                                ? (m.user_packages || m.userPackages).map((up) => up.package?.name).filter(Boolean).join(', ')
                                                : '—'}
                                        </Td>
                                        <Td>
                                            {(m.referrals_count ?? 0)} direct / L:${Number(m.left_points_total ?? 0).toFixed(2)} R:${Number(m.right_points_total ?? 0).toFixed(2)}
                                        </Td>
                                        <Td>
                                            <Link href={`/admin/members/${m.id}`}>
                                                <Button variant="outline" className="text-sm">View</Button>
                                            </Link>
                                        </Td>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty message="No members found" />
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {members?.links && (
                <div className="mt-4 flex justify-center gap-2">
                    {members.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-slate-300'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
