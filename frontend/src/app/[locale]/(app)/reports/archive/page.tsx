'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { 
    Database, Download, Archive, Filter, RefreshCw, 
    FileText, Calendar, Lock, AlertTriangle, ChartPie 
} from 'lucide-react';

export default function ReportingAndArchivingPage() {
    const [isArchiving, setIsArchiving] = useState(false);

    // Mock Data for the Archives
    const archiveRecords = [
        { id: 'ARC-2025', date: '2025-12-31', type: 'Yearly Complete', size: '2.4 GB', status: 'Sealed', author: 'System' },
        { id: 'ARC-Q3-25', date: '2025-09-30', type: 'Quarterly Sync', size: '650 MB', status: 'Available', author: 'Auto' },
        { id: 'ARC-Q2-25', date: '2025-06-30', type: 'Quarterly Sync', size: '710 MB', status: 'Available', author: 'Auto' },
        { id: 'ARC-Q1-25', date: '2025-03-31', type: 'Quarterly Sync', size: '580 MB', status: 'Available', author: 'Admin' },
        { id: 'ARC-2024', date: '2024-12-31', type: 'Yearly Complete', size: '1.9 GB', status: 'Encrypted', author: 'System' },
    ];

    const columns = [
        {
            key: 'id',
            label: 'Archive ID',
            sortable: true,
            render: (_: any, row: any) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.id}</span>
        },
        {
            key: 'date',
            label: 'Cut-off Date',
            sortable: true,
        },
        {
            key: 'type',
            label: 'Archive Type',
            sortable: true,
            render: (_: any, row: any) => (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Database className="w-4 h-4" />
                    {row.type}
                </div>
            )
        },
        {
            key: 'size',
            label: 'Size',
        },
        {
            key: 'status',
            label: 'Status',
            render: (_: any, row: any) => (
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    row.status === 'Sealed' || row.status === 'Encrypted' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                }`}>
                    {row.status === 'Encrypted' && <Lock className="inline-block w-3 h-3 mr-1" />}
                    {row.status}
                </span>
            )
        },
        {
            key: 'author',
            label: 'Triggered By',
            render: (_: any, row: any) => <span className="text-slate-500 font-mono text-xs">{row.author}</span>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: () => (
                <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700 font-bold bg-primary/5 hover:bg-primary/10">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                </Button>
            )
        }
    ];

    const handleManualArchive = () => {
        setIsArchiving(true);
        setTimeout(() => setIsArchiving(false), 2000);
    };

    return (
        <div className="flex flex-col flex-1 w-full px-4 md:px-8 py-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 uppercase tracking-widest border border-purple-200 dark:border-purple-800">
                            System Administration
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Reporting & Data Archiving
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl leading-relaxed">
                        Generate official compliance reports, manage long-term offline storage, and comply with standard legal data retention policies.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <RefreshCw className="w-4 h-4 mr-2 text-slate-500" />
                        Sync Analytics
                    </Button>
                    <Button onClick={handleManualArchive} disabled={isArchiving} className="font-bold bg-primary hover:bg-blue-700 text-white shadow-lg shadow-primary/20 transition-all">
                        {isArchiving ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Archive className="w-4 h-4 mr-2" />
                        )}
                        {isArchiving ? 'Archiving...' : 'Run Manual Archive'}
                    </Button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Storage Used</CardTitle>
                        <Database className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">45.8 GB</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">out of 500 GB</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Total Archives</CardTitle>
                        <Archive className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">12</div>
                        <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"/> Validated Hashes
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Generated Reports</CardTitle>
                        <FileText className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">3,042</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">This Year</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 dark:bg-slate-950 text-white border-transparent">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-400 uppercase">Next Scheduled Job</CardTitle>
                        <Calendar className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">2 Days</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Quarterly DB Snapshot</div>
                    </CardContent>
                </Card>
            </div>

            {/* Reporting Features & Archive Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Reports Generation Block */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="bg-primary/5 p-4 border-b border-primary/10">
                            <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <ChartPie className="w-5 h-5 text-primary" />
                                Custom Reports
                            </h3>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Report Template</label>
                                <select className="w-full text-sm font-medium border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:ring-primary h-10 px-3 border outline-none cursor-pointer">
                                    <option>Operational Performance (Monthly)</option>
                                    <option>Financial Audit (Quarterly)</option>
                                    <option>Fleet Maintenance Ledger</option>
                                    <option>IT Helpdesk SLA Tracking</option>
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Start Date</label>
                                    <input type="date" className="w-full text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 border outline-none" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">End Date</label>
                                    <input type="date" className="w-full text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 border outline-none" />
                                </div>
                            </div>

                            <Button className="w-full mt-2 font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transiton-colors">
                                <FileText className="w-4 h-4 mr-2" /> Generate PDF
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-xl border border-amber-200 dark:border-amber-800/50">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                            <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-500">Legal Compliance Policy</h4>
                                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                    Under data protection laws, all citizen-related complaint archives older than 5 years must be anonymized. The system handles this automatically on the 1st of January.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Archive Table Block */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white">Historical Archives</h3>
                        <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-bold">
                            <Filter className="w-3 h-3" /> Filter Results
                        </Button>
                    </div>

                    <DataTable 
                        columns={columns} 
                        data={archiveRecords} 
                        pagination={true} 
                        pageSize={10}
                    />
                </div>
            </div>
        </div>
    );
}
