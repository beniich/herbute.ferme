'use client';

// Components
import Link from 'next/link';

export default function InfrastructureHeatmapPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display overflow-hidden">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <span className="material-symbols-outlined text-white">map</span>
                        </div>
                        <span className="font-bold tracking-tight">InfraWatch</span>
                    </Link>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <nav className="flex gap-6">
                        <Link href="/analytics/heatmap" className="text-sm font-bold text-primary">Global View</Link>
                        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">District Analysis</Link>
                        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Crew Tracking</Link>
                        <Link href="/reports" className="text-sm font-medium hover:text-primary transition-colors">Back to Reports</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                        <input className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-primary" placeholder="Search districts..." type="text" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=2424eb&color=fff" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 pt-16 h-screen overflow-hidden relative">
                {/* Sidebar Controls */}
                <aside className="w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 absolute left-0 top-16 bottom-0 shadow-xl overflow-y-auto">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Filters & Layers</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Issue Category</label>
                                <select className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary p-2">
                                    <option>All Categories</option>
                                    <option>Potholes</option>
                                    <option>Streetlights</option>
                                    <option>Sewage</option>
                                    <option>Water Leak</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Period</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="text-xs py-1.5 px-2 bg-primary text-white rounded font-bold shadow-md">24h</button>
                                    <button className="text-xs py-1.5 px-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded font-medium hover:bg-slate-200 dark:hover:bg-slate-700">7 Days</button>
                                </div>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Heatmap Intensity</span>
                                    <span className="text-xs text-primary font-bold">High</span>
                                </div>
                                <input className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary text-sm">info</span>
                                <h3 className="text-xs font-bold">Insight</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                High concentration of water leaks detected in District 4. Recommended: Dispatch specialized plumbing crew.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Map Area */}
                <main className="flex-1 relative bg-slate-200 dark:bg-slate-800 overflow-hidden ml-72">
                    {/* Placeholder Map Background */}
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-87.6298,41.8781,12,0/1280x1280?access_token=pk.mock')] bg-cover bg-center opacity-50 grayscale dark:invert selection:bg-none">
                        {/* Fallback pattern if image fails or for styling */}
                        <div className="absolute inset-0 bg-slate-300 dark:bg-slate-800 opacity-50" style={{ backgroundImage: 'radial-gradient(circle, #808080 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    </div>

                    {/* Simulated Heatmap Gradient Overlay */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'radial-gradient(circle at 40% 40%, rgba(36, 36, 235, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(36, 36, 235, 0.6) 0%, transparent 35%), radial-gradient(circle at 20% 80%, rgba(36, 36, 235, 0.3) 0%, transparent 30%)'
                    }}></div>

                    {/* Interactive Marker 1 */}
                    <div className="absolute top-[35%] left-[45%] group cursor-pointer">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute size-12 bg-primary/30 rounded-full animate-ping"></div>
                            <div className="size-4 bg-primary rounded-full border-2 border-white shadow-xl relative z-10"></div>
                            {/* Marker Tooltip */}
                            <div className="absolute bottom-full mb-3 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 w-48 border border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">District 4: Loop</p>
                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mb-2">CRITICAL ALERT</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
                                    <span className="material-symbols-outlined text-sm">water_drop</span>
                                    Main Water Break
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Marker 2 */}
                    <div className="absolute top-[60%] left-[65%] group cursor-pointer">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute size-8 bg-amber-500/30 rounded-full animate-pulse"></div>
                            <div className="size-3 bg-amber-500 rounded-full border-2 border-white shadow-xl relative z-10"></div>
                            {/* Marker Tooltip */}
                            <div className="absolute bottom-full mb-3 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 w-40 border border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">District 2</p>
                                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-2">Moderate</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
                                    <span className="material-symbols-outlined text-sm">lightbulb</span>
                                    Streetlight Outage
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Stats Widgets */}
                    <div className="absolute bottom-8 left-8 right-8 flex gap-4 z-10">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-4 flex-1">
                            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">priority_high</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Active Issues</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">1,284</p>
                            </div>
                        </div>
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-4 flex-1">
                            <div className="size-10 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Critical</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">12</p>
                            </div>
                        </div>
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-4 flex-1">
                            <div className="size-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                                <span className="material-symbols-outlined">timer</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Avg Response</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">4.2h</p>
                            </div>
                        </div>
                    </div>

                    {/* Legend Overlay */}
                    <div className="absolute bottom-32 left-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg z-10 w-48">
                        <h3 className="text-xs font-bold mb-3 text-slate-900 dark:text-white">Issue Density</h3>
                        <div className="h-2 w-full bg-gradient-to-r from-blue-200 via-primary to-blue-900 rounded-full mb-2"></div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                            <span>Low</span>
                            <span>Critical</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

