import PublicLayout from '@/Components/PublicLayout';

export default function About() {
    return (
        <PublicLayout>
            <main className="mx-auto w-full max-w-[1000px] px-6 py-14">
                <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                    <p className="mb-3 text-sm uppercase tracking-[0.2em] text-amber-400">About Aurum Node</p>
                    <h1 className="mb-4 text-4xl font-bold">A New Era of Digital Opportunity Ecosystems</h1>
                    <p className="mb-4 leading-8 text-slate-300">
                        Aurum Node was created to connect global market opportunities with community participation through a technology-driven platform.
                    </p>
                    <p className="mb-4 leading-8 text-slate-300">
                        Aurum Node introduces a community-powered ecosystem where members collectively participate in a diversified portfolio of global sectors.
                    </p>
                    <p className="leading-8 text-slate-300">
                        By combining strategic capital allocation and modern technology infrastructure, Aurum Node is designed for scalable growth with transparent community participation.
                    </p>
                </section>
            </main>
        </PublicLayout>
    );
}

