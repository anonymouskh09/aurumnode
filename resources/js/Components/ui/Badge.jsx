export default function Badge({ variant = 'default', children, className = '' }) {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium';
    const variants = {
        default: 'bg-amber-500/12 text-amber-200 border border-amber-500/30',
        success: 'bg-green-500/12 text-green-200 border border-green-500/30',
        warning: 'bg-amber-500/12 text-amber-200 border border-amber-500/30',
        danger: 'bg-red-500/12 text-red-200 border border-red-500/30',
        paid: 'bg-green-500/12 text-green-200 border border-green-500/30',
        pending: 'bg-amber-500/12 text-amber-200 border border-amber-500/30',
        rejected: 'bg-red-500/12 text-red-200 border border-red-500/30',
    };
    return (
        <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
}
