'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Zap, AlertTriangle, Info, Bell } from 'lucide-react';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const socketUrl = URL.replace(/\/api\/?$/, '');

    const socket = io(socketUrl, {
      path: '/socket.io/',
      withCredentials: true,
      transports: ['websocket']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔔 Notification Socket Connected');
      // Join general user room and organization room
      socket.emit('join-rooms', [`user:${user.id}`, `org:${user.organizationId}`]);
    });

    socket.on('notification', (payload: any) => {
      console.log('📩 New Notification:', payload);

      if (payload.type === 'ai_alert') {
        showAIAlert(payload);
      } else {
        showGeneralNotification(payload);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const showAIAlert = (alert: any) => {
    toast.custom((t) => (
      <div className="bg-[#1a1209] border-2 border-primary/50 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-4 min-w-[350px] animate-in slide-in-from-top-4 duration-500">
        <div className="p-2 bg-primary/20 rounded-xl text-primary animate-pulse">
          <Zap size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="font-bold text-sm text-primary uppercase tracking-tighter">Alerte Vision IA</h4>
            <span className="text-[10px] text-white/40">À l'instant</span>
          </div>
          <p className="text-sm font-semibold mt-1">{alert.message}</p>
          {alert.data?.actionRequired && (
            <div className="mt-2 text-xs bg-white/5 p-2 rounded-lg border border-white/5 italic text-white/70">
              💡 {alert.data.actionRequired}
            </div>
          )}
        </div>
      </div>
    ), {
        duration: 8000,
    });
  };

  const showGeneralNotification = (payload: any) => {
    const icons: any = {
      info: <Info className="text-blue-400" size={18} />,
      warning: <AlertTriangle className="text-orange-400" size={18} />,
      alert: <Bell className="text-red-400" size={18} />,
    };

    toast(payload.title || 'Notification', {
      description: payload.message,
      icon: icons[payload.type] || icons.info,
    });
  };

  return <>{children}</>;
};
