import React from 'react';
import { cn } from '@/lib/inventory/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className
}) => {
    const variants = {
        default: 'bg-slate-100 text-slate-800 border-slate-200',
        success: 'bg-green-100 text-green-800 border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        danger: 'bg-red-100 text-red-800 border-red-200',
        info: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px] uppercase font-black tracking-widest',
        md: 'px-2.5 py-1 text-[11px] uppercase font-black tracking-widest',
    };

    return (
        <span className={cn(
            'inline-flex items-center rounded-md border transition-all',
            variants[variant as keyof typeof variants] || variants.default,
            sizes[size as keyof typeof sizes] || sizes.md,
            className
        )}>
            {children}
        </span>
    );
};
