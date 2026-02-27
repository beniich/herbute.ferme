'use client';

import { Keyword } from '@/lib/satisfaction-data';

export default function SentimentKeywords({
    keywords,
}: {
    keywords: Keyword[];
}) {
    return (
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-base mb-4 text-slate-900 dark:text-white">Sentiment Keywords</h4>
            <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => {
                    const base = "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-default";
                    let variant = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";

                    if (kw.change !== undefined) {
                        if (kw.change > 0) {
                            variant = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20";
                        } else if (kw.change < 0) {
                            variant = "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20";
                        }
                    }

                    return (
                        <span key={i} className={`${base} ${variant}`}>
                            {kw.label}
                            {kw.change !== undefined && (kw.change > 0 ? ` (+${kw.change}%)` : ` (${kw.change}%)`)}
                        </span>
                    );
                })}
            </div>
        </section>
    );
}
