'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Using main project utils

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
    closeButton?: boolean;
}

const SIZE_CONFIG = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    closeButton = true,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm" // Changed background-dark to black/50 for compatibility
                onClick={onClose}
            />

            {/* Modal */}
            <div className={cn(
                'relative w-full mx-4 bg-white dark:bg-slate-900 rounded-xl', // Changed surface-dark to slate-900
                'border border-slate-200 dark:border-slate-800 shadow-2xl',
                'transform transition-all',
                SIZE_CONFIG[size]
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold">{title}</h2>
                        {description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    {closeButton && (
                        <button
                            onClick={onClose}
                            className={cn(
                                'p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg',
                                'transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            )}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
