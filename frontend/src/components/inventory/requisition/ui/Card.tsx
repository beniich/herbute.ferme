import React from 'react';
import { cn } from '@/lib/inventory/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    title,
    description,
    icon,
    actions
}) => {
    return (
        <div className={cn(
            'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-300',
            className
        )}>
            {(title || icon || actions) && (
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="bg-primary/5 p-2 rounded-xl text-primary">
                                    {icon}
                                </div>
                            )}
                            <div>
                                {title && (
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                                        {title}
                                    </h3>
                                )}
                                {description && (
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                        {actions && (
                            <div className="flex items-center gap-2">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="p-6 lg:p-8">
                {children}
            </div>
        </div>
    );
};
