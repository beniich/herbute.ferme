import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
    status: 'healthy' | 'warning' | 'error' | 'neutral' | 'success';
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    showPulse?: boolean;
}

export function StatusIndicator({ status, size = 'md', label, showPulse }: StatusIndicatorProps) {
    const colorClasses = {
        healthy: "bg-emerald-500",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        error: "bg-red-500",
        neutral: "bg-slate-400",
    };

    const sizeClasses = {
        sm: "w-2 h-2",
        md: "w-2.5 h-2.5",
        lg: "w-3 h-3",
    };

    const ringClasses = {
        healthy: "ring-emerald-500/30",
        success: "ring-emerald-500/30",
        warning: "ring-amber-500/30",
        error: "ring-red-500/30",
        neutral: "ring-slate-400/30",
    };

    const pulseClasses = {
        healthy: "text-emerald-500",
        success: "text-emerald-500",
        warning: "text-amber-500",
        error: "text-red-500",
        neutral: "text-slate-400",
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
                {showPulse && (
                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", colorClasses[status])}></span>
                )}
                <span className={cn(
                    "relative inline-flex rounded-full ring-2 ring-offset-1 dark:ring-offset-slate-900",
                    colorClasses[status],
                    sizeClasses[size],
                    ringClasses[status]
                )}></span>
            </div>
            {label && <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{label}</span>}
        </div>
    );
}
