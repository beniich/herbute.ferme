'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: 'English',   flag: '🇬🇧', dir: 'ltr' },
    { code: 'fr', label: 'Français',  flag: '🇫🇷', dir: 'ltr' },
    { code: 'ar', label: 'العربية',  flag: '🇲🇦', dir: 'rtl' },
    { code: 'es', label: 'Español',   flag: '🇪🇸', dir: 'ltr' },
    { code: 'pt', label: 'Português', flag: '🇵🇹', dir: 'ltr' },
    { code: 'de', label: 'Deutsch',   flag: '🇩🇪', dir: 'ltr' },
    { code: 'tr', label: 'Türkçe',   flag: '🇹🇷', dir: 'ltr' },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const switchTo = (code: string) => {
        router.replace(pathname, { locale: code });
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[var(--border)] hover:border-[var(--green)] bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-300 group"
                aria-label="Select Language"
            >
                <Globe size={14} className="text-[var(--green)] group-hover:rotate-12 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text3)] group-hover:text-[var(--green)] transition-colors">
                    {current.flag} {current.code.toUpperCase()}
                </span>
                <ChevronDown
                    size={12}
                    className={`text-[var(--text3)] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-2xl border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden z-[200]">
                    <div className="p-2">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => switchTo(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                                    locale === lang.code
                                        ? 'bg-[var(--green)] text-white'
                                        : 'hover:bg-[var(--bg)] text-[var(--text3)] hover:text-[var(--text)]'
                                }`}
                            >
                                <span className="text-lg leading-none">{lang.flag}</span>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{lang.label}</span>
                                {locale === lang.code && (
                                    <span className="ml-auto text-[9px] font-black tracking-widest opacity-70">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
