'use client';

import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from 'next-intl';
import { toast } from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { 
    Sprout, 
    Lock, 
    Mail, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    ShieldCheck,
    Globe
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login({ email, password });
            toast.success('Connexion réussie !');
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.error || error.response?.data?.message || 'Identifiants invalides';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            // 1. Authentifier l'utilisateur via la popup Google de Firebase
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // 2. Récupérer le token cryptographique (JWT) généré par Firebase
            const idToken = await user.getIdToken();

            // 3. Envoyer le token au backend Herbute pour vérification et création de session
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/auth/firebase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la connexion Google');
            }

            // 4. Si succès, on pourrait mettre à jour le contexte avec data.token / data.user
            // Pour l'instant on redirige simplement (en attendant que le contexte soit adapté)
            toast.success('Connexion Google réussie');
            
            // Recharger la page ou rediriger pour forcer la lecture du cookie si le backend le place
            const from = searchParams.get('from') || '/dashboard';
            window.location.href = `/${locale}${from}`;

        } catch (error: any) {
            console.error("Erreur détaillée Google Login:", error);
            toast.error(error.message || 'Échec de la connexion Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg)] font-sans">
            {/* Background elements - Premium Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,var(--green)_0%,transparent_50%)] opacity-10"></div>
            <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-[var(--gold)] opacity-10 blur-[150px] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-[var(--green)] opacity-10 blur-[150px] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]"></div>

            <div className="w-full max-w-md px-6 relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--green)] to-[var(--green2)] text-white shadow-2xl mb-6 hover:rotate-12 transition-transform duration-500">
                        {isMounted && <Sprout size={40} />}
                    </div>
                    <h1 className="text-4xl font-black text-[var(--text)] tracking-tighter uppercase italic">
                        Agro<span className="text-[var(--green)] not-italic">Maître</span>
                    </h1>
                    <p className="text-[10px] font-black text-[var(--text3)] uppercase tracking-[0.4rem] mt-2">Écosystème Digital Agricole</p>
                </div>

                <GlassCard className="p-1 lg:p-1.5 overflow-hidden shadow-2xl">
                    <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl p-8 lg:p-10 rounded-2xl relative">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-[var(--text)] uppercase italic tracking-tight">Content de vous revoir</h2>
                            <p className="text-xs text-[var(--text3)] uppercase tracking-widest mt-1">Authentification Sécurisée</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text2)] ml-1">Email ou Identifiant</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)] group-focus-within:text-[var(--green)] transition-colors">
                                        {isMounted && <Mail size={18} />}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="votre@email.com"
                                        className="w-full bg-[var(--bg2)]/50 border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[var(--green)] focus:ring-4 focus:ring-[var(--green)]/10 transition-all outline-none text-[var(--text)]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text2)]">Mot de passe</label>
                                    <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-[var(--green)] hover:underline">Oublié ?</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)] group-focus-within:text-[var(--green)] transition-colors">
                                        {isMounted && <Lock size={18} />}
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-[var(--bg2)]/50 border border-[var(--border)] rounded-2xl py-4 pl-12 pr-12 text-sm focus:border-[var(--green)] focus:ring-4 focus:ring-[var(--green)]/10 transition-all outline-none text-[var(--text)]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
                                    >
                                        {isMounted && (showPassword ? <EyeOff size={18} /> : <Eye size={18} />)}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--green)] hover:bg-[var(--green2)] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[var(--green)]/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Connexion
                                        {isMounted && <ArrowRight size={16} />}
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 relative text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--border)]"></div>
                            </div>
                            <span className="relative px-4 bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-[var(--text3)]">Ou</span>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className="w-full max-w-[320px] bg-white border border-gray-300 text-gray-700 py-3 rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {googleLoading ? (
                                    <div className="w-5 h-5 border-2 border-[var(--green)]/30 border-t-[var(--green)] rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                                        Continuer avec Google
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-[var(--text3)]">
                            <div className="flex items-center gap-2">
                                {isMounted && <ShieldCheck size={14} className="text-[var(--green)]" />}
                                <span>SSL Sécurisé</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-[var(--border)]"></div>
                            <div className="flex items-center gap-2">
                                {isMounted && <Globe size={14} className="text-[var(--green)]" />}
                                <span>Cloud Maroc</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>


                <div className="mt-10 text-center space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text2)]">
                        Pas de compte ? <Link href="/register" className="text-[var(--green)] hover:underline ml-2 italic">Rejoindre l'élite →</Link>
                    </p>
                    
                    <div className="flex justify-center gap-8 text-[9px] font-black uppercase tracking-widest text-[var(--text3)]">
                        <Link href="/legal/privacy" className="hover:text-[var(--green)] transition-colors">Vie Privée</Link>
                        <Link href="/contact" className="hover:text-[var(--green)] transition-colors">Support</Link>
                        <Link href="/legal/terms" className="hover:text-[var(--green)] transition-colors">Légal</Link>
                    </div>

                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--text3)] opacity-40">
                        © 2026 AgroMaître Group • Souveraineté Digitale
                    </p>
                </div>
            </div>
        </div>
    );
}
