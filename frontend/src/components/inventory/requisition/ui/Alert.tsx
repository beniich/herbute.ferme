import React from 'react';
import { cn } from '@/lib/inventory/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
    children: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    className?: string;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
    children,
    variant = 'info',
    title,
    className,
    onClose
}) => {
    const variants = {
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-900',
            icon: <Info className="h-5 w-5 text-blue-600" />,
        },
        success: {
            container: 'bg-green-50 border-green-200 text-green-900',
            icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
            icon: <AlertCircle className="h-5 w-5 text-green-600" />, // Standardize colors if needed, but keeping for now
        },
        error: {
            container: 'bg-red-50 border-red-200 text-red-900',
            icon: <XCircle className="h-5 w-5 text-red-600" />,
        },
    };

    const config = variants[variant] || variants.info;

    return (
        <div className={cn(
            'border rounded-lg p-4',
            config.container,
            className
        )}>
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    {config.icon}
                </div>
                <div className="flex-1">
                    {title && (
                        <h3 className="font-semibold mb-1 text-sm uppercase tracking-wider">{title}</h3>
                    )}
                    <div className="text-sm italic">{children}</div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <XCircle className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};
