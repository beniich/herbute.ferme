import { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    title: string;
    value: string | number;
    change?: {
        direction: "up" | "down" | "flat";
        percent: number;
        color: "emerald" | "red" | "gray";
    };
};

export default function StatsCard({ icon, title, value, change }: Props) {
    const getColorClass = (color: string) => {
        const map: Record<string, string> = {
            emerald: "emerald-500",
            red: "red-500",
            gray: "slate-400",
        };
        return map[color] ?? "slate-400";
    };

    const colorClass = change ? getColorClass(change.color) : "primary";

    return (
        <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                    {icon}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {value}
                </span>
                {change && (
                    <span
                        className={`text-${colorClass} text-xs font-bold bg-${colorClass}/10 px-1.5 py-0.5 rounded flex items-center gap-0.5`}
                    >
                        <span className="material-symbols-outlined text-[10px] font-black">
                            {change.direction === "up"
                                ? "arrow_upward"
                                : change.direction === "down"
                                    ? "arrow_downward"
                                    : "trending_flat"}
                        </span>
                        {change.percent}%
                    </span>
                )}
            </div>
        </div>
    );
}
