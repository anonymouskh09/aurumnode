import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui';
import Button from '@/Components/ui/Button';

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

export default function Documents({ documents = [] }) {
    return (
        <DashboardLayout title="Documents">
            <Card>
                <CardHeader
                    title="Documents from admin"
                    subtitle="Read online or download official files"
                />
                <CardBody>
                    {documents.length === 0 ? (
                        <p className="text-sm text-slate-400">No documents available yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="rounded-xl border border-amber-500/20 bg-[#191d2a] p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-slate-100 font-semibold">{doc.title}</p>
                                            {doc.description ? (
                                                <p className="mt-1 text-sm text-slate-300">{doc.description}</p>
                                            ) : null}
                                            <p className="mt-2 text-xs text-slate-400">
                                                {doc.original_name} • {formatBytes(doc.file_size)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={doc.read_url} target="_blank" rel="noreferrer">
                                                <Button type="button" variant="outline" className="text-xs">
                                                    Read
                                                </Button>
                                            </a>
                                            <a href={doc.download_url}>
                                                <Button type="button" className="text-xs">
                                                    Download
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
        </DashboardLayout>
    );
}

