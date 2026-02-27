import React from 'react';

type Props = {
    children: React.ReactNode;
    className?: string;
};

export const Card = ({ children, className = "" }: Props) => (
    <div
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm ${className}`}
    >
        {children}
    </div>
);
