'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps {
  className?: string;
  children?: React.ReactNode;
}

export function Input({ className, children }: InputProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
