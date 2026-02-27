
'use client';

import { RequisitionStatus } from '@/lib/workflows/requisition-workflow';
import {
    Clock,
    Eye,
    CheckCircle,
    XCircle,
    Package,
    Truck,
    Ban,
    FileEdit
} from 'lucide-react';

interface StatusBadgeProps {
    status: RequisitionStatus;
    size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG = {
    [RequisitionStatus.DRAFT]: {
        label: 'Brouillon',
        icon: FileEdit,
        color: 'bg-slate-100 text-slate-700',
    },
    [RequisitionStatus.PENDING]: {
        label: 'En attente',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700',
    },
    [RequisitionStatus.REVIEWED]: {
        label: 'Examinée',
        icon: Eye,
        color: 'bg-blue-100 text-blue-700',
    },
    [RequisitionStatus.APPROVED]: {
        label: 'Approuvée',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700',
    },
    [RequisitionStatus.REJECTED]: {
        label: 'Rejetée',
        icon: XCircle,
        color: 'bg-red-100 text-red-700',
    },
    [RequisitionStatus.IN_PREPARATION]: {
        label: 'En préparation',
        icon: Package,
        color: 'bg-purple-100 text-purple-700',
    },
    [RequisitionStatus.READY]: {
        label: 'Prête',
        icon: Truck,
        color: 'bg-emerald-100 text-emerald-700',
    },
    [RequisitionStatus.DELIVERED]: {
        label: 'Livrée',
        icon: CheckCircle,
        color: 'bg-teal-100 text-teal-700',
    },
    [RequisitionStatus.CANCELLED]: {
        label: 'Annulée',
        icon: Ban,
        color: 'bg-gray-100 text-gray-700',
    },
};

export function RequisitionStatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${config.color} ${sizeClasses[size]}`}>
            <Icon className="w-4 h-4" />
            {config.label}
        </span>
    );
}
