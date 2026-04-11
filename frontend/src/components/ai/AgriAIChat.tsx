'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Wheat, Tractor, Info, X } from 'lucide-react';
import '@/styles/electric-chat.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AgriAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Bonjour ! Je suis l'expert IA d'Herbute. Comment puis-je vous aider aujourd'hui avec vos difficultés d'élevage ou de culture ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      const result = await response.json();
      if (result.success) {
        // Find last assistant message from history
        const lastMsg = result.data.messages.filter((m: any) => m.role === 'assistant').pop();
        setMessages(prev => [...prev, { role: 'assistant', content: lastMsg?.content || "Désolé, je n'ai pas pu générer de réponse." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion avec l'IA." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="electric-border-container w-full max-w-2xl mx-auto my-8">
      <div className="electric-content flex flex-col h-[500px]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full chat-pulse text-primary">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Assistant Expert Agricole</h3>
              <p className="text-xs text-white/60">IA Intelligente Herbute v2.0</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Wheat className="text-green-500 opacity-50" size={18} />
            <Tractor className="text-orange-500 opacity-50" size={18} />
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl flex gap-3 ${
                m.role === 'user' 
                ? 'bg-primary text-primary-foreground ml-4' 
                : 'bg-white/10 backdrop-blur-sm text-white mr-4 border border-white/5'
              }`}>
                {m.role === 'assistant' && <Bot size={20} className="shrink-0 mt-1 opacity-70" />}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                {m.role === 'user' && <User size={20} className="shrink-0 mt-1 opacity-70" />}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 p-3 rounded-2xl animate-pulse text-white/50 text-xs">
                Réflexion en cours...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="relative flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ex: Difficulté de croissance du maïs, maladie bovine..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-center mt-2 text-white/30 italic">
            Appuyez sur Entrée pour envoyer — Conseils IA à titre indicatif
          </p>
        </div>
      </div>
    </div>
  );
}
