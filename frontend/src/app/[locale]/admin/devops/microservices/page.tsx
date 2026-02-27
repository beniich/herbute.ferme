"use client"
import Link from "next/link"

export default function MicroservicesPage() {
    return (
        <div className="min-h-screen bg-background-dark">
            <header className="border-b border-slate-800 bg-background-dark px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-primary">hub</span>
                    </div>
                    <h2 className="text-white text-lg font-bold">Health Center</h2>
                </div>
                <Link href="/admin/devops" className="p-2 text-slate-400 hover:text-white"><span className="material-symbols-outlined">home</span></Link>
            </header>
            <main className="p-6 max-w-[1440px] mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                        <p className="text-slate-400 text-sm mb-2">Total Services</p>
                        <div className="text-2xl font-bold text-white">24</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                        <p className="text-slate-400 text-sm mb-2">System Uptime</p>
                        <div className="text-2xl font-bold text-white">99.98%</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-white">Auth Service</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-300"><span>Uptime</span><span>99.99%</span></div>
                            <div className="flex justify-between text-sm text-slate-300"><span>Latency</span><span>12ms</span></div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-white">Billing Service</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-300"><span>Uptime</span><span>99.95%</span></div>
                            <div className="flex justify-between text-sm text-slate-300"><span>Latency</span><span>24ms</span></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
