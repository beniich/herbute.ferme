'use client'

import DashboardTemplate from '@/components/devops-dashboards/shared/DashboardTemplate'
import { Badge } from "@/components/ui/badge"

export default function SSLManagerDashboard() {
  const kpis = [
    {
      title: 'Total Certificates',
      value: '128',
      change: '+5.2%',
      trend: 'up' as const,
      icon: 'verified_user',
      iconColor: 'primary'
    },
    {
      title: 'Expiring Soon',
      value: '12',
      subtitle: 'Critical',
      icon: 'alarm',
      iconColor: 'amber'
    },
    {
      title: 'Active/Healthy',
      value: '116',
      change: '90.6%',
      trend: 'neutral' as const,
      icon: 'check_circle',
      iconColor: 'green'
    },
    {
      title: 'Auto-Renewal',
      value: '94%',
      change: '+12%',
      trend: 'up' as const,
      icon: 'sync',
      iconColor: 'primary'
    }
  ]

  return (
    <DashboardTemplate
      title="SSL Manager"
      icon="shield_lock"
      kpis={kpis}
    >
      <div className="space-y-8 font-display">
        {/* Critical Alert Banner - Ultra Vibrant */}
        <div className="p-6 rounded-[32px] border border-rose-500/20 bg-rose-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-rose-500">priority_high</span>
            </div>
            <div className="flex items-center gap-6 relative z-10">
                <div className="size-14 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/40 animate-pulse">
                    <span className="material-symbols-outlined text-white text-3xl font-black">emergency</span>
                </div>
                <div>
                    <h3 className="font-black text-xl text-rose-500 uppercase tracking-tight">Critical Expiration Alert</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                        7 Certificates expiring within 7 days. Production services at risk.
                    </p>
                </div>
            </div>
            <button className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-500/30 hover:scale-[1.05] active:scale-95 transition-all relative z-10">
                Renew All Critical
            </button>
        </div>

        {/* Certificates Table - Glassmorphism */}
        <div className="dashboard-card overflow-hidden">
          <div className="p-8 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h3 className="font-black text-xl uppercase tracking-tight">Managed Domains</h3>
                <p className="text-sm text-slate-500 font-medium">Real-time certificate health & chain validation</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                Discovery Scan
              </button>
              <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                Add Domain
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Domain & Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Issuer Info</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Health / TTL</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Auto-Renew</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {/* Row 1 - Healthy */}
                <tr className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <span className="material-symbols-outlined text-emerald-500 text-xl font-black">verified</span>
                      </div>
                      <div>
                        <p className="font-black text-md tracking-tight">api.cloudinfra.io</p>
                        <Badge className="bg-emerald-500 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 mt-1">
                          TRUSTED
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold">DigiCert Global CA</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">SERIAL: 4x992...a3</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2 w-48">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>242 days left</span>
                        <span className="text-emerald-500">82%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined">settings</span>
                    </button>
                  </td>
                </tr>

                {/* Row 2 - Critical */}
                <tr className="group hover:bg-rose-500/5 transition-colors bg-rose-500/[0.02]">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <span className="material-symbols-outlined text-rose-500 text-xl font-black">warning</span>
                      </div>
                      <div>
                        <p className="font-black text-md tracking-tight">legacy-portal.net</p>
                        <Badge className="bg-rose-500 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 mt-1">
                          CRITICAL
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-rose-500">Let&apos;s Encrypt R3</div>
                    <div className="text-[10px] text-rose-500/60 font-mono mt-1">SERIAL: 1z220...f1</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2 w-48">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-rose-500">
                        <span>4 days left</span>
                        <span>2%</span>
                      </div>
                      <div className="h-2 w-full bg-rose-500/10 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]" style={{ width: '2%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manual</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 opacity-0 group-hover:opacity-100 transition-all">
                      Fix Now
                    </button>
                  </td>
                </tr>

                {/* Row 3 - Warning */}
                <tr className="group hover:bg-amber-500/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <span className="material-symbols-outlined text-amber-500 text-xl font-black">schedule</span>
                      </div>
                      <div>
                        <p className="font-black text-md tracking-tight">*.internal.systems</p>
                        <Badge className="bg-amber-500 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 mt-1">
                          EXPIRING
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold">Sectigo RSA Domain</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">SERIAL: 8v101...b8</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2 w-48">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-amber-500">
                        <span>28 days left</span>
                        <span>14%</span>
                      </div>
                      <div className="h-2 w-full bg-amber-500/10 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ width: '14%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined">settings</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Domain Coverage & Quick Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 dashboard-card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-xl uppercase tracking-tight">Domain Coverage Map</h3>
                <p className="text-sm text-slate-500 font-medium">Infrastructure-wide certificate deployment status</p>
              </div>
              <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Scan All Assets</button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Production Subdomains', current: 42, total: 42, color: 'bg-emerald-500' },
                { label: 'Staging & QA Environments', current: 18, total: 24, color: 'bg-amber-500' },
                { label: 'Marketing Campaign TLDs', current: 5, total: 12, color: 'bg-rose-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-slate-500">{item.current}/{item.total} Protected</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${(item.current/item.total)*100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="dashboard-card p-8 bg-primary/5 border-primary/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-8xl text-primary">bolt</span>
              </div>
              <h3 className="font-black text-xl text-primary uppercase tracking-tight mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3 relative z-10">
                {[
                  { label: 'Generate CSR', icon: 'description' },
                  { label: 'Certificate Discovery', icon: 'sensors' },
                  { label: 'Compliance Report', icon: 'verified' },
                  { label: 'Bulk Import', icon: 'file_upload' }
                ].map((action, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-primary/10 hover:border-primary/40 hover:scale-[1.02] active:scale-95 transition-all text-left shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">{action.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-sm text-primary">chevron_right</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="dashboard-card p-6 bg-slate-900 border-white/5 text-white/40 font-mono text-[10px] leading-relaxed">
                <div className="flex items-center gap-2 mb-4 text-emerald-500">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-bold uppercase tracking-widest">Watcher Log</span>
                </div>
                <div>[14:22:01] Scan started: 154 endpoints</div>
                <div>[14:22:05] api.cloudinfra.io: OK (242d remaining)</div>
                <div className="text-rose-500">[14:22:08] legacy-portal.net: CRITICAL (4d)</div>
                <div>[14:22:12] Scan complete. 1 warning found.</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  )
}
