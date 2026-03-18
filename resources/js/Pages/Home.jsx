import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/PublicLayout';
import AnimatedHeroBackground from '@/Components/AnimatedHeroBackground';
import {
    ArrowRight,
    BarChart3,
    BrainCircuit,
    Building2,
    CircleHelp,
    Coins,
    Cpu,
    Earth,
    Gift,
    Globe2,
    HandCoins,
    Landmark,
    LineChart,
    Network,
    PlayCircle,
    Server,
    ShieldCheck,
    TrendingUp,
    UserPlus,
    Users,
} from 'lucide-react';

export default function Home() {
    const highlightStats = [
        { label: 'Global Sectors', value: '6+', icon: Globe2 },
        { label: 'Growth Model', value: '4X Potential', icon: TrendingUp },
        { label: 'Participation', value: 'Community Powered', icon: Users },
    ];
    const howItWorksSteps = [
        {
            title: '1. Community Contribution',
            description:
                "Members join the Aurum Node ecosystem by participating in structured contribution packages that support the platform's community funding pool.",
            icon: UserPlus,
        },
        {
            title: '2. Strategic Allocation',
            description:
                'The pooled resources are allocated across multiple global sectors including trading markets, infrastructure services, commodities, and emerging technologies.',
            icon: HandCoins,
        },
        {
            title: '3. Value Generation',
            description:
                'These sectors generate value through market activity, asset growth, infrastructure services, and operational performance.',
            icon: BarChart3,
        },
        {
            title: '4. Ecosystem Rewards',
            description:
                'Members benefit from the ecosystem through participation rewards and optional network growth incentives.',
            icon: Gift,
        },
    ];
    const opportunitySectors = [
        {
            title: 'Forex Market Participation',
            description:
                'Engagement with global currency markets using professional strategies and advanced market analytics to identify opportunities within daily market movements.',
            icon: LineChart,
        },
        {
            title: 'Digital Asset Markets',
            description:
                'Participation in cryptocurrency and digital asset ecosystems through algorithmic monitoring and market trend analysis.',
            icon: Coins,
        },
        {
            title: 'Chromite Mining Operations',
            description:
                'Engagement with physical chromite resource operations, an important industrial material used in stainless steel production and global manufacturing.',
            icon: Landmark,
        },
        {
            title: 'Artificial Intelligence',
            description:
                'Support for AI-driven technologies that enhance automation, data analysis, and next-generation digital services.',
            icon: BrainCircuit,
        },
        {
            title: 'Real Estate Assets',
            description:
                'Participation in property markets focused on long-term asset appreciation and sustainable income potential.',
            icon: Building2,
        },
        {
            title: 'Computing Infrastructure',
            description:
                'Development and operation of high-performance computing systems supporting blockchain networks, data processing, and digital infrastructure services.',
            icon: Server,
        },
    ];
    const whyChooseItems = [
        {
            title: 'Diversified Opportunity Portfolio',
            description:
                'The ecosystem operates across multiple sectors to create balanced exposure to different global markets.',
            icon: Earth,
        },
        {
            title: 'Technology Integration',
            description:
                'Advanced analytical tools and digital infrastructure support operational efficiency and ecosystem development.',
            icon: Cpu,
        },
        {
            title: 'Community-Powered Growth',
            description:
                'The platform expands through member participation, creating a collaborative digital network.',
            icon: Network,
        },
        {
            title: 'Global Market Engagement',
            description:
                'Members participate in opportunities connected to international markets and emerging industries.',
            icon: ShieldCheck,
        },
    ];
    const faqItems = [
        {
            question: 'What is Aurum Node?',
            answer:
                'Aurum Node is a community-powered digital ecosystem that connects members to diversified global sectors including Forex markets, digital assets, mining operations, artificial intelligence, real estate, and computing infrastructure.',
        },
        {
            question: 'How do members earn rewards?',
            answer:
                'Members may receive ecosystem rewards through participation in platform activities as well as optional network expansion incentives.',
        },
        {
            question: 'Is Aurum Node available globally?',
            answer:
                'Yes. Aurum Node is designed as a global digital ecosystem where members from different regions can participate in the network.',
        },
        {
            question: 'What sectors does Aurum Node operate in?',
            answer:
                'The ecosystem operates across multiple sectors including global markets, commodities, technology infrastructure, and real estate assets.',
        },
        {
            question: 'What is the ecosystem growth potential?',
            answer:
                'Depending on participation level and network development, members may experience up to four times ecosystem growth potential over time.',
        },
    ];

    return (
        <PublicLayout>
            <main>
                <section className="relative overflow-hidden border-b border-amber-500/20">
                    <AnimatedHeroBackground />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a1c28]/20 via-[#1a1c28]/45 to-[#1a1c28]/80" />
                    <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-24 text-center md:py-28">
                        <p className="aurum-fade-up mx-auto mb-5 inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-300 aurum-chip">
                            Community Powered Ecosystem
                        </p>
                        <h1 className="aurum-title-glow aurum-fade-up aurum-fade-up-delay-1 mx-auto mb-7 max-w-5xl text-4xl font-semibold leading-tight md:text-6xl">
                            Next-Generation Digital Opportunity Network
                        </h1>
                        <p className="aurum-fade-up aurum-fade-up-delay-2 mx-auto mb-4 max-w-4xl text-base leading-8 text-slate-200">
                            Aurum Node is a global ecosystem where technology, markets, and community collaboration converge to create scalable digital opportunities.
                        </p>
                        <p className="mx-auto mb-4 max-w-4xl text-base leading-8 text-slate-200">
                            By integrating Forex markets, digital assets, AI infrastructure, mining, real estate, and computing power, Aurum Node builds a diversified platform designed for long-term ecosystem growth.
                        </p>
                        <p className="mx-auto mb-8 max-w-4xl text-base leading-8 text-slate-200">
                            Members participate in a collaborative network that rewards engagement while supporting the expansion of a global digital economy.
                        </p>
                        <p className="mx-auto mb-8 max-w-4xl text-base leading-8 text-slate-200">
                            Join Aurum Node and participate in the future of community-driven ecosystems.
                        </p>
                        <div className="aurum-fade-up aurum-fade-up-delay-3 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/register"
                                className="aurum-btn-primary rounded-xl px-6 py-3 font-semibold transition hover:-translate-y-0.5"
                            >
                                Join the Network
                            </Link>
                            <a
                                href="#opportunity-ecosystem"
                                className="rounded-xl border border-amber-500/60 px-6 py-3 font-semibold text-white transition hover:border-amber-400 hover:text-amber-300"
                            >
                                Explore Opportunities
                            </a>
                        </div>
                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            {highlightStats.map((stat) => (
                                <div key={stat.label} className="aurum-chip rounded-xl px-4 py-4 text-left sm:text-center">
                                    <stat.icon className="mb-2 h-5 w-5 text-amber-300 sm:mx-auto" />
                                    <p className="text-xl font-semibold text-amber-300">{stat.value}</p>
                                    <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative z-10 -mt-10 px-6 pb-8">
                    <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#0a1d15] via-[#07130f] to-[#050b08] shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
                        <div className="bg-[#1a1c28]/75 px-6 py-12 text-center backdrop-blur-[1px] md:px-12">
                            <p className="mx-auto mb-4 inline-flex rounded-full border border-white/25 px-5 py-2 text-sm text-slate-100">
                                Our Network Model
                            </p>
                            <h2 className="aurum-title-glow mb-6 text-4xl font-semibold md:text-5xl">
                                Corporate <span className="text-amber-400">Overview</span>
                            </h2>
                            <p className="mx-auto mb-5 max-w-5xl text-base leading-8 text-slate-100">
                                Aurum Node is a technology-powered digital ecosystem that combines global opportunity sectors with community participation to create a sustainable and scalable growth model.
                            </p>
                            <p className="mx-auto mb-8 max-w-5xl text-base leading-8 text-slate-100">
                                Through diversified strategy, transparent structure, and continuous innovation, Aurum Node is building a next-generation network where participation transforms into long-term opportunity.
                            </p>
                            <button
                                type="button"
                                className="aurum-btn-primary inline-flex items-center gap-3 rounded-full px-7 py-3 text-base font-semibold transition hover:-translate-y-0.5"
                            >
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-amber-600">
                                    <PlayCircle className="h-5 w-5" />
                                </span>
                                Introduction Video (Coming Soon)
                            </button>
                        </div>
                    </div>
                </section>

                <section id="about" className="border-y border-amber-500/15 bg-[#07110d]/80 py-16">
                    <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-6 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">About Aurum Node</p>
                            <h2 className="mb-5 text-3xl font-bold">A New Era of Digital Opportunity Ecosystems</h2>
                            <p className="mb-4 leading-7 text-slate-300">
                                Aurum Node was created to connect global market opportunities with community participation through a technology-driven platform.
                            </p>
                            <p className="mb-4 leading-7 text-slate-300">
                                Traditionally, access to diversified opportunities across industries such as commodities, financial markets, and emerging technologies has been limited to large institutions.
                            </p>
                            <p className="mb-4 leading-7 text-slate-300">
                                Aurum Node introduces a new model - a community-powered ecosystem where members collectively participate in a diversified portfolio of global sectors.
                            </p>
                            <p className="leading-7 text-slate-300">
                                By combining crowd participation, strategic capital allocation, and modern technology infrastructure, Aurum Node aims to build a scalable digital ecosystem where members grow together as the network expands.
                            </p>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-amber-500/30">
                            <img
                                src="/images/sections/image10.jpeg"
                                alt="About Aurum Node ecosystem"
                                className="h-full min-h-[260px] w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="mx-auto w-full max-w-[1200px] px-6 py-16">
                    <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">How Aurum Node Works</p>
                    <h2 className="mb-5 text-3xl font-bold">A Simple and Scalable Ecosystem</h2>
                    <p className="mb-10 leading-7 text-slate-300">
                        Aurum Node operates on a streamlined participation model designed to make access simple while maintaining a diversified opportunity structure.
                    </p>
                    <div className="mb-8 overflow-hidden rounded-2xl border border-amber-500/30">
                        <img
                            src="/images/sections/image3.jpeg"
                            alt="How Aurum Node works illustration"
                            className="h-[340px] w-full object-cover object-[center_10%] md:h-[500px]"
                            loading="lazy"
                        />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        {howItWorksSteps.map((item) => (
                            <div key={item.title} className="aurum-card rounded-xl p-6">
                                <item.icon className="mb-3 h-6 w-6 text-amber-300" />
                                <h3 className="mb-2 text-lg font-semibold text-amber-400">{item.title}</h3>
                                <p className="leading-7 text-slate-300">{item.description}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 leading-7 text-slate-300">
                        This balanced model combines technology-driven opportunity management with community expansion.
                    </p>
                </section>

                <section id="opportunity-ecosystem" className="border-y border-amber-500/15 bg-[#07110d]/80 py-16">
                    <div className="mx-auto w-full max-w-[1200px] px-6">
                        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">Opportunity Ecosystem</p>
                        <h2 className="mb-5 text-3xl font-bold">Diversified Global Sectors</h2>
                        <p className="mb-10 leading-7 text-slate-300">
                            Aurum Node focuses on a diversified opportunity model by allocating resources across multiple sectors to support long-term ecosystem development.
                        </p>
                        <div className="mb-8 overflow-hidden rounded-2xl border border-amber-500/30">
                            <img
                                src="/images/sections/image8.jpeg"
                                alt="Global opportunity sectors"
                                className="h-[240px] w-full object-cover md:h-[300px]"
                                loading="lazy"
                            />
                        </div>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {opportunitySectors.map((sector) => (
                                <div key={sector.title} className="aurum-card rounded-xl p-6">
                                    <sector.icon className="mb-3 h-6 w-6 text-amber-300" />
                                    <h3 className="mb-2 text-lg font-semibold text-amber-400">{sector.title}</h3>
                                    <p className="text-sm leading-7 text-slate-300">{sector.description}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 leading-7 text-slate-300">
                            This diversified ecosystem helps Aurum Node adapt to changing global market conditions.
                        </p>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-[1200px] px-6 py-16">
                    <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">Member Opportunities</p>
                    <h2 className="mb-5 text-3xl font-bold">Multiple Ways to Grow Within the Ecosystem</h2>
                    <p className="mb-4 leading-7 text-slate-300">
                        Aurum Node offers members access to a dual opportunity model designed to reward both participation and community expansion.
                    </p>
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="aurum-card rounded-xl p-6">
                            <img
                                src="/images/sections/image1.jpeg"
                                alt="Participation rewards"
                                className="mb-4 h-40 w-full rounded-lg object-cover"
                                loading="lazy"
                            />
                            <h3 className="mb-2 text-lg font-semibold text-amber-400">Participation Rewards</h3>
                            <p className="leading-7 text-slate-300">
                                Members may earn ecosystem rewards generated through the performance of Aurum Node's diversified opportunity portfolio.
                            </p>
                            <p className="mt-4 leading-7 text-slate-300">
                                These rewards are influenced by activities across digital markets, infrastructure services, commodities, and technology sectors.
                            </p>
                        </div>
                        <div className="aurum-card rounded-xl p-6">
                            <img
                                src="/images/sections/image2.jpeg"
                                alt="Network growth rewards"
                                className="mb-4 h-40 w-full rounded-lg object-cover"
                                loading="lazy"
                            />
                            <h3 className="mb-2 text-lg font-semibold text-amber-400">Network Growth Rewards</h3>
                            <p className="leading-7 text-slate-300">
                                Members may also expand their earning potential by introducing new participants to the ecosystem and contributing to the growth of the Aurum Node community.
                            </p>
                            <p className="mt-4 leading-7 text-slate-300">
                                This structured network model allows members to build long-term opportunities while supporting the expansion of the platform.
                            </p>
                        </div>
                    </div>
                    <p className="mt-8 leading-7 text-slate-300">
                        Through these combined mechanisms, members may achieve up to 4X ecosystem growth potential over time, depending on participation level and network activity.
                    </p>
                </section>

                <section className="border-y border-amber-500/15 bg-[#07110d]/80 py-16">
                    <div className="mx-auto w-full max-w-[1200px] px-6">
                        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">Why Choose Aurum Node</p>
                        <h2 className="mb-10 text-3xl font-bold">Designed for the Modern Digital Economy</h2>
                        <div className="grid gap-5 md:grid-cols-2">
                            {whyChooseItems.map((item) => (
                                <div key={item.title} className="aurum-card rounded-xl p-6">
                                    <item.icon className="mb-3 h-6 w-6 text-amber-300" />
                                    <h3 className="mb-2 text-lg font-semibold text-amber-400">{item.title}</h3>
                                    <p className="leading-7 text-slate-300">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-[1200px] px-6 py-16">
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">Ecosystem Growth Vision</p>
                            <h2 className="mb-5 text-3xl font-bold">Building a Global Opportunity Network</h2>
                            <p className="mb-4 leading-7 text-slate-300">
                                Aurum Node is designed to evolve as technology, markets, and global participation continue to expand.
                            </p>
                            <p className="mb-4 leading-7 text-slate-300">
                                As the ecosystem grows, Aurum Node aims to introduce new sectors, infrastructure solutions, and strategic collaborations that further strengthen the platform.
                            </p>
                            <p className="mb-4 leading-7 text-slate-300">
                                The long-term vision is to create a self-sustaining digital ecosystem where technology, global opportunities, and community collaboration work together to generate lasting value.
                            </p>
                            <p className="leading-7 text-slate-300">
                                Through innovation and strategic development, Aurum Node is building the foundation for a next-generation digital opportunity network.
                            </p>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-amber-500/30">
                            <img
                                src="/images/sections/image6.jpeg"
                                alt="Ecosystem growth vision"
                                className="h-full min-h-[260px] w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>

                <section className="border-y border-amber-500/15 bg-[#07110d]/80 py-16">
                    <div className="mx-auto w-full max-w-[1200px] px-6">
                        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">Trust and Transparency</p>
                        <h2 className="mb-5 text-3xl font-bold">Responsible Ecosystem Development</h2>
                        <p className="mb-8 leading-7 text-slate-300">
                            Aurum Node is committed to building a sustainable ecosystem for its global community.
                        </p>
                        <div className="grid gap-3 text-slate-300 md:grid-cols-2">
                            <div className="aurum-card rounded-lg px-4 py-3">Diversification across multiple sectors</div>
                            <div className="aurum-card rounded-lg px-4 py-3">Responsible ecosystem development</div>
                            <div className="aurum-card rounded-lg px-4 py-3">Continuous technology integration</div>
                            <div className="aurum-card rounded-lg px-4 py-3">Community-driven expansion</div>
                        </div>
                        <p className="mt-8 leading-7 text-slate-300">
                            Our goal is to build a platform where innovation, transparency, and collaboration support long-term ecosystem growth.
                        </p>
                    </div>
                </section>

                <section id="faq" className="mx-auto w-full max-w-[1200px] px-6 py-16">
                    <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">FAQ</p>
                    <h2 className="mb-10 text-3xl font-bold">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqItems.map((item) => (
                            <div key={item.question} className="aurum-card rounded-xl p-6">
                                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-amber-400">
                                    <CircleHelp className="h-5 w-5 text-amber-300" />
                                    {item.question}
                                </h3>
                                <p className="leading-7 text-slate-300">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="border-t border-amber-500/20 bg-gradient-to-r from-amber-700/20 to-amber-500/5 py-16">
                    <div className="mx-auto w-full max-w-[1200px] px-6 text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-amber-400">Final Call to Action</p>
                        <h2 className="mb-5 text-3xl font-bold text-white">Join the Aurum Node Ecosystem</h2>
                        <p className="mx-auto mb-4 max-w-[900px] leading-7 text-slate-300">
                            Aurum Node represents a new generation of digital ecosystems where technology, opportunity, and community growth converge.
                        </p>
                        <p className="mx-auto mb-4 max-w-[900px] leading-7 text-slate-300">
                            Join a rapidly expanding global network designed to unlock new possibilities across emerging industries and global markets.
                        </p>
                        <p className="mx-auto mb-8 max-w-[900px] leading-7 text-slate-300">
                            Start your journey with Aurum Node today and participate in the future of community-powered digital ecosystems.
                        </p>
                        <Link
                            href="/register"
                            className="aurum-btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3 font-semibold transition hover:-translate-y-0.5"
                        >
                            Create Your Account
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}

