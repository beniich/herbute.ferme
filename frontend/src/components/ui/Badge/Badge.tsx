'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, children }: BadgeProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
