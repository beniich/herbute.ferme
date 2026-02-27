import { cn, getTailwindStatusColor } from '@/lib/utils'
import type { StatusIndicatorProps } from '@/types/dashboard-v2'

export function StatusIndicator({
    status,
    label,
    size = 'md',
    animated = false,
}: StatusIndicatorProps) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
    }

    const dotSizeClasses = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider border',
                getTailwindStatusColor(status),
                sizeClasses[size]
            )}
        >
            <span
                className={cn(
                    'rounded-full',
                    dotSizeClasses[size],
                    animated && 'animate-pulse'
                )}
                style={{
                    backgroundColor: 'currentColor',
                }}
            />
            {label}
        </span>
    )
}
