'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { 
  LayoutDashboard, 
  BarChart3, 
  Map as MapIcon, 
  CloudSun, 
  Beef, 
  Bird, 
  Navigation, 
  Leaf, 
  Sprout, 
  Flower2, 
  Droplets, 
  Trees, 
  Home, 
  Truck, 
  BookOpen, 
  Wallet, 
  Users, 
  CalendarCheck, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Package, 
  Library, 
  AlertCircle, 
  ThumbsUp, 
  Activity,
  Settings,
  Cpu,
  Ticket,
  Server
} from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navConfig = (t: any): NavSection[] => [
  {
    title: t('sections.pilotage'),
    items: [
      { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: t('overview') },
      { href: '/analytics', icon: <BarChart3 size={18} />, label: 'Analytics & KPIs' },
      { href: '/map', icon: <MapIcon size={18} />, label: t('map') },
      { href: '/iot', icon: <Cpu size={18} />, label: t('iotDashboard') },
      { href: '/meteo', icon: <CloudSun size={18} />, label: t('weather') },
    ],
  },
  {
    title: t('sections.exploitation'),
    items: [
      { href: '/elevage', icon: <Beef size={18} />, label: t('livestock') },
      { href: '/volaille', icon: <Bird size={18} />, label: t('poultry'), badge: '!', badgeColor: 'red' },
      { href: '/parcelles', icon: <Navigation size={18} />, label: t('plots') },
      { href: '/herbes', icon: <Leaf size={18} />, label: t('herbs') },
      { href: '/legumes', icon: <Sprout size={18} />, label: t('vegetables') },
      { href: '/pepiniere', icon: <Flower2 size={18} />, label: t('nursery') },
      { href: '/irrigation', icon: <Droplets size={18} />, label: t('irrigation') },
    ],
  },
  {
    title: t('sections.patrimoine'),
    items: [
      { href: '/foret', icon: <Trees size={18} />, label: t('forestry') },
      { href: '/domaine', icon: <Home size={18} />, label: t('domain') },
      { href: '/fleet', icon: <Truck size={18} />, label: t('fleet') },
    ],
  },
  {
    title: t('sections.adminHr'),
    items: [
      { href: '/teams', icon: <Users size={18} />, label: t('teams') },
      { href: '/roster', icon: <CalendarCheck size={18} />, label: t('hrPlanning') },
      { href: '/tasks', icon: <CheckSquare size={18} />, label: t('tasks') },
      { href: '/planning', icon: <Calendar size={18} />, label: t('calendar') },
      { href: '/messages', icon: <MessageSquare size={18} />, label: t('messages') },
    ],
  },
  {
    title: t('sections.gestion'),
    items: [
      { href: '/comptabilite', icon: <BookOpen size={18} />, label: t('accounting') },
      { href: '/budget', icon: <Wallet size={18} />, label: t('finance') },
      { href: '/reports', icon: <FileText size={18} />, label: t('reports') },
      { href: '/inventory', icon: <Package size={18} />, label: t('inventory') },
      { href: '/knowledge', icon: <Library size={18} />, label: t('knowledgeBase') },
    ],
  },
  {
    title: t('sections.itSupport'),
    items: [
      { href: '/it-admin', icon: <Server size={18} />, label: t('itAdmin') },
      { href: '/it-admin/glpi', icon: <Ticket size={18} />, label: t('glpi') },
      { href: '/complaints', icon: <AlertCircle size={18} />, label: t('reclamations'), badge: '2', badgeColor: 'gold' },
      { href: '/feedback', icon: <ThumbsUp size={18} />, label: t('feedback') },
      { href: '/audit-logs', icon: <Activity size={18} />, label: t('auditLogs') },
      { href: '/settings', icon: <Settings size={18} />, label: t('settings') },
    ],
  },
];

export default function AgroSidebar() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const config = navConfig(t);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/' || pathname?.endsWith('/dashboard');
    }
    return pathname?.includes(path) ? 'active' : '';
  };

  const getBadgeStyle = (color?: string) => {
    if (!color) return {};
    const map: Record<string, string> = {
      red: 'rgba(192,57,43,0.2)',
      gold: 'rgba(200,146,26,0.2)',
      green: 'rgba(90,158,69,0.2)',
      blue: 'rgba(58,122,184,0.2)',
    };
    const textMap: Record<string, string> = {
      red: 'var(--red)',
      gold: 'var(--gold2)',
      green: 'var(--green2)',
      blue: 'var(--blue)',
    };
    return { background: map[color] || map.red, color: textMap[color] || textMap.red };
  };

  return (
    <div className={`sidebar${collapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Collapse toggle */}
      <button
        className="sidebar-collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? t('expand') : t('collapse')}
      >
        {collapsed ? '›' : '‹'}
      </button>

      {config.map((section) => (
        <React.Fragment key={section.title}>
          {!collapsed && (
            <div className="nav-section">{section.title}</div>
          )}
          {section.items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="ni">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="badge" style={getBadgeStyle(item.badgeColor)}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </React.Fragment>
      ))}

      <div className="sidebar-footer">
        {!collapsed ? (
          <div className="sidebar-farm">
            <div className="farm-icon">🏡</div>
            <div>
              <div className="farm-name">Al Baraka</div>
              <div className="farm-type">340 HA · MAROC</div>
            </div>
          </div>
        ) : (
          <div className="sidebar-farm" style={{ justifyContent: 'center' }}>
            <div className="farm-icon">🏡</div>
          </div>
        )}
      </div>
    </div>
  );
}
