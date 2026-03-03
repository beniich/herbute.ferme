'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { 
    Cpu, 
    BarChart3, 
    Zap, 
    ShieldCheck, 
    Layout, 
    Globe, 
    ArrowRight, 
    Sprout, 
    Database, 
    Layers, 
    Activity, 
    Cloud, 
    Play,
    Activity as ActivityIcon,
    ChevronRight,
    MousePointer2,
    Lock
} from 'lucide-react';

const modules = [
    { name: 'Élevage', desc: 'Inventaire du cheptel, suivi vétérinaire, production laitière.', icon: '🐄', color: '#cc9977' },
    { name: 'Herbes & Aromates', desc: 'Parcelles, récoltes, séchage et ventes à l\'export.', icon: '🌿', color: '#5a9e6f' },
    { name: 'Légumes & Fruits', desc: 'Planning des cultures, stocks et ventes aux marchés.', icon: '🥕', color: '#e8943a' },
    { name: 'Pépinière', desc: 'Catalogue des plantes, semis et gestion des ventes.', icon: '🪴', color: '#7bc67e' },
    { name: 'Budget & Finance', desc: 'Budget annuel, prévisionnel et trésorerie réelle.', icon: '💰', color: '#FE7F2D' },
    { name: 'Comptabilité', desc: 'Recettes, dépenses, bilan P&L et TVA automatique.', icon: '📒', color: '#b87cb8' },
];

