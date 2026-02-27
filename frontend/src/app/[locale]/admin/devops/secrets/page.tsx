'use client'

import { Card } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/MetricCard'
import { Button } from '@/components/ui/button'

export default function SecretsPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-pink-500 rounded-xl text-white shadow-lg shadow-pink-500/20">
                            <span className="material-symbols-outlined text-3xl">shield_person</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Secrets Management</h1>
                            <p className="text-slate-500 dark:text-slate-400">Secure storage and rotation of credentials</p>
                        </div>
                    </div>
                    <Button variant="primary">
                        <span className="material-symbols-outlined">add</span>
                        New Secret
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard title="Vaulted Secrets" value="42" icon="key" />
                    <MetricCard title="Pending Rotation" value="2" icon="sync" trend={{ value: 'Action Required', direction: 'down' }} />
                    <MetricCard title="Access Logs" value="1.2k" icon="history" subtitle="Last 24h" />
                </div>

                <Card header={<h3 className="font-bold">Secure Vault</h3>}>
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400">lock</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Vault Locked</h2>
                            <p className="text-slate-500 max-w-sm mx-auto mt-2">
                                This management interface is currently under development. Please use the command line utility `rt-vault` for all secret operations.
                            </p>
                        </div>
                        <Button variant="secondary" onClick={() => window.history.back()}>
                            Return to DevOps Suite
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
