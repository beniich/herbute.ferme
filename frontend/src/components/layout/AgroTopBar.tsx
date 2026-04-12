'use client';

import React, { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useOrgStore } from '@/store/orgStore';
import { 
  Bell, 
  Plus, 
  ChevronRight, 
  Sprout, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { CurrencySelector } from '@/components/ui/CurrencySelector';

const getRouteLabels = (t: any): Record<string, string> => ({
  '/dashboard': t('overview'),
  '/analytics': 'Analytics & KPIs',
  '/map': t('map'),
  '/meteo': t('weather'),
  '/elevage': t('livestock'),
  '/volaille': t('poultry'),
  '/parcelles': t('plots'),
  '/herbes': t('herbs'),
  '/legumes': t('vegetables'),
  '/pepiniere': t('nursery'),
  '/irrigation': t('irrigation'),
  '/foret': t('forestry'),
  '/domaine': t('domain'),
  '/fleet': t('fleet'),
  '/comptabilite': t('accounting'),
  '/budget': t('finance'),
  '/teams': t('teams'),
  '/roster': t('hrPlanning'),
  '/tasks': t('tasks'),
  '/planning': t('calendar'),
  '/messages': t('messages'),
  '/reports': t('reports'),
  '/inventory': t('inventory'),
  '/knowledge': t('knowledgeBase'),
  '/complaints': t('reclamations'),
  '/feedback': t('feedback'),
  '/audit-logs': t('auditLogs'),
  '/settings': t('settings'),
  '/it-admin': t('itAdmin'),
  '/admin': 'Administration',
  '/super-admin': 'Super Admin',
  '/citizen': 'Citizens',
  '/technician': 'Technicians',
});

export default function AgroTopBar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const { user, logout } = useAuth();
  const { activeOrganization } = useOrgStore();
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routeLabels = getRouteLabels(t);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
  }, [locale]);

  const getBreadcrumb = () => {
    if (!pathname) return t('overview');
    const segments = pathname.split('/').filter(Boolean);
    for (let i = segments.length - 1; i >= 0; i--) {
      const key = '/' + segments[i];
      if (routeLabels[key]) return routeLabels[key];
    }
    return t('overview');
  };

  const userInitials = user
    ? `${user.prenom ? user.prenom[0] : ''}${user.nom ? user.nom[0] : ''}`.toUpperCase()
    : 'A';

  return (
    <div className="topbar glass-effect" style={{
      height: '64px',
      background: 'var(--glass)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      gap: '12px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div className="logo-icon" style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--green), var(--green2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0
        }}>
          <Sprout size={18} />
        </div>
        <div className="hidden sm:block">
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.02em' }}>AgroMaître</div>
          <div style={{ fontSize: '9px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('domain')}</div>
        </div>
      </div>

      {/* Breadcrumb — hidden on small screens */}
      <div className="hidden md:flex" style={{ alignItems: 'center', gap: '6px', fontSize: '13px', flex: 1, overflow: 'hidden' }}>
        <Link href="/dashboard" style={{ color: 'var(--text3)', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
          {activeOrganization?.name || 'AgroMaître'}
        </Link>
        <ChevronRight size={13} style={{ color: 'var(--text3)', flexShrink: 0 }} />
        <span id="breadcrumb" style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getBreadcrumb()}</span>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Date — desktop only */}
        <div className="hidden lg:block" style={{ fontSize: '12px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{currentDate}</div>

        {/* Currency Selector */}
        <CurrencySelector compact />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Link href="/complaints" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ 
            cursor: 'pointer', padding: '7px', borderRadius: '8px',
            background: 'var(--bg3)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'var(--text2)', position: 'relative'
          }}>
            <Bell size={17} />
            <span style={{
              position: 'absolute', top: '-3px', right: '-3px',
              width: '15px', height: '15px',
              background: 'var(--red)', border: '2px solid var(--bg)',
              borderRadius: '50%', fontSize: '9px', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
            }}>2</span>
          </div>
        </Link>

        {/* User / Logout */}
        <div
          className="hidden sm:flex"
          onClick={logout}
          style={{
            alignItems: 'center', gap: '8px',
            padding: '4px 10px 4px 4px', borderRadius: '24px',
            background: 'var(--bg3)', cursor: 'pointer',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #215E61, #0a1a1b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: '700', color: 'white'
          }}>
            {userInitials}
          </div>
          <span className="hidden md:inline" style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: '500', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.prenom || 'Admin'}
          </span>
          <LogOut size={13} style={{ color: 'var(--text3)' }} />
        </div>

        {/* Quick Task button — desktop */}
        <Link href="/tasks" style={{ textDecoration: 'none' }} className="hidden lg:block">
          <button style={{
            padding: '7px 14px', borderRadius: '8px',
            background: 'var(--gold)', color: 'white',
            fontSize: '12px', fontWeight: '700', border: 'none',
            display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            <Plus size={14} />
            <span>{t('task')}</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
