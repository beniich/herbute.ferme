'use client';

import { Department } from '@/lib/satisfaction-data';

export default function TopDepartments({
    departments,
}: {
    departments: Department[];
}) {
    const topThree = [...departments]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    return (
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-base mb-6 text-slate-900 dark:text-white">Department Rankings</h4>
            <div className="space-y-5">
                {topThree.map((dept, i) => {
                    const width = `${(dept.rating / 5) * 100}%`;
                    const color =
                        dept.rating >= 4.5
                            ? "bg-emerald-500"
                            : dept.rating >= 4
                                ? "bg-emerald-400"
                                : "bg-amber-500";
                    const textColor =
                        dept.rating >= 4.5
                            ? "text-emerald-500"
                            : dept.rating >= 4
                                ? "text-emerald-400"
                                : "text-amber-500";

                    return (
                        <div key={dept.id}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{dept.name}</p>
                                </div>
                                <span className={`font-black text-sm tracking-tight ${textColor}`}>
                                    {dept.rating.toFixed(1)}
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
