import PublicLayout from '@/Components/PublicLayout';
import { useForm, usePage } from '@inertiajs/react';
import { Mail, Phone, User, MessageSquare, Send, ShieldCheck } from 'lucide-react';

export default function Contact() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset('subject', 'message'),
        });
    };

    return (
        <PublicLayout>
            <main className="mx-auto w-full max-w-[1200px] px-6 py-14">
                <section className="mb-8 rounded-2xl border border-amber-500/20 bg-[#1f2231] p-8">
                    <p className="mb-3 text-sm uppercase tracking-[0.2em] text-amber-400">Contact Us</p>
                    <h1 className="mb-4 text-3xl font-bold text-slate-100 md:text-4xl">Let&apos;s Talk About Aurum Node</h1>
                    <p className="max-w-3xl leading-8 text-slate-300">
                        Send us your questions, partnership ideas, or support requests. Our team reviews messages carefully and replies as soon as possible.
                    </p>
                </section>

                <section className="grid gap-6 lg:grid-cols-5">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-2xl border border-amber-500/20 bg-[#1f2231] p-6">
                            <h2 className="mb-4 text-xl font-semibold text-slate-100">Direct Contact</h2>
                            <div className="space-y-4 text-sm text-slate-300">
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-amber-300" />
                                    <div>
                                        <p className="font-medium text-slate-100">Email</p>
                                        <p>Messages are delivered to our official mailbox configured on the server.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-amber-300" />
                                    <div>
                                        <p className="font-medium text-slate-100">Response Window</p>
                                        <p>Typical response time: within 24-48 business hours.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-300" />
                                    <div>
                                        <p className="font-medium text-slate-100">Privacy First</p>
                                        <p>Your details are used only to handle your inquiry.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <form onSubmit={submit} className="rounded-2xl border border-amber-500/20 bg-[#1f2231] p-6 md:p-8">
                            {flash?.status && (
                                <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                                    {flash.status}
                                </div>
                            )}
                            {errors?.form && (
                                <div className="mb-5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                                    {errors.form}
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field
                                    label="Full Name"
                                    icon={User}
                                    value={data.name}
                                    onChange={(value) => setData('name', value)}
                                    placeholder="Enter your full name"
                                    error={errors.name}
                                />
                                <Field
                                    label="Email Address"
                                    icon={Mail}
                                    type="email"
                                    value={data.email}
                                    onChange={(value) => setData('email', value)}
                                    placeholder="Enter your email"
                                    error={errors.email}
                                />
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <Field
                                    label="Phone (Optional)"
                                    icon={Phone}
                                    value={data.phone}
                                    onChange={(value) => setData('phone', value)}
                                    placeholder="+92..."
                                    error={errors.phone}
                                />
                                <Field
                                    label="Subject"
                                    icon={MessageSquare}
                                    value={data.subject}
                                    onChange={(value) => setData('subject', value)}
                                    placeholder="What is this about?"
                                    error={errors.subject}
                                />
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium text-slate-200">Message</label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    rows={6}
                                    placeholder="Write your message..."
                                    className="w-full rounded-xl border border-amber-500/25 bg-[#1a1c28] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                                />
                                {errors.message && <p className="mt-1 text-xs text-rose-300">{errors.message}</p>}
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <Send className="h-4 w-4" />
                                    {processing ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}

function Field({ label, icon: Icon, value, onChange, placeholder, error, type = 'text' }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">{label}</label>
            <div className="relative">
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-300" />
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-amber-500/25 bg-[#1a1c28] py-3 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                />
            </div>
            {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
        </div>
    );
}

