import React from "react";
import { ReactNode } from "react";

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon?: string;
    badge?: string;
    sub?: string;
}

export default function MetricCard({ title, value, unit, icon, badge, sub }: MetricCardProps) {
    return (
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                {icon && (
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-lg text-lg">
                        {icon}
                    </span>
                )}
            </div>

            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {value}
                {unit && <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">{unit}</span>}
            </p>

            {badge && (
                <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {badge}
                    </span>
                    {sub && <span className="text-slate-400 dark:text-slate-500">{sub}</span>}
                </div>
            )}
        </div>
    );
}
