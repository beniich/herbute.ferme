import React from 'react';
import { cn } from '@/lib/inventory/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, icon, ...props }, ref) => {
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
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none z-10">
                            {icon}
                        </div>
                    )}
                    <select
                        ref={ref}
                        className={cn(
                            'w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800',
                            'bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white appearance-none',
                            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                            'disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed',
                            'transition-all duration-200 cursor-pointer pl-4 pr-10',
                            error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
                            icon && 'pl-11',
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined shrink-0 text-xl">expand_more</span>
                    </div>
                </div>
                {error && (
                    <p className="mt-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest italic ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
