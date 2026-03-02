'use client';

import React, { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useOrgStore } from '@/store/orgStore';
import { 
  Bell, 
  Sun, 
  Moon, 
  Plus, 
  ChevronRight, 
  Sprout, 
  User, 
  LogOut 
} from 'lucide-react';

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
  const { activeOrganization } = useOrgStore();
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
    <div className="topbar glass-effect" style={{
      height: '64px',
      background: 'rgba(245, 251, 230, 0.8)', /* --bg with alpha */
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="topbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="logo-icon" style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--green), var(--green2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <Sprout size={20} />
        </div>
        <div>
          <div className="logo-text" style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.02em' }}>AgroMaître</div>
          <div className="logo-sub" style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domaine Agricole</div>
        </div>
      </div>

      <div className="topbar-center" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <Link href="/dashboard" style={{ color: 'var(--text3)', textDecoration: 'none' }}>
          {activeOrganization?.name || 'AgroMaître'}
        </Link>
        <ChevronRight size={14} style={{ color: 'var(--text3)' }} />
        <span id="breadcrumb" style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '15px' }}>{getBreadcrumb()}</span>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="topbar-date" style={{ fontSize: '13px', color: 'var(--text3)' }}>{currentDate}</div>

        <div
          className="theme-toggle"
          title={isLightMode ? 'Mode sombre' : 'Mode clair'}
          onClick={toggleTheme}
          style={{ 
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            background: 'var(--bg3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text2)'
          }}
        >
          {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
        </div>

        <Link href="/complaints" style={{ textDecoration: 'none' }}>
          <div className="topbar-alert" style={{ 
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            background: 'var(--bg3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text2)',
            position: 'relative'
          }}>
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '16px',
              height: '16px',
              background: 'var(--accent)',
              border: '2px solid var(--bg)',
              borderRadius: '50%',
              fontSize: '10px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700'
            }}>2</span>
          </div>
        </Link>

        <div
          className="topbar-user"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 12px 4px 4px',
            borderRadius: '24px',
            background: 'var(--bg3)',
            cursor: 'pointer',
            border: '1px solid var(--border)'
          }}
        >
          <div className="topbar-avatar" style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e293b, #000)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '600',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {userInitials}
          </div>
          <span className="topbar-uname" style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: '500' }}>
            {user?.prenom || 'Admin'} {user?.nom ? user.nom[0] + '.' : ''}
          </span>
          <LogOut size={14} style={{ color: 'var(--text3)' }} />
        </div>

        <Link href="/tasks" style={{ textDecoration: 'none' }}>
          <button className="topbar-btn" style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: 'var(--text)',
            color: 'var(--bg)',
            fontSize: '13px',
            fontWeight: '600',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}>
            <Plus size={16} />
            <span>Tâche</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
