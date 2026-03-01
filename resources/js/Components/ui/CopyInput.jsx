import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from './Button';

export default function CopyInput({ value, label }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {label && <span className="text-sm font-medium text-slate-600 w-16 shrink-0">{label}</span>}
            <div className="flex-1 min-w-0 flex gap-2">
                <input
                    type="text"
                    readOnly
                    value={value ?? '-'}
                    className="flex-1 min-w-0 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 truncate"
                />
                <Button
                    variant="primary"
                    onClick={handleCopy}
                    className="shrink-0"
                    title={copied ? 'Copied!' : 'Copy'}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                </Button>
            </div>
        </div>
    );
}