export default function AgroSyncPage() {
    return (
        <div className="bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[var(--gold)] selection:text-white min-h-screen">
            <main className="agro-sync-fusion">
                {/* Hero section */}
                <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,var(--green)_0%,transparent_50%)] opacity-10"></div>
                        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,#FE7F2D_0%,transparent_50%)] opacity-10"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
                        <div className="space-y-12">
                            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/50 border border-[var(--green)]/20 text-[var(--green)] text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-sm italic">
                                <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse"></span>
                                AgroMaître Pro Ecosystem
                            </div>
                            
                            <h1 className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase italic text-[var(--text)]">
                                Agro<span className="text-[var(--green)] not-italic">Sync</span><br />
                                <span className="text-4xl md:text-6xl text-[var(--text3)] block mt-4">Intelligence Rurale.</span>
                            </h1>

                            <p className="text-xl text-[var(--text2)] max-w-lg leading-relaxed font-normal italic opacity-80">
                                La plateforme d'intelligence unifiée conçue pour les exploitations modernes. Gérez votre ferme avec précision, sans compromis.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link href="/register" className="px-12 py-6 bg-[var(--green)] hover:bg-[var(--green2)] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-[var(--green)]/20 hover:scale-105 italic flex items-center justify-center gap-4 group">
                                    Déployer l'Essai <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                                <button className="px-12 py-6 bg-white/50 border border-[var(--border)] hover:bg-white text-[var(--text)] rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all italic flex items-center justify-center gap-4 backdrop-blur-md">
                                    <Play size={18} fill="currentColor" /> Voir la Démo
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-12 pt-12 border-t border-[var(--border)]">
                                {[
                                    { val: '60+', label: 'Écrans UI' },
                                    { val: '10', label: 'Modules' },
                                    { val: '100%', label: 'Cloud-Based' }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-3xl font-black text-[var(--green)] italic">{stat.val}</div>
                                        <div className="text-[10px] text-[var(--text3)] uppercase tracking-widest mt-1 font-black">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive UI Mockup */}
                        <div className="relative group perspective-1000 hidden lg:block">
                            <div className="absolute inset-0 bg-[var(--green)]/10 blur-[120px] rounded-full group-hover:bg-[var(--gold)]/10 transition-all duration-1000"></div>
                            
                            <div className="relative bg-white border border-[var(--border)] rounded-[3rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-1000 p-2">
                                {/* Browser Bar */}
                                <div className="h-12 bg-[var(--bg3)] border-b border-[var(--border)] flex items-center px-6 gap-3">
                                    <div className="w-3 h-3 rounded-full bg-[#f87171]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#fbbf24]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#34d399]"></div>
                                    <div className="flex-1 text-center text-[9px] font-mono text-[var(--text3)] uppercase tracking-widest italic">agromaitre.ma/sync/dashboard</div>
                                </div>
                                <div className="h-[450px] bg-white grid grid-cols-12">
                                    <div className="col-span-1 border-r border-[var(--border)] flex flex-col items-center py-8 gap-8 bg-[var(--bg3)]/30">
                                        {[1,2,3,4,5].map(i => <div key={i} className={`w-8 h-8 rounded-xl ${i===1 ? 'bg-[var(--green)] text-white' : 'bg-white border border-[var(--border)]'} flex items-center justify-center text-xs`}>
                                            {i === 1 ? '🌾' : i === 2 ? '📊' : i === 3 ? '🐄' : i === 4 ? '💰' : '⚙️'}
                                        </div>)}
                                    </div>
                                    <div className="col-span-11 p-10 space-y-8">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-3">
                                                <div className="h-2 w-32 bg-[var(--green)]/20 rounded-full"></div>
                                                <div className="h-10 w-64 bg-[var(--bg)] border border-[var(--border)] rounded-2xl"></div>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-[var(--bg3)] border border-[var(--border)] shadow-inner"></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6">
                                            {[
                                                { label: 'C.A.', val: '142K', color: 'var(--green)' },
                                                { label: 'Charges', val: '89K', color: '#f87171' },
                                                { label: 'Profit', val: '53K', color: 'var(--gold)' }
                                            ].map((kpi, i) => (
                                                <div key={i} className="h-32 bg-[var(--bg)] rounded-3xl border border-[var(--border)] p-6 space-y-4 hover:shadow-lg transition-all border-t-4" style={{ borderTopColor: kpi.color }}>
                                                    <div className="text-[8px] font-black uppercase tracking-widest text-[var(--text3)]">{kpi.label}</div>
                                                    <div className="text-2xl font-black italic" style={{ color: kpi.color }}>{kpi.val}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-32 bg-[var(--bg3)]/50 rounded-[2rem] border border-[var(--border)] border-dashed"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute -top-10 -right-10 bg-white border border-[var(--border)] p-10 rounded-[2.5rem] shadow-2xl animate-bounce-slow border-t-4 border-t-[var(--gold)]">
                                <div className="text-[var(--gold)] text-3xl font-black italic">53 600 DH</div>
                                <div className="text-[10px] text-[var(--text3)] uppercase tracking-[0.2em] mt-2 font-black">Bénéfice Net</div>
                                <div className="text-[9px] text-[var(--green)] font-bold mt-2 italic">▲ 22.7% vs mois préc.</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Strip */}
                <div className="py-16 border-y border-[var(--border)] bg-white relative z-10 overflow-hidden">
                    <div className="flex whitespace-nowrap animate-marquee">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="flex items-center gap-16 px-8 text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text3)] italic">
                                <span className="flex items-center gap-4"><Sprout size={16} className="text-[var(--green)]" /> GESTION CHEPTEL</span>
                                <span className="flex items-center gap-4"><Database size={16} className="text-[var(--gold)]" /> BUDGET & FINANCE</span>
                                <span className="flex items-center gap-4"><Layers size={16} className="text-[var(--text)]" /> EXPORT PDF COMPTABLE</span>
                                <span className="flex items-center gap-4"><Sprout size={16} className="text-[var(--green)]" /> HERBES & AROMATES</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modules Grid */}
                <section className="py-48 max-w-7xl mx-auto px-6">
                    <div className="mb-32 space-y-6 text-center max-w-3xl mx-auto">
                        <h2 className="text-[var(--green)] font-black text-[10px] uppercase tracking-[0.6em] italic">L'Infrastructure Unifiée</h2>
                        <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-[var(--text)] leading-none">
                            Tous vos secteurs, <br />
                            <span className="text-[var(--gold)] not-italic underline underline-offset-[16px] decoration-[var(--border)]">un seul espace.</span>
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1 bg-[var(--border)] rounded-[4rem] border border-[var(--border)] overflow-hidden shadow-2xl">
                        {modules.map((m, i) => (
                            <div key={i} className="group p-16 bg-white hover:bg-[var(--bg)] transition-all duration-700 relative overflow-hidden cursor-pointer">
                                <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--green)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
                                <div className="w-20 h-20 rounded-3xl bg-[var(--bg3)] flex items-center justify-center text-3xl mb-12 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm">
                                    {m.icon}
                                </div>
                                <h4 className="text-2xl font-black mb-6 italic uppercase tracking-tight text-[var(--text)]">{m.name}</h4>
                                <p className="text-[var(--text2)] text-sm leading-relaxed font-normal italic opacity-70 group-hover:opacity-100 transition-opacity">{m.desc}</p>
                                <Link href="/register" className="mt-10 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--green)] hover:gap-6 transition-all border-b border-[var(--green)]/20 pb-2">
                                    Explorer <ChevronRight size={14} />
                                </Link>
                                <span className="absolute top-12 right-12 text-[9px] font-black text-[var(--text3)] uppercase tracking-widest opacity-30">MOD-0{i+1}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA / Final Pull */}
                <section className="pb-48 px-6">
                    <div className="max-w-6xl mx-auto rounded-[6rem] bg-gradient-to-br from-[var(--sidebar-bg)] to-[var(--text)] p-20 lg:p-32 text-center text-white relative overflow-hidden shadow-electric">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,var(--green)_0%,transparent_50%)] opacity-30"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                        
                        <div className="relative z-10 space-y-16">
                             <div className="w-24 h-24 rounded-[2rem] bg-white/10 flex items-center justify-center mx-auto mb-12 shadow-2xl border border-white/20 backdrop-blur-md">
                                <Zap className="w-10 h-10 text-[var(--gold)]" />
                            </div>
                            <h2 className="text-5xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9]">
                                Votre ferme mérite<br />
                                <span className="text-[var(--gold)] not-italic underline underline-offset-[20px] decoration-white/10">une gestion élite.</span>
                            </h2>
                            <p className="text-xl text-white/50 max-w-2xl mx-auto font-normal italic leading-relaxed opacity-80">
                                14 jours d'essai gratuit. Aucune carte bancaire requise. <br className="hidden md:block" />
                                Déploiement instantané certifié par AgroMaître.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
                                <Link href="/register" className="w-full sm:w-auto px-16 py-8 bg-[var(--gold)] text-white rounded-3xl font-black text-sm uppercase tracking-[0.3em] hover:scale-105 transition-all italic shadow-2xl shadow-[var(--gold)]/30">
                                    Démarrer l'Expérience
                                </Link>
                                <Link href="/contact" className="w-full sm:w-auto px-16 py-8 bg-transparent border-2 border-white/20 rounded-3xl font-black text-sm uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all italic flex items-center justify-center gap-4">
                                    Parler à un Agronome
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 50s linear infinite;
                    display: flex;
                    width: max-content;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-25px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 7s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
