"use client"
import Link from "next/link"

export default function RBACPage() {
    return (
        <div className="h-screen flex flex-col bg-background-dark">
            <header className="h-16 border-b border-primary/20 bg-background-dark px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-xl">shield_lock</span>
                    </div>
                    <h2 className="text-lg font-bold text-white">Enterprise Access Control</h2>
                </div>
                <Link href="/admin/devops" className="p-2 text-slate-400 hover:text-white"><span className="material-symbols-outlined">home</span></Link>
            </header>
            <div className="flex-1 flex overflow-hidden">
                <aside className="w-64 border-r border-slate-800 bg-background-dark p-4 space-y-2">
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                        <span className="text-sm font-medium">Roles & Permissions</span>
                    </a>
                </aside>
                <main className="flex-1 p-6 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-2 text-white">Granular RBAC Fine-tuning</h1>
                    <p className="text-slate-400 text-sm mb-6">Define specific module access levels</p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Module</th>
                                    <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Create</th>
                                    <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Read</th>
                                    <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Update</th>
                                    <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-800">
                                    <td className="p-4"><div className="font-semibold text-white">User Management</div></td>
                                    <td className="p-4 text-center"><input type="checkbox" defaultChecked className="rounded" /></td>
                                    <td className="p-4 text-center"><input type="checkbox" defaultChecked className="rounded" /></td>
                                    <td className="p-4 text-center"><input type="checkbox" defaultChecked className="rounded" /></td>
                                    <td className="p-4 text-center"><input type="checkbox" className="rounded" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}
