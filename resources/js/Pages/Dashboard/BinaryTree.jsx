import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { ChevronLeft, ChevronRight, Loader2, Search, UserRound, X } from 'lucide-react';

const DEEP_TREE_THRESHOLD = 10;
const PACKAGE_META = {
    100: { logo: '/images/brand/100pkg.png', name: 'Starter', borderClass: 'border-emerald-300 shadow-[0_0_0_2px_rgba(110,231,183,0.38),0_0_20px_rgba(16,185,129,0.35)]' },
    500: { logo: '/images/brand/500pkg.png', name: 'Builder', borderClass: 'border-cyan-300 shadow-[0_0_0_2px_rgba(103,232,249,0.38),0_0_20px_rgba(6,182,212,0.35)]' },
    1000: { logo: '/images/brand/1000pkg.png', name: 'Accelerator', borderClass: 'border-blue-300 shadow-[0_0_0_2px_rgba(147,197,253,0.38),0_0_20px_rgba(59,130,246,0.35)]' },
    2500: { logo: '/images/brand/2500pkg.png', name: 'Elite', borderClass: 'border-violet-300 shadow-[0_0_0_2px_rgba(196,181,253,0.38),0_0_20px_rgba(139,92,246,0.35)]' },
    5000: { logo: '/images/brand/5000pkglogo.jpeg', name: 'Titan', borderClass: 'border-fuchsia-300 shadow-[0_0_0_2px_rgba(240,171,252,0.38),0_0_20px_rgba(217,70,239,0.35)]' },
    10000: { logo: '/images/brand/10000pkg.png', name: 'Legacy', borderClass: 'border-rose-300 shadow-[0_0_0_2px_rgba(253,164,175,0.38),0_0_20px_rgba(244,63,94,0.35)]' },
};
const FREE_USER_LOGO = '/images/brand/free.jpeg';

