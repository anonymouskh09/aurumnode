import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, Button } from '@/Components/ui';

const inputClass = 'block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500';

export default function Profile({ auth, kycDocuments, errors: serverErrors }) {
    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
        usdt_address: auth.user.usdt_address ?? '',
    });

    const err = (f) => serverErrors?.[f] || profileForm.errors[f];

    return (
        <DashboardLayout title="My Profile">
            <div className="max-w-2xl space-y-6">
                <Card>
                    <CardHeader title="Personal details" subtitle="Update your information" />
                    <CardBody>
                        <form onSubmit={(e) => { e.preventDefault(); profileForm.put('/dashboard/profile'); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input type="text" value={profileForm.data.name} onChange={(e) => profileForm.setData('name', e.target.value)} className={inputClass} />
                                {err('name') && <p className="text-sm text-red-600 mt-1">{err('name')}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" value={profileForm.data.email} onChange={(e) => profileForm.setData('email', e.target.value)} className={inputClass} />
                                {err('email') && <p className="text-sm text-red-600 mt-1">{err('email')}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">USDT withdrawal address</label>
                                <input type="text" value={profileForm.data.usdt_address} onChange={(e) => profileForm.setData('usdt_address', e.target.value)} placeholder="Enter USDT address" className={inputClass} />
                                {err('usdt_address') && <p className="text-sm text-red-600 mt-1">{err('usdt_address')}</p>}
                            </div>
                            <Button type="submit" variant="primary" disabled={profileForm.processing}>Save</Button>
                        </form>
                    </CardBody>
                </Card>

                <TransactionPasswordForm errors={serverErrors} />
                <KycSection kycDocuments={kycDocuments} />
            </div>
        </DashboardLayout>
    );
}

function TransactionPasswordForm({ errors: serverErrors }) {
    const { data, setData, post, processing, errors } = useForm({
        current_transaction_password: '',
        transaction_password: '',
        transaction_password_confirmation: '',
    });
    const err = (f) => serverErrors?.[f] || errors[f];

    return (
        <Card>
            <CardHeader title="Transaction password" subtitle="Set or update your transaction password" />
            <CardBody>
                <form onSubmit={(e) => { e.preventDefault(); post('/dashboard/profile/transaction-password'); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current (leave blank if first time)</label>
                        <input type="password" value={data.current_transaction_password} onChange={(e) => setData('current_transaction_password', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New transaction password</label>
                        <input type="password" value={data.transaction_password} onChange={(e) => setData('transaction_password', e.target.value)} className={inputClass} />
                        {err('transaction_password') && <p className="text-sm text-red-600 mt-1">{err('transaction_password')}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm</label>
                        <input type="password" value={data.transaction_password_confirmation} onChange={(e) => setData('transaction_password_confirmation', e.target.value)} className={inputClass} />
                    </div>
                    <Button type="submit" variant="primary" disabled={processing}>Update</Button>
                </form>
            </CardBody>
        </Card>
    );
}

function KycSection({ kycDocuments }) {
    const { data, setData, post, processing } = useForm({ document_type: 'id_front', document: null });

    return (
        <Card>
            <CardHeader title="KYC documents" subtitle="Upload verification documents" />
            <CardBody>
                <form onSubmit={(e) => { e.preventDefault(); post('/dashboard/profile/kyc', { forceFormData: true }); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Document type</label>
                        <select value={data.document_type} onChange={(e) => setData('document_type', e.target.value)} className={inputClass}>
                            <option value="id_front">ID Front</option>
                            <option value="id_back">ID Back</option>
                            <option value="selfie">Selfie</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload file</label>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => setData('document', e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700" />
                    </div>
                    <Button type="submit" variant="primary" disabled={processing}>Upload</Button>
                </form>
                {kycDocuments?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-700 mb-2">Uploaded</p>
                        <ul className="space-y-1 text-sm text-slate-600">
                            {kycDocuments.map((doc) => (
                                <li key={doc.id}>{doc.document_type} — {doc.status}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
