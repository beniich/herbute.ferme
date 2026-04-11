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
    if (typeof window === 'undefined') return;

    let socket: Socket | null = null;
    try {
      const URL = process.env.NEXT_PUBLIC_API_URL || '';
      const socketUrl = URL ? URL.replace(/\/api\/?$/, '') : window.location.origin;

      socket = io(socketUrl, {
        path: '/socket.io/',
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('🔔 Notification Socket Connected');
        socket?.emit('join-rooms', [`user:${user.id}`, `org:${user.organizationId}`]);
      });

      socket.on('notification', (payload: any) => {
        if (payload.type === 'ai_alert') {
          showAIAlert(payload);
        } else {
          showGeneralNotification(payload);
        }
      });
    } catch (e) {
      console.error('Socket initialization failed', e);
    }

    const handleTestAlert = () => {
      showAIAlert({
        type: 'ai_alert',
        message: 'Alerte IA: Analyse critique du sol recommandée pour le secteur Maraîchage.',
        data: { actionRequired: 'Vérifier le système d\'irrigation.' }
      });
    };
    window.addEventListener('test-ai-alert', handleTestAlert);

    return () => {
      if (socket) socket.disconnect();
      window.removeEventListener('test-ai-alert', handleTestAlert);
    };
  }, [user]);

  const showAIAlert = (alert: any) => {
    toast.custom((t) => (
      <div className="electric-border-container shadow-2xl animate-in slide-in-from-top-4 duration-500">
        <div className="electric-content bg-[#1a1209] p-4 flex items-start gap-4 min-w-[350px]">
          <div className="p-2 bg-primary/20 rounded-xl text-primary animate-pulse shrink-0">
            <Zap size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-extrabold text-[10px] text-primary uppercase tracking-[2px]">🤖 IA Herbute • Alerte</h4>
              <span className="text-[9px] text-white/30 font-mono">LIVE</span>
            </div>
            <p className="text-sm font-medium text-white leading-relaxed">{alert.message}</p>
            {alert.data?.actionRequired && (
              <div className="mt-3 text-[11px] bg-primary/10 p-2 rounded-lg border border-primary/20 italic text-primary/90 flex items-center gap-2">
                <Info size={12} className="shrink-0" />
                <span>{alert.data.actionRequired}</span>
              </div>
            )}
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => toast.dismiss(t)}
                className="text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest"
              >
                Ignorer
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
        duration: 10000,
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