function TreeNode({ node, level = 0, onSelect }) {
    if (!node) return null;

    const isPaid = node.status === 'paid';
    const isRoot = level === 0;
    const highestPackageAmount = Math.round(Number(node.highest_package_amount ?? 0));
    const packageMeta = PACKAGE_META[highestPackageAmount] || null;
    const packageLogo = packageMeta?.logo || null;
    const packageBorderClass = packageMeta?.borderClass || (isPaid ? 'border-amber-300 shadow-[0_0_0_2px_rgba(252,211,77,0.35),0_0_16px_rgba(245,158,11,0.30)]' : 'border-amber-500/30');
    const hasLeft = !!node.left;
    const hasRight = !!node.right;
    const hasChildren = hasLeft || hasRight;

    return (
        <div className="flex flex-col items-center">
            <button
                type="button"
                onClick={() => onSelect?.(node.id)}
                className={`
                    relative h-24 w-24 rounded-full border-2 p-1.5 shrink-0
                    transition-shadow duration-200 cursor-pointer overflow-hidden flex items-center justify-center
                    ${isRoot
                        ? 'ring-2 ring-amber-200 ring-offset-2 ring-offset-slate-50 shadow-md'
                        : ''
                    }
                    ${isPaid ? 'bg-amber-500/10 shadow-sm' : 'bg-[#1f2231]'}
                    ${packageBorderClass}
                `}
                title={node.username || node.name || `User #${node.id}`}
            >
                {packageLogo && (
                    <img
                        src={packageLogo}
                        alt={`$${highestPackageAmount} package`}
                        className="h-full w-full rounded-full object-cover"
                    />
                )}
                {!packageLogo && (
                    <img
                        src={FREE_USER_LOGO}
                        alt="Free user"
                        className="h-full w-full rounded-full object-cover"
                    />
                )}
                {packageMeta && (
                    <span className="absolute inset-x-1 bottom-1 rounded-full bg-black/70 px-1 py-[2px] text-[9px] font-semibold text-white truncate">
                        {packageMeta.name} ${highestPackageAmount}
                    </span>
                )}
            </button>
            {hasChildren && (
                <div className="mt-3 flex flex-col items-center">
                    <div className="h-4 w-px bg-cyan-300/90 shadow-[0_0_14px_rgba(125,211,252,0.95)]" />
                    {hasLeft && hasRight ? (
                        <div className="flex flex-col items-center">
                            <svg
                                viewBox="0 0 100 36"
                                preserveAspectRatio="none"
                                className="h-9 w-28 sm:w-40"
                                aria-hidden="true"
                            >
                                <path
                                    d="M50 0 L18 34 M50 0 L82 34"
                                    fill="none"
                                    stroke="rgba(125,211,252,0.95)"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="flex items-start justify-center gap-6 sm:gap-10">
                                <div className="flex flex-col items-center">
                                    <div className="h-3 w-px bg-cyan-300/90 shadow-[0_0_12px_rgba(125,211,252,0.95)]" />
                                    <TreeNode node={node.left} level={level + 1} onSelect={onSelect} />
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="h-3 w-px bg-cyan-300/90 shadow-[0_0_12px_rgba(125,211,252,0.95)]" />
                                    <TreeNode node={node.right} level={level + 1} onSelect={onSelect} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-px bg-cyan-300/90 shadow-[0_0_12px_rgba(125,211,252,0.95)]" />
                            <TreeNode node={node.left || node.right} level={level + 1} onSelect={onSelect} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function BinaryTree({ tree, leftTotal, rightTotal, maxDepth = 0, requestedDepth = 8, hasMore = false, binaryUnlock = null }) {
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');

    useEffect(() => {
        const text = query.trim();
        if (text.length < 2) {
            setResults([]);
            setSearching(false);
            return undefined;
        }

        const timer = setTimeout(async () => {
            try {
                setSearching(true);
                const response = await fetch(`/dashboard/binary-tree/search?q=${encodeURIComponent(text)}`);
                const data = await response.json();
                setResults(Array.isArray(data?.items) ? data.items : []);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const selectMember = async (memberId) => {
        try {
            setDetailsError('');
            setDetailsLoading(true);
            setModalOpen(true);
            const response = await fetch(`/dashboard/binary-tree/member/${memberId}`);
            if (!response.ok) {
                throw new Error('Unable to fetch details');
            }
            const data = await response.json();
            setSelected(data);
            setResults([]);
            setQuery(data?.username || '');
        } catch {
            setSelected(null);
            setDetailsError('Unable to load member details. Please try again.');
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeModal = () => setModalOpen(false);

    const loadMore = () => {
        setLoadingMore(true);
        router.get('/dashboard/binary-tree', { depth: requestedDepth + 4 }, { preserveState: false });
    };

    const isDeep = maxDepth >= DEEP_TREE_THRESHOLD;
    const canReceiveBinary = !!binaryUnlock?.can_receive;
    const leftPaid = !!binaryUnlock?.left_paid;
    const rightPaid = !!binaryUnlock?.right_paid;
    const unlockMessage = canReceiveBinary
        ? 'Binary commission unlocked. You can receive binary commission now.'
        : (!leftPaid && !rightPaid)
            ? 'Binary commission is locked. Please register 1 direct paid user on LEFT and 1 on RIGHT.'
            : (!leftPaid)
                ? 'Binary commission is locked. Please bring 1 direct paid user on LEFT side.'
                : 'Binary commission is locked. Please bring 1 direct paid user on RIGHT side.';

    return (
        <DashboardLayout title="My Binary Tree">
            {/* Leg totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="overflow-hidden">
                    <CardBody className="flex items-center gap-4 p-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-cyan-100 flex items-center justify-center text-amber-300 shrink-0">
                            <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-400">Left leg total (USDT)</p>
                            <p className="text-2xl font-bold text-slate-100 mt-0.5">
                                ${(leftTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </CardBody>
                </Card>
                <Card className="overflow-hidden">
                    <CardBody className="flex items-center gap-4 p-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-cyan-100 flex items-center justify-center text-amber-300 shrink-0">
                            <ChevronRight className="w-7 h-7" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-400">Right leg total (USDT)</p>
                            <p className="text-2xl font-bold text-slate-100 mt-0.5">
                                ${(rightTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Card className={`mb-6 border ${canReceiveBinary ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
                <CardBody className="p-4">
                    <p className={`text-sm font-medium ${canReceiveBinary ? 'text-amber-200' : 'text-amber-200'}`}>
                        {unlockMessage}
                    </p>
                </CardBody>
            </Card>

            <Card className="mb-6">
                <CardHeader title="Search member in your binary network" subtitle="Type username and pick a matching member to view details." />
                <CardBody>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-300" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by username or name..."
                            className="w-full rounded-xl border border-amber-500/25 bg-[#1a1c28] py-2.5 pl-10 pr-4 text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                        />
                        {searching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-amber-300" />}
                    </div>

                    {results.length > 0 && (
                        <div className="mt-2 overflow-hidden rounded-xl border border-amber-500/20 bg-[#1f2231]">
                            {results.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => selectMember(item.id)}
                                    className="flex w-full items-center justify-between gap-3 border-b border-amber-500/10 px-4 py-3 text-left text-sm transition hover:bg-[#262b3f] last:border-b-0"
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium text-slate-100">@{item.username}</span>
                                        <span className="block truncate text-xs text-slate-400">{item.name || '—'}</span>
                                    </span>
                                    <span className={`rounded-lg border px-2 py-1 text-xs ${item.status === 'paid' ? 'border-emerald-500/40 text-emerald-300' : 'border-slate-500/40 text-slate-300'}`}>
                                        {item.status}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {detailsError && <p className="mt-3 text-sm text-rose-300">{detailsError}</p>}

                    {detailsLoading && (
                        <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300">
                            <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                            Loading member details...
                        </div>
                    )}

                    {selected && !detailsLoading && (
                        <div className="mt-4 rounded-xl border border-amber-500/20 bg-[#1a1c28] p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <UserRound className="h-4 w-4 text-amber-300" />
                                <p className="text-sm font-semibold text-slate-100">
                                    @{selected.username} {selected.name ? `(${selected.name})` : ''}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <Metric label="Left Volume" value={`$${Number(selected.left_points_total ?? 0).toFixed(2)}`} />
                                <Metric label="Right Volume" value={`$${Number(selected.right_points_total ?? 0).toFixed(2)}`} />
                                <Metric label="Total Volume" value={`$${Number(selected.total_volume ?? 0).toFixed(2)}`} />
                                <Metric label="Total Network" value={String(selected.network_total_count ?? 0)} />
                                <Metric label="Left Team" value={String(selected.left_team_count ?? 0)} />
                                <Metric label="Right Team" value={String(selected.right_team_count ?? 0)} />
                                <Metric label="Paid Users" value={String(selected.network_paid_count ?? 0)} />
                                <Metric label="Free Users" value={String(selected.network_free_count ?? 0)} />
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Tree card */}
            <Card className="overflow-hidden">
                <CardHeader
                    title={
                        <span className="flex items-center gap-2 flex-wrap">
                            <span>Binary tree</span>
                            {isDeep && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-200 border border-amber-500/30">
                                    Deep Tree
                                </span>
                            )}
                        </span>
                    }
                    subtitle={`Outer-only legs. Showing ${requestedDepth} levels · Depth: ${maxDepth}`}
                />

                {/* Tree area */}
                <div
                    className="overflow-auto min-h-[420px] max-h-[72vh] bg-[#1a1c28]/70"
                >
                    <div className="inline-flex justify-center py-10 px-10 min-w-full min-h-full">
                        {tree ? (
                            <TreeNode node={tree} level={0} onSelect={selectMember} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[#262a3b] flex items-center justify-center text-slate-400 mb-4">
                                    <ChevronLeft className="w-8 h-8" />
                                </div>
                                <p className="text-slate-300 font-medium">No tree data yet</p>
                                <p className="text-sm text-slate-400 mt-1">Your binary tree will appear here once you have referrals.</p>
                            </div>
                        )}
                    </div>
                </div>
                {hasMore && (
                    <div className="p-4 border-t border-amber-500/20 bg-[#1f2231] flex justify-center">
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="px-5 py-2.5 text-sm font-medium rounded-xl bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            See more
                        </button>
                    </div>
                )}
            </Card>

            {modalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <button type="button" className="absolute inset-0 bg-black/70" onClick={closeModal} aria-label="Close details modal" />
                    <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-amber-500/30 bg-[#1f2231] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-amber-500/20 px-5 py-4">
                            <h3 className="text-base font-semibold text-slate-100">Member details</h3>
                            <button type="button" onClick={closeModal} className="rounded-lg border border-amber-500/30 p-1.5 text-slate-300 transition hover:text-amber-200">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="max-h-[80vh] overflow-auto p-5">
                            {detailsLoading && (
                                <div className="inline-flex items-center gap-2 text-sm text-slate-300">
                                    <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                                    Loading member details...
                                </div>
                            )}
                            {detailsError && !detailsLoading && <p className="text-sm text-rose-300">{detailsError}</p>}
                            {selected && !detailsLoading && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <Info label="Username" value={`@${selected.username || '-'}`} />
                                        <Info label="Name" value={selected.name || '-'} />
                                        <Info label="Email" value={selected.email || '-'} />
                                        <Info label="Mobile" value={selected.mobile || '-'} />
                                        <Info label="Country" value={selected.country || '-'} />
                                        <Info label="City" value={selected.city || '-'} />
                                        <Info label="Status" value={selected.status || '-'} />
                                        <Info label="Highest Package" value={selected.highest_package_amount ? `$${Math.round(Number(selected.highest_package_amount))}` : '-'} />
                                        <Info label="Placement Side" value={selected.placement_side || '-'} />
                                        <Info label="Sponsor Username" value={selected.sponsor_username || '-'} />
                                        <Info label="Binary Parent Username" value={selected.binary_parent_username || '-'} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        <Metric label="Left Volume" value={`$${Number(selected.left_points_total ?? 0).toFixed(2)}`} />
                                        <Metric label="Right Volume" value={`$${Number(selected.right_points_total ?? 0).toFixed(2)}`} />
                                        <Metric label="Total Volume" value={`$${Number(selected.total_volume ?? 0).toFixed(2)}`} />
                                        <Metric label="Total Network" value={String(selected.network_total_count ?? 0)} />
                                        <Metric label="Left Team" value={String(selected.left_team_count ?? 0)} />
                                        <Metric label="Right Team" value={String(selected.right_team_count ?? 0)} />
                                        <Metric label="Paid Users" value={String(selected.network_paid_count ?? 0)} />
                                        <Metric label="Free Users" value={String(selected.network_free_count ?? 0)} />
                                        <Metric label="Direct Total" value={String(selected.direct_total_count ?? 0)} />
                                        <Metric label="Direct Paid" value={String(selected.direct_paid_count ?? 0)} />
                                        <Metric label="Direct Free" value={String(selected.direct_free_count ?? 0)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

function Metric({ label, value }) {
    return (
        <div className="rounded-lg border border-amber-500/15 bg-[#1f2231] px-3 py-2.5">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-slate-100 mt-1">{value}</p>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-lg border border-amber-500/15 bg-[#1a1c28] px-3 py-2.5">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-medium text-slate-100 break-all">{value}</p>
        </div>
    );
}



