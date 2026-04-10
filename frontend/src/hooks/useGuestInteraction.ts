'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useGuestInteraction() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedDraft, setSavedDraft] = useState<any>(null);
  
  // Remplacer ça par votre véritable store ou state global (ex: zustand ou AuthContext)
  // On simulera ici le fait de savoir si le visiteur est un invité
  const isGuest = true; // TODO: Connecter à votre provider d'authentification réel 

  const closeAuthModal = () => setShowAuthModal(false);

  // Interceptor pour les clics ou la soumission de formulaires
  const handleInteraction = useCallback((e: any, draftData?: any) => {
    if (isGuest) {
      e.preventDefault(); // Empêcher l'action par défaut (soumission, lien...)
      e.stopPropagation();

      // Sauvegarder ce que l'utilisateur était en train de remplir (frappes)
      if (draftData) {
        setSavedDraft(draftData);
        localStorage.setItem('herbute_guest_draft', JSON.stringify(draftData));
      }
      
      // Afficher la page/modale de connexion Google
      setShowAuthModal(true);
      return false; // Action bloquée, l'utilisateur a été intercepté
    }
    
    return true; // L'utilisateur est connecté, laisser l'action se dérouler normalement
  }, [isGuest]);

  // Si l'utilisateur est nouvellement connecté, restaurer ses frappes !
  useEffect(() => {
    if (!isGuest) {
      const draft = localStorage.getItem('herbute_guest_draft');
      if (draft) {
        setSavedDraft(JSON.parse(draft));
        localStorage.removeItem('herbute_guest_draft'); // Nettoyer
      }
    }
  }, [isGuest]);

  return { isGuest, showAuthModal, closeAuthModal, handleInteraction, savedDraft };
}
