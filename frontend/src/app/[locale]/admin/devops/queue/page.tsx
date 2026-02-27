"use client"

import { Footer } from "@/components/devops-dashboards/layout/Footer"
import { Header } from "@/components/devops-dashboards/layout/Header"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Job {
    id: string
    name: string
    status: 'active' | 'waiting' | 'completed' | 'failed'
    progress: number
    attempts: number
    timestamp: string
}

export default function QueuePage() {
    const [jobs, setJobs] = useState<Job[]>([
        { id: 'job_88a1', name: 'email-notifications', status: 'active', progress: 45, attempts: 1, timestamp: '2 mins ago' },
        { id: 'job_88a2', name: 'process-image-th', status: 'active', progress: 12, attempts: 2, timestamp: '5 mins ago' },
        { id: 'job_88a3', name: 'cleanup-temp-files', status: 'completed', progress: 100, attempts: 1, timestamp: '1 hour ago' },
        { id: 'job_88a4', name: 'webhook-dispatch', status: 'failed', progress: 12, attempts: 3, timestamp: '10 mins ago' },
        { id: 'job_88a5', name: 're-index-search', status: 'active', progress: 78, attempts: 1, timestamp: '30 secs ago' },
    ])

    useEffect(() => {
        const interval = setInterval(() => {
            setJobs(prev => prev.map(job => {
                if (job.status === 'active' && job.progress < 100) {
                    const newProgress = Math.min(100, job.progress + Math.floor(Math.random() * 5))
                    return {
                        ...job,
                        progress: newProgress,
                        status: newProgress === 100 ? 'completed' : 'active'
                    }
                }
                return job
            }))
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const stats = [
        { label: 'Active Jobs', value: '1,284', icon: 'sync', color: 'blue' },
        { label: 'Waiting', value: '452', icon: 'timer', color: 'amber' },
        { label: 'Completed', value: '12.5k', icon: 'check_circle', color: 'emerald' },
        { label: 'Failed', value: '23', icon: 'error', color: 'red' },
    ]

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
                {/* Page Title & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-4xl">database</span>
                            BullMQ & Redis Console
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Monitoring message queues and background job performance
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500/20 transition-all">
                            Purge Failed Jobs
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Force Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="dashboard-card p-6 group hover:translate-y-[-4px] transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        {stat.label}
                                    </p>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                                        {stat.value}
                                    </h2>
                                </div>
                                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-500">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+12% vs last hour</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live Jobs Table */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">format_list_bulleted</span>
                                Live Job Explorers
                            </h3>
                            <Link href="#" className="text-sm font-bold text-primary hover:underline">View All Jobs</Link>
                        </div>

                        <div className="dashboard-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="data-table">
                                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                                        <tr>
                                            <th className="px-6 py-4">Job / ID</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Progress</th>
                                            <th className="px-6 py-4">Attempts</th>
                                            <th className="px-6 py-4">Started</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-300">
                                        {jobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{job.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-mono tracking-tighter">{job.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`status-badge ${
                                                        job.status === 'active' ? 'status-info' :
                                                        job.status === 'completed' ? 'status-success' :
                                                        job.status === 'failed' ? 'status-error' :
                                                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 min-w-[120px]">
                                                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${
                                                                job.status === 'failed' ? 'bg-red-500' : 'bg-primary'
                                                            }`}
                                                            style={{ width: `${job.progress}%` } as React.CSSProperties}
                                                        />
                                                    </div>
                                                    <div className="text-[10px] font-bold mt-1 text-right">{job.progress}%</div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold">
                                                    {job.attempts}/5
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 italic">
                                                    {job.timestamp}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Redis Status & Configuration */}
                    <div className="space-y-6">
                        <div className="dashboard-card p-6 border-l-4 border-red-500">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500">memory</span>
                                Redis Instance
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Host</span>
                                    <span className="font-mono font-bold">127.0.0.1:6379</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Memory Usage</span>
                                    <span className="font-bold text-emerald-500">124.5 MB</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Uptime</span>
                                    <span className="font-bold">14d 2h 12m</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Persistence</span>
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold">RDB+AOF</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card p-6 bg-slate-900 dark:bg-slate-950 border-none shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                                <span className="material-symbols-outlined text-9xl text-primary">bolt</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-white font-black mb-2">DevOps Tip</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    Use <code className="text-primary font-mono bg-primary/10 px-1 rounded">queue.obliterate()</code> to completely
                                    reset a queue and its metadata during debugging.
                                </p>
                                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                                    Read docs <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
