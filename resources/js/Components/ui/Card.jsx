export function Card({ children, className = '' }) {
    return (
        <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
    return (
        <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${className}`}>
            <div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export function CardBody({ children, className = '' }) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}
