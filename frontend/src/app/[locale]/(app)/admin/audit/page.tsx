'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Download,
    Filter,
    RefreshCw,
    Search,
    Shield,
    Users
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface AuditLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  targetId?: string;
  targetType?: string;
  details: any;
  ipAddress: string;
  timestamp: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/audit-logs?limit=100');
      setLogs(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        log.userId?.name.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(search.toLowerCase()));
      const matchesAction = filterAction === 'ALL' || log.action === filterAction;
      return matchesSearch && matchesAction;
    });
  }, [logs, search, filterAction]);

  const getActionStyles = (action: string) => {
    if (action.includes('CREATE')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (action.includes('UPDATE')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background-dark">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">AuditGuard</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">System Traceability</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" onClick={loadLogs}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
           </Button>
           <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
           </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Audit Trails & Activity</h2>
           <p className="text-slate-500 font-medium text-lg">Immutable history of all system modifications and administrative actions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-white dark:bg-slate-900 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800">
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Logs</p>
                    <p className="text-3xl font-black mt-1">{logs.length}</p>
                  </div>
                  <Activity className="size-10 text-primary opacity-20" />
               </div>
             </CardContent>
           </Card>
           <Card className="bg-white dark:bg-slate-900 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 border-l-4 border-l-red-500">
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Deletions</p>
                    <p className="text-3xl font-black mt-1">{logs.filter(l => l.action.includes('DELETE')).length}</p>
                  </div>
                  <AlertCircle className="size-10 text-red-500 opacity-20" />
               </div>
             </CardContent>
           </Card>
           <Card className="bg-white dark:bg-slate-900 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 border-l-4 border-l-emerald-500">
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Creations</p>
                    <p className="text-3xl font-black mt-1">{logs.filter(l => l.action.includes('CREATE')).length}</p>
                  </div>
                  <CheckCircle className="size-10 text-emerald-500 opacity-20" />
               </div>
             </CardContent>
           </Card>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <Input
                placeholder="Search logs by operator, action or data..."
                className="pl-10 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold"
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                  >
                    <option value="ALL">All Actions</option>
                    <option value="LOGIN">Logins</option>
                    <option value="EXECUTE_POWERSHELL">PowerShell</option>
                    <option value="CREATE_SECRET">Secret Vault</option>
                    <option value="DELETE">Deletions</option>
                  </select>
               </div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Operator</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Action</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Details</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold italic animate-pulse">Syncing encrypted audit stream...</td>
                  </tr>
                ) : filteredLogs.length > 0 ? filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg text-primary">
                             <Users className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="font-bold text-sm">{log.userId?.name || 'System'}</p>
                             <p className="text-[10px] text-slate-500 font-mono">{log.ipAddress}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-tighter ${getActionStyles(log.action)}`}>
                          {log.action}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{log.targetType || 'SYSTEM'}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{log.targetId || '-'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-md">
                          {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                       </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold">{new Date(log.timestamp).toLocaleDateString()}</span>
                          <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-500">No logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
