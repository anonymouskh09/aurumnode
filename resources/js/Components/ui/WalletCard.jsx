export default function WalletCard({ label, value, subtitle, icon: Icon, className = '' }) {
    return (
        <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group min-h-[120px] flex flex-col ${className}`.trim()}>
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                    <p className="text-xl font-bold text-slate-900 mt-1">${parseFloat(value ?? 0).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
