import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardHeader, CardBody, Button } from '@/Components/ui';

const inputClass = 'block w-full rounded-xl border border-amber-500/20 px-4 py-2.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500';

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
                                <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                                <p className="text-slate-300 font-medium py-2">{auth.user?.username ?? '—'}</p>
                                <p className="text-xs text-slate-400">Your referral link uses this username.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                                <input type="text" value={profileForm.data.name} onChange={(e) => profileForm.setData('name', e.target.value)} className={inputClass} />
                                {err('name') && <p className="text-sm text-red-600 mt-1">{err('name')}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                <input type="email" value={profileForm.data.email} onChange={(e) => profileForm.setData('email', e.target.value)} className={inputClass} />
                                {err('email') && <p className="text-sm text-red-600 mt-1">{err('email')}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">USDT withdrawal address</label>
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
            <CardHeader title="Transaction password" subtitle="Set or update your transaction password. A verification email will be sent; click the link to confirm." />
            <CardBody>
                <form onSubmit={(e) => { e.preventDefault(); post('/dashboard/profile/transaction-password'); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Current (leave blank if first time)</label>
                        <input type="password" value={data.current_transaction_password} onChange={(e) => setData('current_transaction_password', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">New transaction password</label>
                        <input type="password" value={data.transaction_password} onChange={(e) => setData('transaction_password', e.target.value)} className={inputClass} />
                        {err('transaction_password') && <p className="text-sm text-red-600 mt-1">{err('transaction_password')}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Confirm</label>
                        <input type="password" value={data.transaction_password_confirmation} onChange={(e) => setData('transaction_password_confirmation', e.target.value)} className={inputClass} />
                    </div>
                    <Button type="submit" variant="primary" disabled={processing}>Update</Button>
                </form>
            </CardBody>
        </Card>
    );
}

function KycSection({ kycDocuments }) {
    const { data, setData, post, processing, errors } = useForm({
        id_front: null,
        id_back: null,
        selfie: null,
    });

    return (
        <Card>
            <CardHeader title="KYC documents" subtitle="Upload verification documents" />
            <CardBody>
                <form onSubmit={(e) => { e.preventDefault(); post('/dashboard/profile/kyc', { forceFormData: true }); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">ID Front</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setData('id_front', e.target.files[0] ?? null)}
                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-500/10 file:text-amber-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">ID Back</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setData('id_back', e.target.files[0] ?? null)}
                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-500/10 file:text-amber-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Selfie (optional)</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setData('selfie', e.target.files[0] ?? null)}
                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-500/10 file:text-amber-300"
                        />
                    </div>
                    {errors?.id_front && <p className="text-sm text-red-600 mt-1">{errors.id_front}</p>}
                    <Button type="submit" variant="primary" disabled={processing}>Upload</Button>
                </form>
                {kycDocuments?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-amber-500/15">
                        <p className="text-sm font-medium text-slate-300 mb-2">Uploaded</p>
                        <ul className="space-y-1 text-sm text-slate-300">
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



