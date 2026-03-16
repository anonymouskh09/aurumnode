import PublicLayout from '@/Components/PublicLayout';

export default function KycPolicy() {
    return (
        <PublicLayout>
            <main className="mx-auto w-full max-w-[1000px] px-6 py-12">
                <div className="mb-8 rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                    <p className="mb-2 text-sm uppercase tracking-[0.2em] text-amber-400">Policy</p>
                    <h1 className="mb-3 text-4xl font-bold">KYC Policy</h1>
                    <p className="leading-7 text-slate-300">
                        Aurum Node implements Know Your Customer (KYC) procedures to help maintain a secure, transparent, and responsible digital ecosystem.
                    </p>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Purpose of KYC</h2>
                        <p className="mb-3 leading-7 text-slate-300">
                            The purpose of KYC verification is to confirm the identity of platform participants and help prevent activities such as fraud, identity misuse, and other forms of financial misconduct.
                        </p>
                        <p className="leading-7 text-slate-300">
                            KYC procedures are part of Aurum Node's broader commitment to ecosystem integrity and responsible platform management.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Identity Verification</h2>
                        <p className="mb-3 leading-7 text-slate-300">
                            Users may be required to complete identity verification in order to access certain features of the Aurum Node ecosystem.
                        </p>
                        <p className="mb-3 leading-7 text-slate-300">Verification may include submitting information such as:</p>
                        <ul className="list-disc space-y-2 pl-6 text-slate-300">
                            <li>Full legal name</li>
                            <li>Date of birth</li>
                            <li>Residential address</li>
                            <li>Government-issued identification document</li>
                            <li>Proof of address (such as a utility bill or official document)</li>
                        </ul>
                        <p className="mt-3 leading-7 text-slate-300">
                            Additional verification may be required in certain circumstances depending on account activity or operational requirements.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Verification Process</h2>
                        <p className="mb-3 leading-7 text-slate-300">The KYC process may occur during:</p>
                        <ul className="list-disc space-y-2 pl-6 text-slate-300">
                            <li>Account registration</li>
                            <li>Participation in ecosystem activities</li>
                            <li>Withdrawal or transfer requests</li>
                            <li>Security or compliance reviews</li>
                        </ul>
                        <p className="mt-3 leading-7 text-slate-300">
                            Aurum Node reserves the right to request verification documents when necessary to ensure the security and legitimacy of platform usage.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Data Protection</h2>
                        <p className="mb-3 leading-7 text-slate-300">
                            All identity information submitted during the KYC process is handled with strict attention to privacy and security.
                        </p>
                        <p className="mb-3 leading-7 text-slate-300">
                            User information is stored and processed in accordance with the Aurum Node Privacy Policy and is used solely for verification, compliance, and platform security purposes.
                        </p>
                        <p className="leading-7 text-slate-300">
                            Aurum Node does not sell or distribute personal identification information to unauthorized third parties.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Refusal or Failure to Verify</h2>
                        <p className="mb-3 leading-7 text-slate-300">
                            If a user refuses to provide required verification information, or if submitted documentation cannot be verified, Aurum Node reserves the right to:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 text-slate-300">
                            <li>Restrict certain platform features</li>
                            <li>Temporarily suspend account activity</li>
                            <li>Decline or delay transaction processing</li>
                            <li>Terminate accounts in cases of policy violations</li>
                        </ul>
                        <p className="mt-3 leading-7 text-slate-300">
                            These measures help ensure the security and integrity of the Aurum Node ecosystem.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Ongoing Compliance</h2>
                        <p className="leading-7 text-slate-300">
                            Aurum Node may periodically review user accounts to maintain compliance with internal security standards and applicable regulations. Users may be requested to update or resubmit verification information as part of routine platform security procedures.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                        <h2 className="mb-4 text-2xl font-semibold text-amber-400">Policy Updates</h2>
                        <p className="leading-7 text-slate-300">
                            This KYC Policy may be updated from time to time to reflect changes in operational procedures or regulatory standards. Users are encouraged to review this section periodically to remain informed about verification requirements within the Aurum Node ecosystem.
                        </p>
                    </section>
                </div>
            </main>
        </PublicLayout>
    );
}

