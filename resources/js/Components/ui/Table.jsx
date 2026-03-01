export function Table({ children, className = '' }) {
    return (
        <div className={`overflow-x-auto rounded-2xl border border-slate-200 ${className}`}>
            <table className="min-w-full divide-y divide-slate-200">
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children }) {
    return (
        <thead className="bg-slate-50 sticky top-0">
            <tr>{children}</tr>
        </thead>
    );
}

export function TableBody({ children }) {
    return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function TableRow({ children, className = '' }) {
    return (
        <tr className={`hover:bg-slate-50/80 transition-colors ${className}`}>
            {children}
        </tr>
    );
}

export function Th({ children, align = 'left', className = '' }) {
    const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
    return (
        <th className={`px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${alignClass} ${className}`}>
            {children}
        </th>
    );
}

export function Td({ children, align = 'left', className = '' }) {
    const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
    return (
        <td className={`px-6 py-4 text-sm text-slate-700 ${alignClass} ${className}`}>
            {children}
        </td>
    );
}

export function TableEmpty({ message, action }) {
    return (
        <tr>
            <td colSpan={100} className="px-6 py-12 text-center">
                <div className="text-slate-500">
                    <p className="text-sm">{message}</p>
                    {action}
                </div>
            </td>
        </tr>
    );
}
