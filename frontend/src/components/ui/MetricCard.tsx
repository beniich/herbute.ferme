interface MetricCardProps {
    title: string
    value: string | number
    icon?: string
    trend?: {
        value: string
        direction: 'up' | 'down' | 'neutral'
    }
    subtitle?: string
    className?: string
}

export function MetricCard({ title, value, icon, trend, subtitle, className = '' }: MetricCardProps) {
    const trendColors = {
        up: 'text-emerald-500',
        down: 'text-red-500',
        neutral: 'text-slate-500',
    }

    return (
        <div className={`bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm ${className}`}>
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    {title}
                </p>
                {icon && <span className="material-symbols-outlined text-primary text-lg">{icon}</span>}
            </div>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
                {trend && (
                    <span className={`text-xs font-bold flex items-center ${trendColors[trend.direction]}`}>
                        <span className="material-symbols-outlined text-xs">
                            {trend.direction === 'up' ? 'trending_up' : trend.direction === 'down' ? 'trending_down' : 'trending_flat'}
                        </span>
                        {trend.value}
                    </span>
                )}
            </div>
            {subtitle && <p className="text-slate-400 text-[10px] mt-1">{subtitle}</p>}
        </div>
    )
}
