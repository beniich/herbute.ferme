"use client"

import { itAssetsApi } from "@/lib/api"
import { useEffect, useState } from "react"

export default function ITAssetsPage() {
    const [assets, setAssets] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const [assetsData, statsData] = await Promise.all([
                    itAssetsApi.getAll(),
                    itAssetsApi.getStats()
                ])
                setAssets(assetsData)
                setStats(statsData)
            } catch (error) {
                console.error("Failed to fetch IT assets:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAssets()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'maintenance': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'retired': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    }

    return (
        <div className="p-6 space-y-6 bg-slate-950 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">IT Assets Inventory</h1>
                    <p className="text-slate-500 text-sm">Manage enterprise hardware and infrastructure assets.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Register New Asset
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Total Assets</p>
                    <p className="text-2xl font-black text-white">{isLoading ? '...' : stats?.total || 0}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Active</p>
                    <p className="text-2xl font-black text-green-500">{isLoading ? '...' : stats?.byStatus?.find((s:any) => s._id === 'active')?.count || 0}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Under Maintenance</p>
                    <p className="text-2xl font-black text-yellow-500">{isLoading ? '...' : stats?.byStatus?.find((s:any) => s._id === 'maintenance')?.count || 0}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Total Value</p>
                    <p className="text-2xl font-black text-blue-500">{isLoading ? '...' : `$${(stats?.totalValue || 0).toLocaleString()}`}</p>
                </div>
            </div>

            {/* Assets Table */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-950 text-slate-500 uppercase text-[11px] font-bold">
                            <tr>
                                <th className="px-6 py-4">Asset Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">S/N</th>
                                <th className="px-6 py-4">Assignment</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : assets.length > 0 ? (
                                assets.map((asset) => (
                                    <tr key={asset._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-white">{asset.name}</td>
                                        <td className="px-6 py-4 uppercase text-[10px] font-medium text-slate-400">{asset.type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${getStatusColor(asset.status)}`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">{asset.serialNumber}</td>
                                        <td className="px-6 py-4">
                                            {asset.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 bg-blue-500/20 rounded-full flex items-center justify-center text-[10px] text-blue-400 uppercase font-black">
                                                        {asset.assignedTo.firstName?.[0]}{asset.assignedTo.lastName?.[0]}
                                                    </div>
                                                    <span className="text-xs">{asset.assignedTo.firstName} {asset.assignedTo.lastName}</span>
                                                </div>
                                            ) : <span className="text-slate-600 text-[10px] uppercase font-bold">Unassigned</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                <button className="p-1.5 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">history</span></button>
                                                <button className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500 italic">No assets registered yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
