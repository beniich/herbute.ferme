"use client"

import DashboardTemplate from "@/components/devops-dashboards/shared/DashboardTemplate"
import { Badge } from "@/components/ui/badge"

export default function APMDashboard() {
    const kpis = [
        {
            title: "Avg Latency (P95)",
            value: "142ms",
            change: "-12ms",
            trend: "up" as const,
            icon: "timer",
            iconColor: "emerald"
        },
        {
            title: "Error Rate",
            value: "0.04%",
            change: "-0.01%",
            trend: "up" as const,
            icon: "running_with_errors",
            iconColor: "emerald"
        },
        {
            title: "Throughput",
            value: "4.2k",
            unit: "req/s",
            change: "+8%",
            trend: "up" as const,
            icon: "speed",
            iconColor: "primary"
        },
        {
            title: "Active Traces",
            value: "2.4M",
            subtitle: "Last 24h",
            icon: "account_tree",
            iconColor: "primary"
        }
    ]

    return (
        <DashboardTemplate
            title="APM Dashboard"
            icon="analytics"
            kpis={kpis}
        >
            <div className="space-y-8 font-display">
                {/* Service Map Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/5">
                            <span className="material-symbols-outlined text-primary text-4xl font-black">hub</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Service Mesh Overview</h2>
                            <p className="text-slate-500 font-medium">Monitoring 24 microservices across 3 clusters</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Performance Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Services List Card */}
                        <div className="dashboard-card overflow-hidden transition-all duration-500 hover:border-primary/30">
                            <div className="p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                                <h3 className="font-black text-xl uppercase tracking-tight">Services Health</h3>
                                <Badge className="bg-emerald-500 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">All Systems Normal</Badge>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-white/5">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Service Name</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Latency</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Success Rate</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">CPU/Mem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {[
                                            { name: "auth-service", latency: 45, success: 99.99, cpu: 12, mem: 240, color: "emerald" },
                                            { name: "payment-gateway", latency: 185, success: 99.95, cpu: 44, mem: 850, color: "emerald" },
                                            { name: "inventory-api", latency: 320, success: 98.42, cpu: 78, mem: 1200, color: "amber" },
                                            { name: "notification-hub", latency: 12, success: 100, cpu: 5, mem: 120, color: "emerald" },
                                            { name: "search-engine", latency: 540, success: 94.20, cpu: 92, mem: 4200, color: "rose" },
                                        ].map((service, _i) => (
                                            <tr key={service.name} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`size-10 rounded-xl bg-${service.color}-500/10 flex items-center justify-center border border-${service.color}-500/20`}>
                                                            <span className="material-symbols-outlined text-xl font-black">api</span>
                                                        </div>
                                                        <span className="font-black text-md tracking-tight uppercase">{service.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                   <span className={`text-xs font-black ${service.latency > 300 ? 'text-rose-500' : 'text-emerald-500'}`}>{service.latency}ms</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${service.success > 98 ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full`}
                                                                style={{ width: `${service.success}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-500">{service.success}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                   <div className="inline-flex items-center gap-2">
                                                       <Badge className="bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 text-[8px] font-black">{service.cpu}% CPU</Badge>
                                                       <Badge className="bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 text-[8px] font-black">{service.mem}MB</Badge>
                                                   </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Traces Visualizer Placeholder */}
                        <div className="dashboard-card p-8 bg-slate-900 border-white/5 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                               <span className="material-symbols-outlined text-9xl text-white">timeline</span>
                           </div>
                           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                               <div className="space-y-2">
                                   <div className="flex items-center gap-2 text-primary mb-2">
                                       <span className="material-symbols-outlined text-sm font-black">rebase_edit</span>
                                       <span className="text-[10px] font-black uppercase tracking-widest">Distributed Tracing</span>
                                   </div>
                                   <h3 className="text-2xl font-black text-white uppercase tracking-tight">Trace Explorer</h3>
                                   <p className="text-slate-400 font-medium max-w-sm">Deep-dive into individual request lifecycles. 12 traces flagged as abnormal in the last 5 minutes.</p>
                               </div>
                               <button className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">
                                   Open Jaeger View
                               </button>
                           </div>
                        </div>
                    </div>

                    {/* APM Sidebar: Anomalies & Recommendations */}
                    <div className="space-y-8">
                        <div className="dashboard-card p-8 space-y-8">
                            <div>
                                <h3 className="font-black text-xl uppercase tracking-tight">Anomalies</h3>
                                <p className="text-sm text-slate-500 font-medium">AI-driven detection results</p>
                            </div>

                            <div className="space-y-4">
                               <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-[32px]">
                                   <div className="flex items-center gap-3 mb-2">
                                       <span className="material-symbols-outlined text-rose-500 text-sm font-black">priority_high</span>
                                       <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Latency Spike</p>
                                   </div>
                                   <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                       Search Engine P99 latency increased by <span className="text-rose-500 font-black">240%</span>. Correlates with intensive indexing job.
                                   </p>
                               </div>

                               <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-[32px]">
                                   <div className="flex items-center gap-3 mb-2">
                                       <span className="material-symbols-outlined text-amber-500 text-sm font-black">psychology</span>
                                       <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Resource Prediction</p>
                                   </div>
                                   <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                       Auth Service memory usage trending upwards. Forecasted OOM in <span className="text-amber-500 font-black">~6.5 hours</span>.
                                   </p>
                               </div>
                            </div>
                        </div>

                        {/* RUM Insights */}
                        <div className="dashboard-card p-8 bg-slate-950 border-white/5 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                               <span className="material-symbols-outlined text-sm">open_in_new</span>
                               User Experience (RUM)
                           </h4>
                           <div className="space-y-6">
                               <div className="flex items-center justify-between">
                                   <span className="text-xs font-bold text-slate-300">Apdex Score</span>
                                   <span className="text-lg font-black text-emerald-500">0.94</span>
                               </div>
                               <div className="flex items-center justify-between">
                                   <span className="text-xs font-bold text-slate-300">First Paint</span>
                                   <span className="text-sm font-black text-white">0.8s</span>
                               </div>
                               <div className="flex items-center justify-between">
                                   <span className="text-xs font-bold text-slate-300">CLS (Layout Shift)</span>
                                   <span className="text-sm font-black text-emerald-500">0.012</span>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    )
}
