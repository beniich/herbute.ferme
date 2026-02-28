'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function AgroTopBar() {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

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
        <span>Domaine Al Baraka</span> › <span id="breadcrumb">Vue Générale</span>
      </div>
      
      <div className="topbar-right">
        <div className="topbar-date">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        <div className="theme-toggle" title="Changer de mode">🌓</div>
        <div className="topbar-alert" title="4 alertes actives">🔔</div>
        
        <div className="topbar-user" onClick={handleLogout} title="Se déconnecter">
          <div className="topbar-avatar">🧑‍🌾</div>
          <span className="topbar-uname">{user?.nom || 'Admin'} {user?.prenom || ''}</span>
        </div>
        
        <button className="topbar-btn">+ Nouvelle Entrée</button>
      </div>
    </div>
  );
}
