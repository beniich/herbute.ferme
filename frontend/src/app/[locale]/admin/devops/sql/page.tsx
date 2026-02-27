'use client';

import React from 'react';
import {
    Database,
    Search,
    Play,
    Clock,
    AlertTriangle,
    CheckCircle,
    BarChart2,
    List,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    MoreHorizontal,
    Download,
    Copy,
    Terminal,
    Server
} from 'lucide-react';

export default function SqlInsightDashboard() {
    return (
        <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <Database className="text-indigo-600 size-6" />
                    <h1 className="font-bold text-lg">Query Insight</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Databases</h3>
                        <div className="space-y-1">
                            <button className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium">
                                <Server className="size-4" />
                                <span>production-primary</span>
                                <span className="ml-auto size-2 rounded-full bg-emerald-500"></span>
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium transition-colors">
                                <Server className="size-4" />
                                <span>analytics-replica-01</span>
                                <span className="ml-auto size-2 rounded-full bg-emerald-500"></span>
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium transition-colors">
                                <Server className="size-4" />
                                <span>staging-db</span>
                                <span className="ml-auto size-2 rounded-full bg-amber-500"></span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Saved Queries</h3>
                        <div className="space-y-1">
                            <button className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 truncate transition-colors">
                                Monthly User Churn Analysis
                            </button>
                            <button className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 truncate transition-colors">
                                High Latency API Logs
                            </button>
                            <button className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 truncate transition-colors">
                                Order Processing Queue Depth
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>PostgreSQL 15.4</span>
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Stats Bar */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center px-6 justify-between shrink-0">
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">QPS</p>
                            <p className="text-lg font-bold font-mono">2,450</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:border-slate-800"></div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Avg Latency</p>
                            <p className="text-lg font-bold font-mono text-emerald-600">4.2ms</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:border-slate-800"></div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Active Conn</p>
                            <p className="text-lg font-bold font-mono">84/100</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                            <Play className="size-4" /> Run Query
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Slow Query Alert */}
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 flex items-start gap-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-500">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-500">Missing Index Detected</h3>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                Query on table <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">users</code> is performing a sequential scan. Adding an index on <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">email</code> could improve performance by 94%.
                            </p>
                            <div className="mt-3 flex gap-3">
                                <button className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline">View Query Details</button>
                                <button className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline">Generate Index Migration</button>
                            </div>
                        </div>
                    </div>

                    {/* Slow Queries Table */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-base flex items-center gap-2">
                                <Clock className="size-4 text-slate-400" />
                                Slowest Queries (Last 1h)
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400"><Filter className="size-4" /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400"><Download className="size-4" /></button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Query Snippet</th>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider w-32">Calls/Min</th>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider w-32">Avg Time</th>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider w-32">P99</th>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {/* Row 1 */}
                                    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 truncate max-w-md">
                                                SELECT * FROM orders WHERE status = 'PENDING' AND created_at &#60; NOW() - INTERVAL '1 day'
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono">45</td>
                                        <td className="px-6 py-4 font-mono font-bold text-amber-500">342ms</td>
                                        <td className="px-6 py-4 font-mono font-bold text-rose-500">1.2s</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="invisible group-hover:visible p-1 hover:text-indigo-600"><MoreHorizontal className="size-4" /></button>
                                        </td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 truncate max-w-md">
                                                UPDATE user_sessions SET last_active = NOW() WHERE session_id = $1
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono">1,204</td>
                                        <td className="px-6 py-4 font-mono font-bold text-emerald-500">5ms</td>
                                        <td className="px-6 py-4 font-mono font-bold text-slate-500">12ms</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="invisible group-hover:visible p-1 hover:text-indigo-600"><MoreHorizontal className="size-4" /></button>
                                        </td>
                                    </tr>
                                    {/* Row 3 */}
                                    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 truncate max-w-md">
                                                SELECT count(*) FROM audit_logs WHERE user_id = $1 GROUP BY action_type
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono">12</td>
                                        <td className="px-6 py-4 font-mono font-bold text-amber-500">890ms</td>
                                        <td className="px-6 py-4 font-mono font-bold text-rose-500">2.4s</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="invisible group-hover:visible p-1 hover:text-indigo-600"><MoreHorizontal className="size-4" /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Query Editor Placeholder */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm flex flex-col h-96">
                        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ad-hoc Query</span>
                            <div className="flex gap-2">
                                <button className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"><Copy className="size-3" /> Copy</button>
                                <button className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"><Terminal className="size-3" /> Explain</button>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 outline-none">
                            <span className="text-purple-400">SELECT</span> u.id, u.email, count(o.id) as order_count<br />
                            <span className="text-purple-400">FROM</span> users u<br />
                            <span className="text-purple-400">LEFT JOIN</span> orders o <span className="text-purple-400">ON</span> u.id = o.user_id<br />
                            <span className="text-purple-400">WHERE</span> u.created_at &#62; <span className="text-green-400">'2023-01-01'</span><br />
                            <span className="text-purple-400">GROUP BY</span> u.id<br />
                            <span className="text-purple-400">ORDER BY</span> order_count <span className="text-purple-400">DESC</span><br />
                            <span className="text-purple-400">LIMIT</span> 50;
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
