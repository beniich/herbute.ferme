import React, { useEffect, useState } from 'react';
import { dbAdminApi } from "@/services/dbAdminService";

interface ActiveQuery {
    id: number;
    query: string;
    duration: string;
    state: string;
}

interface QueryPerformance {
    time: number;
    select: number;
    insert: number;
    update: number;
    delete: number;
}

interface DbaData {
    activeQueries: ActiveQuery[];
    queryPerformance: QueryPerformance[];
}

export default function DBASentinelDashboard() {
    const [data, setData] = useState<DbaData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await dbAdminApi.getDBASentinelData();
                setData(res.data);
            } catch (error) {
                console.error("Failed to load DBA Sentinel data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // Fast polling for "live" terminal feel
        const interval = setInterval(loadData, 2000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-[#0b0c10]">
                <div className="text-[#4ade80] font-mono animate-pulse"> INITIALIZING_SYSTEM...</div>
            </div>
        );
    }

    const { activeQueries, queryPerformance } = data || { activeQueries: [], queryPerformance: [] };

    // Generate SVG points for the graph
    const getPoints = (type: keyof QueryPerformance) => {
        return queryPerformance.map((p, i) => {
            const x = (i / (queryPerformance.length - 1)) * 1000;
            const y = 150 - (p[type] / 1500) * 150; // Scale to fit localized SVG height
            return `${x},${y}`;
        }).join(' ');
    };

    return (
        <div className="flex w-full h-full bg-[#0b0c10] text-[#e0e0e0] font-mono overflow-hidden selection:bg-[#4ade80] selection:text-[#0b0c10]">
            <style jsx>{`
                .terminal-text::after {
                    content: '_';
                    animation: blink 1s step-end infinite;
                }
                @keyframes blink { 50% { opacity: 0; } }
                .pulse-dot {
                    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
                    animation: pulse-green 2s infinite;
                }
                @keyframes pulse-green {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
                }
            `}</style>

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Terminal Header */}
                <header className="h-14 border-b border-[#333] flex items-center px-6 bg-[#111] z-20">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-[#4ade80]">terminal</span>
                        <h1 className="text-lg font-bold tracking-tight text-[#4ade80] terminal-text">DBA_SENTINEL_V3.0</h1>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#4ade80] pulse-dot"></span>
                            <span className="text-[#4ade80]">SYSTEM_ONLINE</span>
                        </div>
                        <span className="text-[#666]">|</span>
                        <span className="text-[#888]">UPTIME: 412h 12m</span>
                        <span className="text-[#666]">|</span>
                        <span className="text-[#888]">USER: admin@reclamtrack</span>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Metrics Sidebar */}
                    <aside className="w-72 border-r border-[#333] bg-[#0f1115] overflow-y-auto p-4 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-[#666] uppercase tracking-wider">Cluster Health</h3>
                            <div className="p-3 bg-[#1a1d24] border border-[#333] rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-[#4ade8090]">Primary (RW)</span>
                                    <span className="text-xs bg-[#4ade8020] text-[#4ade80] px-1.5 py-0.5 rounded">OK</span>
                                </div>
                                <div className="space-y-1 text-xs text-[#aaa]">
                                    <div className="flex justify-between"><span>Load:</span> <span>0.42</span></div>
                                    <div className="flex justify-between"><span>Conns:</span> <span>1,240</span></div>
                                    <div className="flex justify-between"><span>Rep Lag:</span> <span>0ms</span></div>
                                </div>
                            </div>
                            <div className="p-3 bg-[#1a1d24] border border-[#333] rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-[#60a5fa90]">Replica-01 (RO)</span>
                                    <span className="text-xs bg-[#4ade8020] text-[#4ade80] px-1.5 py-0.5 rounded">OK</span>
                                </div>
                                <div className="space-y-1 text-xs text-[#aaa]">
                                    <div className="flex justify-between"><span>Load:</span> <span>0.85</span></div>
                                    <div className="flex justify-between"><span>Conns:</span> <span>4,102</span></div>
                                    <div className="flex justify-between"><span>Rep Lag:</span> <span>12ms</span></div>
                                </div>
                            </div>
                            <div className="p-3 bg-[#1a1d24] border border-[#333] rounded opacity-70">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-[#60a5fa90]">Replica-02 (RO)</span>
                                    <span className="text-xs bg-[#facc1520] text-[#facc15] px-1.5 py-0.5 rounded">WARN</span>
                                </div>
                                <div className="space-y-1 text-xs text-[#aaa]">
                                    <div className="flex justify-between"><span>Load:</span> <span className="text-[#facc15]">2.10</span></div>
                                    <div className="flex justify-between"><span>Conns:</span> <span>890</span></div>
                                    <div className="flex justify-between"><span>Rep Lag:</span> <span className="text-[#facc15]">450ms</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-[#666] uppercase tracking-wider">Quick Actions</h3>
                            <button className="w-full text-left px-3 py-2 text-xs bg-[#222] hover:bg-[#333] border border-[#444] text-[#ccc] hover:text-white transition-colors rounded flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span> Re-balance Connections
                            </button>
                            <button className="w-full text-left px-3 py-2 text-xs bg-[#222] hover:bg-[#333] border border-[#444] text-[#ccc] hover:text-white transition-colors rounded flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">stop_circle</span> Kill Idle Sessions
                            </button>
                            <button className="w-full text-left px-3 py-2 text-xs bg-[#222] hover:bg-[#333] border border-[#444] text-[#ccc] hover:text-white transition-colors rounded flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">analytics</span> Analyze Vacuum Stats
                            </button>
                        </div>
                    </aside>

                    {/* Main Workspace */}
                    <main className="flex-1 overflow-y-auto bg-[#0b0c10] p-6 space-y-6">
                        {/* Live Query Perf Graph Area */}
                        <div className="h-64 border border-[#333] bg-[#0f1115] rounded p-4 relative overflow-hidden group">
                            <div className="absolute top-2 right-4 flex gap-4 text-xs text-[#666] font-bold z-10">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4ade80]"></span> SELECT</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#60a5fa]"></span> INSERT</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#f87171]"></span> UPDATE</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#facc15]"></span> DELETE</span>
                            </div>
                            <h3 className="text-xs font-bold text-[#888] mb-4">QUERY_PERFORMANCE_IOPS (Live 5s)</h3>

                            {/* Simulated SVG Graph */}
                            <div className="relative w-full h-[85%] border-l border-b border-[#333]">
                                <svg className="w-full h-full" viewBox="0 0 1000 150" preserveAspectRatio="none">
                                    <polyline fill="none" stroke="#4ade80" strokeWidth="1.5" points={getPoints('select')} />
                                    <polyline fill="none" stroke="#60a5fa" strokeWidth="1.5" points={getPoints('insert')} opacity="0.7" />
                                    <polyline fill="none" stroke="#f87171" strokeWidth="1.5" points={getPoints('update')} opacity="0.7" />
                                </svg>
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4ade8010] to-transparent w-[50px] h-full animate-[scan_2s_linear_infinite]"></div>
                            </div>
                        </div>

                        {/* Live Session Manager */}
                        <div className="border border-[#333] bg-[#0f1115] rounded overflow-hidden">
                            <div className="px-4 py-2 border-b border-[#333] bg-[#1a1d24] flex justify-between items-center">
                                <h3 className="text-xs font-bold text-[#ccc]">ACTIVE_SESSIONS</h3>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Filter by user/db..." className="bg-[#0b0c10] border border-[#333] text-[#aaa] text-xs px-2 py-1 rounded w-48 outline-none focus:border-[#4ade80]" />
                                    <button className="text-[#aaa] hover:text-white"><span className="material-symbols-outlined text-sm">filter_list</span></button>
                                </div>
                            </div>
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#1a1d24] text-[#666]">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">PID</th>
                                        <th className="px-4 py-2 font-medium">QUERY</th>
                                        <th className="px-4 py-2 font-medium">DURATION</th>
                                        <th className="px-4 py-2 font-medium">STATE</th>
                                        <th className="px-4 py-2 font-medium text-right">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#222]">
                                    {activeQueries.map((query) => (
                                        <tr key={query.id} className="hover:bg-[#1f2937] transition-colors group">
                                            <td className="px-4 py-2 text-[#4ade80]">{query.id}</td>
                                            <td className="px-4 py-2 text-[#aaa] font-mono trunc max-w-xs truncate overflow-hidden whitespace-nowrap">{query.query}</td>
                                            <td className="px-4 py-2">{query.duration}</td>
                                            <td className="px-4 py-2"><span className={`text-${query.state === 'active' ? '[#4ade80]' : '[#666]'}`}>{query.state}</span></td>
                                            <td className="px-4 py-2 text-right">
                                                <button className="text-[#f87171] opacity-0 group-hover:opacity-100 font-bold hover:underline">[KILL]</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Keep some static rows for layout if needed, but primary comes from API now */}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
