'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function QueryVizPage() {
    const [, setSelectedNode] = useState('seq-scan')

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-6 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-lg text-white">
                            <span className="material-symbols-outlined text-2xl">database</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">
                            QueryViz <span className="text-primary">Pro</span>
                        </h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 ml-4">
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                            Query Editor
                        </a>
                        <a className="text-sm font-medium text-primary" href="#">
                            Execution Plan
                        </a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                            History
                        </a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                            Performance Lab
                        </a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Engine:
                        </span>
                        <span className="text-sm font-medium">PostgreSQL 15.4</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="primary">
                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                            Analyze Query
                        </Button>
                        <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Explorer & Metrics */}
                <aside className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-background-dark/50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
                            <span>Alpha_Project</span>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span>Production_DB</span>
                        </div>
                        <h3 className="text-sm font-bold mt-1 truncate">Plan #1042: User_Stats_Rollup</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Summary Dashboard */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Key Performance Indicators
                            </p>

                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-slate-500">Execution Time</span>
                                    <span className="material-symbols-outlined text-orange-500 text-sm">warning</span>
                                </div>
                                <p className="text-2xl font-bold mt-1">12.4ms</p>
                                <p className="text-xs text-orange-500 mt-1 font-medium">
                                    -15% performance vs last run
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                <span className="text-xs text-slate-500">Total Cost Score</span>
                                <p className="text-2xl font-bold mt-1">8,420</p>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-primary h-full w-3/4"></div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                <span className="text-xs text-slate-500">Memory Usage</span>
                                <p className="text-2xl font-bold mt-1">4.2MB</p>
                                <p className="text-xs text-emerald-500 mt-1 font-medium">Within optimized bounds</p>
                            </div>
                        </div>

                        {/* Missing Indexes Widget */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Recommendations
                                </p>
                                <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full font-bold">
                                    2 FOUND
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 group cursor-pointer hover:bg-primary/10 transition-all">
                                    <div className="flex gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold leading-tight">
                                                Missing Index on &apos;users.email&apos;
                                            </p>
                                            <p className="text-[10px] text-slate-500 mt-1">
                                                Could reduce Seq Scan cost by 85%
                                            </p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-2 py-1 text-[10px] font-bold border border-primary/30 rounded group-hover:bg-primary group-hover:text-white transition-all uppercase tracking-tighter">
                                        Copy SQL Fix
                                    </button>
                                </div>

                                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <div className="flex gap-2">
                                        <span className="material-symbols-outlined text-emerald-500 text-lg">
                                            check_circle
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold leading-tight">Parallel Workers Optimal</p>
                                            <p className="text-[10px] text-slate-500 mt-1">Configured for 4 workers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center: Tree Visualization Canvas */}
                <section className="flex-1 relative canvas-grid flex flex-col bg-slate-50 dark:bg-[#0c1018]">
                    {/* Canvas Toolbar */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                <span className="material-symbols-outlined text-xl">zoom_in</span>
                            </button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                <span className="material-symbols-outlined text-xl">zoom_out</span>
                            </button>
                            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                <span className="material-symbols-outlined text-xl">center_focus_strong</span>
                            </button>
                        </div>
                        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                            <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded">
                                Visual
                            </button>
                            <button className="px-3 py-1.5 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                Raw JSON
                            </button>
                        </div>
                    </div>

                    {/* Visualization Area */}
                    <div className="flex-1 overflow-auto flex items-start justify-center p-20">
                        <div className="flex flex-col items-center gap-16 min-w-[1000px]">
                            {/* Root Node: Final Result */}
                            <div className="relative flex flex-col items-center">
                                <div className="w-64 bg-white dark:bg-slate-900 rounded-xl border-2 border-primary shadow-xl p-4 relative z-10 cursor-pointer ring-4 ring-primary/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Limit</span>
                                        <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold">
                                            100%
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold">Limit Operation</h4>
                                    <div className="mt-3 flex flex-col gap-1">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-slate-500">Actual Time:</span>
                                            <span className="font-mono">12.43ms</span>
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-slate-500">Rows:</span>
                                            <span className="font-mono">50</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Connector */}
                                <div className="absolute top-full h-16 w-1 bg-slate-300 dark:bg-slate-700"></div>
                            </div>

                            {/* Level 2: Sort */}
                            <div className="relative flex flex-col items-center">
                                <div className="w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg p-4 relative z-10 cursor-pointer hover:border-primary transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Sort</span>
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                            88%
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold">Quicksort (Memory)</h4>
                                    <div className="mt-3 flex flex-col gap-1 text-[10px]">
                                        <p className="text-slate-500 italic">Sorted by: user_id ASC</p>
                                    </div>
                                </div>
                                {/* Split Connector */}
                                <div className="absolute top-full h-16 w-[400px] border-t-2 border-x-2 border-slate-300 dark:bg-slate-700 rounded-t-xl"></div>
                            </div>

                            {/* Level 3: Parallel Operations */}
                            <div className="flex gap-40 relative">
                                {/* Left Node: Join */}
                                <div className="flex flex-col items-center">
                                    <div className="w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg p-4 relative z-10 cursor-pointer hover:border-primary transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                Hash Join
                                            </span>
                                            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                                42%
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold">Inner Join</h4>
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            Hash Cond: orders.uid = users.id
                                        </p>
                                    </div>
                                    <div className="h-16 w-1 bg-slate-300 dark:bg-slate-700"></div>
                                    {/* Leaf 1 */}
                                    <div className="w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg p-4 relative z-10 cursor-pointer hover:border-primary transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                Index Scan
                                            </span>
                                            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                                5%
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold">idx_orders_user_id</h4>
                                        <p className="text-[10px] text-slate-500 mt-1 italic">Index Only Scan</p>
                                    </div>
                                </div>

                                {/* Right Node: Parallel Scan (HOTSPOT) */}
                                <div className="flex flex-col items-center">
                                    <div
                                        onClick={() => setSelectedNode('seq-scan')}
                                        className="w-64 bg-white dark:bg-slate-900 rounded-xl border-2 border-orange-500 shadow-lg shadow-orange-500/10 p-4 relative z-10 cursor-pointer hover:scale-105 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] font-bold text-orange-500 uppercase">
                                                    Seq Scan
                                                </span>
                                                <span className="material-symbols-outlined text-[14px] text-orange-500">
                                                    error
                                                </span>
                                            </div>
                                            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                                78% COST
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold">Table: public.users</h4>
                                        <div className="mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded text-[10px] font-mono leading-tight">
                                            Filter: (status = &apos;active&apos;)
                                            <br />
                                            Rows Removed: 42,904
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Minimap */}
                    <div className="absolute bottom-6 right-6 w-48 h-32 bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden pointer-events-none">
                        <div className="w-full h-full p-2 opacity-50 relative">
                            <div className="w-4 h-2 bg-primary mx-auto mb-2"></div>
                            <div className="w-12 h-0.5 bg-slate-400 mx-auto mb-2"></div>
                            <div className="flex justify-center gap-4">
                                <div className="w-10 h-6 bg-slate-400 rounded-sm"></div>
                                <div className="w-10 h-6 bg-orange-400 rounded-sm"></div>
                            </div>
                            {/* Viewport Indicator */}
                            <div className="absolute inset-0 border-2 border-primary/50 translate-x-4 translate-y-2 scale-75"></div>
                        </div>
                    </div>
                </section>

                {/* Right Sidebar: Node Inspector */}
                <aside className="w-96 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-background-dark">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Node Inspector</h3>
                                <p className="text-xs text-slate-500">Operation: Parallel Seq Scan</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <span className="text-[10px] text-slate-500 block uppercase font-bold">
                                    Estimated Cost
                                </span>
                                <span className="text-sm font-mono font-bold">0.00 .. 842.12</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <span className="text-[10px] text-slate-500 block uppercase font-bold">
                                    Actual Rows
                                </span>
                                <span className="text-sm font-mono font-bold">5,102</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Metrics Section */}
                        <div>
                            <h5 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">bar_chart</span>
                                Performance Breakdown
                            </h5>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">I/O Wait Time</span>
                                        <span className="font-bold">4.2ms (34%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-orange-500 h-full w-[34%]"></div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">CPU Processing</span>
                                        <span className="font-bold">7.1ms (57%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[57%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Source Code/JSON snippet */}
                        <div>
                            <h5 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">code</span>
                                Raw Plan Fragment
                            </h5>
                            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-800">
                                {`{
  "Node Type": "Seq Scan",
  "Parallel Aware": true,
  "Relation Name": "users",
  "Alias": "u",
  "Startup Cost": 0.00,
  "Total Cost": 842.12,
  "Plan Rows": 5102,
  "Plan Width": 240,
  "Actual Startup Time": 0.045,
  "Actual Total Time": 11.201,
  "Filter": "(status = 'active'::text)"
}`}
                            </pre>
                        </div>

                        {/* Optimizer Hints */}
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                            <h5 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                Optimizer Advice
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                This sequential scan is consuming 78% of the query resources. Since the filter{' '}
                                <code className="bg-white dark:bg-slate-800 px-1 rounded">status = &apos;active&apos;</code>{' '}
                                is highly selective, consider adding a partial index to improve lookup performance.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 py-2 bg-primary text-white text-[10px] font-bold rounded hover:bg-primary/90 transition-all uppercase">
                                    Apply Optimization
                                </button>
                                <button className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                    <span className="material-symbols-outlined text-xs">more_horiz</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Footer: Query Editor Pull-up */}
            <footer className="h-10 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected:
                        production-read-only
                    </span>
                    <span>Database: analytics_warehouse</span>
                </div>
                <div className="flex gap-4 items-center">
                    <button className="hover:text-primary transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">terminal</span> Console
                    </button>
                    <div className="w-px h-3 bg-slate-200 dark:bg-slate-800"></div>
                    <span>Row count: 5,102</span>
                    <span>Duration: 12.43ms</span>
                </div>
            </footer>
        </div>
    )
}
