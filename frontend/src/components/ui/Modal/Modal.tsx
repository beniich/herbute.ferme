'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  className?: string;
  children?: React.ReactNode;
}

export function Modal({ className, children }: ModalProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
