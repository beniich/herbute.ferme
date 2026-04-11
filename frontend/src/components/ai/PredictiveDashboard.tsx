'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, Users, Package, Clock, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Prediction {
    _id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    predictionData: {
        description: string;
        actionRequired: string;
        probability: number;
    };
    createdAt: string;
}

export default function PredictiveDashboard() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const fetchPredictions = async () => {
        try {
            const res = await fetch('/api/ai/predictions');
            const data = await res.json();
            if (data.success) setPredictions(data.data);
        } catch (err) {
            console.error('Failed to fetch predictions', err);
        }
    };

    const runGlobalAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            await fetch('/api/ai/analyze-global', { method: 'POST' });
            await fetchPredictions();
        } catch (err) {
            console.error('Analysis failed', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        fetchPredictions();
    }, []);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'bg-red-500/20 border-red-500/50 text-red-400';
            case 'medium': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
            default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'stock': return <Package size={18} />;
            case 'hr': return <Users size={18} />;
            case 'yield': return <TrendingUp size={18} />;
            default: return <Clock size={18} />;
        }
    };

    return (
        <Card className="bg-[#1a1209]/80 border-white/5 backdrop-blur-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        <Zap size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Analyses Prédictives IA</CardTitle>
                        <p className="text-sm text-white/40">Risques anticipés pour les 7 prochains jours</p>
                    </div>
                </div>
                <button 
                    onClick={runGlobalAnalysis}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all flex items-center gap-2"
                >
                    {isAnalyzing ? 'Analyse...' : 'Relancer Analyse'}
                </button>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {predictions.length === 0 && !isAnalyzing && (
                        <div className="text-center py-8 text-white/20 italic">
                            Aucune prédiction disponible. Lancez une analyse globale.
                        </div>
                    )}
                    
                    {predictions.map((pred) => (
                        <div 
                            key={pred._id} 
                            className={`p-4 border rounded-xl flex gap-4 items-start transition-all hover:translate-x-1 ${getSeverityColor(pred.severity)}`}
                        >
                            <div className="p-2 bg-white/10 rounded-lg">
                                {getIcon(pred.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                                        Exploitation {pred.type}
                                    </span>
                                    <span className="text-xs opacity-50">
                                        {Math.round(pred.predictionData.probability * 100)}% confiance
                                    </span>
                                </div>
                                <h4 className="font-semibold text-lg mb-1">{pred.predictionData.description}</h4>
                                <div className="flex items-center gap-2 text-sm bg-black/20 p-2 rounded-lg mt-2 italic">
                                    <Info size={14} className="shrink-0" />
                                    <span>Conseil : {pred.predictionData.actionRequired}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
