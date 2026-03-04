import { useRef, useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Move, Loader2 } from 'lucide-react';

const DEEP_TREE_THRESHOLD = 10;
const BASE_VERTICAL_GAP = 36;
const VERTICAL_GAP_PER_LEVEL = 28;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.07;
const TRANSITION_MS = 200;

function verticalGap(level) {
    return BASE_VERTICAL_GAP + Math.min(level * VERTICAL_GAP_PER_LEVEL, 100);
}

function TreeNode({ node, level = 0 }) {
    if (!node) return null;

    const isPaid = node.status === 'paid';
    const isRoot = level === 0;
    const displayName = node.username || node.name || `User #${node.id}`;
    const gap = verticalGap(level);

    return (
        <div className="flex flex-col items-center" style={{ marginTop: gap }}>
            <div
                className={`
                    px-4 py-2.5 rounded-xl border-2 text-sm font-medium min-w-[110px] max-w-[140px] text-center shrink-0
                    transition-shadow duration-200
                    ${isRoot
                        ? 'ring-2 ring-teal-200 ring-offset-2 ring-offset-slate-50 shadow-md'
                        : ''
                    }
                    ${isPaid
                        ? 'bg-teal-50 border-teal-400 text-teal-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }
                `}
            >
                <span className="text-[10px] uppercase tracking-wide text-slate-400 font-medium block mb-1">
                    Level {node.level ?? level + 1}
                </span>
                <span className="font-semibold text-slate-900 block truncate" title={displayName}>
                    {displayName}
                </span>
                <div className="flex justify-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span title="Left volume (USDT)">L: ${(node.left_points ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span title="Right volume (USDT)">R: ${(node.right_points ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>
            {(node.left || node.right) && (
                <div className="flex gap-16 mt-3">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Left</span>
                        <div className="w-0.5 h-5 bg-slate-300 rounded-full shrink-0" />
                        <TreeNode node={node.left} level={level + 1} />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Right</span>
                        <div className="w-0.5 h-5 bg-slate-300 rounded-full shrink-0" />
                        <TreeNode node={node.right} level={level + 1} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BinaryTree({ tree, leftTotal, rightTotal, maxDepth = 0, requestedDepth = 8, hasMore = false }) {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const panStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

    const handleWheel = useCallback((e) => {
        if (!containerRef.current) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        setScale((s) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s + delta)));
    }, []);

    const handleMouseDown = useCallback((e) => {
        if (e.button !== 0) return;
        setIsPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y };
    }, [translate]);

    const handleMouseMove = useCallback((e) => {
        if (!isPanning) return;
        setTranslate({
            x: panStart.current.tx + (e.clientX - panStart.current.x),
            y: panStart.current.ty + (e.clientY - panStart.current.y),
        });
    }, [isPanning]);

    const handleMouseUp = useCallback(() => setIsPanning(false), []);
    const handleMouseLeave = useCallback(() => setIsPanning(false), []);

    const zoomIn = () => setScale((s) => Math.min(MAX_ZOOM, s + ZOOM_STEP));
    const zoomOut = () => setScale((s) => Math.max(MIN_ZOOM, s - ZOOM_STEP));
    const resetView = () => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    };

    const loadMore = () => {
        setLoadingMore(true);
        router.get('/dashboard/binary-tree', { depth: requestedDepth + 5 }, { preserveState: false });
    };

    const isDeep = maxDepth >= DEEP_TREE_THRESHOLD;

    return (
        <DashboardLayout title="My Binary Tree">
            {/* Leg totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="overflow-hidden">
                    <CardBody className="flex items-center gap-4 p-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-teal-600 shrink-0">
                            <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-500">Left leg total (USDT)</p>
                            <p className="text-2xl font-bold text-slate-900 mt-0.5">
                                ${(leftTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </CardBody>
                </Card>
                <Card className="overflow-hidden">
                    <CardBody className="flex items-center gap-4 p-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-teal-600 shrink-0">
                            <ChevronRight className="w-7 h-7" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-500">Right leg total (USDT)</p>
                            <p className="text-2xl font-bold text-slate-900 mt-0.5">
                                ${(rightTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Tree card */}
            <Card className="overflow-hidden">
                <CardHeader
                    title={
                        <span className="flex items-center gap-2 flex-wrap">
                            <span>Binary tree</span>
                            {isDeep && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                    Deep Tree
                                </span>
                            )}
                        </span>
                    }
                    subtitle={`Outer-only legs. Showing ${requestedDepth} levels · Depth: ${maxDepth}`}
                />

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Move className="w-4 h-4 shrink-0" />
                        <span>Drag to pan</span>
                    </div>
                    <div className="hidden sm:block w-px h-5 bg-slate-200" />
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span>Scroll to zoom</span>
                    </div>
                    <div className="flex-1 min-w-[120px]" />
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={zoomOut}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            title="Zoom out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={zoomIn}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            title="Zoom in"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={resetView}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1"
                            title="Reset view"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                    {hasMore && (
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="px-4 py-2.5 text-sm font-medium rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Load more levels
                        </button>
                    )}
                </div>

                {/* Tree area */}
                <div
                    ref={containerRef}
                    className="overflow-auto min-h-[420px] max-h-[72vh] cursor-grab active:cursor-grabbing select-none bg-slate-100/50"
                    style={{ touchAction: 'none' }}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    <div
                        className="inline-flex justify-center py-10 px-10 min-w-full min-h-full origin-center"
                        style={{
                            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                            transition: isPanning ? 'none' : `transform ${TRANSITION_MS}ms ease-out`,
                        }}
                    >
                        {tree ? (
                            <TreeNode node={tree} level={0} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 mb-4">
                                    <ChevronLeft className="w-8 h-8" />
                                </div>
                                <p className="text-slate-600 font-medium">No tree data yet</p>
                                <p className="text-sm text-slate-500 mt-1">Your binary tree will appear here once you have referrals.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </DashboardLayout>
    );
}
