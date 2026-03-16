export default function WalletCard({ label, value, subtitle, icon: Icon, className = '' }) {
    return (
        <div className={`bg-[#1f2231] border border-amber-500/20 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.25)] p-5 transition-all duration-200 hover:shadow-[0_18px_38px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 group min-h-[120px] flex flex-col ${className}`.trim()}>
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-300 group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-300">{label}</p>
                    {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                    <p className="text-xl font-bold text-slate-100 mt-1">${parseFloat(value ?? 0).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
