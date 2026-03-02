'use client';

import React from 'react';
import AgroTopBar from './AgroTopBar';
import AgroSidebar from './AgroSidebar';
import '@/styles/agro-theme.css'; // Load the theme CSS

export default function AgroLayout({ children }: { children: React.ReactNode }) {
  // Wrap everything inside .agro-theme so the custom CSS applies only here
  return (
    <div className="agro-theme">
      <AgroTopBar />
      <div className="layout">
        <AgroSidebar />
        <div className="main" id="main">
          {children}
        </div>
      </div>
    </div>
  );
}
