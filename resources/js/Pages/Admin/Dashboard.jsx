import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import Button from '@/Components/ui/Button';
import {
    Users,
    UserCheck,
    UserX,
    DollarSign,
    TrendingUp,
    Gift,
    PieChart,
    Award,
    FileCheck,
    CreditCard,
    Calendar,
    Filter,
} from 'lucide-react';

export default function AdminDashboard({
    filters,
    members,
    sales,
    package_wise_sales,
    withdrawals,
    roi_this_week,
    direct_bonus_total,
    binary_bonus_total,
    binary_bonus_this_week,
    rank_holders_count,
    kyc_pending_count,
    packages,
    ranks,
}) {
    const applyFilters = (newFilters) => {
        router.get('/admin', newFilters, { preserveState: true });
    };

    return (
        <AdminLayout title="Dashboard">
            <p className="text-slate-500 mb-6">MLM overview — filter by date, package, rank, and member status.</p>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader title="Filters" />
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date from</label>
                            <input
                                type="date"
                                value={filters?.date_from ?? ''}
                                onChange={(e) => applyFilters({ ...filters, date_from: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date to</label>
                            <input
                                type="date"
                                value={filters?.date_to ?? ''}
                                onChange={(e) => applyFilters({ ...filters, date_to: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Package</label>
                            <select
                                value={filters?.package_id ?? ''}
                                onChange={(e) => applyFilters({ ...filters, package_id: e.target.value || undefined })}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">All</option>
                                {packages?.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Rank</label>
                            <select
                                value={filters?.rank_id ?? ''}
                                onChange={(e) => applyFilters({ ...filters, rank_id: e.target.value || undefined })}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">All</option>
                                {ranks?.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Member status</label>
                            <select
                                value={filters?.member_status ?? ''}
                                onChange={(e) => applyFilters({ ...filters, member_status: e.target.value || undefined })}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">All</option>
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Members */}
                <Card>
                    <CardHeader title="Members" />
                    <CardBody>
                        <div className="grid grid-cols-3 gap-4">
                            <Link href="/admin/members?status=free" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:border-teal-200 transition-colors">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Users className="w-4 h-4" /> Free
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{members?.total_free ?? 0}</p>
                            </Link>
                            <Link href="/admin/members?status=paid" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:border-teal-200 transition-colors">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <UserCheck className="w-4 h-4" /> Paid
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{members?.total_paid ?? 0}</p>
                            </Link>
                            <Link href="/admin/members?status=blocked" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-colors">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <UserX className="w-4 h-4" /> Blocked
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{members?.total_blocked ?? 0}</p>
                            </Link>
                        </div>
                    </CardBody>
                </Card>

                {/* Sales */}
                <Card>
                    <CardHeader title="Sales" />
                    <CardBody>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Total sales</span>
                                <span className="text-xl font-bold text-teal-600">${(sales?.total ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Sales today</span>
                                <span className="font-semibold">${(sales?.today ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">In selected range</span>
                                <span className="font-semibold">${(sales?.in_range ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Package-wise sales */}
            <Card className="mb-6">
                <CardHeader title="Package-wise sales (in date range)" />
                <CardBody className="p-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Package</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Sales</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {package_wise_sales?.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-6 py-3 text-sm font-medium text-slate-900">{p.name}</td>
                                    <td className="px-6 py-3 text-sm text-right font-semibold text-teal-600">
                                        ${(p.total_sales ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Link href="/admin/withdrawals" className="block">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardBody>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Pending withdrawals</p>
                                    <p className="text-xl font-bold text-slate-900">{withdrawals?.pending_count ?? 0}</p>
                                    <p className="text-sm text-amber-600">${(withdrawals?.pending_amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Link>
                <Card>
                    <CardBody>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">ROI this week</p>
                                <p className="text-xl font-bold text-slate-900">${(roi_this_week ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                <Gift className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Direct bonus total</p>
                                <p className="text-xl font-bold text-slate-900">${(direct_bonus_total ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <PieChart className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Binary bonus</p>
                                <p className="text-xl font-bold text-slate-900">${(binary_bonus_total ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                <p className="text-xs text-slate-500">This week: ${(binary_bonus_this_week ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/kyc" className="block">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardBody className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                                <FileCheck className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-slate-500">KYC approval requests</p>
                                <p className="text-3xl font-bold text-slate-900">{kyc_pending_count ?? 0}</p>
                            </div>
                        </CardBody>
                    </Card>
                </Link>
                <Card>
                    <CardBody className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Award className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-slate-500">Rank holders</p>
                            <p className="text-3xl font-bold text-slate-900">{rank_holders_count ?? 0}</p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/admin/members">
                    <Button variant="primary">Manage members</Button>
                </Link>
                <Link href="/admin/withdrawals">
                    <Button variant="outline">Withdrawals</Button>
                </Link>
                <Link href="/admin/kyc">
                    <Button variant="outline">KYC</Button>
                </Link>
                <Link href="/admin/settings">
                    <Button variant="outline">Settings</Button>
                </Link>
            </div>
        </AdminLayout>
    );
}
