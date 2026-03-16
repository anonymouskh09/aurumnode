import PublicLayout from '@/Components/PublicLayout';

export default function Contact() {
    return (
        <PublicLayout>
            <main className="mx-auto w-full max-w-[1000px] px-6 py-14">
                <section className="rounded-2xl border border-amber-500/20 bg-[#08140f] p-8">
                    <p className="mb-3 text-sm uppercase tracking-[0.2em] text-amber-400">Contact</p>
                    <h1 className="mb-4 text-4xl font-bold">Get In Touch</h1>
                    <p className="mb-4 leading-8 text-slate-300">
                        For support and account-related assistance, please use your dashboard support channel or official communication links shared by Aurum Node.
                    </p>
                    <p className="leading-8 text-slate-300">
                        Our team focuses on transparent communication and timely responses to help members navigate the ecosystem smoothly.
                    </p>
                </section>
            </main>
        </PublicLayout>
    );
}

