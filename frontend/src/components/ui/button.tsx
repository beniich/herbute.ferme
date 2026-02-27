import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'default'
    size?: 'sm' | 'md' | 'lg' | 'icon' | 'default'
    children: ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-semibold rounded-lg transition-all flex items-center gap-2'

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
        secondary: 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
        default: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20', // Explicit default mapping to primary
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-2.5 text-base',
        icon: 'p-2',
        default: 'px-4 py-2 text-sm', // Mapping default to md
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
