'use client';

import React, { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Vue Générale',
  '/analytics': 'Analytics & KPIs',
  '/map': 'Carte Interactive',
  '/meteo': 'Météo & Environnement',
  '/elevage': 'Élevage Bovin/Ovin',
  '/volaille': 'Ferme Avicole',
  '/parcelles': 'Parcelles & Cultures',
  '/herbes': 'Herbes & Aromates',
  '/legumes': 'Légumes & Fruits',
  '/pepiniere': 'Pépinière',
  '/irrigation': 'Irrigation & Eau',
  '/foret': 'Gestion Forestière',
  '/domaine': 'Domaine & Infrastructure',
  '/fleet': 'Équipements & Flotte',
  '/comptabilite': 'Comptabilité',
  '/budget': 'Budget & Finance',
  '/teams': 'Équipes',
  '/roster': 'Planning RH',
  '/tasks': 'Tâches',
  '/planning': 'Calendrier',
  '/messages': 'Messages',
  '/reports': 'Rapports & Export',
  '/inventory': 'Inventaire',
  '/knowledge': 'Base de Connaissance',
  '/complaints': 'Réclamations',
  '/feedback': 'Feedback',
  '/audit-logs': 'Journaux d\'Audit',
  '/settings': 'Paramètres',
  '/it-admin': 'Admin IT',
  '/admin': 'Administration',
  '/super-admin': 'Super Admin',
  '/citizen': 'Citoyens',
  '/technician': 'Techniciens',
};

export default function AgroTopBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isLightMode, setIsLightMode] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
  }, []);

  const toggleTheme = () => {
    const root = document.querySelector('.agro-theme');
    if (root) {
      root.classList.toggle('light-mode');
      setIsLightMode(!isLightMode);
    }
  };

  const getBreadcrumb = () => {
    if (!pathname) return 'Vue Générale';
    const segments = pathname.split('/').filter(Boolean);
    // Find the last segment that matches a route label
    for (let i = segments.length - 1; i >= 0; i--) {
      const key = '/' + segments[i];
      if (routeLabels[key]) return routeLabels[key];
    }
    return 'Vue Générale';
  };

  const handleLogout = () => {
    logout();
  };

  const userInitials = user
    ? `${user.prenom ? user.prenom[0] : ''}${user.nom ? user.nom[0] : ''}`.toUpperCase()
    : 'A';

  return (
    <div className="topbar">
      <div className="topbar-logo">
        <div className="logo-icon">🌾</div>
        <div>
          <div className="logo-text">AgroMaître</div>
          <div className="logo-sub">Domaine Agricole</div>
        </div>
      </div>

      <div className="topbar-center">
        <Link href="/dashboard" style={{ color: 'var(--text3)', textDecoration: 'none' }}>
          Domaine Al Baraka
        </Link>
        <span style={{ color: 'var(--text3)', margin: '0 4px' }}>›</span>
        <span id="breadcrumb" style={{ color: 'var(--text2)' }}>{getBreadcrumb()}</span>
      </div>

      <div className="topbar-right">
        <div className="topbar-date">{currentDate}</div>

        <div
          className="theme-toggle"
          title={isLightMode ? 'Mode sombre' : 'Mode clair'}
          onClick={toggleTheme}
          style={{ cursor: 'pointer' }}
        >
          {isLightMode ? '🌙' : '🌓'}
        </div>

        <Link href="/complaints" style={{ textDecoration: 'none' }}>
          <div className="topbar-alert" title="2 alertes actives" style={{ '--alert-count': '"2"' } as React.CSSProperties}>
            🔔
          </div>
        </Link>

        <div
          className="topbar-user"
          onClick={handleLogout}
          title="Se déconnecter"
        >
          <div className="topbar-avatar">
            {userInitials || '🧑‍🌾'}
          </div>
          <span className="topbar-uname">
            {user?.prenom || 'Admin'} {user?.nom ? user.nom[0] + '.' : ''}
          </span>
        </div>

        <Link href="/tasks" style={{ textDecoration: 'none' }}>
          <button className="topbar-btn">+ Nouvelle Tâche</button>
        </Link>
      </div>
    </div>
  );
}
