interface KPICardProps {
    title: string
    value: string
    change?: string
    trend?: 'up' | 'down' | 'neutral'
    icon: string
    subtitle?: string
    iconColor?: string
}

export default function KPICard({
    title,
    value,
    change,
    trend = 'neutral',
    icon,
    subtitle,
    iconColor = 'primary'
}: KPICardProps) {
    const trendColors = {
        up: 'text-green-500',
        down: 'text-red-500',
        neutral: 'text-slate-400'
    }

    const trendIcons = {
        up: 'arrow_upward',
        down: 'arrow_downward',
        neutral: 'trending_flat'
    }

    const iconColorClasses = {
        primary: 'bg-blue-500/10 text-blue-500',
        red: 'bg-red-500/10 text-red-500',
        green: 'bg-green-500/10 text-green-500',
        amber: 'bg-amber-500/10 text-amber-500',
        purple: 'bg-purple-500/10 text-purple-500'
    }

    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {title}
                </span>
                <div className={`size-8 rounded-lg flex items-center justify-center ${iconColorClasses[iconColor as keyof typeof iconColorClasses] || iconColorClasses.primary}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
                {change && (
                    <span className={`text-xs font-bold flex items-center ${trendColors[trend]}`}>
                        <span className="material-symbols-outlined text-[14px]">
                            {trendIcons[trend]}
                        </span>
                        {change}
                    </span>
                )}
            </div>
            {subtitle && (
                <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
            )}
        </div>
    )
}
