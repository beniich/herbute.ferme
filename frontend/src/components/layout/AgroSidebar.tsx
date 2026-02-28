'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navConfig: NavSection[] = [
  {
    title: 'Tableau de Bord',
    items: [
      { href: '/dashboard', icon: '🏠', label: 'Vue Générale' },
      { href: '/analytics', icon: '📊', label: 'Analytics & KPIs' },
      { href: '/map', icon: '🗺️', label: 'Carte Interactive' },
      { href: '/meteo', icon: '🌤️', label: 'Météo & Environnement' },
    ],
  },
  {
    title: 'Élevage & Volaille',
    items: [
      { href: '/elevage', icon: '🐄', label: 'Élevage Bovin/Ovin' },
      { href: '/volaille', icon: '🐓', label: 'Ferme Avicole', badge: '!', badgeColor: 'red' },
    ],
  },
  {
    title: 'Cultures & Terres',
    items: [
      { href: '/parcelles', icon: '🗺️', label: 'Parcelles & Cultures' },
      { href: '/herbes', icon: '🌿', label: 'Herbes & Aromates' },
      { href: '/legumes', icon: '🥕', label: 'Légumes & Fruits' },
      { href: '/pepiniere', icon: '🪴', label: 'Pépinière' },
      { href: '/irrigation', icon: '💧', label: 'Irrigation & Eau' },
    ],
  },
  {
    title: 'Forêt & Domaine',
    items: [
      { href: '/foret', icon: '🌲', label: 'Gestion Forestière' },
      { href: '/domaine', icon: '🏡', label: 'Domaine & Infrastructure' },
      { href: '/fleet', icon: '🚜', label: 'Équipements & Flotte' },
    ],
  },
  {
    title: 'Finance & Gestion',
    items: [
      { href: '/comptabilite', icon: '📒', label: 'Comptabilité' },
      { href: '/budget', icon: '💰', label: 'Budget & Finance' },
    ],
  },
  {
    title: 'Organisation',
    items: [
      { href: '/teams', icon: '👥', label: 'Équipes' },
      { href: '/roster', icon: '🗓️', label: 'Planning RH' },
      { href: '/tasks', icon: '✅', label: 'Tâches' },
      { href: '/planning', icon: '📅', label: 'Calendrier' },
      { href: '/messages', icon: '💬', label: 'Messages' },
    ],
  },
  {
    title: 'Rapports & Outils',
    items: [
      { href: '/reports', icon: '📋', label: 'Rapports & Export' },
      { href: '/inventory', icon: '📦', label: 'Inventaire' },
      { href: '/knowledge', icon: '📚', label: 'Base de Connaissance' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { href: '/complaints', icon: '📣', label: 'Réclamations', badge: '2', badgeColor: 'gold' },
      { href: '/feedback', icon: '💡', label: 'Feedback' },
      { href: '/audit-logs', icon: '🔍', label: 'Journaux d\'Audit' },
      { href: '/settings', icon: '⚙️', label: 'Paramètres' },
    ],
  },
];

export default function AgroSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
        title={collapsed ? 'Développer' : 'Réduire'}
      >
        {collapsed ? '›' : '‹'}
      </button>

      {navConfig.map((section) => (
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
