"use client";

import { useState } from "react";
import LogRow from "./LogRow";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function LogTable() {
    const [page, setPage] = useState(1);
    const { logs, pagination, isLoading } = useAuditLogs(page);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
                <LoadingSpinner />
                <p className="text-slate-500 italic mt-4">Synchronizing audit trails...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                                Operator
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                                Action
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                                Target
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                                Intervention Details
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                                Time
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-right"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.length > 0 ? (
                            logs.map((entry) => (
                                <LogRow key={entry._id} entry={entry} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                                    No audit logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold italic">
                    Showing {logs.length} events (Page {pagination?.page || 1} of {pagination?.pages || 1})
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(p => (pagination && p < pagination.pages ? p + 1 : p))}
                        disabled={!pagination || page >= pagination.pages}
                        className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                    >
                        Next Page
                    </button>
                </div>
            </div>
        </div>
    );
}
