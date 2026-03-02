
'use client';

import { cn } from '@/lib/utils';
import {
    BarChart3,
    Calendar,
    FileText,
    HelpCircle,
    LayoutDashboard,
    Map,
    Package,
    Settings,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
}

const menuItems: MenuItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'Complaints',
        href: '/complaints',
        icon: FileText,
        badge: '12',
    },
    {
        label: 'Teams',
        href: '/teams',
        icon: Users,
    },
    {
        label: 'Planning',
        href: '/planning',
        icon: Calendar,
    },
    {
        label: 'Maps',
        href: '/maps',
        icon: Map,
    },
    {
        label: 'Inventory',
        href: '/inventory',
        icon: Package,
    },
    {
        label: 'Satisfaction',
        href: '/feedback/satisfaction',
        icon: BarChart3,
    },
    {
        label: 'Audit Logs',
        href: '/audit-logs',
        icon: FileText,
    },
    {
        label: 'Roster',
        href: '/roster',
        icon: Users,
    },
    {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside 
            className="flex flex-col h-[calc(100vh-56px)] sticky top-[56px] hidden lg:flex transition-all duration-300 group/sidebar z-40 sidebar"
            style={{ 
                width: '64px',
                borderLeft: '1px solid var(--border)',
                fontFamily: 'var(--font-body)',
                overflowX: 'hidden'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.width = '240px'; }}
            onMouseLeave={(e) => { e.currentTarget.style.width = '64px'; }}
        >
            <nav className="flex-1 space-y-1 p-2 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--bg3) transparent' }}>
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "nav-item mb-2", 
                                isActive && "active"
                            )}
                        >
                            <div className="ni">
                                <Icon style={{ width: '18px', height: '18px' }} />
                            </div>
                            <span className="nav-label opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                                {item.label}
                            </span>
                            {item.badge && (
                                <span className="badge opacity-0 group-hover/sidebar:opacity-100">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* System Status Footer */}
            <div className="p-3 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="p-2 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--green2)' }}></span>
                        <p className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
                            Système Actif
                        </p>
                    </div>
                </div>

                <button className="w-full mt-3 flex items-center gap-3 px-3 transition-colors" style={{ color: 'var(--text3)', fontSize: '13px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text2)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text3)'}
                >
                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity whitespace-nowrap">Aide & Support</span>
                </button>
            </div>
        </aside>
    );
}
