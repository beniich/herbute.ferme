"use client"

import { itTicketsApi } from "@/lib/api"
import { format } from "date-fns"
import { useEffect, useState } from "react"

export default function ITHelpdeskPage() {
    const [tickets, setTickets] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const [ticketsData, statsData] = await Promise.all([
                    itTicketsApi.getAll(),
                    itTicketsApi.getStats()
                ])
                setTickets(ticketsData)
                setStats(statsData)
            } catch (error) {
                console.error("Failed to fetch IT tickets:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTickets()
    }, [])

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    }

    const getSLAStatus = (sla: any) => {
        if (!sla || sla.breached) return <span className="text-red-500 font-bold">BREACHED</span>;
        return <span className="text-green-500">In Time</span>;
    }

    return (
        <div className="p-6 space-y-6 bg-slate-950 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">IT Support Helpdesk</h1>
                    <p className="text-slate-500 text-sm">Monitor and resolve IT infrastructure support requests.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">filter_list</span>
                        Filters
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        New Ticket
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5"><span className="material-symbols-outlined text-4xl">confirmation_number</span></div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Open Tickets</p>
                    <p className="text-2xl font-black text-white">{isLoading ? '...' : stats?.byStatus?.find((s:any) => s._id === 'open')?.count || 0}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">In Progress</p>
                    <p className="text-2xl font-black text-blue-500">{isLoading ? '...' : stats?.byStatus?.find((s:any) => s._id === 'in_progress')?.count || 0}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Mean Resolution Time</p>
                    <p className="text-2xl font-black text-green-500">{isLoading ? '...' : `${stats?.avgResolutionTime || 0}h`}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">SLA Compliance</p>
                    <p className="text-2xl font-black text-purple-500">92.4%</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-950 text-slate-500 uppercase text-[11px] font-bold">
                            <tr>
                                <th className="px-6 py-4">Ticket</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Created By</th>
                                <th className="px-6 py-4">SLA Deadline</th>
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
                            ) : tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-xs">#{ticket._id.slice(-6).toUpperCase()} - {ticket.title}</span>
                                                <span className="text-[10px] text-slate-500">{ticket.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 uppercase text-[10px] font-medium">{ticket.status.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 text-xs">
                                            {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-mono">
                                            {getSLAStatus(ticket.sla)}
                                            <div className="text-slate-600 mt-1">{format(new Date(ticket.createdAt), 'dd/MM HH:mm')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">visibility</span></button>
                                                <button className="p-1.5 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">check_circle</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500 italic">No support tickets found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
