'use client';

import React from 'react';
import {
    Terminal,
    Search,
    Settings,
    Download,
    Trash2,
    Maximize2,
    Minimize2,
    Command,
    Clock,
    AlertTriangle,
    CheckCircle,
    AlertOctagon,
    Info,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';

export default function LogSenseDashboard() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0a0e14] text-slate-300 font-mono text-xs">
            {/* Sidebar with Filters */}
            <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-800 bg-[#0d1117]">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 text-blue-500">
                    <Terminal className="size-5" />
                    <h1 className="font-bold text-base tracking-tight text-slate-100 sans-serif">LogSense</h1>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">BETA</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                    {/* Time Picker */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                            <span>Time Range</span>
                            <Clock className="size-3" />
                        </div>
                        <select className="w-full bg-[#161b22] border border-slate-700/50 rounded p-2 text-slate-300 focus:outline-none focus:border-blue-600 hover:border-slate-600 transition-colors">
                            <option>Last 15 minutes</option>
                            <option>Last 1 hour</option>
                            <option>Last 24 hours</option>
                            <option>Last 7 days</option>
                            <option>Custom range...</option>
                        </select>
                    </div>

                    {/* Log Level Filters */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-500 uppercase font-bold text-[10px] tracking-wider mb-2">
                            <span>Log Levels</span>
                        </div>
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800/50 cursor-pointer group">
                                <input type="checkbox" className="rounded border-slate-700 bg-[#161b22] text-rose-500 focus:ring-0 focus:ring-offset-0" defaultChecked />
                                <span className="text-rose-500 font-bold group-hover:text-rose-400">ERROR</span>
                                <span className="ml-auto text-slate-600 text-[10px]">142</span>
                            </label>
                            <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800/50 cursor-pointer group">
                                <input type="checkbox" className="rounded border-slate-700 bg-[#161b22] text-amber-500 focus:ring-0 focus:ring-offset-0" defaultChecked />
                                <span className="text-amber-500 font-bold group-hover:text-amber-400">WARN</span>
                                <span className="ml-auto text-slate-600 text-[10px]">45</span>
                            </label>
                            <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800/50 cursor-pointer group">
                                <input type="checkbox" className="rounded border-slate-700 bg-[#161b22] text-blue-500 focus:ring-0 focus:ring-offset-0" defaultChecked />
                                <span className="text-blue-500 font-bold group-hover:text-blue-400">INFO</span>
                                <span className="ml-auto text-slate-600 text-[10px]">2,201</span>
                            </label>
                            <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800/50 cursor-pointer group">
                                <input type="checkbox" className="rounded border-slate-700 bg-[#161b22] text-slate-500 focus:ring-0 focus:ring-offset-0" />
                                <span className="font-bold group-hover:text-slate-400">DEBUG</span>
                                <span className="ml-auto text-slate-600 text-[10px]">12k</span>
                            </label>
                        </div>
                    </div>

                    {/* Sources Dropdown */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                            <span>Sources</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between px-2 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <span>api-service</span>
                                <button className="hover:text-white"><Trash2 className="size-3" /></button>
                            </div>
                            <div className="flex items-center justify-between px-2 py-1 text-slate-500 hover:text-slate-300">
                                <span>+ Add source filter</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-full">
                        <Settings className="size-4" />
                        <span>Configuration</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Search Bar Header */}
                <header className="flex flex-col border-b border-slate-800 bg-[#0d1117] p-2 gap-2">
                    {/* Search Input Area */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="flex-1 relative">
                            <div className="absolute left-3 top-2.5 text-slate-500">
                                <Search className="size-4" />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-[#0a0e14] border border-slate-700 text-slate-200 pl-10 pr-12 py-2 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-600 text-sm font-mono"
                                placeholder='level:error AND "connection timeout"'
                            />
                            <div className="absolute right-3 top-2.5 flex items-center gap-2">
                                <span className="bg-slate-800 text-slate-400 px-1.5 rounded text-[10px] border border-slate-700">/</span>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-sm transition-colors">
                            Run Query
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded">
                            <Download className="size-4" />
                        </button>
                    </div>

                    {/* Query Stats / Timeline preview */}
                    <div className="h-12 w-full bg-[#0a0e14] border border-slate-800 rounded relative overflow-hidden flex items-end px-1 gap-px">
                        {/* Simulated Histogram Bars */}
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-2/5 rounded-t-sm transition-colors"></div>
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-1/5 rounded-t-sm transition-colors"></div>
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-3/5 rounded-t-sm transition-colors"></div>
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-full rounded-t-sm transition-colors"></div>
                        <div className="flex-1 bg-rose-900/50 hover:bg-rose-600 h-1/3 rounded-t-sm transition-colors border-b-2 border-rose-500"></div> {/* Error spike */}
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-2/5 rounded-t-sm transition-colors"></div>
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-1/4 rounded-t-sm transition-colors"></div>
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-1/2 rounded-t-sm transition-colors"></div>
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-3/4 rounded-t-sm transition-colors"></div>
                        <div className="flex-1 bg-slate-800 hover:bg-blue-600 h-1/5 rounded-t-sm transition-colors"></div>

                        {/* Overlay Text */}
                        <div className="absolute top-1 right-2 text-[10px] text-slate-500 font-bold bg-[#0a0e14]/80 px-1 rounded">
                            1,240 events matched
                        </div>
                    </div>
                </header>

                {/* Results Area */}
                <div className="flex-1 overflow-auto custom-scrollbar bg-[#0a0e14]">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="bg-[#161b22] sticky top-0 z-10 text-slate-500 font-semibold border-b border-slate-800">
                            <tr>
                                <th className="w-10 px-2 py-1 text-center border-r border-slate-800">
                                    <input type="checkbox" className="rounded bg-slate-800 border-slate-700" />
                                </th>
                                <th className="w-32 px-4 py-2 border-r border-slate-800 text-[10px] uppercase tracking-wider hover:text-slate-300 cursor-pointer">Timestamp</th>
                                <th className="w-20 px-4 py-2 border-r border-slate-800 text-[10px] uppercase tracking-wider hover:text-slate-300 cursor-pointer">Level</th>
                                <th className="w-32 px-4 py-2 border-r border-slate-800 text-[10px] uppercase tracking-wider hover:text-slate-300 cursor-pointer">Service</th>
                                <th className="px-4 py-2 text-[10px] uppercase tracking-wider hover:text-slate-300 cursor-pointer">Message</th>
                                <th className="w-10 px-2 py-1"></th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300 divide-y divide-slate-800/50">
                            {/* Log Entry 1: Error */}
                            <tr className="hover:bg-slate-800/30 group">
                                <td className="px-2 py-1.5 text-center border-r border-slate-800/50 bg-[#0a0e14] group-hover:bg-[#0d1620]">
                                    <ChevronRight className="size-3 text-slate-600" />
                                </td>
                                <td className="px-4 py-1.5 border-r border-slate-800/50 font-mono text-slate-500 whitespace-nowrap">Oct 24 14:22:10.452</td>
                                <td className="px-4 py-1.5 border-r border-slate-800/50 font-bold text-rose-500">ERROR</td>
                                <td className="px-4 py-1.5 border-r border-slate-800/50 text-slate-400">auth-service</td>
                                <td className="px-4 py-1.5 font-mono text-rose-300 truncate">
                                    Failed to connect to database: Connection refused at tcp://db-primary:5432
                                </td>
                                <td className="px-2 py-1 text-right">
                                    <button className="invisible group-hover:visible text-slate-500 hover:text-slate-200"><MoreHorizontal className="size-3" /></button>
                                </td>
                            </tr>

                            {/* Log Entry 2: Info */}
                            <tr className="hover:bg-slate-800/30 group">
                                <td className="px-2 py-1.5 text-center border-r border-slate-800/50 bg-[#0a0e14] group-hover:bg-[#0d1620]">
                                    <ChevronRight className="size-3 text-slate-600" />
                                </td>
                                <td className="px-4 py-1.5 border-r border-slate-800/50 font-mono text-slate-500 whitespace-nowrap">Oct 24 14:22:10.110</td>
                                <td className="px-4 py-1.5 border-r border-slate-800/50 font-bold text-blue-500">INFO</td>
                                <td className="px-4 py-1.5 border-r border-slate-800/50 text-slate-400">api-gateway</td>
                                <td className="px-4 py-1.5 font-mono text-slate-300 truncate">
                                    GET /v1/users/profile - 200 OK - 45ms
                                </td>
                                <td className="px-2 py-1 text-right">
                                    <button className="invisible group-hover:visible text-slate-500 hover:text-slate-200"><MoreHorizontal className="size-3" /></button>
                                </td>
                            </tr>
                            {/* Additional Rows would go here */}
                            {[...Array(15)].map((_, i) => (
                                <tr key={i} className="hover:bg-slate-800/30 group">
                                    <td className="px-2 py-1.5 text-center border-r border-slate-800/50 bg-[#0a0e14] group-hover:bg-[#0d1620]">
                                        <ChevronRight className="size-3 text-slate-600" />
                                    </td>
                                    <td className="px-4 py-1.5 border-r border-slate-800/50 font-mono text-slate-500 whitespace-nowrap">Oct 24 14:22:0{9 - (i % 9)}.00{i}</td>
                                    <td className="px-4 py-1.5 border-r border-slate-800/50 font-bold text-blue-500">INFO</td>
                                    <td className="px-4 py-1.5 border-r border-slate-800/50 text-slate-400">worker-node-{i % 5}</td>
                                    <td className="px-4 py-1.5 font-mono text-slate-400 truncate">
                                        Processing job #{4920 + i} complete. Payload size: {120 + i * 10} bytes.
                                    </td>
                                    <td className="px-2 py-1 text-right">
                                        <button className="invisible group-hover:visible text-slate-500 hover:text-slate-200"><MoreHorizontal className="size-3" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <footer className="h-8 border-t border-slate-800 bg-[#0d1117] flex items-center justify-between px-4 text-[10px] text-slate-500">
                    <div className="flex items-center gap-4">
                        <span>Showing 1-50 of 1,240 events</span>
                        <span className="text-blue-500 font-bold">0.045s query time</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-slate-800 rounded hover:text-slate-300 disabled:opacity-50"><ChevronLeft className="size-3" /></button>
                        <span className="text-slate-300">Page 1</span>
                        <button className="p-1 hover:bg-slate-800 rounded hover:text-slate-300"><ChevronRight className="size-3" /></button>
                    </div>
                </footer>
            </main>
        </div>
    );
}
