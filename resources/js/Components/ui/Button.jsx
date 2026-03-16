export default function Button({ variant = 'primary', children, className = '', ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-amber-500 hover:bg-amber-400 text-[#1a1c28] shadow-sm hover:shadow',
        secondary: 'bg-[#1f2231] hover:bg-[#262a3b] text-slate-100 border border-amber-500/20',
        outline: 'border-2 border-amber-500 text-amber-300 hover:bg-amber-500/10',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };
    return (
        <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
            {children}
        </button>
    );
}
