import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    changeLabel?: string;
    icon?: React.ReactNode;
    loading?: boolean;
    className?: string; // For extra classes like border color
    footer?: React.ReactNode;
}

export function KPICard({ title, value, change, trend, changeLabel, icon, loading, className, footer }: KPICardProps) {
    return (
        <div className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm", className)}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{title}</p>
                    {loading ? (
                        <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded mt-2" />
                    ) : (
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</h3>
                    )}
                </div>
                {icon && (
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                        {icon}
                    </div>
                )}
            </div>

            {!loading && (
                <div className="flex items-center gap-2">
                    {change !== undefined && (
                        <span className={cn(
                            "flex items-center text-xs font-bold px-2 py-0.5 rounded-full",
                            trend === 'up' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            trend === 'down' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                            trend === 'neutral' && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                            !trend && change > 0 && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            !trend && change < 0 && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                            {trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
                            {trend === 'down' && <ArrowDown className="w-3 h-3 mr-1" />}
                            {change > 0 && !trend && <ArrowUp className="w-3 h-3 mr-1" />}
                            {change < 0 && !trend && <ArrowDown className="w-3 h-3 mr-1" />}
                            {Math.abs(change)}%
                        </span>
                    )}
                    {changeLabel && <span className="text-xs text-slate-500">{changeLabel}</span>}
                </div>
            )}
            {footer && <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">{footer}</div>}
        </div>
    )
}
