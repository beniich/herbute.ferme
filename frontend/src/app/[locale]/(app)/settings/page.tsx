'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { useCurrencyStore, CURRENCIES, CurrencyCode } from '@/store/currencyStore';
import SubscriptionManagement from '@/components/settings/SubscriptionManagement';
import { 
    Settings, 
    Users, 
    Bell, 
    Shield, 
    CreditCard, 
    Palette, 
    Sun, 
    Moon, 
    Laptop,
    Save,
    Globe,
    Building2,
    Check,
    DollarSign,
    Unlink,
    Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

const SETTINGS_TABS = [
    { id: 'profile',      label: 'Organisation',  icon: Building2,  labelFull: 'Organisation & Profil' },
    { id: 'currency',     label: 'Devise',         icon: DollarSign, labelFull: 'Devise & Locale' },
    { id: 'appearance',  label: 'Apparence',       icon: Palette,    labelFull: 'Apparence' },
    { id: 'subscription', label: 'Abonnement',     icon: CreditCard, labelFull: 'Abonnement & Paiement' },
    { id: 'users',        label: 'Utilisateurs',   icon: Users,      labelFull: 'Utilisateurs & Rôles' },
    { id: 'notifications', label: 'Notifications', icon: Bell,       labelFull: 'Notifications' },
    { id: 'security',     label: 'Sécurité',       icon: Shield,     labelFull: 'Sécurité' },
];

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text3)]">{label}</label>
            {children}
        </div>
    );
}

function SettingsInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:border-[var(--gold)] outline-none transition-all text-[var(--text)]"
        />
    );
}

function SettingsSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:border-[var(--gold)] outline-none transition-all text-[var(--text)] appearance-none"
        >
            {children}
        </select>
    );
}

import { toast as toaster } from 'react-hot-toast';
import { apiClient } from '@/lib/api';

