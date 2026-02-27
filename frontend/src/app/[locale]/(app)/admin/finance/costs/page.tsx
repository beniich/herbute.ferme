'use client';

import { useState } from 'react';
import Link from 'next/link';

// Types
interface CostEntry {
    id: string;
    description: string;
    client: string;
    materialCost: number;
    laborCost: number;
    status: 'Invoiced' | 'Pending' | 'Over Budget';
}

// Mock Data
const mockCosts: CostEntry[] = [
    { id: 'TK-8492', description: 'HVAC System Repair', client: 'Global Tech Park, Building A', materialCost: 1240, laborCost: 450, status: 'Invoiced' },
    { id: 'TK-8501', description: 'Main Entrance Door Sensor', client: 'Retail Hub East', materialCost: 215, laborCost: 180, status: 'Pending' },
    { id: 'TK-8512', description: 'Electrical Re-wiring', client: 'Apartments Central', materialCost: 4500, laborCost: 1200, status: 'Over Budget' },
    { id: 'TK-8520', description: 'Emergency Pipe Repair', client: 'Western Medical Plaza', materialCost: 85, laborCost: 350, status: 'Pending' },
];

export default function CostTrackingPage() {
    const [costs, setCosts] = useState<CostEntry[]>(mockCosts);
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    const filteredCosts = statusFilter === 'All Statuses'
        ? costs
        : costs.filter(c => c.status === statusFilter);

    const totalStats = {
        total: 45200,
        materials: 28450,
        labor: 16750,
        pending: 12300
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-3 text-primary">
                            <span className="material-symbols-outlined text-3xl">payments</span>
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">CostTrack Pro</h2>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
                            <Link href="/admin/finance/costs" className="text-primary text-sm font-semibold border-b-2 border-primary py-1">Financials</Link>
                            <Link href="/inventory" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Inventory</Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 items-center">
                        <div className="relative hidden sm:block w-full max-w-xs">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                            <input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="Search tickets..." type="text" />
                        </div>
                        <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">receipt_long</span>
                            <span>Bulk Invoice</span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                            <img src="https://ui-avatars.com/api/?name=Financial+Manager&background=2424eb&color=fff" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto w-full p-6 md:p-8 space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight tracking-tight">Intervention Cost Tracking</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base">Detailed overview of material and labor expenses for all maintenance tickets.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            <span>Last 30 Days</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-lg">download</span>
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">TOTAL COST</p>
                            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">${totalStats.total.toLocaleString()}.00</p>
                        <div className="mt-2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span>+12.5%</span>
                            <span className="text-slate-400 dark:text-slate-500 font-medium ml-1">vs last month</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">MATERIALS</p>
                            <span className="material-symbols-outlined text-slate-400">inventory_2</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">${totalStats.materials.toLocaleString()}.00</p>
                        <div className="mt-2 flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm font-bold">
                            <span className="material-symbols-outlined text-sm">trending_down</span>
                            <span>-2.4%</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">LABOR</p>
                            <span className="material-symbols-outlined text-slate-400">engineering</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">${totalStats.labor.toLocaleString()}.00</p>
                        <div className="mt-2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span>+18.1%</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-primary border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-primary text-sm font-bold">PENDING INVOICE</p>
                            <span className="material-symbols-outlined text-primary">pending_actions</span>
                        </div>
                        <p className="text-primary text-2xl font-black tracking-tight">${totalStats.pending.toLocaleString()}.00</p>
                        <div className="mt-2 flex items-center gap-1 text-primary/70 text-sm font-bold">
                            <span>{Math.round(totalStats.pending / totalStats.total * 100)}% of total</span>
                        </div>
                    </div>
                </div>

                {/* Charts Area (Simulated) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Operational Spending</h3>
                        <div className="grid grid-cols-6 items-end gap-3 h-48 px-2">
                            {[40, 65, 55, 85, 95, 70].map((h, i) => (
                                <div key={i} className="space-y-2 group flex flex-col items-center">
                                    <div className={`w-full rounded-t-md transition-all ${i === 4 ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/40'}`} style={{ height: `${h}%` }}></div>
                                    <p className="text-[10px] font-bold text-slate-400">{'JanFebMarAprMayJun'.substring(i * 3, i * 3 + 3)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Material vs. Labor Efficiency</h3>
                            <div className="text-right">
                                <p className="text-slate-900 dark:text-white font-bold">$165k Total</p>
                                <p className="text-emerald-500 text-xs font-bold">Efficiency +15%</p>
                            </div>
                        </div>
                        <div className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-slate-400 font-medium italic">Efficiency Trend Chart Visualization</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-slate-900 dark:text-white font-black text-xl">Detailed Intervention Costs</h3>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>All Statuses</option>
                                <option>Invoiced</option>
                                <option>Pending</option>
                                <option>Over Budget</option>
                            </select>
                            <button className="flex-1 sm:flex-none px-6 py-2 bg-primary text-white text-sm font-black rounded-lg transition-colors hover:bg-primary/90">
                                Apply Filter
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ticket ID</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Intervention & Client</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Material</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Labor</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredCosts.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-bold text-primary">#{item.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.description}</p>
                                            <p className="text-[11px] text-slate-500 font-medium uppercase">{item.client}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white text-right tabular-nums">${item.materialCost.toLocaleString()}.00</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white text-right tabular-nums">${item.laborCost.toLocaleString()}.00</td>
                                        <td className={`px-6 py-4 text-sm font-black text-right tabular-nums ${item.status === 'Over Budget' ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                                            ${(item.materialCost + item.laborCost).toLocaleString()}.00
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tight ${item.status === 'Invoiced' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700' :
                                                    item.status === 'Pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' :
                                                        'bg-rose-100 dark:bg-rose-900/30 text-rose-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">receipt_long</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500 uppercase">Showing {filteredCosts.length} entries</p>
                        <div className="flex items-center gap-1">
                            <button className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30" disabled>
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 rounded bg-primary text-white text-[11px] font-black">1</button>
                            <button className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
