"use client"

import DashboardTemplate from "@/components/devops-dashboards/shared/DashboardTemplate"
import { Badge } from "@/components/ui/badge"
import { useSecuritySocket } from "@/hooks/useSecuritySocket"
import { securityApi } from "@/lib/api"
import { format } from "date-fns"
import { useEffect, useState } from "react"

interface ComplianceData {
    complianceScore: number;
    recommendations: string[];
}

interface RdpSession {
    username: string;
    sessionName: string;
    id: string;
    state: string;
}

interface PasswordAudit {
    bcryptHashed: number;
    totalUsers: number;
}

export default function SecurityPage() {
    const [complianceData, setComplianceData] = useState<ComplianceData | null>(null);
    const [rdpSessions, setRdpSessions] = useState<RdpSession[]>([]);
    const [passwordAudit, setPasswordAudit] = useState<PasswordAudit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { firewallLogs, isConnected } = useSecuritySocket();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [compliance, rdp, audit] = await Promise.all([
                    securityApi.getCompliance(),
                    securityApi.getRdpSessions(),
                    securityApi.getPasswordAudit()
                ]);
                setComplianceData(compliance);
                setRdpSessions(rdp);
                setPasswordAudit(audit);
            } catch (error) {
                console.error("Failed to fetch security data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const activeThreats = firewallLogs.filter(l => l.action !== 'pass').length;

    const kpis = [
        {
            title: "Security Score",
            value: isLoading ? "..." : `${complianceData?.complianceScore || 0}%`,
            change: "Stable",
            trend: "up" as const,
            icon: "verified_user",
            iconColor: (complianceData?.complianceScore || 0) >= 80 ? "emerald" : "amber" as "emerald" | "amber"
        },
        {
            title: "Active Threats",
            value: activeThreats.toString(),
            change: "Last 24h",
            trend: "down" as const,
            icon: "gpp_maybe",
            iconColor: activeThreats > 0 ? "rose" : "emerald" as "rose" | "emerald"
        },
        {
            title: "RDP Sessions",
            value: isLoading ? "..." : rdpSessions.length.toString(),
            subtitle: "Authorized access",
            icon: "terminal",
            iconColor: "primary"
        },
        {
            title: "Encryption",
            value: isLoading ? "..." : `${passwordAudit?.bcryptHashed || 0}/${passwordAudit?.totalUsers || 0}`,
            subtitle: "BCRYPT Coverage",
            icon: "lock",
            iconColor: "primary"
        }
    ]

    return (
        <DashboardTemplate
            title="Security Center"
            icon="shield_lock"
            kpis={kpis}
        >
            <div className="space-y-8 font-display">
                {/* Security Status Banner */}
                <div className={`p-8 rounded-[32px] border ${activeThreats > 0 ? 'border-rose-500/20 bg-rose-500/10' : 'border-emerald-500/20 bg-emerald-500/10'} flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                        <span className="material-symbols-outlined text-9xl text-white">security_update_good</span>
                    </div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className={`size-20 rounded-3xl ${activeThreats > 0 ? 'bg-rose-500/20' : 'bg-emerald-500/20'} flex items-center justify-center border ${activeThreats > 0 ? 'border-rose-500/30' : 'border-emerald-500/30'} shadow-2xl`}>
                            <span className={`material-symbols-outlined text-4xl font-black ${activeThreats > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {activeThreats > 0 ? 'warning' : 'shield_check'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">
                                {activeThreats > 0 ? 'System Under Attack' : 'Defenses Optimal'}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {activeThreats > 0
                                    ? `${activeThreats} malicious attempts blocked in the last hour.`
                                    : 'AII sensors reporting normal behavior across all perimeters.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <button className="px-8 py-4 bg-white dark:bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                            Review Policy
                        </button>
                        <button className={`px-8 py-4 ${activeThreats > 0 ? 'bg-rose-500' : 'bg-primary'} text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition-all`}>
                            Isolate Network
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live Network Monitoring */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="dashboard-card overflow-hidden">
                            <div className="p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                                <div>
                                    <h3 className="font-black text-xl uppercase tracking-tight">Perimeter Traffic</h3>
                                    <p className="text-sm text-slate-500 font-medium">Real-time socket stream from edge firewalls</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`size-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        {isConnected ? 'Edge Socket Linked' : 'Socket Disconnected'}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-x-auto h-[500px] custom-scrollbar">
                                <table className="w-full text-left border-collapse font-mono">
                                    <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                                        <tr className="border-b border-slate-200 dark:border-white/10">
                                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Source Asset</th>
                                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Protocol</th>
                                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Destination</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {firewallLogs.length > 0 ? firewallLogs.map((log, _i) => (
                                            <tr key={_i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-4 text-[10px] text-slate-500">
                                                    {format(new Date(log.timestamp), 'HH:mm:ss.SSS')}
                                                </td>
                                                <td className="px-8 py-4">
                                                    <Badge className={`${
                                                        log.action === 'pass' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                        'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                    } text-[8px] font-black uppercase px-2 py-0.5 border`}>
                                                        {log.action}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-4 text-[10px] font-bold text-primary">
                                                    {log.srcIP}:{log.srcPort}
                                                </td>
                                                <td className="px-8 py-4 text-[10px] text-slate-400 font-bold uppercase">
                                                    {log.protocol}
                                                </td>
                                                <td className="px-8 py-4 text-[10px] text-slate-500 text-right">
                                                    {log.dstIP}:{log.dstPort}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="p-20 text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                                        <span className="material-symbols-outlined text-6xl animate-pulse">radar</span>
                                                        <p className="text-[10px] font-black uppercase tracking-widest">Scanning network traffic...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Threat Intel Sidebar */}
                    <div className="space-y-8">
                        {/* RDP Monitoring */}
                        <div className="dashboard-card p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-xl uppercase tracking-tight">RDP Sessions</h3>
                                <span className="material-symbols-outlined text-slate-400">person_search</span>
                            </div>
                            <div className="space-y-3">
                                {isLoading ? (
                                    [1,2].map(n => <div key={n} className="h-16 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />)
                                ) : rdpSessions.length > 0 ? rdpSessions.map((session, _i) => (
                                    <div key={_i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between group hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest">{session.username}</p>
                                                <p className="text-[9px] text-slate-500 font-medium">Session ID: {session.id}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-500 text-[8px] font-black uppercase px-2 py-0.5">Active</Badge>
                                    </div>
                                )) : (
                                    <p className="text-center py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">No Active Sessions</p>
                                )}
                            </div>
                        </div>

                        {/* Critical Compliance Audit */}
                        <div className="dashboard-card p-8 bg-slate-900 border-white/5 relative overflow-hidden group">
                           <div className="absolute -top-12 -left-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                               <span className="material-symbols-outlined text-[160px] text-white">fact_check</span>
                           </div>
                           <div className="relative z-10 space-y-6">
                               <div className="flex items-center justify-between">
                                   <h3 className="text-xl font-black text-white uppercase tracking-tight">Policy Audit</h3>
                                   <Badge className="bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase border border-amber-500/30">Action Required</Badge>
                               </div>
                               <div className="space-y-4">
                                   {complianceData?.recommendations?.map((rec, _i) => (
                                       <div key={_i} className="flex gap-4 group/item">
                                           <div className="mt-1 size-1.5 rounded-full bg-amber-500 shrink-0 group-hover/item:scale-150 transition-transform" />
                                           <p className="text-[11px] text-slate-400 font-medium leading-relaxed group-hover/item:text-slate-200 transition-colors">{rec}</p>
                                       </div>
                                   ))}
                               </div>
                               <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all backdrop-blur-md">
                                   Download Full Report
                               </button>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    )
}
