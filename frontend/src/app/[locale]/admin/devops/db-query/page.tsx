'use client'

import DashboardTemplate from '@/components/devops-dashboards/shared/DashboardTemplate'

export default function DBQueryPerformance() {
  const kpis = [
    {
      title: 'Avg Latency',
      value: '45.2ms',
      change: '5.2%',
      trend: 'down' as const,
      icon: 'speed',
      iconColor: 'primary'
    },
    {
      title: 'P99 Latency',
      value: '128.4ms',
      change: '12.1%',
      trend: 'up' as const,
      icon: 'bolt',
      iconColor: 'red'
    },
    {
      title: 'Throughput',
      value: '2.4k/s',
      change: '0.8%',
      trend: 'up' as const,
      icon: 'dataset',
      iconColor: 'green'
    },
    {
      title: 'Slow Queries',
      value: '18',
      change: '4',
      trend: 'down' as const,
      icon: 'running_with_errors',
      iconColor: 'amber'
    }
  ]

  return (
    <DashboardTemplate
      title="QueryLens Pro"
      icon="database"
      kpis={kpis}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Mini-Info */}
        <aside className="w-full lg:w-64 space-y-6">
          <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-border-dark">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Active Instance</p>
            <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-primary">PostgreSQL-Prod-01</span>
                <span className="size-2 rounded-full bg-green-500"></span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">us-east-1.db.aws.com</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-surface-dark/50 p-4 rounded-xl border border-slate-100 dark:border-border-dark">
            <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-amber-500">warning</span>
              System Alert
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Index usage on <span className="font-mono text-primary">users_meta</span> table has dropped below 15% in the last 4h.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Latency Chart & Execution Detail */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Chart Placeholder */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold dark:text-white">Latency distribution</h2>
                  <p className="text-xs text-slate-400">Past 24 hours of performance metrics</p>
                </div>
              </div>
              <div className="h-64 flex flex-col justify-end">
                <div className="flex items-end gap-1 h-full px-2">
                  <div className="flex-1 bg-primary/20 rounded-t-sm h-[30%]"></div>
                  <div className="flex-1 bg-primary/30 rounded-t-sm h-[45%]"></div>
                  <div className="flex-1 bg-primary/25 rounded-t-sm h-[35%]"></div>
                  <div className="flex-1 bg-primary/40 rounded-t-sm h-[60%]"></div>
                  <div className="flex-1 bg-primary/35 rounded-t-sm h-[50%]"></div>
                  <div className="flex-1 bg-primary/60 rounded-t-sm h-[80%]"></div>
                  <div className="flex-1 bg-primary/50 rounded-t-sm h-[70%]"></div>
                  <div className="flex-1 bg-red-500/60 rounded-t-sm h-[95%]"></div>
                  <div className="flex-1 bg-primary/70 rounded-t-sm h-[85%]"></div>
                  <div className="flex-1 bg-primary/45 rounded-t-sm h-[55%]"></div>
                  <div className="flex-1 bg-primary/30 rounded-t-sm h-[40%]"></div>
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-slate-400 uppercase font-bold tracking-widest px-2">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>23:59</span>
                </div>
              </div>
            </div>

            {/* Quick Fixes */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col">
              <h2 className="text-lg font-bold dark:text-white mb-1">Quick Fixes</h2>
              <p className="text-xs text-slate-400 mb-6">AI-Powered insights for active sessions</p>
              <div className="space-y-4 flex-1">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-tight">Missing Index</p>
                  <p className="text-sm dark:text-slate-200 leading-snug">Adding a composite index on <span className="font-mono text-xs font-semibold">order_items(order_id, product_id)</span> could reduce latency by 40%.</p>
                </div>
                <div className="p-3 bg-amber-500/5 rounded-lg border-l-4 border-amber-500">
                  <p className="text-xs font-bold text-amber-500 mb-1 uppercase tracking-tight">Sequential Scan</p>
                  <p className="text-sm dark:text-slate-200 leading-snug">Query #8293 is performing a full table scan on 2.4M rows.</p>
                </div>
              </div>
              <button className="w-full mt-6 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Apply Optimizations
              </button>
            </div>
          </section>

          {/* Slow Query Table Placeholder */}
          <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between bg-slate-50/50 dark:bg-background-dark/30">
              <h2 className="text-lg font-bold dark:text-white">Identified Slow Queries</h2>
            </div>
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">list_alt</span>
              <p>Detailed query analysis available in advanced view</p>
            </div>
          </section>
        </div>
      </div>
    </DashboardTemplate>
  )
}
