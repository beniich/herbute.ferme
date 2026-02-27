'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock Data
const integrations = [
    {
        id: 'esri',
        name: 'Esri ArcGIS Pro',
        type: 'GIS PROVIDER',
        status: 'Connected',
        endpoint: 'arcgis.api/v4/geo',
        latency: '124ms',
        image: 'https://via.placeholder.com/300x150/2424eb/FFFFFF?text=ArcGIS',
        statusColor: 'bg-green-100 text-green-700',
        dotColor: 'bg-green-500'
    },
    {
        id: 'twilio',
        name: 'Twilio Messaging',
        type: 'SMS GATEWAY',
        status: 'Maintenance',
        endpoint: 'api.twilio.com/2010-04-01',
        latency: '--',
        image: 'https://via.placeholder.com/300x150/F22F46/FFFFFF?text=Twilio',
        statusColor: 'bg-amber-100 text-amber-700',
        dotColor: 'bg-amber-500'
    },
    {
        id: 'lorawan',
        name: 'LoRaWAN Leak Detect',
        type: 'IOT SENSOR NETWORK',
        status: 'Connected',
        endpoint: 'eu1.cloud.thethings.network',
        latency: '85ms',
        image: 'https://via.placeholder.com/300x150/10b981/FFFFFF?text=LoRaWAN',
        statusColor: 'bg-green-100 text-green-700',
        dotColor: 'bg-green-500'
    }
];

const logs = [
    { id: 1, service: 'Esri ArcGIS', event: 'GET /layers/hydro/refresh', status: '200 OK', statusClass: 'bg-green-100 text-green-700', latency: '142ms', time: '14:24:02' },
    { id: 2, service: 'Twilio SMS', event: 'POST /v1/sms/send', status: '503 UNAVAIL', statusClass: 'bg-red-100 text-red-700', latency: '--', time: '14:22:58' },
    { id: 3, service: 'LoRaWAN Network', event: 'UPSTREAM /node_492/ping', status: '200 OK', statusClass: 'bg-green-100 text-green-700', latency: '850ms', time: '14:18:45' }
];

export default function IntegrationsHubPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <span className="material-symbols-outlined text-white">hub</span>
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Integration Hub</h1>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
                            <Link href="/admin/integrations" className="text-sm font-bold text-primary border-b-2 border-primary py-4">Integrations</Link>
                            <Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">API Keys</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                            <span className="material-symbols-outlined text-sm">add_link</span>
                            Connect New Service
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8">
                {/* Title & Top Summary */}
                <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">External Integration Hub</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Manage technical connections for GIS mapping, SMS notifications, and IoT sensor networks for automated leak detection.</p>
                    </div>
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <button className="px-4 py-2 text-xs font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm text-primary">LIVE STATUS</button>
                        <button className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">HISTORICAL DATA</button>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Active Nodes</p>
                            <span className="material-symbols-outlined text-primary">router</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold">1,248</p>
                        <p className="text-green-600 text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span> +12% from last month
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Global Uptime</p>
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold">99.98%</p>
                        <p className="text-slate-400 text-xs font-bold">Past 30 days</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg. Latency</p>
                            <span className="material-symbols-outlined text-amber-500">speed</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold">42ms</p>
                        <p className="text-slate-400 text-xs font-bold">Optimal performance</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">API Failures</p>
                            <span className="material-symbols-outlined text-red-500">error</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold">0.02%</p>
                        <p className="text-red-500 text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">warning</span> 4 failed requests today
                        </p>
                    </div>
                </div>

                {/* Service Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                    {integrations.map((service) => (
                        <div key={service.id} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                            <div className="h-32 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})`, opacity: 0.8 }}></div>
                                <div className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1 ${service.statusColor}`}>
                                    <span className={`size-1.5 rounded-full ${service.dotColor} ${service.status === 'Connected' ? 'animate-pulse' : ''}`}></span>
                                    {service.status}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">{service.name}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">{service.type}</p>
                                    </div>
                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">settings</span>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">API Endpoint</span>
                                        <span className="text-slate-900 dark:text-slate-300 font-mono">{service.endpoint}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Avg. Response</span>
                                        <span className="text-slate-900 dark:text-slate-300 font-bold">{service.latency}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-2">
                                    <button className="flex-1 bg-primary/10 text-primary text-xs font-bold py-2 rounded hover:bg-primary hover:text-white transition-colors">Test Connection</button>
                                    <button className="px-3 border border-slate-200 dark:border-slate-700 rounded flex items-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Integration Placeholder */}
                    <div className="flex flex-col border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 items-center justify-center text-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group cursor-pointer">
                        <div className="size-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white font-bold">Add Integration</p>
                            <p className="text-slate-500 text-sm">Configure a new API, Gateway, or Network Node</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Logs Section */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">terminal</span>
                            Recent Integration Activity
                        </h3>
                        <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                            View All Logs <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Payload Status</th>
                                    <th className="px-6 py-4">Latency</th>
                                    <th className="px-6 py-4">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{log.service}</td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.event}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${log.statusClass}`}>{log.status}</span></td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.latency}</td>
                                        <td className="px-6 py-4 text-slate-400 tabular-nums">{log.time}</td>
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

