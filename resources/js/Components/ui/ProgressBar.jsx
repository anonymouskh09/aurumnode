export default function ProgressBar({ value, max = 100, showLabel = false, className = '' }) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (
        <div className={className}>
            <div className="h-2 bg-[#141722] rounded-full overflow-hidden border border-amber-500/20">
                <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-xs text-slate-400 mt-1">{value} / {max}</p>
            )}
        </div>
    );
}
