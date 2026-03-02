export function Card({ children, className = '' }) {
    return (
        <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
    return (
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${className}`}>
            <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{title}</h3>
                {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}

export function CardBody({ children, className = '' }) {
    return <div className={`p-4 sm:p-6 ${className}`}>{children}</div>;
}
