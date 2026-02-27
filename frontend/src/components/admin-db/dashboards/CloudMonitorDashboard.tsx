import React, { useEffect, useState } from 'react';
import { dbAdminApi } from "@/services/dbAdminService";

interface CostBreakdown {
    service: string;
    cost: number;
    pct: number;
    color: string;
}

interface CloudResources {
    instances: number;
    storageTB: number;
    savings: number;
}

interface CloudData {
    total: number;
    changePct: number;
    breakdown: CostBreakdown[];
    resources: CloudResources;
}

export default function CloudMonitorDashboard() {
    const [data, setData] = useState<CloudData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await dbAdminApi.getCloudMonitorData();
                setData(res.data);
            } catch (error) {
                console.error("Failed to load CloudMonitor data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Fallback data if API fails or returns null
    const { total, changePct, breakdown, resources } = data || {
        total: 0,
        changePct: 0,
        breakdown: [],
        resources: { instances: 0, storageTB: 0, savings: 0 }
    };

    return (
        <div className="flex w-full h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
            <style jsx>{`
                .chart-container {
                    background-image: linear-gradient(rgba(19, 91, 236, 0.05) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(19, 91, 236, 0.05) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>

            {/* Sidebar Navigation (Collapsed Style) */}
            <aside className="w-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-6 z-20 shadow-xl">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <span className="material-symbols-outlined text-[24px]">cloud</span>
                </div>
                <nav className="flex-1 flex flex-col gap-4 w-full px-2">
                    <button className="w-full aspect-square rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all group relative">
                        <span className="material-symbols-outlined">dashboard</span>
                        <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Overview</div>
                    </button>
                    <button className="w-full aspect-square rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all group relative">
                        <span className="material-symbols-outlined">attach_money</span>
                        <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Cost Analysis</div>
                    </button>
                    <button className="w-full aspect-square rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all group relative">
                        <span className="material-symbols-outlined">security</span>
                        <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Security Groups</div>
                    </button>
                    <button className="w-full aspect-square rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all group relative">
                        <span className="material-symbols-outlined">settings</span>
                        <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Settings</div>
                    </button>
                </nav>
                <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="User" />
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cloud Monitor <span className="text-primary">Enterprise</span></h1>
                        <p className="text-sm text-slate-500">Multi-cloud resource management & cost optimization</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button className="px-4 py-2 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 shadow rounded-md flex items-center gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" className="h-4 w-auto" alt="AWS" />
                                AWS
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/dec/Google_Cloud_Logo.svg" className="h-4 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="GCP" />
                                GCP
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" className="h-4 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Azure" />
                                Azure
                            </button>
                        </div>
                        <button className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-6 right-8 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-[#0b0c10]">
                    <div className="max-w-[1600px] mx-auto space-y-8">
                        {/* Top Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-[120px]">payments</span>
                                </div>
                                <p className="text-blue-100 font-medium mb-1">Total Monthly Cost</p>
                                <h2 className="text-4xl font-black mb-4">${total.toLocaleString()}</h2>
                                <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-sm">{changePct < 0 ? 'trending_down' : 'trending_up'}</span>
                                    <span className="font-bold">{Math.abs(changePct)}%</span> vs last month
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-4 top-4 h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                    <span className="material-symbols-outlined">savings</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Projected Savings</p>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">${resources.savings.toLocaleString()}</h2>
                                <p className="text-sm text-slate-500">Available via Reserved Instances</p>
                                <button className="mt-4 text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    Review Recommendations <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                <div className="absolute right-4 top-4 h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <span className="material-symbols-outlined">dns</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Active Resources</p>
                                <div className="flex gap-6 mt-2">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{resources.instances}</h3>
                                        <p className="text-xs text-slate-500">EC2 Instances</p>
                                    </div>
                                    <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{resources.storageTB} TB</h3>
                                        <p className="text-xs text-slate-500">S3 Storage</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Chart Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                            {/* Chart Area */}
                            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Cost Trend Analysis</h3>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">Daily</button>
                                        <button className="px-3 py-1 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">Weekly</button>
                                    </div>
                                </div>
                                <div className="flex-1 w-full relative chart-container rounded-lg border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                                    {/* Mock SVG Line Chart */}
                                    <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 50" preserveAspectRatio="none">
                                        {/* Grid Lines */}
                                        <path d="M0 40 L100 40" stroke="#cbd5e1" strokeWidth="0.1" strokeDasharray="1,1" />
                                        <path d="M0 30 L100 30" stroke="#cbd5e1" strokeWidth="0.1" strokeDasharray="1,1" />
                                        <path d="M0 20 L100 20" stroke="#cbd5e1" strokeWidth="0.1" strokeDasharray="1,1" />
                                        <path d="M0 10 L100 10" stroke="#cbd5e1" strokeWidth="0.1" strokeDasharray="1,1" />

                                        {/* Data Line (Gradient Fill) */}
                                        <defs>
                                            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 35 Q 10 32, 20 25 T 40 30 T 60 15 T 80 20 T 100 10 V 50 H 0 Z" fill="url(#gradient)" />
                                        <path d="M0 35 Q 10 32, 20 25 T 40 30 T 60 15 T 80 20 T 100 10" fill="none" stroke="#3b82f6" strokeWidth="0.5" />

                                        {/* Points */}
                                        <circle cx="20" cy="25" r="1.5" fill="white" stroke="#3b82f6" strokeWidth="0.5" />
                                        <circle cx="60" cy="15" r="1.5" fill="white" stroke="#3b82f6" strokeWidth="0.5" />
                                        <circle cx="100" cy="10" r="1.5" fill="white" stroke="#3b82f6" strokeWidth="0.5" />
                                    </svg>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Cost Breakdown</h3>
                                <div className="flex-1 flex flex-col justify-center space-y-6">
                                    {breakdown.map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-slate-600 dark:text-slate-300">{item.service}</span>
                                                <div className="text-right">
                                                    <span className="font-bold text-slate-900 dark:text-white block">${item.cost.toLocaleString()}</span>
                                                    <span className="text-xs text-slate-500">{item.pct}%</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${item.color.replace('bg-', '')} ${item.color}`} style={{ width: `${item.pct}%`, backgroundColor: item.color.startsWith('#') || item.color.includes('-') ? '' : 'var(--color)' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Alerts Section */}
                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-4">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 mt-1">warning</span>
                            <div>
                                <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm">Cost Anomaly Detected</h4>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">One of your RDS instances (db-prod-primary) showed a +240% cost spike in the last 6 hours due to high IOPS.</p>
                                <button className="mt-3 text-xs font-bold text-amber-900 dark:text-amber-100 underline hover:no-underline">Investigate Resource</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
