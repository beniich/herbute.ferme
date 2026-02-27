'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

let socket: Socket | null = null;

export const useSocket = () => {
    const { token } = useAuthStore();

    useEffect(() => {
        if (!token) return;

        const URL = process.env.NEXT_PUBLIC_SOCKET_URL!;
        socket = io(URL, {
            auth: { token }
        });

        socket.on('connect', () => console.log('🔗 Connecté au WebSocket'));

        // Exemple d'événement : nouvelle réclamation affectée
        socket.on('assignment-updated', (payload) => {
            console.log('🔔 Assignment mis à jour', payload);
            // Vous pouvez déclencher un rafraîchissement global via Zustand
        });

        socket.on('new-complaint', (payload) => {
            console.log('🔔 Nouvelle réclamation', payload);
        });

        return () => {
            socket?.disconnect();
        };
    }, [token]);

    return socket;
};
