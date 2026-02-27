interface DashboardHeaderProps {
    title: string
    description?: string
    actions?: React.ReactNode
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0f] flex items-center justify-between px-8 z-10 sticky top-0">
            <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
                {description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                )}
            </div>

            {actions && <div className="flex items-center gap-4">{actions}</div>}
        </header>
    )
}
