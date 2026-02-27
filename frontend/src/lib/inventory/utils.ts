import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD',
    }).format(amount);
}

export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: fr });
}

export function generateRequisitionId(): string {
    const prefix = 'REQ';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}${random}`;
}

export function getPriorityColor(priority: string): string {
    const colors = {
        low: 'bg-blue-100 text-blue-800 border-blue-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        high: 'bg-orange-100 text-orange-800 border-orange-200',
        urgent: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[priority as keyof typeof colors] || colors.low;
}

export function getStatusColor(status: string): string {
    const colors = {
        draft: 'bg-gray-100 text-gray-800 border-gray-200',
        pending_approval: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200',
        completed: 'bg-blue-100 text-blue-800 border-blue-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
        cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status as keyof typeof colors] || colors.draft;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function calculateDaysUntil(date: Date | string): number {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export function isUrgent(neededBy: Date | string, threshold: number = 3): boolean {
    return calculateDaysUntil(neededBy) <= threshold;
}

export function calculateTotalAmount(items: { quantity: number; unitPrice: number }[]): number {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
}

export function getApprovalThreshold(): {
    autoApprove: number;
    managerApproval: number;
    directorApproval: number
} {
    return {
        autoApprove: 1000,
        managerApproval: 5000,
        directorApproval: 20000,
    };
}

export function determineApprovalLevel(totalAmount: number): 'auto' | 'manager' | 'director' | 'board' {
    const thresholds = getApprovalThreshold();

    if (totalAmount < thresholds.autoApprove) return 'auto';
    if (totalAmount < thresholds.managerApproval) return 'manager';
    if (totalAmount < thresholds.directorApproval) return 'director';
    return 'board';
}
