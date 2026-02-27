import { Footer } from '../layout/Footer'
import { Header } from '../layout/Header'
import KPICard from './KPICard'

interface DashboardTemplateProps {
    title: string
    icon: string
    kpis?: Array<{
        title: string
        value: string
        change?: string
        trend?: 'up' | 'down' | 'neutral'
        icon: string
        subtitle?: string
        iconColor?: string
    }>
    children?: React.ReactNode
}

export default function DashboardTemplate({
    title,
    icon,
    kpis = [],
    children
}: DashboardTemplateProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <Header />

            {/* Page Sub-Header */}
            <div className="bg-white/50 dark:bg-surface-dark/50 border-b border-slate-200 dark:border-border-dark px-6 py-4 backdrop-blur-sm sticky top-16 z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">refresh</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8 space-y-8">
                {/* KPIs Section */}
                {kpis.length > 0 && (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpis.map((kpi, index) => (
                            <KPICard key={index} {...kpi} />
                        ))}
                    </section>
                )}

                {/* Custom Content */}
                {children}
            </main>

            <Footer />
        </div>
    )
}
