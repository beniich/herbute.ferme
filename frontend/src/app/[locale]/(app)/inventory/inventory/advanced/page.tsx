'use client';

import { useState } from 'react';
import Link from 'next/link';

// Types
interface InventoryActivity {
    id: string;
    type: 'CONSUMPTION' | 'ARRIVAL' | 'ALERT' | 'RETURN' | 'ADJUSTMENT';
    message: string;
    detail: string;
    timestamp: string;
    user?: string;
}

// Mock Data
const mockActivities: InventoryActivity[] = [
    { id: '1', type: 'CONSUMPTION', message: 'Team 04 took 5 meters of pipe', detail: 'Intervention: #INC-2841', timestamp: '14 minutes ago' },
    { id: '2', type: 'ARRIVAL', message: 'Stock Arrival: 200 Units', detail: 'Item: PVC Pipe 2-inch', timestamp: '1 hour ago' },
    { id: '3', type: 'ALERT', message: 'Alert: Low Stock Threshold', detail: 'Item: Smart Water Meter V2', timestamp: '3 hours ago' },
    { id: '4', type: 'RETURN', message: 'Team 12 returned 2 meters', detail: 'Excess from: #INC-2810', timestamp: 'Yesterday' },
    { id: '5', type: 'ADJUSTMENT', message: 'Stock Adjustment: -10 Units', detail: 'Manual update by Supervisor', timestamp: 'Oct 12, 09:15 AM' }
];

export default function AdvancedInventoryPage() {
    // Helper to get activity icon color
    const getActivityColor = (type: InventoryActivity['type']) => {
        switch (type) {
            case 'CONSUMPTION': return 'bg-primary border-primary';
            case 'ARRIVAL': return 'bg-emerald-500 border-emerald-500';
            case 'ALERT': return 'bg-amber-500 border-amber-500';
            case 'RETURN': return 'bg-blue-400 border-blue-400';
            case 'ADJUSTMENT': return 'bg-slate-400 border-slate-400';
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <span className="material-symbols-outlined text-white">inventory_2</span>
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ReclamTrack Inventory</h1>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link href="/inventory" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Standard View</Link>
                            <Link href="/inventory/advanced" className="text-sm font-bold text-primary border-b-2 border-primary py-4">Advanced Analytics</Link>
                            <Link href="/inventory/request" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Requests</Link>
                            <Link href="/warehouse/approvals" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Approvals</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input
                                type="text"
                                placeholder="Global inventory search..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=2424eb&color=fff" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Inventory & Stock Management</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive analytics and control interface for field equipment.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                                <span className="material-symbols-outlined text-lg">add</span>
                                New Item
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined text-2xl">category</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Items</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">1,248 <span className="text-xs font-normal text-slate-400 ml-1">SKUs</span></p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                                <span className="material-symbols-outlined text-2xl">warning</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Low Stock Alerts</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">14 <span className="text-xs font-normal text-rose-500 ml-1">3 Critical</span></p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                <span className="material-symbols-outlined text-2xl">pending_actions</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Requests</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">08 <span className="text-xs font-normal text-slate-400 ml-1">From Field</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Table Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                                <div className="relative w-full md:w-80">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                                        placeholder="Search by name or category..."
                                        type="text"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <span className="material-symbols-outlined text-slate-500">filter_list</span>
                                    </button>
                                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <span className="material-symbols-outlined text-slate-500">file_download</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                            <th className="px-6 py-4">Item Name</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4 text-center">Current Stock</th>
                                            <th className="px-6 py-4">Unit</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {/* Example Row 1 */}
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-xl">vibration</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900 dark:text-white leading-tight">PVC Pipe 2-inch</span>
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">SKU-PIPE-PVC-02</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-300">Pipes</span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-amber-600">12</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">Units</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                    Low Stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Add/Subtract Stock">
                                                        <span className="material-symbols-outlined text-lg">exposure_plus_1</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Edit">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Example Row 2 */}
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-xl">cable</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900 dark:text-white leading-tight">Fiber Optic Cable</span>
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">SKU-CBL-FIB-OUT</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-300">Cables</span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-rose-600">0</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">Meters</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                    Out of Stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Add/Subtract Stock">
                                                        <span className="material-symbols-outlined text-lg">exposure_plus_1</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Edit">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Activity Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full max-h-[700px]">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Recent Activity</h3>
                                <span className="material-symbols-outlined text-slate-400 text-lg">history</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {mockActivities.map(activity => (
                                    <div key={activity.id} className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800">
                                        <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm ${getActivityColor(activity.type)}`}></div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{activity.timestamp}</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{activity.message}</p>
                                            <p className="text-xs text-slate-500">{activity.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                                <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg">
                                    View Full History
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

