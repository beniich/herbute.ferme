'use client'

import { DashboardHeader } from '@/components/dashboard-v2/DashboardHeader'
import { KPICard } from '@/components/dashboard-v2/KPICard'
import { StatusIndicator } from '@/components/dashboard-v2/StatusIndicator'

export default function DatabaseTopologyPage() {
    return (
        <>
            <DashboardHeader
                title="Database Topology Monitor"
                description="Real-time cluster replication and node health monitoring"
                actions={
                    <>
                        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            <span className="text-xs font-medium text-emerald-400">Cluster: Healthy</span>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                            <span className="material-symbols-outlined text-sm">bolt</span>
                            Force Failover
                        </button>
                    </>
                }
            />

            <div className="flex-1 overflow-y-auto p-8 bg-[#f6f6f8] dark:bg-[#101622] custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPICard
                            title="Total Nodes"
                            value={42}
                            trend={{ value: 2.4, direction: 'up', label: 'vs last week' }}
                            icon="dns"
                            iconColor="text-primary"
                        />
                        <KPICard
                            title="Active Pods"
                            value={1204}
                            trend={{ value: 0, direction: 'neutral', label: 'Healthy' }}
                            icon="view_in_ar"
                            iconColor="text-emerald-500"
                        />
                        <KPICard
                            title="CPU Load"
                            value="68.2%"
                            icon="memory"
                            iconColor="text-primary"
                        />
                        <KPICard
                            title="Memory Usage"
                            value="124.5 GB"
                            icon="save"
                            iconColor="text-orange-500"
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white dark:bg-[#1a2233] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <span className="material-symbols-outlined text-primary">account_tree</span>
                            Cluster Topology Visualization
                        </h3>

                        <div className="h-96 flex items-center justify-center bg-slate-50 dark:bg-[#101622] rounded-lg border border-slate-200 dark:border-slate-800">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">hub</span>
                                <p className="text-slate-500 text-sm">
                                    Topology visualization will be implemented here
                                </p>
                                <p className="text-slate-400 text-xs mt-2">
                                    Follow the pattern from Material Workflow dashboard
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-[#1a2233] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Node Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#101622] rounded-lg">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">DB-PROD-01</p>
                                        <p className="text-xs text-slate-500">10.0.0.1</p>
                                    </div>
                                    <StatusIndicator status="healthy" label="Healthy" size="sm" animated />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#101622] rounded-lg">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">DB-REPL-01</p>
                                        <p className="text-xs text-slate-500">10.0.0.2</p>
                                    </div>
                                    <StatusIndicator status="healthy" label="Healthy" size="sm" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#101622] rounded-lg">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">DB-REPL-02</p>
                                        <p className="text-xs text-slate-500">10.0.0.3</p>
                                    </div>
                                    <StatusIndicator status="warning" label="Lagging" size="sm" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1a2233] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Replication Metrics</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">Average Replication Lag</span>
                                        <span className="font-bold text-slate-900 dark:text-white">186 ms</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: '18%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">WAL Throughput</span>
                                        <span className="font-bold text-slate-900 dark:text-white">12.8 MB/s</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">Active Connections</span>
                                        <span className="font-bold text-slate-900 dark:text-white">1,842</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
