import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardBody, ProgressBar } from '@/Components/ui';
import { Award, Target } from 'lucide-react';

export default function Rank({ currentRank, nextRank, lesserSide }) {
    const remaining = nextRank
        ? Math.max(0, parseFloat(nextRank.lesser_side_required) - (lesserSide ?? 0))
        : 0;
    const required = nextRank ? parseFloat(nextRank.lesser_side_required) : 0;

    return (
        <DashboardLayout title="My Rank">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardBody>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Current rank</p>
                                <p className="text-2xl font-bold text-teal-700">
                                    {currentRank?.name ?? 'No rank yet'}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <p className="text-sm text-slate-500">Lesser side business (USDT)</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            ${(lesserSide ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </CardBody>
                </Card>

                {nextRank && (
                    <Card>
                        <CardBody>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Next rank</p>
                                    <p className="text-lg font-semibold text-slate-900">{nextRank.name}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600">
                                Required: ${required.toLocaleString(undefined, { minimumFractionDigits: 2 })} lesser side (USDT)
                            </p>
                            <ProgressBar value={lesserSide ?? 0} max={required} showLabel className="mt-2" />
                            <p className="text-sm font-medium text-teal-600 mt-2">
                                Remaining: ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                            </p>
                        </CardBody>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
