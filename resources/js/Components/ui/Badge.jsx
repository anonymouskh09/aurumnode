export default function Badge({ variant = 'default', children, className = '' }) {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium';
    const variants = {
        default: 'bg-teal-50 text-teal-700 border border-teal-200',
        success: 'bg-green-50 text-green-700 border border-green-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        danger: 'bg-red-50 text-red-700 border border-red-200',
        paid: 'bg-green-50 text-green-700 border border-green-200',
        pending: 'bg-amber-50 text-amber-700 border border-amber-200',
        rejected: 'bg-red-50 text-red-700 border border-red-200',
    };
    return (
        <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
}
