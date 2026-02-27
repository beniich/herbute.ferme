'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Using main project utils

export type StatusVariant =
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'primary';

interface StatusBadgeProps {
    variant: StatusVariant;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const VARIANTS = {
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    primary: 'bg-primary/10 text-primary border-primary/20',
};

const SIZES = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
};

export function StatusBadge({
    variant,
    children,
    size = 'md',
}: StatusBadgeProps) {
    return (
        <span className={cn(
            'font-bold uppercase rounded border inline-block',
            VARIANTS[variant],
            SIZES[size]
        )}>
            {children}
        </span>
    );
}
