'use client';

import React from 'react';
import AgriAIChat from '@/components/ai/AgriAIChat';
import PredictiveDashboard from '@/components/ai/PredictiveDashboard';
import { Sparkles, BrainCircuit, Shield } from 'lucide-react';

export default function AIPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10 min-h-screen bg-[#0b0f0a]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#1a1209]/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
                        <Sparkles size={14} />
                        <span>Intelligence Artificielle de Pointe</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Herbute <span className="text-primary">Vision</span>
                    </h1>
                    <p className="text-white/60 max-w-xl">
                        Votre assistant expert analyse l'ensemble de votre exploitation en temps réel pour anticiper les risques et optimiser vos rendements.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center p-3 bg-white/5 rounded-2xl border border-white/10 w-24">
                        <BrainCircuit className="text-primary mb-1" size={24} />
                        <span className="text-[10px] text-white/40 uppercase">Analytique</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white/5 rounded-2xl border border-white/10 w-24">
                        <Shield className="text-green-500 mb-1" size={24} />
                        <span className="text-[10px] text-white/40 uppercase">Sécurité</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* AI Chat section (Left) */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                    <div className="mb-4 ml-2">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                            Expertise IA Directe
                        </h2>
                    </div>
                    <AgriAIChat />
                </div>
                
                {/* Predictions section (Right) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="mb-4 ml-2">
                        <h2 className="text-xl font-bold text-white">Alertes Prédictives</h2>
                    </div>
                    <PredictiveDashboard />
                    
                    <div className="bg-[#1a1209]/60 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <BrainCircuit size={80} />
                        </div>
                        <h4 className="font-bold text-white text-lg mb-3">Comment ça marche ?</h4>
                        <p className="text-sm text-white/50 leading-relaxed relative z-10">
                            Notre algorithme analyse les données bioclimatiques, l'historique de vos cultures et les signaux faibles de votre cheptel. En croisant ces informations avec le modèle Llama 3.1, nous pouvons prédire les événements critiques 7 jours à l'avance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

