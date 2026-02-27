import React from 'react';
import { cn } from '@/lib/inventory/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        icon,
        children,
        disabled,
        ...props
    }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px]';

        const variants = {
            primary: 'bg-primary text-white hover:bg-blue-700 focus:ring-primary/50 shadow-lg shadow-primary/20',
            secondary: 'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500 shadow-lg shadow-slate-900/20',
            outline: 'border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary/50',
            ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-600/20',
        };

        const sizes = {
            sm: 'px-4 py-2',
            md: 'px-6 py-3',
            lg: 'px-8 py-4 text-xs',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    baseStyles,
                    variants[variant] || variants.primary,
                    sizes[size] || sizes.md,
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>CHARGEMENT...</span>
                    </>
                ) : (
                    <>
                        {icon && <span className="inline-flex">{icon}</span>}
                        {children}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
