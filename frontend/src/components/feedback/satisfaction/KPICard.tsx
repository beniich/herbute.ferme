'use client';

type KPICardProps = {
    title: string;
    value: string | number;
    sub?: string;
    change?: string;
    changePositive?: boolean;
    iconStars?: number;
};

export default function KPICard({
    title,
    value,
    sub,
    change,
    changePositive = true,
    iconStars,
}: KPICardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                {change && (
                    <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${changePositive
                                ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                : "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
                            }`}
                    >
                        {change}
                    </span>
                )}
            </div>

            <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white">{value}</h3>
                {sub && <span className="text-slate-400 dark:text-slate-500 text-lg">{sub}</span>}
            </div>

            {iconStars !== undefined && (
                <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <span
                            key={i}
                            className={`material-symbols-outlined text-xl ${i < iconStars
                                    ? "text-amber-400 filled-icon"
                                    : "text-slate-200 dark:text-slate-700 filled-icon"
                                }`}
                        >
                            star
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
