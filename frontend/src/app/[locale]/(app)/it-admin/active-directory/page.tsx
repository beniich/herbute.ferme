'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { CheckCircle, FileText, RefreshCw, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ADStatus {
  status: 'connected' | 'disconnected';
  message: string;
}

interface ADLog {
  _id: string;
  syncType: string;
  action: string;
  totalProcessed: number;
  successful: number;
  failed: number;
  createdAt: string;
}

export default function ActiveDirectoryPage() {
  const [status, setStatus] = useState<ADStatus | null>(null);
  const [logs, setLogs] = useState<ADLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statusRes, logsRes] = await Promise.all([
        api.get('/api/ad/status').catch(err => ({ data: { status: 'disconnected', message: err.response?.data?.error || 'Failed to connect' } })),
        api.get('/api/ad/logs')
      ]);

      setStatus(statusRes.data);
      setLogs(logsRes.data.logs || []);
    } catch (error) {
      console.error('Failed to load AD data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await api.post('/api/ad/sync');
      toast.success(`Sync finished: ${res.data.imported} imported, ${res.data.updated} updated`);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Active Directory</h1>
          <p className="text-gray-600 mt-1">Manage AD synchronization and users</p>
        </div>
        <Button onClick={handleSync} disabled={syncing || status?.status !== 'connected'}>
          <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      {/* Connection Status */}
      <Card className={`${status?.status === 'connected' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-4 flex items-center gap-3">
          {status?.status === 'connected' ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
          <div>
            <h3 className={`font-medium ${status?.status === 'connected' ? 'text-green-900' : 'text-red-900'}`}>
              {status?.status === 'connected' ? 'Connected to Active Directory' : 'Disconnected'}
            </h3>
            <p className={`text-sm ${status?.status === 'connected' ? 'text-green-700' : 'text-red-700'}`}>
              {status?.message}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              User Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">View users imported from Active Directory.</p>
            <Button variant="outline" className="w-full">View AD Users</Button>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
               Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-gray-500">URL:</span>
                 <span className="font-mono">ldaps://localhost:636</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Base DN:</span>
                 <span className="font-mono">dc=example,dc=com</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Username:</span>
                 <span className="font-mono">admin@example.com</span>
               </div>
            </div>
            <Button variant="outline" className="w-full mt-4">Edit Configuration</Button>
          </CardContent>
        </Card>
      </div>

      {/* Sync Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Synchronization Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Changes</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log._id} className="border-b">
                      <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 capitalize">{log.syncType}</td>
                      <td className="px-4 py-3">
                         <span className={`px-2 py-1 rounded-full text-xs ${
                           log.action === 'error' ? 'bg-red-100 text-red-800' :
                           log.failed > 0 ? 'bg-yellow-100 text-yellow-800' :
                           'bg-green-100 text-green-800'
                         }`}>
                           {log.action === 'error' ? 'Failed' : 'Success'}
                         </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {log.successful} processed, {log.failed} failed
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No synchronization logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
