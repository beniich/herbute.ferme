'use client'

import { Card } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/MetricCard'
import { Button } from '@/components/ui/button'

export default function ChaosHubPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500 rounded-xl text-white shadow-lg shadow-yellow-500/20">
                            <span className="material-symbols-outlined text-3xl">bolt</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Chaos Hub</h1>
                            <p className="text-slate-500 dark:text-slate-400">Resilience testing and fault injection experiments</p>
                        </div>
                    </div>
                    <Button variant="danger">
                        <span className="material-symbols-outlined">warning</span>
                        New Experiment
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard title="Active Tests" value="0" icon="science" />
                    <MetricCard title="Resilience Score" value="84/100" icon="security" trend={{ value: '+4', direction: 'up' }} />
                    <MetricCard title="Mean Time to Recover" value="4.2m" icon="timer" trend={{ value: '-12%', direction: 'up' }} />
                </div>

                <Card header={<h3 className="font-bold">Experiment Laboratory</h3>}>
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400">experiment</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Laboratory Initializing</h2>
                            <p className="text-slate-500 max-w-sm mx-auto mt-2">
                                FAULT-INJECTION-V2 is currently being deployed to this cluster. The experiment hub will be available shortly.
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
