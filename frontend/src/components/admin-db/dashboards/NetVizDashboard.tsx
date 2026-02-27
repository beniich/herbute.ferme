import React, { useEffect, useState } from 'react';
import { dbAdminApi } from "@/services/dbAdminService";

interface Node {
    id: string;
    type: 'lb' | 'app' | 'db' | 'cache';
    label: string;
    status: 'healthy' | 'warning' | 'critical';
    x: number;
    y: number;
}

interface Connection {
    from: string;
    to: string;
    status: 'active' | 'inactive';
    latency: number;
}

interface Metrics {
    activeConnections: number;
    requestsPerSecond: number;
    latencyAvg: number;
    errorRate: string;
}

export default function NetVizDashboard() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await dbAdminApi.getNetVizData();
                setNodes(res.data.nodes);
                setConnections(res.data.connections);
                setMetrics(res.data.metrics);
            } catch (error) {
                console.error("Failed to load NetViz data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // Poll for metrics every 5s
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Helper to get node color by status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return '#22c55e'; // green-500
            case 'warning': return '#f59e0b'; // amber-500
            case 'critical': return '#ef4444'; // red-500
            default: return '#94a3b8'; // slate-400
        }
    };

    // Helper to get node color by type
    const getNodeColor = (type: string) => {
        switch (type) {
            case 'lb': return '#8b5cf6'; // violet-500
            case 'app': return '#3b82f6'; // blue-500
            case 'db': return '#06b6d4'; // cyan-500
            case 'cache': return '#ec4899'; // pink-500
            default: return '#64748b'; // slate-500
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display relative overflow-hidden">
            <style jsx>{`
                .canvas-grid {
                    background-image: radial-gradient(circle, #232f48 1px, transparent 1px);
                    background-size: 30px 30px;
                }
                .flow-line {
                    stroke-dasharray: 10;
                    animation: dash 5s linear infinite;
                }
                @keyframes dash {
                    to { stroke-dashoffset: -100; }
                }
            `}</style>

            {/* Top Navigation Bar */}
            <header className="flex h-16 items-center justify-between border-b border-primary/20 bg-background-light/80 dark:bg-background-dark/80 px-6 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="material-symbols-outlined text-white text-sm">hub</span>
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">NetViz <span className="text-primary">Pro</span></h1>
                    </div>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-bold border border-primary/20 hover:bg-primary/20 transition-all">Live View</button>
                        <button className="px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all">Historical</button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">fabric-US-EAST-1</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Sidebar - Controls & Layers */}
                <aside className="w-64 border-r border-primary/10 bg-background-light dark:bg-background-dark p-4 flex flex-col gap-6 z-40 overflow-y-auto">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Layers</h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <input type="checkbox" defaultChecked className="accent-primary h-4 w-4" />
                                <span className="text-sm font-medium">Application Layer</span>
                            </label>
                            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <input type="checkbox" defaultChecked className="accent-primary h-4 w-4" />
                                <span className="text-sm font-medium">Database Cluster</span>
                            </label>
                            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <input type="checkbox" defaultChecked className="accent-primary h-4 w-4" />
                                <span className="text-sm font-medium">Cache / Redis</span>
                            </label>
                            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <input type="checkbox" className="accent-primary h-4 w-4" />
                                <span className="text-sm font-medium text-slate-400">External APIs</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Main Interactive Canvas */}
                <main className="relative flex-1 bg-white dark:bg-[#0b0c10] overflow-hidden">
                    <div className="absolute inset-0 canvas-grid opacity-30"></div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                            </marker>
                        </defs>
                        {connections.map((conn, i) => {
                            const source = nodes.find(n => n.id === conn.from);
                            const target = nodes.find(n => n.id === conn.to);
                            if (!source || !target) return null;

                            return (
                                <g key={i}>
                                    <line
                                        x1={source.x + 24} y1={source.y + 24}
                                        x2={target.x + 24} y2={target.y + 24}
                                        stroke="#64748b" strokeWidth="2" strokeOpacity="0.5" markerEnd="url(#arrowhead)"
                                    />
                                    {/* Animated Flow Packet */}
                                    <circle r="3" fill={getNodeColor(source.type)}>
                                        <animateMotion
                                            dur={`${Math.max(1, 5 - (conn.latency / 20))}s`}
                                            repeatCount="indefinite"
                                            path={`M${source.x + 24},${source.y + 24} L${target.x + 24},${target.y + 24}`}
                                        />
                                    </circle>
                                    {/* Latency Label */}
                                    <text
                                        x={(source.x + target.x) / 2 + 30}
                                        y={(source.y + target.y) / 2}
                                        fill="#94a3b8"
                                        fontSize="10"
                                        className="font-mono bg-slate-900"
                                    >
                                        {conn.latency}ms
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {nodes.map(node => (
                        <div
                            key={node.id}
                            className="absolute flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
                            style={{ left: node.x, top: node.y }}
                        >
                            <div
                                className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg relative group bg-slate-800"
                                style={{
                                    boxShadow: `0 10px 25px -5px ${getNodeColor(node.type)}50`,
                                    border: `2px solid ${getStatusColor(node.status)}`
                                }}
                            >
                                <span className="material-symbols-outlined text-white" style={{ color: getNodeColor(node.type) }}>
                                    {node.type === 'lb' ? 'alt_route' :
                                        node.type === 'app' ? 'dns' :
                                            node.type === 'db' ? 'database' : 'memory'}
                                </span>
                                {/* Status Indicator */}
                                <div
                                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-900"
                                    style={{ backgroundColor: getStatusColor(node.status) }}
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute -top-10 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                    {node.status.toUpperCase()} - {Math.floor(Math.random() * 80)}% Load
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-black/50 px-2 rounded backdrop-blur-sm">
                                {node.label}
                            </span>
                        </div>
                    ))}

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-white/90 dark:bg-background-dark/90 border border-primary/20 p-2 shadow-2xl backdrop-blur-md z-30">
                        <button className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-sm">add</span></button>
                        <button className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-sm">remove</span></button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                        <button className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-sm">center_focus_strong</span></button>
                    </div>
                    <div className="absolute bottom-6 right-6 flex flex-col gap-4 items-end z-30">
                        <div className="bg-white/90 dark:bg-background-dark/90 border border-primary/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Legend</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-violet-500"></span> Load Balancer</div>
                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-blue-500"></span> App Server</div>
                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Database</div>
                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Cache</div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Telemetry Panel */}
                <aside className="w-80 border-l border-primary/10 bg-background-light dark:bg-background-dark flex flex-col z-40">
                    <div className="p-4 border-b border-primary/10">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Real-time Telemetry</h3>
                        <p className="text-xs text-slate-500">Updating every 5 seconds</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {metrics ? (
                            <>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Requests / sec</span>
                                        <span className="text-primary font-bold">{metrics.requestsPerSecond}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(metrics.requestsPerSecond / 5000) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Avg Latency</span>
                                        <span className={`font-bold ${metrics.latencyAvg > 50 ? 'text-amber-500' : 'text-green-500'}`}>{metrics.latencyAvg}ms</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ${metrics.latencyAvg > 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (metrics.latencyAvg / 100) * 100)}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Error Rate</span>
                                        <span className="text-red-500 font-bold">{metrics.errorRate}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${parseFloat(metrics.errorRate) * 10}%` }}></div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <h4 className="text-xs font-bold text-slate-500 mb-3">Active Connections</h4>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
                                        {metrics.activeConnections}
                                        <span className="text-xs font-normal text-slate-400">concurrent</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-20">
                                <span className="text-slate-500 text-xs">Loading telemetry...</span>
                            </div>
                        )}

                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-3 items-start">
                            <span className="material-symbols-outlined text-amber-500 text-lg mt-0.5">warning</span>
                            <div>
                                <h5 className="text-xs font-bold text-slate-900 dark:text-white">High Latency Detected</h5>
                                <p className="text-[10px] text-slate-500 mt-1">Node <span className="font-mono bg-white dark:bg-slate-700 px-1 rounded">App Server 2</span> is responding slower than usual (45ms).</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
