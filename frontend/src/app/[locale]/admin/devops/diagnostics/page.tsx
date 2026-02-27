"use client"
import Link from "next/link"

export default function DiagnosticsPage() {
    return (
        <div className="min-h-screen bg-background-dark flex flex-col">
            <header className="border-b border-border-dark bg-background-dark px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                        <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <h1 className="text-lg font-bold text-white">Diagnostic Center</h1>
                </div>
                <Link href="/admin/devops" className="p-2 text-slate-400 hover:text-white"><span className="material-symbols-outlined">home</span></Link>
            </header>
            <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-surface-dark border border-border-dark p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase mb-2">Total Events</p>
                        <div className="text-2xl font-bold text-white">14.2k</div>
                    </div>
                    <div className="bg-surface-dark border border-border-dark p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase mb-2">Unresolved</p>
                        <div className="text-2xl font-bold text-white">42</div>
                    </div>
                </div>
                <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-dark">
                        <h2 className="text-lg font-semibold text-white">Issues List</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                                <div className="font-bold text-white">TypeError: undefined is not an object</div>
                                <div className="text-sm text-slate-400 mt-1">api/v1/auth/callback.js</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