export default function SettingsPage() {
    const [activeTab, setActiveTab]   = useState('profile');
    const { theme, setTheme }         = useTheme();
    const { currency, setCurrency, format } = useCurrencyStore();
    const { user, refreshUser }       = useAuth();
    const [loading, setLoading]       = useState(false);
    const [linking, setLinking]       = useState(false);
    const [orgData, setOrgData]       = useState<any>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const orgId = user?.organizationId;
            if (!orgId) return;
            const data = await apiClient.get(`/api/organizations/${orgId}`);
            if (data?.organization) {
                setOrgData(data.organization);
                if (data.organization.settings?.currency) {
                    setCurrency(data.organization.settings.currency as CurrencyCode);
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const orgId = user?.organizationId;
            if (!orgId) throw new Error("ID d'organisation manquant");

            await apiClient.patch(`/api/organizations/${orgId}`, {
                settings: {
                    ...orgData?.settings,
                    currency: currency.code,
                    theme: theme,
                }
            });

            toaster.success('Paramètres sauvegardés avec succès');
            refreshUser();
        } catch (error: any) {
            console.error("Save error:", error);
            toaster.error(error?.message || "Erreur lors de la sauvegarde");
        } finally {
            setLoading(false);
        }
    };

    const handleLinkGoogle = async () => {
        try {
            setLinking(true);
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            await apiClient.post('/api/auth/link-google', { token });

            toaster.success('Compte Google lié avec succès');
            refreshUser();
        } catch (error: any) {
            toaster.error(error?.message || 'Erreur lors de la liaison du compte Google');
        } finally {
            setLinking(false);
        }
    };

    const handleUnlinkGoogle = async () => {
        if (!confirm('Êtes-vous sûr de vouloir délier votre compte Google ? Vous devrez utiliser votre mot de passe pour vous connecter.')) return;
        try {
            setLinking(true);
            await apiClient.post('/api/auth/unlink-google');
            toaster.success('Compte Google délié avec succès');
            refreshUser();
        } catch (error: any) {
            toaster.error(error?.message || 'Erreur lors de la déliaison. Avez-vous un mot de passe local défini ?');
        } finally {
            setLinking(false);
        }
    };

    const currentTab = SETTINGS_TABS.find(t => t.id === activeTab);

    return (
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">

            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                        <Settings size={13} />
                        Administration
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-[var(--text)]">Paramètres Généraux</h1>
                    <p className="text-sm text-[var(--text3)] opacity-70">Contrôlez l'écosystème de votre domaine agricole</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-[var(--gold)]/20 disabled:opacity-50"
                >
                    {loading 
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <Save size={16} />
                    }
                    Enregistrer
                </button>
            </div>

            {/* Tab nav — horizontal scrollable on mobile */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-nowrap no-scrollbar">
                {SETTINGS_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap text-xs font-bold transition-all shrink-0
                                ${active 
                                    ? 'bg-[var(--gold)] text-white shadow-lg shadow-[var(--gold)]/20' 
                                    : 'bg-[var(--bg3)] text-[var(--text2)] hover:bg-[var(--bg2)]'
                                }
                            `}
                        >
                            <Icon size={15} />
                            <span className="hidden sm:inline">{tab.labelFull}</span>
                            <span className="sm:hidden">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content Card */}
            <div className="bg-[var(--panel)] border border-[var(--border)] rounded-[20px] p-7 min-h-[360px]">
                <h3 className="text-base font-black uppercase italic tracking-tighter text-[var(--text)] mb-7">
                    {currentTab?.labelFull}
                </h3>

                {/* ── PROFILE ─────────────────────────── */}
                {activeTab === 'profile' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                            <FieldGroup label="Nom de l'exploitation">
                                <SettingsInput type="text" defaultValue="Domaine Al Baraka" />
                            </FieldGroup>
                            <FieldGroup label="ID Légal / SIRET">
                                <SettingsInput type="text" defaultValue="MA-992-12345" />
                            </FieldGroup>
                            <FieldGroup label="Langue système">
                                <SettingsSelect>
                                    <option>Français (FR)</option>
                                    <option>Arabe (AR)</option>
                                    <option>Anglais (EN)</option>
                                </SettingsSelect>
                            </FieldGroup>
                            <FieldGroup label="Fuseau horaire">
                                <SettingsSelect>
                                    <option>Africa/Casablanca (UTC+1)</option>
                                    <option>Europe/Paris (UTC+2)</option>
                                    <option>UTC</option>
                                </SettingsSelect>
                            </FieldGroup>
                        </div>
                        
                        {/* Section Compte Google */}
                        <div className="pt-5 border-t border-[var(--border)]">
                            <div className="mb-4">
                                <h4 className="text-sm font-extrabold text-[var(--text)]">Connexion Google</h4>
                                <p className="text-xs text-[var(--text3)] mt-1">
                                    Liez votre compte Google pour vous connecter en un clic sans mot de passe.
                                </p>
                            </div>
                            
                            {user?.googleId || user?.firebaseUid ? (
                                <div className="flex items-center justify-between p-4 bg-[var(--gold)]/5 rounded-xl border border-[var(--gold)]/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-bold text-[var(--text)]">Compte lié</div>
                                            <div className="text-[11px] text-[var(--text3)]">Vous pouvez vous connecter avec ce compte.</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleUnlinkGoogle}
                                        disabled={linking}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        <Unlink size={14} /> Délier le compte
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-[var(--bg2)] rounded-xl border border-dashed border-[var(--border)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text3)] opacity-50 grayscale">
                                            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-bold text-[var(--text)]">Aucun compte lié</div>
                                            <div className="text-[11px] text-[var(--text3)]">Associez votre email Google.</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleLinkGoogle}
                                        disabled={linking}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> 
                                        Connecter Google
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600 text-[12px] font-medium">
                            <Globe size={16} />
                            Ces modifications affecteront tous les utilisateurs du domaine.
                        </div>
                    </div>
                )}

                {/* ── CURRENCY ────────────────────────── */}
                {activeTab === 'currency' && (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                            {CURRENCIES.map((c) => {
                                const active = c.code === currency.code;
                                return (
                                    <button
                                        key={c.code}
                                        onClick={() => { setCurrency(c.code as CurrencyCode); toaster.success(`Devise changée: ${c.label}`); }}
                                        className={`
                                            flex flex-col items-start gap-2 p-4 rounded-2xl cursor-pointer border-2 transition-all relative
                                            ${active 
                                                ? 'border-[var(--gold)] bg-[var(--gold)]/5' 
                                                : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--gold)]/50'
                                            }
                                        `}
                                    >
                                        {active && (
                                            <div className="absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-full bg-[var(--gold)] flex items-center justify-center">
                                                <Check size={11} color="white" />
                                            </div>
                                        )}
                                        <span className="text-3xl">{c.flag}</span>
                                        <div>
                                            <div className={`font-extrabold text-[15px] ${active ? 'text-[var(--gold)]' : 'text-[var(--text)]'}`}>{c.code}</div>
                                            <div className="text-[11px] text-[var(--text3)]">{c.label}</div>
                                        </div>
                                        <div className={`text-xl font-black ${active ? 'text-[var(--gold)]' : 'text-[var(--text2)]'}`}>{c.symbol}</div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Live preview */}
                        <div className="p-5 rounded-2xl bg-[var(--bg2)] border border-[var(--border)]">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text3)] mb-3">Aperçu du formatage</div>
                            <div className="flex flex-wrap gap-5">
                                {[150000, 50000, 1234.56, 9.99].map(n => (
                                    <div key={n} className="flex flex-col gap-1">
                                        <span className="text-[10px] text-[var(--text3)]">{n.toLocaleString()}</span>
                                        <span className="font-extrabold text-base text-[var(--gold)]">{format(n)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── APPEARANCE ──────────────────────── */}
                {activeTab === 'appearance' && (
                    <div className="flex flex-col gap-7">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                            {([
                                { id: 'light',  label: 'Mode Clair',  IconComp: Sun,    bg: 'bg-amber-100', fg: 'text-amber-600' },
                                { id: 'dark',   label: 'Mode Sombre', IconComp: Moon,   bg: 'bg-slate-800', fg: 'text-slate-400' },
                                { id: 'system', label: 'Système',     IconComp: Laptop, bg: 'bg-indigo-100', fg: 'text-indigo-600' },
                            ] as const).map(({ id, label, IconComp, bg, fg }) => (
                                <button
                                    key={id}
                                    onClick={() => setTheme(id)}
                                    className={`
                                        flex flex-col items-center gap-3.5 p-6 rounded-2xl cursor-pointer border-2 transition-all
                                        ${theme === id 
                                            ? 'border-[var(--gold)] bg-[var(--gold)]/5 scale-[1.03]' 
                                            : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--gold)]/50'
                                        }
                                    `}
                                >
                                    <div className={`w-12 h-12 rounded-full ${bg} ${fg} flex items-center justify-center shadow-inner`}>
                                        <IconComp size={24} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme === id ? 'text-[var(--gold)]' : 'text-[var(--text2)]'}`}>{label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 pt-5 border-t border-[var(--border)]">
                            {[
                                { label: 'Mode Haute Performance', desc: 'Désactive les effets de flou (Glassmorphism) pour plus de fluidité.', active: false },
                                { label: "Animations d'interface", desc: 'Micro-interactions lors du survol et des clics.', active: true },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <div className="text-sm font-bold text-[var(--text)]">{item.label}</div>
                                        <div className="text-[11px] text-[var(--text3)] mt-0.5">{item.desc}</div>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors ${item.active ? 'bg-[var(--gold)]' : 'bg-[var(--bg3)]'}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${item.active ? 'left-6' : 'left-1'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── SUBSCRIPTION ─────────────────────── */}
                {activeTab === 'subscription' && (
                    <SubscriptionManagement />
                )}

                {/* ── PLACEHOLDER TABS ────────────────── */}
                {!['profile', 'currency', 'appearance', 'subscription'].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center min-h-[240px] gap-4 text-center">
                        <div className="p-4 rounded-full bg-[var(--bg)] text-[var(--text3)]">
                            <Settings size={36} className="opacity-40" />
                        </div>
                        <h3 className="font-bold text-[var(--text2)] text-sm">Section en cours de migration</h3>
                        <p className="text-xs text-[var(--text3)] max-w-[360px]">
                            Nous migrons actuellement toutes les fonctionnalités vers le nouveau moteur AgroMaître v2. Cette section sera disponible sous peu.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
