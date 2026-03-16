export default function StatCard({ label, value, subtitle, icon: Icon, className = '' }) {
    return (
        <div className={`bg-[#1f2231] border border-amber-500/20 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.25)] p-4 transition-all duration-200 hover:shadow-[0_18px_38px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-300">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
