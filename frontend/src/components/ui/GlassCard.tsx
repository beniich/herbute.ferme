'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    accent?: string;
    onClick?: () => void;
    hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className,
    accent,
    onClick,
    hover = true,
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                'relative overflow-hidden rounded-2xl border transition-all duration-300',
                'bg-white/5 backdrop-blur-[20px] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
                hover && 'hover:bg-white/10 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] cursor-pointer',
                className
            )}
        >
            {accent && (
                <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ backgroundColor: accent }}
                />
            )}
            {children}
        </div>
    );
};
