'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = () => {
        api.get('/api/messages')
            .then(res => {
                const data = res?.data?.data || res?.data || [];
                setMessages(Array.isArray(data) ? data : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            await api.post('/api/messages', {
                recipientId: 'system', // or selected user
                content: newMessage,
                type: 'text'
            });
            setNewMessage('');
            loadMessages();
        } catch (err) {
            console.error('Erreur envoi message', err);
        }
    };

    return (
        <div className="page active" id="page-messages">
            <div className="page-header">
                    <div className="page-label" style={{ color: 'var(--blue)' }}>Organisation</div>
                    <h1 className="page-title">Boîte de Messagerie</h1>
                    <div className="page-sub">Communications internes et discussions d'équipe</div>
                </div>

                <div className="content-grid cg-2" style={{ gridTemplateColumns: '1fr 3fr' }}>
                    <div className="panel" style={{ height: 'calc(100vh - 200px)' }}>
                        <div className="panel-header" style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                                <button style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'var(--text)' }}>Récents</button>
                                <button style={{ flex: 1, padding: '8px', background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}>Non lus</button>
                            </div>
                        </div>
                        <div className="panel-body" style={{ padding: 0 }}>
                            {loading ? <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div> : (
                                messages.length === 0 ? <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)' }}>Aucun message</div> :
                                messages.map((msg, i) => (
                                    <div key={msg._id || i} className="msg-row" style={{ padding: '16px', display: 'flex', gap: '12px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: !msg.read ? 'rgba(58,122,184,0.05)' : 'transparent' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--gold)', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {(msg.senderName || 'U')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <div style={{ fontWeight: !msg.read ? 'bold' : 'normal' }}>{msg.senderName || 'Utilisateur'}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '13px', color: !msg.read ? 'var(--text)' : 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="panel" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                        <div className="panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Canal Général
                            </div>
                        </div>
                        <div className="panel-body" style={{ flex: 1, background: 'var(--bg3)', display: 'flex', flexDirection: 'column', padding: '16px', gap: '16px', overflowY: 'auto' }}>
                            {messages.slice().reverse().map((msg, i) => (
                                <div key={msg._id || i} style={{ 
                                    alignSelf: msg.senderId === 'me' ? 'flex-end' : 'flex-start', 
                                    background: msg.senderId === 'me' ? 'var(--blue)' : 'var(--panel)', 
                                    color: msg.senderId === 'me' ? '#fff' : 'var(--text)',
                                    padding: '12px 16px', 
                                    borderRadius: msg.senderId === 'me' ? '16px 16px 0 16px' : '16px 16px 16px 0', 
                                    maxWidth: '70%', 
                                    border: msg.senderId === 'me' ? 'none' : '1px solid var(--border)' 
                                }}>
                                    {msg.content}
                                    <div style={{ fontSize: '10px', color: msg.senderId === 'me' ? 'rgba(255,255,255,0.7)' : 'var(--text3)', marginTop: '4px', textAlign: 'right' }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && !loading && (
                                <div style={{ margin: 'auto', color: 'var(--text3)' }}>Sélectionnez une conversation</div>
                            )}
                        </div>
                        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                            <input 
                                type="text" 
                                placeholder="Écrire un message..." 
                                style={{ flex: 1, padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend} style={{ padding: '0 24px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Envoyer</button>
                        </div>
                    </div>
            </div>
        </div>
    );
}
