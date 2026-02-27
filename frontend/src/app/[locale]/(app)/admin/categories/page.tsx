'use client';

import { useState } from 'react';
import Link from 'next/link';

// Types
interface Category {
    id: string;
    name: string;
    department: string;
    priority: 'Urgent' | 'High' | 'Medium' | 'Low';
    status: 'Active' | 'Inactive';
    icon: string;
    iconColor: string;
    bgColor: string;
}

// Mock Data
const mockCategories: Category[] = [
    {
        id: '1',
        name: 'Water Leak',
        department: 'Facilities - Plumbing',
        priority: 'High',
        status: 'Active',
        icon: 'water_drop',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
        id: '2',
        name: 'Power Outage',
        department: 'Facilities - Electrical',
        priority: 'Urgent',
        status: 'Active',
        icon: 'bolt',
        iconColor: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    {
        id: '3',
        name: 'Elevator Stuck',
        department: 'Security & Maintenance',
        priority: 'Urgent',
        status: 'Active',
        icon: 'elevator',
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
        id: '4',
        name: 'Network Outage',
        department: 'IT Support',
        priority: 'Medium',
        status: 'Inactive',
        icon: 'dns',
        iconColor: 'text-slate-600',
        bgColor: 'bg-slate-100 dark:bg-slate-800'
    }
];

export default function ServiceCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleStatus = (id: string) => {
        setCategories(categories.map(cat =>
            cat.id === id ? { ...cat, status: cat.status === 'Active' ? 'Inactive' : 'Active' } : cat
        ));
    };

    const deleteCategory = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(cat => cat.id !== id));
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'Urgent': return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"><span className="size-1.5 rounded-full bg-red-500"></span>Urgent</span>;
            case 'High': return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"><span className="size-1.5 rounded-full bg-orange-500"></span>High</span>;
            case 'Medium': return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"><span className="size-1.5 rounded-full bg-blue-500"></span>Medium</span>;
            case 'Low': return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"><span className="size-1.5 rounded-full bg-slate-500"></span>Low</span>;
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
                                <span className="material-symbols-outlined text-white">settings_suggest</span>
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Intervention Manager</h1>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
                            <Link href="/complaints/list" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Complaints</Link>
                            <Link href="/inventory" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Interventions</Link>
                            <Link href="/admin/categories" className="text-sm font-bold text-primary border-b-2 border-primary py-4">Settings</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input
                                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-primary"
                                placeholder="Search categories..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Category
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8">
                {/* Heading */}
                <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Service Category Configuration</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Define how complaints are categorized, prioritized, and routed to technical teams.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Categories</p>
                            <span className="material-symbols-outlined text-primary">category</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{categories.length}</p>
                            <span className="text-green-600 text-xs font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">+4 this month</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Status</p>
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{categories.filter(c => c.status === 'Active').length}</p>
                            <span className="text-slate-400 text-xs font-medium">categories live</span>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Table Controls */}
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined">filter_list</span>
                                Filter by:
                            </div>
                            <select className="text-sm rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-primary p-2">
                                <option>All Departments</option>
                                <option>Facilities Management</option>
                                <option>IT Support</option>
                                <option>Security</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Department</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Default Priority</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded ${category.bgColor} flex items-center justify-center ${category.iconColor}`}>
                                                    <span className="material-symbols-outlined text-lg">{category.icon}</span>
                                                </div>
                                                <span className="font-semibold text-slate-900 dark:text-white">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{category.department}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getPriorityBadge(category.priority)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(category.id)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${category.status === 'Active' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${category.status === 'Active' ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-primary rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button onClick={() => deleteCategory(category.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
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

