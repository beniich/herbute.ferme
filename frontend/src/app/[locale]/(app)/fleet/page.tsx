'use client';

import Link from 'next/link';

export default function FleetPage() {
    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Side Navigation */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white dark:bg-[#111122] border-r border-slate-200 dark:border-slate-800">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight">Fleet Manager</h1>
                        <p className="text-[10px] text-slate-500 dark:text-[#9292c8] uppercase tracking-wider font-semibold">Operations</p>
                    </div>
                </div>
                <nav className="flex-1 px-3 space-y-1">
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#242447] text-white border-l-4 border-primary" href="#">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Fleet Overview</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#242447] text-slate-600 dark:text-[#9292c8] transition-colors" href="#">
                        <span className="material-symbols-outlined">error</span>
                        <span className="text-sm font-medium">Complaints Log</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#242447] text-slate-600 dark:text-[#9292c8] transition-colors" href="#">
                        <span className="material-symbols-outlined">build</span>
                        <span className="text-sm font-medium">Interventions</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#242447] text-slate-600 dark:text-[#9292c8] transition-colors" href="#">
                        <span className="material-symbols-outlined">map</span>
                        <span className="text-sm font-medium">Fleet Map</span>
                    </a>
                    <div className="pt-4 pb-2 px-3">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">System</p>
                    </div>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#242447] text-slate-600 dark:text-[#9292c8] transition-colors" href="#">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </a>
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-sm">event_repeat</span>
                        Schedule Maintenance
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#111121]/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-6">
                        <h2 className="text-lg font-bold">Vehicle Fleet Monitoring</h2>
                        <div className="relative w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input className="w-full bg-slate-100 dark:bg-[#242447] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all" placeholder="Search plates, drivers..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg bg-slate-100 dark:bg-[#242447] text-slate-600 dark:text-white relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-[#242447]"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold">John Stevens</p>
                                <p className="text-[10px] text-slate-500">Fleet Director</p>
                            </div>
                            <img className="h-9 w-9 rounded-full border-2 border-primary/20 object-cover" alt="User profile avatar photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS6XuUYiEEbH4OCI0O2Zn0XawxB9nzDj05ZwAe-J_K25A5HOLB3eVwXkOH0XgIbw_5wieAL1UzBus06sF9_bol1HwC4QAsZOsZvxsw68gJjqby7mokiYZVBWHFzB-_1ZICslSfaSfaA5Uv6d3TZGwPz849vi3YrBmIRx6KIdVqkSZPf5ZPhojV628O5jzhisxJC7F0ko2HjQp_alYQUO6CIA9AjAtchzmZBZUfGQ8nG-IK7nV7R0cW0AAmZafebuGDeGuLQYcLw8DF" />
                        </div>
                    </div>
                </header>
                <div className="p-8 space-y-8">
                    {/* KPI Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-[#1c1c30] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-slate-500 dark:text-[#9292c8]">TOTAL VEHICLES</span>
                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black">124</h3>
                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>+2%
                                </span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1c1c30] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-slate-500 dark:text-[#9292c8]">ACTIVE ASSIGNMENTS</span>
                                <span className="material-symbols-outlined text-blue-400">task_alt</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black">86</h3>
                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>+5%
                                </span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1c1c30] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ring-1 ring-amber-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-slate-500 dark:text-[#9292c8]">MAINTENANCE ALERTS</span>
                                <span className="material-symbols-outlined text-amber-500">warning</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black">12</h3>
                                <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_down</span>-3%
                                </span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1c1c30] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ring-1 ring-red-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-slate-500 dark:text-[#9292c8]">LOW FUEL WARNINGS</span>
                                <span className="material-symbols-outlined text-red-500">ev_station</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black">05</h3>
                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>+1%
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Filters & Action Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex bg-slate-100 dark:bg-[#242447] p-1 rounded-lg w-fit">
                            <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-primary text-slate-900 dark:text-white rounded-md shadow-sm">All Trucks</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 dark:text-[#9292c8] hover:text-slate-700">Service Due</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 dark:text-[#9292c8] hover:text-slate-700">On Assignment</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 dark:text-[#9292c8] hover:text-slate-700">Idle</button>
                        </div>
                        <button className="flex items-center gap-2 bg-slate-800 dark:bg-[#242447] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add New Vehicle
                        </button>
                    </div>
                    {/* Vehicle Health Table */}
                    <div className="bg-white dark:bg-[#1c1c30] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#242447]/50 text-slate-500 dark:text-[#9292c8] text-[11px] font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Vehicle Plate</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Model / Type</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Fuel Level</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Last Maintenance</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Assignment</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                                {/* Row 1: Maintenance Overdue */}
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-red-500/10 text-red-500 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">dangerous</span>
                                            </div>
                                            <span className="font-bold tracking-wide">TX-7742-G</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">Volvo FH16 Service</td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[100px]">
                                            <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                                                <span>24%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 w-[24%]"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-red-400">Oct 12, 2023</span>
                                            <span className="text-[10px] text-slate-400">Overdue by 14 days</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-500 italic">None - Grounded</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Maintenance Due</span>
                                    </td>
                                </tr>
                                {/* Row 2: Healthy */}
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                            </div>
                                            <span className="font-bold tracking-wide">BC-9011-Z</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">Ford Transit Box</td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[100px]">
                                            <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                                                <span>82%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[82%]"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">Jan 15, 2024</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">Sector 7 Logistics</span>
                                            <span className="text-[10px] text-slate-400">Driver: M. Rossi</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-primary/20 dark:text-blue-400">On Duty</span>
                                    </td>
                                </tr>
                                {/* Row 3: Service Soon */}
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">priority_high</span>
                                            </div>
                                            <span className="font-bold tracking-wide">NY-5520-X</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">Mercedes Actros</td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[100px]">
                                            <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                                                <span>45%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 w-[45%]"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-amber-500">Feb 28, 2024</span>
                                            <span className="text-[10px] text-slate-400">Scheduled soon</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">Downtown Hub Delivery</span>
                                            <span className="text-[10px] text-slate-400">Driver: K. Thompson</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Service Soon</span>
                                    </td>
                                </tr>
                                {/* Row 4: Idle/Healthy */}
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                            </div>
                                            <span className="font-bold tracking-wide">LA-1129-K</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">Isuzu NPR Service</td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[100px]">
                                            <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                                                <span>95%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[95%]"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">Feb 02, 2024</td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-500">Idle - Ready for dispatch</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Idle</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="px-6 py-4 bg-slate-50 dark:bg-[#242447]/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-medium">Showing 4 of 124 vehicles</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-white dark:hover:bg-primary/20 transition-colors">Previous</button>
                                <button className="px-3 py-1 rounded bg-white dark:bg-primary border border-slate-200 dark:border-primary text-xs font-bold shadow-sm">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
