export default function StatCard({ label, value, subtitle, icon: Icon, className = '' }) {
    return (
        <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
