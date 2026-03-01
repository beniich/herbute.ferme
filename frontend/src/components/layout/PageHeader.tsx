'use client';

import React from 'react';

interface PageHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  labelColor?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ 
  label, 
  title, 
  subtitle, 
  labelColor = 'var(--green)', 
  actions 
}: PageHeaderProps) {
  return (
    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div>
        <div className="page-label" style={{ color: labelColor }}>{label}</div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <div className="page-sub">{subtitle}</div>}
      </div>
      {actions && (
        <div className="page-actions" style={{ display: 'flex', gap: '10px' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
