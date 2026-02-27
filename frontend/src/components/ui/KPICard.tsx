
interface KPICardProps {
    label: string;
    val: string | number;
    sub: string;
    icon: string;
    color: string;
    pulse?: boolean;
}

const colorConfig: Record<string, { bg: string; text: string; valueText: string }> = {
    'slate': {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-500 dark:text-slate-400',
        valueText: 'text-slate-900 dark:text-white'
    },
    'primary': {
        bg: 'bg-primary/10',
        text: 'text-primary',
        valueText: 'text-slate-900 dark:text-white'
    },
    'blue-500': {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
        valueText: 'text-slate-900 dark:text-white'
    },
    'emerald-500': {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        valueText: 'text-slate-900 dark:text-white'
    },
    'rose-500': {
        bg: 'bg-rose-500/10',
        text: 'text-rose-500',
        valueText: 'text-rose-600 dark:text-rose-500'
    },
    'amber-500': {
        bg: 'bg-amber-500/10',
        text: 'text-amber-500',
        valueText: 'text-slate-900 dark:text-white'
    }
};

export function KPICard({ label, val, sub, icon, color, pulse = false }: KPICardProps) {
    const config = colorConfig[color] || colorConfig['slate'];

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
                <span className="material-symbols-outlined text-6xl">{icon}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className={`size-10 rounded-xl flex items-center justify-center ${config.bg} ${config.text}`}>
                    <span className={`material-symbols-outlined text-xl ${pulse ? 'animate-pulse' : ''}`}>{icon}</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</span>
            </div>
            <p className={`text-3xl font-black ${config.valueText}`}>{val}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tight">{sub}</p>
        </div>
    );
}
