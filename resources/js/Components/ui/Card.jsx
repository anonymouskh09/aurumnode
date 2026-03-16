export function Card({ children, className = '' }) {
    return (
        <div className={`bg-[#1f2231] border border-amber-500/20 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.25)] ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
    return (
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-amber-500/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${className}`}>
            <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-100 truncate">{title}</h3>
                {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}

export function CardBody({ children, className = '' }) {
    return <div className={`p-4 sm:p-6 ${className}`}>{children}</div>;
}
