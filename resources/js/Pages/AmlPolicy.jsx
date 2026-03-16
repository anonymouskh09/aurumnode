import PublicLayout from '@/Components/PublicLayout';

export default function AmlPolicy() {
    return (
        <PublicLayout>
            <main className="mx-auto w-full max-w-[1000px] px-6 py-12">
                <div className="mb-8 rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                    <p className="mb-2 text-sm uppercase tracking-[0.2em] text-amber-400">Policy</p>
                    <h1 className="mb-3 text-4xl font-bold">Anti-Money Laundering (AML) Policy</h1>
                    <p className="leading-7 text-slate-300">
                        Aurum Node is committed to maintaining a transparent and responsible ecosystem. The platform does not support or facilitate activities related to money laundering, terrorist financing, fraud, or any other unlawful financial activity.
                    </p>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Commitment to Compliance</h2>
                        <p className="leading-7 text-slate-300">
                            This Anti-Money Laundering (AML) Policy outlines the measures taken to help protect the integrity of the Aurum Node ecosystem and its community.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Prohibited Activities</h2>
                        <p className="mb-3 leading-7 text-slate-300">
                            Users of the Aurum Node platform are strictly prohibited from using the ecosystem for any illegal or unauthorized purposes.
                        </p>
                        <p className="mb-3 leading-7 text-slate-300">This includes, but is not limited to:</p>
                        <ul className="list-disc space-y-2 pl-6 text-slate-300">
                            <li>Money laundering</li>
                            <li>Terrorist financing</li>
                            <li>Fraudulent activities</li>
                            <li>Identity theft</li>
                            <li>Use of funds derived from criminal activities</li>
                            <li>Any actions that violate applicable financial regulations</li>
                        </ul>
                        <p className="mt-3 leading-7 text-slate-300">
                            Any accounts suspected of engaging in prohibited activities may be suspended, restricted, or terminated.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Identity Verification</h2>
                        <p className="mb-3 leading-7 text-slate-300">
                            To maintain ecosystem integrity and security, Aurum Node may request identity verification from users when necessary.
                        </p>
                        <p className="mb-3 leading-7 text-slate-300">This may include verifying information such as:</p>
                        <ul className="list-disc space-y-2 pl-6 text-slate-300">
                            <li>Full legal name</li>
                            <li>Contact details</li>
                            <li>Government-issued identification</li>
                            <li>Proof of address</li>
                        </ul>
                        <p className="mt-3 leading-7 text-slate-300">
                            Verification procedures may be implemented during account registration, participation activities, or when required by operational or compliance standards.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Transaction Monitoring</h2>
                        <p className="mb-3 leading-7 text-slate-300">
                            Aurum Node may implement monitoring measures designed to identify suspicious behavior or unusual activity within the ecosystem.
                        </p>
                        <p className="mb-3 leading-7 text-slate-300">Activities that may trigger review include:</p>
                        <ul className="list-disc space-y-2 pl-6 text-slate-300">
                            <li>Unusual transaction patterns</li>
                            <li>Rapid or irregular account activity</li>
                            <li>Use of multiple accounts linked to the same individual</li>
                            <li>Activity that appears inconsistent with typical user behavior</li>
                        </ul>
                        <p className="mt-3 leading-7 text-slate-300">
                            If suspicious activity is detected, Aurum Node reserves the right to investigate and take appropriate action.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Reporting Suspicious Activity</h2>
                        <p className="leading-7 text-slate-300">
                            Aurum Node reserves the right to report suspected unlawful activity to relevant authorities where required by applicable regulations. Users acknowledge that the platform may cooperate with regulatory bodies or law enforcement agencies in order to maintain ecosystem integrity and compliance.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">User Responsibility</h2>
                        <p className="leading-7 text-slate-300">
                            All users are responsible for ensuring that the funds or digital assets they use within the Aurum Node ecosystem originate from lawful sources. By participating in the platform, users confirm that they will not use Aurum Node for any activity that violates applicable financial or anti-money laundering regulations.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Policy Updates</h2>
                        <p className="leading-7 text-slate-300">
                            Aurum Node may update or modify this AML Policy from time to time to reflect regulatory developments or operational changes within the ecosystem. Users are encouraged to review this policy periodically to remain informed about compliance standards and platform practices.
                        </p>
                    </section>
                </div>
            </main>
        </PublicLayout>
    );
}

