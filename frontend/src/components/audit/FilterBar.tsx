export default function FilterBar() {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[280px]">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                            manage_search
                        </span>
                        <input
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-500"
                            placeholder="Search Record ID (e.g., REC-005)..."
                            type="text"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        All Actions
                        <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-primary">
                        Last 24 Hours
                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Status: All
                        <span className="material-symbols-outlined text-lg">tune</span>
                    </button>
                    <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
