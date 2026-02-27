
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming Button component exists

interface HeaderProps {
    showSearch?: boolean;
    breadcrumbs?: { label: string; href: string }[];
}

export function Header({ showSearch = true, breadcrumbs }: HeaderProps) {
    const { user, logout } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-50">
            {/* Logo & Breadcrumbs */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                        <span className="material-symbols-outlined block">account_balance</span>
                        {/* Note: Ensure Material Symbols are loaded or use Lucide Icon replacement if preferred */}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                            ReclamTrack
                        </h1>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                            Municipal Services
                        </span>
                    </div>
                </div>

                {breadcrumbs && (
                    <nav className="hidden md:flex items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {i > 0 && <span className="text-gray-400">/</span>}
                                <Link
                                    href={crumb.href}
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            </div>
                        ))}
                    </nav>
                )}
            </div>

            {/* Search Bar */}
            {showSearch && (
                <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 w-80 relative">
                    <Search className="text-gray-400 w-4 h-4 absolute left-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-sm w-full pl-8 placeholder:text-gray-400 outline-none"
                        placeholder="Search complaint ID, location..."
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                </button>

                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{user?.role}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-primary" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
