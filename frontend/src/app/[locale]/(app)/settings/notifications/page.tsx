'use client';

import { useState } from 'react';

export default function NotificationSettingsPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark hidden md:flex flex-col">
                    <div className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">settings_suggest</span>
                            </div>
                            <div>
                                <h1 className="text-sm font-bold">Admin Panel</h1>
                                <p className="text-xs text-slate-500">System Management</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 space-y-1">
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined">description</span>
                            <span className="text-sm font-medium">Complaints</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined">engineering</span>
                            <span className="text-sm font-medium">Interventions</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined">group</span>
                            <span className="text-sm font-medium">Teams</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined">bar_chart</span>
                            <span className="text-sm font-medium">Reports</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg active-link bg-primary/10 text-primary" href="#">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </a>
                    </nav>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 p-2">
                            <img alt="Profile" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJEOwxkrGZWVr_88o-EOAMkydctDGUkBsoLslO17f0oYol_dNdMDSuBgJo4Bs7D5lBKWiQvdY-sRrwonEBhxTuhYGkHdDaZWP1xvdYJnUmGoHDjkbPnRNh_lQM9ScZ_zBFHvSFs09kK0mQCVR7DuJ2DysHGEmB6RG-cTmO5f3jrfAHW9to-2X7eaK95l-yrIP-dio1mlr6w-w4rZVm7PRe0zTmb1Y7_D6XFMgiyq2WADWpdUAFHicbNtHeuQJnhMMslyQtXyShOLxM" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate">Alex Rivera</p>
                                <p className="text-[10px] text-slate-500">Super Administrator</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                    <div className="max-w-5xl mx-auto p-6 lg:p-10">
                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight mb-2">Notification & Alert Settings</h2>
                                <p className="text-slate-500 max-w-2xl">Configure how the system communicates with users and field teams. Manage SMS/Email triggers and customize templates for every stage of the intervention lifecycle.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    Reset Defaults
                                </button>
                                <button className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-8">
                            {/* Alert Section: New Complaint */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm">notification_add</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">New Complaint Alerts</h3>
                                                <p className="text-sm text-slate-500">Triggered when a citizen submits a new issue report.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-xs font-medium text-slate-500">SMS</span>
                                                <div className="relative inline-flex items-center h-5 w-10">
                                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors"></div>
                                                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-xs font-medium text-slate-500">Email</span>
                                                <div className="relative inline-flex items-center h-5 w-10">
                                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors"></div>
                                                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Template</label>
                                            <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                                                <span className="material-symbols-outlined text-[14px]">add_circle</span> Insert Variable
                                            </button>
                                        </div>
                                        <textarea className="w-full h-32 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm p-2" placeholder="Dear [Customer_Name], we have received your complaint [Complaint_ID] regarding [Category]..."></textarea>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">SMS Template</label>
                                            <span className="text-[10px] text-slate-400 font-medium">104 / 160 characters</span>
                                        </div>
                                        <textarea className="w-full h-32 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm p-2" placeholder="Alert: Your complaint #[ID] has been logged. Our team is reviewing the details. Track here: [Link]"></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* Alert Section: Team Dispatched */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm">local_shipping</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">Team Dispatched Alerts</h3>
                                                <p className="text-sm text-slate-500">Triggered when a field crew is assigned to a specific task.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-xs font-medium text-slate-500">SMS</span>
                                                <div className="relative inline-flex items-center h-5 w-10">
                                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors"></div>
                                                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-xs font-medium text-slate-500">Email</span>
                                                <div className="relative inline-flex items-center h-5 w-10">
                                                    <input className="sr-only peer" type="checkbox" />
                                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors"></div>
                                                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-100">
                                    <div className="space-y-3 grayscale opacity-50">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-400">Email Template (Disabled)</label>
                                        </div>
                                        <div className="w-full h-32 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-800"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">SMS Template</label>
                                            <span className="text-[10px] text-slate-400 font-medium">82 / 160 characters</span>
                                        </div>
                                        <textarea className="w-full h-32 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm p-2" defaultValue="A technical team ([Team_Name]) has been dispatched to [Location] for #[ID]."></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* Alert Section: Issue Resolved */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm">task_alt</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">Issue Resolved Alerts</h3>
                                                <p className="text-sm text-slate-500">Triggered upon successful closing of an intervention ticket.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-xs font-medium text-slate-500">SMS</span>
                                                <div className="relative inline-flex items-center h-5 w-10">
                                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors"></div>
                                                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-xs font-medium text-slate-500">Email</span>
                                                <div className="relative inline-flex items-center h-5 w-10">
                                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors"></div>
                                                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Template</label>
                                        <textarea className="w-full h-32 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm p-2" defaultValue="Great news! Your issue #[ID] has been marked as resolved by our technical team..."></textarea>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">SMS Template</label>
                                            <span className="text-[10px] text-slate-400 font-medium">45 / 160 characters</span>
                                        </div>
                                        <textarea className="w-full h-32 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm p-2" defaultValue="Issue #[ID] resolved. Thank you for your patience."></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* Tags / Placeholders Guide */}
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                                <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-sm">info</span> Available Variables
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">[Customer_Name]</span>
                                    <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">[Complaint_ID]</span>
                                    <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">[Category]</span>
                                    <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">[Team_Name]</span>
                                    <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">[Location]</span>
                                    <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">[Resolution_Date]</span>
                                    <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">[Tracking_URL]</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4">
                            <button className="px-8 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">Discard changes</button>
                            <button className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Save Notification Profile
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
