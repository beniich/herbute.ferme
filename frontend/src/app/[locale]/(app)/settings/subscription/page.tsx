'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Sparkles, Building2, Zap, Sprout } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const PLANS = [
  {
    id: 'essai',
    name: 'Essai',
    description: 'Pour découvrir la plateforme.',
    price: 'Gratuit',
    period: '14 jours',
    icon: Sprout,
    features: ['1 Utilisateur', 'Gestion basique', 'Support communautaire'],
    color: 'border-gray-200'
  },
  {
    id: 'essentiel',
    name: 'Essentiel',
    description: 'L\'essentiel pour les petites exploitations.',
    price: '29€',
    period: '/ mois',
    icon: Check,
    features: ['Jusqu\'à 3 utilisateurs', 'Suivi des cultures', 'Support email'],
    color: 'border-[#215E61]'
  },
  {
    id: 'professionnel',
    name: 'Professionnel',
    description: 'Outils avancés de prédiction et d\'IoT.',
    price: '99€',
    period: '/ mois',
    icon: Sparkles,
    features: ['Utilisateurs illimités', 'Prédictions IA', 'Intégration capteurs IoT', 'Support prioritaire 24/7'],
    color: 'border-[#FF9F1C] bg-gradient-to-b from-[#FFFDF5] to-white',
    popular: true
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    description: 'Solution sur-mesure pour les grands comptes.',
    price: 'Sur Devis',
    period: '',
    icon: Building2,
    features: ['Multi-sites', 'API Dédiée', 'Gestionnaire de compte', 'SLA Garanti'],
    color: 'border-purple-600'
  }
];

export default function SubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success'|'error', msg: string} | null>(null);

  useEffect(() => {
    if (searchParams?.get('success') === 'true') {
      setNotification({ type: 'success', msg: 'Paiement réussi ! Votre abonnement a été mis à jour.' });
      refreshUser(); // Refresh session to get new plan
    }
    if (searchParams?.get('canceled') === 'true') {
      setNotification({ type: 'error', msg: 'Le paiement a été annulé.' });
    }
  }, [searchParams, refreshUser]);

  const handleSubscribe = async (planId: string) => {
    if (planId === 'essai' || planId === 'entreprise') {
      alert("Veuillez contacter notre support pour ce plan.");
      return;
    }

    try {
      setLoadingPlan(planId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           // Note: assumes standard token fetching or cookies are sent if using withCredentials
        },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) throw new Error("Erreur de paiement");

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirection vers Stripe
      }
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', msg: 'Impossible d\'initialiser le paiement.' });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#35013F]">Mon Abonnement</h1>
        <p className="text-gray-600 mt-2">Gérez votre formule et vos factures.</p>
        
        {user && (
           <div className="mt-4 inline-block bg-[#E9B5D2]/20 text-[#951556] px-4 py-2 rounded-full font-medium">
             Plan actuel : <span className="uppercase font-bold">{user.plan || 'ESSAI'}</span>
           </div>
        )}
      </div>

      {notification && (
        <div className={`p-4 mb-8 rounded-md border ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {notification.msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => {
          const isCurrentPlan = user?.plan?.toLowerCase() === plan.id;
          const Icon = plan.icon;

          return (
            <Card key={plan.id} className={`relative flex flex-col ${plan.color} ${isCurrentPlan ? 'ring-2 ring-current ring-offset-2' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                  <span className="bg-[#FF9F1C] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Zap className="w-3 h-3" /> Recommandé
                  </span>
                </div>
              )}
              
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-[#35013F]">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="h-10">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 font-medium">{plan.period}</span>
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex flex-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-[#215E61] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${isCurrentPlan ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-[#951556] hover:bg-[#561050] text-[#E9B5D2]'}`}
                  disabled={isCurrentPlan || loadingPlan === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrentPlan ? (
                    'Plan Actuel'
                  ) : (
                    'Choisir ce plan'
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
