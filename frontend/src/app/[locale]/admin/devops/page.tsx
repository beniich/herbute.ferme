'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Header } from "@/components/devops-dashboards/layout/Header"
import { Footer } from "@/components/devops-dashboards/layout/Footer"

const dashboards = [
    // Implemented DevOps Dashboards
    { id: 'security', name: 'Auth Service (Sentinel)', description: 'Real-time auth metrics & logs', icon: 'security', color: 'blue' },
    { id: 'kubernetes/node/current', name: 'K8s Node Manager', description: 'Monitor and manage Kubernetes nodes', icon: 'grid_view', color: 'green' },
    { id: 'logs', name: 'LogSense Explorer', description: 'Centralized log analytics & search', icon: 'analytics', color: 'purple' },
    { id: 'sql', name: 'SQL Query Insight', description: 'Database performance & query monitoring', icon: 'database', color: 'indigo' },
    { id: 'pii', name: 'PII Governance', description: 'Sensitive data discovery & compliance', icon: 'shield_lock', color: 'orange' },
    { id: 'iac', name: 'IaC Deployment Diff', description: 'Terraform plan & diff visualization', icon: 'hub', color: 'teal' },
    { id: 'health', name: 'System Health Topology', description: 'Service status & health map', icon: 'activity', color: 'emerald' },
    { id: 'failover', name: 'DR Failover Console', description: 'Multi-region disaster recovery management', icon: 'refresh', color: 'red' },

    // Original DevOps Dashboards (Placeholders)
    { id: 'mailbox', name: 'Mailbox Configuration', description: 'Manage your incoming and outgoing mail servers', icon: 'mail', color: 'blue' },
    { id: 'gslb', name: 'EdgeRoute GSLB', description: 'Global server load balancing and traffic routing', icon: 'hub', color: 'indigo' },
    { id: 'backup', name: 'CloudGuard Backup', description: 'Automated S3 backups and recovery management', icon: 'cloud_done', color: 'teal' },
    { id: 'chaos-hub', name: 'Chaos Hub', description: 'Run chaos engineering experiments and tests', icon: 'bolt', color: 'yellow' },
    { id: 'vault', name: 'Security Vault', description: 'Securely manage API keys and credentials', icon: 'shield_person', color: 'pink' },
    { id: 'drift', name: 'Infrastructure Drift', description: 'Detect and resolve infrastructure configuration drift', icon: 'hub', color: 'cyan' },
    { id: 'trace', name: 'APM Trace Explorer', description: 'Explore application performance traces and logs', icon: 'analytics', color: 'violet' },
]

const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20',
    red: 'bg-red-500/10 text-red-500 group-hover:bg-red-500/20',
    green: 'bg-green-500/10 text-green-500 group-hover:bg-green-500/20',
    purple: 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/20',
    orange: 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20',
    teal: 'bg-teal-500/10 text-teal-500 group-hover:bg-teal-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500/20',
    pink: 'bg-pink-500/10 text-pink-500 group-hover:bg-pink-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20',
    violet: 'bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20',
    sky: 'bg-sky-500/10 text-sky-500 group-hover:bg-sky-500/20',
    lime: 'bg-lime-500/10 text-lime-500 group-hover:bg-lime-500/20',
    rose: 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20',
}


export default function DevOpsPage() {
    const params = useParams()
    const locale = params.locale as string

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
            <Header />
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                        DevOps Monitoring Suite
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Professional monitoring and management dashboards for modern infrastructure
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboards.map((dashboard) => (
                        <Link
                            key={dashboard.id}
                            href={`/${locale}/admin/devops/${dashboard.id}`}
                            className="group relative bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`size-12 rounded-lg flex items-center justify-center transition-colors ${colorClasses[dashboard.color as keyof typeof colorClasses]}`}>
                                    <span className="material-symbols-outlined text-2xl">{dashboard.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                        {dashboard.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {dashboard.description}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-primary">
                                    arrow_forward
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}
