export default function Button({ variant = 'primary', children, className = '', ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow',
        secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
        outline: 'border-2 border-teal-600 text-teal-700 hover:bg-teal-50',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };
    return (
        <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
            {children}
        </button>
    );
}
