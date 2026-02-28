'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/navigation';

export default function AgroSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.includes(path) ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="nav-section">Tableau de Bord</div>
      <Link href="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
        <span className="ni">🏠</span> Vue Générale
      </Link>
      <Link href="/settings" className={`nav-item ${isActive('/settings')}`}>
        <span className="ni">💼</span> Gestion Admin
      </Link>
      <Link href="/meteo" className={`nav-item ${isActive('/meteo')}`}>
        <span className="ni">🌤️</span> Météo & Environnement
      </Link>

      <div className="nav-section">Élevage & Volaille</div>
      <Link href="/elevage" className={`nav-item ${isActive('/elevage')}`}>
        <span className="ni">🐄</span> Élevage Bovin/Ovin
      </Link>
      <Link href="/volaille" className={`nav-item ${isActive('/volaille')}`}>
        <span className="ni">🐓</span> Ferme Avicole <span className="badge">!</span>
      </Link>
      <Link href="/sante" className={`nav-item ${isActive('/sante')}`}>
        <span className="ni">💊</span> Santé Animale
      </Link>
      <Link href="/alimentation" className={`nav-item ${isActive('/alimentation')}`}>
        <span className="ni">🌾</span> Alimentation & Stocks
      </Link>

      <div className="nav-section">Cultures & Terres</div>
      <Link href="/parcelles" className={`nav-item ${isActive('/parcelles')}`}>
        <span className="ni">🗺️</span> Parcelles & Cultures
      </Link>
      <Link href="/herbes" className={`nav-item ${isActive('/herbes')}`}>
        <span className="ni">🌿</span> Herbes & Aromates
      </Link>
      <Link href="/legumes" className={`nav-item ${isActive('/legumes')}`}>
        <span className="ni">🥕</span> Légumes & Fruits
      </Link>
      <Link href="/pepiniere" className={`nav-item ${isActive('/pepiniere')}`}>
        <span className="ni">🪴</span> Pépinière
      </Link>
      <Link href="/irrigation" className={`nav-item ${isActive('/irrigation')}`}>
        <span className="ni">💧</span> Irrigation & Eau
      </Link>

      <div className="nav-section">Forêt & Domaine</div>
      <Link href="/foret" className={`nav-item ${isActive('/foret')}`}>
        <span className="ni">🌲</span> Gestion Forestière
      </Link>
      <Link href="/domaine" className={`nav-item ${isActive('/domaine')}`}>
        <span className="ni">🏡</span> Domaine & Infrastructure
      </Link>
      <Link href="/equipement" className={`nav-item ${isActive('/equipement')}`}>
        <span className="ni">🚜</span> Équipements & Flotte
      </Link>

      <div className="nav-section">Finance & Gestion</div>
      <Link href="/comptabilite" className={`nav-item ${isActive('/comptabilite')}`}>
        <span className="ni">📒</span> Comptabilité
      </Link>
      <Link href="/budget" className={`nav-item ${isActive('/budget')}`}>
        <span className="ni">💰</span> Budget & Finance
      </Link>
      <Link href="/ventes" className={`nav-item ${isActive('/ventes')}`}>
        <span className="ni">🛒</span> Ventes & Marchés
      </Link>
      <Link href="/investissement" className={`nav-item ${isActive('/investissement')}`}>
        <span className="ni">📈</span> Investissements & ROI
      </Link>
      <Link href="/rh" className={`nav-item ${isActive('/rh')}`}>
        <span className="ni">👥</span> Ressources Humaines
      </Link>

      <div className="nav-section">Rapports</div>
      <Link href="/rapports" className={`nav-item ${isActive('/rapports')}`}>
        <span className="ni">📊</span> Rapports & Export
      </Link>
      <Link href="/alertes" className={`nav-item ${isActive('/alertes')}`}>
        <span className="ni">🔔</span> Alertes <span className="badge">4</span>
      </Link>
      <Link href="/parametres" className={`nav-item ${isActive('/parametres')}`}>
        <span className="ni">⚙️</span> Paramètres
      </Link>

      <div className="sidebar-footer">
        <div className="sidebar-farm">
          <div className="farm-icon">🏡</div>
          <div>
            <div className="farm-name">Al Baraka</div>
            <div className="farm-type">340 HA · MAROC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
