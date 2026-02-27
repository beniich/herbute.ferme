'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Types
type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    reorderPoint: number;
    unitPrice: number;
    status: StockStatus;
}

// Mock Data
const mockInventory: InventoryItem[] = [
    {
        id: '1',
        name: 'PVC Pipe 2-inch (Industrial)',
        sku: 'SKU-PIPE-PVC-02',
        category: 'Pipes',
        currentStock: 12,
        reorderPoint: 25,
        unitPrice: 15.50,
        status: 'LOW_STOCK'
    },
    {
        id: '2',
        name: 'Fiber Optic Cable (Outdoor)',
        sku: 'SKU-WIRE-FIB-OUT',
        category: 'Wires',
        currentStock: 0,
        reorderPoint: 100,
        unitPrice: 2.80,
        status: 'OUT_OF_STOCK'
    },
    {
        id: '3',
        name: 'Smart Water Meter (V2)',
        sku: 'SKU-MET-WAT-S02',
        category: 'Meters',
        currentStock: 142,
        reorderPoint: 50,
        unitPrice: 120.00,
        status: 'IN_STOCK'
    },
    {
        id: '4',
        name: 'Copper Pipe - 15mm',
        sku: 'SKU-PIPE-COP-15',
        category: 'Pipes',
        currentStock: 85,
        reorderPoint: 30,
        unitPrice: 22.40,
        status: 'IN_STOCK'
    },
    {
        id: '5',
        name: 'Electric Meter (Three Phase)',
        sku: 'SKU-MET-ELE-TP03',
        category: 'Meters',
        currentStock: 34,
        reorderPoint: 20,
        unitPrice: 245.00,
        status: 'IN_STOCK'
    },
    {
        id: '6',
        name: 'Safety Gloves (Heavy Duty)',
        sku: 'SKU-SAF-GLV-HD',
        category: 'Safety Gear',
        currentStock: 500,
        reorderPoint: 100,
        unitPrice: 5.00,
        status: 'IN_STOCK'
    },
    {
        id: '7',
        name: 'Joint Sealant 500ml',
        sku: 'SKU-CON-SEA-500',
        category: 'Consumables',
        currentStock: 5,
        reorderPoint: 20,
        unitPrice: 12.50,
        status: 'LOW_STOCK'
    }
];

export default function InventoryPage() {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    // Derived State
    const filteredInventory = useMemo(() => {
        return mockInventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            const matchesStatus = selectedStatus === 'All' ||
                (selectedStatus === 'Low Stock' && item.status === 'LOW_STOCK') ||
                (selectedStatus === 'Out of Stock' && item.status === 'OUT_OF_STOCK') ||
                (selectedStatus === 'In Stock' && item.status === 'IN_STOCK');

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [searchQuery, selectedCategory, selectedStatus]);

    const categories = Array.from(new Set(mockInventory.map(item => item.category)));

    const stats = useMemo(() => {
        const totalValue = mockInventory.reduce((acc, item) => acc + (item.currentStock * item.unitPrice), 0);
        const lowStock = mockInventory.filter(i => i.status === 'LOW_STOCK').length;
        const outOfStock = mockInventory.filter(i => i.status === 'OUT_OF_STOCK').length;
        return { totalValue, lowStock, outOfStock };
    }, []);

    // Helper functions
    const getStatusBadge = (status: StockStatus) => {
        switch (status) {
            case 'IN_STOCK': return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    In Stock
                </span>
            );
            case 'LOW_STOCK': return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Low Stock
                </span>
            );
            case 'OUT_OF_STOCK': return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Out of Stock
                </span>
            );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <span className="material-symbols-outlined text-white">inventory_2</span>
                            </div>
                            <h1 className="text-lg font-bold tracking-tight">ReclamTrack Inventory</h1>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
                            <Link href="/complaints/list" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Complaints</Link>
                            <Link href="/inventory" className="text-sm font-bold text-primary border-b-2 border-primary py-4">Inventory</Link>
                            <Link href="/reports" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Reporting</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input
                                type="text"
                                placeholder="Search SKU or item..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=2424eb&color=fff" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Inventory & Stock Management</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and manage critical spare parts, equipment, and field consumables.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export CSV
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                            Request Stock
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Items</p>
                            <span className="material-symbols-outlined text-primary text-lg">category</span>
                        </div>
                        <p className="text-2xl font-bold leading-none mb-1">{mockInventory.length}</p>
                        <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">trending_up</span> +2.4% from last month
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Low Stock Alerts</p>
                            <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
                        </div>
                        <p className="text-2xl font-bold leading-none mb-1">{stats.lowStock + stats.outOfStock}</p>
                        <p className="text-xs font-medium text-rose-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">priority_high</span> {stats.outOfStock} critical (0 stock)
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Requests</p>
                            <span className="material-symbols-outlined text-blue-500 text-lg">pending_actions</span>
                        </div>
                        <p className="text-2xl font-bold leading-none mb-1">08</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            Average delivery: 3.2 days
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inventory Value</p>
                            <span className="material-symbols-outlined text-slate-400 text-lg">payments</span>
                        </div>
                        <p className="text-2xl font-bold leading-none mb-1">${stats.totalValue.toLocaleString()}</p>
                        <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">trending_up</span> +1.5% asset growth
                        </p>
                    </div>
                </div>

                {/* Inventory Table Container */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    {/* Table Filters */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                Filters
                            </div>
                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer text-slate-700 dark:text-slate-300 font-medium"
                            >
                                <option value="All">All Categories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer text-slate-700 dark:text-slate-300 font-medium"
                            >
                                <option value="All">Status: All</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <strong>1 - {filteredInventory.length}</strong> of <strong>{mockInventory.length}</strong> items
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Item Name / SKU</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Current Stock</th>
                                    <th className="px-6 py-4">Reorder Point</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredInventory.map(item => (
                                    <tr
                                        key={item.id}
                                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${item.status === 'LOW_STOCK' ? 'bg-amber-50/30 dark:bg-amber-900/10' :
                                                item.status === 'OUT_OF_STOCK' ? 'bg-rose-50/30 dark:bg-rose-900/10' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 dark:text-white">{item.name}</span>
                                                <span className="text-xs text-slate-500">{item.sku}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium text-slate-600 dark:text-slate-300">{item.category}</span>
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${item.status === 'LOW_STOCK' ? 'text-amber-600 dark:text-amber-400' :
                                                item.status === 'OUT_OF_STOCK' ? 'text-rose-600 dark:text-rose-400' :
                                                    'text-slate-900 dark:text-white'
                                            }`}>
                                            {item.currentStock} units
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.reorderPoint} units</td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.status === 'OUT_OF_STOCK' ? (
                                                <button className="text-primary hover:underline text-sm font-bold">Order Now</button>
                                            ) : (
                                                <button className="text-slate-500 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">more_horiz</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

