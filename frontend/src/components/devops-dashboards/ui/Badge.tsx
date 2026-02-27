import React from 'react';

type Props = {
    children: React.ReactNode;
    variant?: "primary" | "success" | "danger" | "warning" | "neutral";
    className?: string;
};

export const Badge = ({
    children,
    variant = "primary",
    className = "",
}: Props) => {
    const base = "px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider";
    const variants = {
        primary: "bg-primary/10 text-primary border border-primary/20",
        success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20",
        warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
        neutral: "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700",
    };
    return (
        <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>
    );
};
