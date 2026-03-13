'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from 'next-intl';
import { toast } from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { 
    Lock, 
    Mail, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    ShieldCheck,
    Globe,
    Zap,
    Cpu,
    Target
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for Lottie to prevent SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

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
    const [lottieData, setLottieData] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        // Load a tech/agro-industrial animation
        fetch('https://assets9.lottiefiles.com/packages/lf20_m6cu97.json') // High-speed digital network / growth
            .then(res => res.json())
            .then(data => setLottieData(data))
            .catch(err => console.error("Lottie load error:", err));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            toast.success('Accès Autorisé');
        } catch (error: any) {
            const message = error.response?.data?.error || error.response?.data?.message || 'Identifiants invalides';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/auth/firebase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
            });

            if (!response.ok) throw new Error('Échec validation Backend');
            
            toast.success('Authentification Google OK');
            const from = searchParams.get('from') || '/dashboard';
            window.location.href = `/${locale}${from}`;
        } catch (error: any) {
            toast.error(error.message || 'Échec Google Auth');
        } finally {
            setGoogleLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#05080a] font-sans selection:bg-[var(--green)] selection:text-white">
            {/* ELECTRIC GRID BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#162a22_1px,transparent_1px),linear-gradient(to_bottom,#162a22_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                <div className="absolute inset-0 bg-[#05080a] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#000_100%)]"></div>
            </div>

            {/* FLOATING ENERGY ORBS */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--green)]/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--gold)]/10 blur-[120px] rounded-full delay-1000 animate-pulse"></div>

            {/* SCANLINE EFFECT */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]"></div>

            <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 px-6 relative z-20">
                
                {/* LEFT SIDE: BRANDING & LOTTIE */}
                <div className="hidden lg:flex flex-col flex-1 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--green)]/30 bg-[var(--green)]/10 text-[var(--green)] text-[10px] font-black uppercase tracking-widest animate-bounce">
                            <Zap size={12} fill="currentColor" />
                            <span>Système Haute Performance v2.0</span>
                        </div>
                        <h1 className="text-7xl font-sans font-black text-white tracking-tighter uppercase leading-[0.85] [font-family:var(--font-anton)]">
                            AGRO<span className="text-[var(--green)]">MAÎTRE</span><br/>
                            <span className="text-3xl tracking-[0.2em] font-light opacity-50">INTELLIGENCE</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md font-medium leading-relaxed">
                            Pilotez votre exploitation avec la précision d'un moteur industriel. Données temps réel, synchronisation cloud et sécurité souveraine.
                        </p>
                    </div>

                    <div className="w-full max-w-md aspect-square relative">
                        {lottieData && (
                            <Lottie 
                                animationData={lottieData} 
                                loop={true} 
                                className="w-full h-full drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]" 
                            />
                        )}
                        <div className="absolute -bottom-4 -right-4 p-6 bg-[#0a1215] border border-[var(--border)] rounded-2xl shadow-2xl backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[var(--green)]/20 rounded-xl text-[var(--green)]">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Core Engine</p>
                                    <p className="text-white font-mono font-bold tracking-tighter">NODE_HERBUTE_V2</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: LOGIN FORM */}
                <div className="w-full max-w-md">
                    {/* MOBILE LOGO */}
                    <div className="lg:hidden text-center mb-8">
                         <h1 className="text-5xl font-black text-white tracking-tighter uppercase [font-family:var(--font-anton)]">
                            AGRO<span className="text-[var(--green)]">MAÎTRE</span>
                        </h1>
                    </div>

                    <div className="relative group">
                        {/* GLOW BORDER EFFECT */}
                        <div className="absolute -inset-[2px] bg-gradient-to-r from-[var(--green)] via-emerald-400 to-[var(--gold)] rounded-[2.5rem] opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-500"></div>
                        
                        <div className="relative bg-[#0d1519]/80 backdrop-blur-3xl border border-white/10 p-1 rounded-[2.5rem] shadow-2xl">
                            <div className="bg-[#0a1215]/90 p-8 lg:p-10 rounded-[2.4rem] border border-white/5">
                                <div className="mb-10 text-center lg:text-left">
                                    <div className="inline-block p-3 bg-[var(--green)] rounded-2xl mb-4 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                                        <Target size={24} className="text-white" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white uppercase [font-family:var(--font-anton)] tracking-wider">Identification</h2>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-1 font-bold">Terminal de Contrôle Sécurisé</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Canal d'accès</label>
                                        </div>
                                        <div className="relative group/input">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-[var(--green)] transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="UTILISATEUR@HERBUTE.DOM"
                                                className="w-full bg-[#05080a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-mono tracking-tight text-white focus:border-[var(--green)]/50 focus:ring-1 focus:ring-[var(--green)]/20 transition-all outline-none placeholder:opacity-30"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clé de sécurité</label>
                                            <Link href="#" className="text-[9px] font-black uppercase text-[var(--gold)] hover:text-white transition-colors">Perdue ?</Link>
                                        </div>
                                        <div className="relative group/input">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-[var(--green)] transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••••••"
                                                className="w-full bg-[#05080a] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-mono text-white focus:border-[var(--green)]/50 focus:ring-1 focus:ring-[var(--green)]/20 transition-all outline-none"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="relative w-full group overflow-hidden bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--green)] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="relative z-10 group-hover:text-white transition-colors flex items-center justify-center gap-3">
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    Initialiser l'accès
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-8 relative text-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <span className="relative px-4 bg-[#0a1215] text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">Alternatif</span>
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={googleLoading}
                                        className="w-full bg-[#05080a] border border-white/5 text-slate-300 py-4 rounded-2xl font-bold text-xs shadow-sm hover:bg-white/5 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {googleLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                                                Accès via Google Infrastructure
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-10 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-[var(--green)]" />
                                        <span>Cryptage Militaire</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                                    <div className="flex items-center gap-2 font-mono">
                                        <Globe size={14} className="text-[var(--green)]" />
                                        <span>Node_MA_01</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 text-center space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Nouveau membre ? <Link href="/register" className="text-white hover:text-[var(--green)] transition-colors ml-2 underline decoration-[var(--green)] underline-offset-4">S'enregistrer sur le réseau →</Link>
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-700">
                            © 2026 AgroMaître Industries • Souveraineté Digitale Totale
                        </p>
                    </div>
                </div>
                
            </div>

            <style jsx global>{`
                @keyframes grid-glow {
                    0% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.1; }
                }
                :root {
                    --green: #22c55e;
                    --green2: #15803d;
                    --gold: #fde047;
                    --border: rgba(255,255,255,0.1);
                }
            `}</style>
        </div>
    );
}
