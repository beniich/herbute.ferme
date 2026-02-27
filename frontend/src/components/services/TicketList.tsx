'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Using main project utils
import { formatTimeAgo } from '@/lib/services-utils'; // Using adapted services utils

export interface Ticket {
    id: string;
    number: string;
    subject: string;
    status: 'open' | 'in-progress' | 'waiting' | 'resolved';
    agent: {
        name: string;
        avatar: string;
    };
    lastActivity: Date;
    priority?: 'low' | 'medium' | 'high';
}

interface TicketListProps {
    tickets: Ticket[];
    onSelectTicket?: (ticket: Ticket) => void;
}

const STATUS_CONFIG = {
    open: { color: 'bg-blue-500/10 text-blue-500', label: 'Open' },
    'in-progress': { color: 'bg-blue-500/10 text-blue-500', label: 'In Progress' },
    waiting: { color: 'bg-yellow-500/10 text-yellow-600', label: 'Waiting Response' },
    resolved: { color: 'bg-emerald-500/10 text-emerald-500', label: 'Resolved' },
};

export function TicketList({ tickets, onSelectTicket }: TicketListProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <div className={cn(
            'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800',
            'overflow-hidden'
        )}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className={cn(
                            'bg-slate-50 dark:bg-slate-900/40',
                            'border-b border-slate-200 dark:border-slate-800'
                        )}>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Ticket Details
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Assigned Agent
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Last Activity
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {tickets.map((ticket) => {
                            const isSelected = selectedId === ticket.id;
                            const statusConfig = STATUS_CONFIG[ticket.status];

                            return (
                                <tr
                                    key={ticket.id}
                                    onClick={() => {
                                        setSelectedId(ticket.id);
                                        onSelectTicket?.(ticket);
                                    }}
                                    className={cn(
                                        'cursor-pointer transition-colors group',
                                        'hover:bg-slate-50 dark:hover:bg-primary/5'
                                    )}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                                                {ticket.subject}
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono">
                                                #{ticket.number}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-primary">
                                                    {ticket.agent.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {ticket.agent.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            'px-3 py-1 text-[10px] font-bold uppercase rounded border',
                                            statusConfig.color,
                                            `border-current/20`
                                        )}>
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-slate-500">
                                            {formatTimeAgo(ticket.lastActivity)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <ChevronRight className={cn(
                                            'w-5 h-5 text-slate-400 group-hover:text-primary transition-colors',
                                            isSelected && 'text-primary'
                                        )} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
