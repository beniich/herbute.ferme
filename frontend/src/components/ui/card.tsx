import { ReactNode } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    className?: string
    header?: ReactNode
    footer?: ReactNode
}

export function Card({ children, className = '', header, footer, ...props }: CardProps) {
    const isOpinionated = header || footer;
    return (
        <div className={`bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden ${className}`} {...props}>
            {header && (
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    {header}
                </div>
            )}
            <div className={isOpinionated ? "p-6" : ""}>{children}</div>
            {footer && (
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    {footer}
                </div>
            )}
        </div>
    )
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col space-y-1.5 ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props}>
            {children}
        </h3>
    )
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`} {...props}>
            {children}
        </p>
    )
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center ${className}`} {...props}>
            {children}
        </div>
    )
}
