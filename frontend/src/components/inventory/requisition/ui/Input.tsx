import React from 'react';
import { cn } from '@/lib/inventory/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        {label}
                        {props.required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-800',
                            'bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium',
                            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                            'disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed',
                            'transition-all duration-200',
                            error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
                            icon && 'pl-11',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest italic ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-1">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
