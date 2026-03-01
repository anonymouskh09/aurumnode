import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function TreeNode({ node, side }) {
    if (!node) return null;

    const isPaid = node.status === 'paid';
    const displayName = node.username || node.name || `User #${node.id}`;

    return (
        <div className="flex flex-col items-center">
            <div
                className={`
                    px-4 py-2 rounded-xl border-2 text-sm font-medium min-w-[100px] text-center
                    ${isPaid
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }
                `}
            >
                <span className="font-semibold">{displayName}</span>
                <div className="flex justify-center gap-2 mt-1 text-xs text-slate-500">
                    <span title="Left points">L: {node.left_points?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? 0}</span>
                    <span title="Right points">R: {node.right_points?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? 0}</span>
                </div>
            </div>
            {(node.left || node.right) && (
                <div className="flex gap-8 mt-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 mb-1">Left</span>
                        <div className="w-px h-4 bg-slate-300" />
                        <TreeNode node={node.left} side="left" />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 mb-1">Right</span>
                        <div className="w-px h-4 bg-slate-300" />
                        <TreeNode node={node.right} side="right" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BinaryTree({ tree, leftTotal, rightTotal }) {
    return (
        <DashboardLayout title="My Binary Tree">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardBody className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Left leg total</p>
                            <p className="text-xl font-bold text-slate-900">{(leftTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} pts</p>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Right leg total</p>
                            <p className="text-xl font-bold text-slate-900">{(rightTotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} pts</p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Card>
                <CardHeader
                    title="Binary tree (top 5 levels)"
                    subtitle="Your network structure. Paid members highlighted in teal."
                />
                <CardBody className="overflow-x-auto">
                    <div className="flex justify-center py-8">
                        {tree ? <TreeNode node={tree} /> : <p className="text-slate-500">No tree data</p>}
                    </div>
                </CardBody>
            </Card>
        </DashboardLayout>
    );
}
