export default function ProgressBar({ value, max = 100, showLabel = false, className = '' }) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (
        <div className={className}>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-xs text-slate-500 mt-1">{value} / {max}</p>
            )}
        </div>
    );
}
