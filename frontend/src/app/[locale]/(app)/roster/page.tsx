'use client';

import { useState, useEffect } from 'react';
import { rosterApi, staffApi } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function RosterPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [roster, setRoster] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentWeek, setCurrentWeek] = useState('2024-W43'); // Example week

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffData, rosterData] = await Promise.all([
                    staffApi.getAll(),
                    rosterApi.get({ week: currentWeek }),
                ]);
                setStaff(staffData);
                setRoster(rosterData);
            } catch (error) {
                console.error('Error fetching roster data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentWeek]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
                        <button className="material-symbols-outlined p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300">chevron_left</button>
                        <div className="px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Oct 23 - Oct 29, 2023</div>
                        <button className="material-symbols-outlined p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300">chevron_right</button>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50">Today</button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium shadow-sm">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                        <span className="material-symbols-outlined text-lg">publish</span>
                        Publish Roster
                    </button>
                </div>
            </div>

            {/* Roster Table Container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-r border-slate-200 dark:border-slate-700 min-w-[280px]">
                                    Team Member
                                </th>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                                    <th key={day} className={`px-4 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 ${idx >= 5 ? 'bg-slate-100/50 dark:bg-slate-800/80' : ''}`}>
                                        <div className="text-slate-900 dark:text-white mb-0.5">{day}</div>
                                        <div className="text-[10px]">Oct {23 + idx}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {staff.length > 0 ? (
                                staff.map((member: any) => (
                                    <tr key={member._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 border-r border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                                                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium">{member.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day, i) => {
                                            // Find shift for this member
                                            const shift = roster?.shifts?.find((s: any) =>
                                                (s.staffId._id === member._id) || (s.staffId === member._id)
                                            );
                                            const dayShift = shift?.days?.[day];
                                            const isOff = !dayShift || dayShift.toLowerCase() === 'off';

                                            return (
                                                <td key={day} className="p-2 border-r border-slate-100 dark:border-slate-800">
                                                    <div className={`
                                                        border rounded-lg p-2 text-center min-h-[40px] text-xs font-medium flex items-center justify-center
                                                        ${isOff
                                                            ? 'bg-slate-50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 text-slate-400'
                                                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                                        }
                                                    `}>
                                                        {isOff ? 'OFF' : dayShift}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                        No staff members found. Add staff to begin scheduling.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{roster?.shifts?.length || 0}</div>
                        <div className="text-sm text-slate-500 font-medium">Confirmed Shifts</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">pending_actions</span>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-slate-500 font-medium">Pending Leave Requests</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">groups</span>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{staff.length}</div>
                        <div className="text-sm text-slate-500 font-medium">Total Staff</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
