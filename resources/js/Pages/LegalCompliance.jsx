import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/PublicLayout';

export default function LegalCompliance() {
    const sections = [
        {
            title: '1. General Information',
            paragraphs: [
                'Aurum Node operates as a digital ecosystem designed to connect members with various technology-driven opportunities and community participation models.',
                'All information provided on this website is intended for general informational purposes only. Nothing on this platform should be interpreted as professional financial, legal, or tax advice.',
                'Participation in the Aurum Node ecosystem is voluntary and based solely on individual decision-making.',
            ],
        },
        {
            title: '2. Terms of Use',
            paragraphs: ['By accessing or using the Aurum Node website and platform, users agree to comply with the following terms:'],
            bullets: [
                'Users must provide accurate and truthful information when creating an account.',
                'Users are responsible for maintaining the confidentiality of their account credentials.',
                'Users agree not to misuse the platform or engage in fraudulent, unlawful, or abusive activities.',
                'Aurum Node reserves the right to suspend or terminate accounts that violate these terms or engage in harmful behavior within the ecosystem.',
                'Use of the platform indicates acceptance of these conditions.',
            ],
        },
        {
            title: '3. Participation Policy',
            paragraphs: [
                'Participation in the Aurum Node ecosystem is independent and voluntary.',
                "Members engage with the platform through structured participation packages designed to support the ecosystem's development and operational activities.",
                'Aurum Node does not guarantee specific financial outcomes. Participation rewards and ecosystem growth depend on multiple factors including market conditions, technological performance, and community activity.',
            ],
        },
        {
            title: '4. Risk Disclosure',
            paragraphs: [
                'Participation in digital ecosystems and global market activities involves potential risks.',
                'These risks may include, but are not limited to:',
            ],
            bullets: [
                'Market volatility in digital and financial markets',
                'Changes in regulatory environments',
                'Technological disruptions or system interruptions',
                'Operational risks related to global industries',
            ],
            afterBullets: [
                'Members acknowledge that outcomes may vary and that participation carries inherent uncertainty.',
                'Users should carefully evaluate their personal financial situation and risk tolerance before engaging with any digital ecosystem activities.',
            ],
        },
        {
            title: '5. No Financial Advice',
            paragraphs: [
                'Aurum Node does not provide financial, legal, tax, or investment advice.',
                'Any information provided on the platform, including educational materials, descriptions of opportunities, or ecosystem updates, should not be interpreted as professional guidance.',
                'Members are encouraged to conduct independent research and consult qualified professionals before making financial decisions.',
            ],
        },
        {
            title: '6. No Guaranteed Rewards',
            paragraphs: [
                'While Aurum Node offers participation mechanisms and network expansion opportunities, the platform does not guarantee fixed rewards or predetermined outcomes.',
                'Any references to potential growth or rewards represent possible scenarios based on ecosystem activity and community development.',
                'Actual outcomes may vary depending on participation level, market conditions, and ecosystem performance.',
            ],
        },
        {
            title: '7. User Responsibilities',
            paragraphs: ['Users of the Aurum Node platform are responsible for:'],
            bullets: [
                'Ensuring that participation is permitted under the laws of their jurisdiction',
                'Managing their account credentials securely',
                'Conducting their own research before engaging with the ecosystem',
                'Complying with all applicable local laws and regulations',
            ],
            afterBullets: ['Aurum Node does not assume responsibility for individual user decisions.'],
        },
        {
            title: '8. Privacy Policy',
            paragraphs: [
                'Aurum Node respects the privacy of its members and is committed to protecting personal information.',
                'The platform may collect certain data necessary for account creation, platform operation, and service improvements.',
                'This information may include:',
            ],
            bullets: [
                'Name and contact information',
                'Account activity within the platform',
                'Technical information related to device or browser usage',
            ],
            afterBullets: [
                'Personal information is used solely for operational purposes and improving the user experience within the Aurum Node ecosystem.',
                'Aurum Node does not sell or distribute user data to unauthorized third parties.',
            ],
        },
        {
            title: '9. Data Security',
            paragraphs: [
                'Aurum Node takes reasonable steps to protect user data and platform integrity through technical and operational safeguards.',
                'However, no digital system can guarantee complete security. Users acknowledge that online platforms may carry certain cybersecurity risks.',
                'Users are encouraged to maintain strong passwords and practice safe digital behavior when accessing the platform.',
            ],
        },
        {
            title: '10. External Links and Third-Party Services',
            paragraphs: [
                'The Aurum Node website may include links or references to third-party platforms, resources, or services.',
                'These links are provided for informational purposes only. Aurum Node does not control or assume responsibility for the content, privacy practices, or operations of external services.',
                'Users interact with third-party services at their own discretion.',
            ],
        },
        {
            title: '11. Platform Updates and Modifications',
            paragraphs: [
                'Aurum Node is a developing digital ecosystem and may update its services, technology, policies, or operational structure over time.',
                'The platform reserves the right to modify, update, or discontinue certain features in order to maintain system performance and ecosystem sustainability.',
                'Users are encouraged to review this page periodically for updates.',
            ],
        },
        {
            title: '12. Jurisdiction and Compliance',
            paragraphs: [
                'Users are responsible for ensuring that their use of the Aurum Node platform complies with the laws and regulations applicable in their respective jurisdictions.',
                'Aurum Node does not guarantee that participation in the ecosystem is permitted under the laws of every country.',
            ],
        },
        {
            title: '13. Limitation of Liability',
            paragraphs: [
                'By using the Aurum Node platform, users acknowledge that participation occurs at their own discretion and risk.',
                'Aurum Node, its operators, and associated partners shall not be held liable for any direct or indirect losses arising from participation in the ecosystem, use of the website, or reliance on information provided on the platform.',
            ],
        },
        {
            title: '14. Acceptance of Terms',
            paragraphs: [
                'By accessing or using the Aurum Node website and platform, you confirm that you have read, understood, and agreed to the policies outlined on this page.',
                'If you do not agree with these terms, you should discontinue use of the platform.',
            ],
        },
    ];

    return (
        <PublicLayout>
            <main className="mx-auto w-full max-w-[1000px] px-6 py-12">
                <div className="mb-10 rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                    <p className="mb-2 text-sm uppercase tracking-[0.2em] text-amber-400">Legal and Compliance</p>
                    <h1 className="mb-3 text-4xl font-bold">Terms, Privacy and Risk Disclosure</h1>
                    <p className="mb-6 text-slate-300">Last Updated: March 2026</p>
                    <p className="leading-7 text-slate-300">
                        This page outlines the terms, policies, and disclosures governing the use of the Aurum Node platform and website. By accessing or using the Aurum Node ecosystem, you acknowledge that you have read, understood, and agreed to the policies described below.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link href="/acceptable-use-policy" className="rounded-lg border border-amber-500/40 px-4 py-2 text-sm text-slate-200 transition hover:border-amber-400 hover:text-amber-300">
                            Acceptable Use Policy
                        </Link>
                        <Link href="/kyc-policy" className="rounded-lg border border-amber-500/40 px-4 py-2 text-sm text-slate-200 transition hover:border-amber-400 hover:text-amber-300">
                            KYC Policy
                        </Link>
                        <Link href="/aml-policy" className="rounded-lg border border-amber-500/40 px-4 py-2 text-sm text-slate-200 transition hover:border-amber-400 hover:text-amber-300">
                            AML Policy
                        </Link>
                    </div>
                </div>

                <section className="mb-8 rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                    <h2 className="mb-4 text-2xl font-semibold text-amber-400">Legal Disclaimer</h2>
                    <h3 className="mb-3 text-lg font-semibold">General Information</h3>
                    <p className="mb-3 leading-7 text-slate-300">
                        The information provided on the Aurum Node platform and website is intended for general informational purposes only. By accessing or using the Aurum Node ecosystem, you acknowledge that you have read, understood, and agreed to the terms outlined in this disclaimer.
                    </p>
                    <p className="mb-3 leading-7 text-slate-300">
                        Aurum Node operates as a digital ecosystem designed for community participation and technology-driven opportunities. The content on this website should not be interpreted as financial, legal, or professional advice.
                    </p>
                    <p className="mb-3 leading-7 text-slate-300">
                        Participation in digital ecosystems and global markets may involve various levels of risk. Market conditions, technological developments, and operational factors may influence the overall performance of ecosystem activities.
                    </p>
                    <p className="leading-7 text-slate-300">
                        By participating in Aurum Node, members acknowledge and accept that outcomes may vary and that no specific financial results are guaranteed.
                    </p>
                </section>

                <div className="space-y-6">
                    {sections.map((section) => (
                        <section key={section.title} className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                            <h2 className="mb-4 text-2xl font-semibold text-amber-400">{section.title}</h2>
                            {section.paragraphs?.map((paragraph) => (
                                <p key={paragraph} className="mb-3 leading-7 text-slate-300">
                                    {paragraph}
                                </p>
                            ))}
                            {section.bullets?.length > 0 && (
                                <ul className="mb-3 list-disc space-y-2 pl-6 text-slate-300">
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                            {section.afterBullets?.map((paragraph) => (
                                <p key={paragraph} className="mb-3 leading-7 text-slate-300">
                                    {paragraph}
                                </p>
                            ))}
                        </section>
                    ))}
                </div>
            </main>
        </PublicLayout>
    );
}

