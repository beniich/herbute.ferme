'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, BarChart3, ShieldCheck, Cpu, BookOpen, ArrowRight, Mail, Calendar, Clock, User, ChevronRight, Share2, Bookmark } from 'lucide-react';

const posts = [
    {
        category: 'Intelligence',
        categoryColor: 'text-[var(--green)] bg-[var(--green3)] border-[var(--green)]/20',
        title: 'AgroMaître 4.0 : L\'Imagerie Multispectrale au Service du Souss',
        excerpt: 'Comment notre nouvelle couche de données satellite permet de détecter le stress hydrique 15 jours avant les premiers signes visibles sur les agrumes.',
        date: '02 Mars 2026',
        readTime: '6 min',
        author: 'Dr. Yassine Alami',
        gradient: 'from-[var(--green)] to-[var(--green2)]'
    },
    {
        category: 'Rendement',
        categoryColor: 'text-[var(--gold)] bg-[var(--gold)]/10 border-[var(--gold)]/20',
        title: 'Optimisation de l\'Olivier : Retour sur l\'Expérience de Meknès',
        excerpt: 'Analyse d\'une saison de culture gérée par IA : réduction des intrants de 25% et augmentation de la qualité d\'huile d\'olive.',
        date: '28 Février 2026',
        readTime: '8 min',
        author: 'Sarah Berada',
        gradient: 'from-[var(--gold)] to-[#ff9e5e]'
    },
    {
        category: 'Technique',
        categoryColor: 'text-[var(--text)] bg-[var(--bg3)] border-[var(--border)]',
        title: 'IoT & Bas-Débit : Connecter les Zones Blanches du Gharb',
        excerpt: 'Déploiement de notre infrastructure LoRaWAN pour une connectivité totale, même sans couverture 4G/5G.',
        date: '15 Février 2026',
        readTime: '12 min',
        author: 'Karim Tazi',
        gradient: 'from-[var(--sidebar-bg)] to-[var(--text)]'
    }
];

export default function BlogPage() {
    const featured = posts[0];

    return (
        <div className="bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[var(--green)] selection:text-white overflow-hidden">
            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-48 lg:pt-48 lg:pb-64 flex items-center justify-center overflow-hidden bg-[var(--sidebar-bg)]">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,var(--green)_0%,transparent_50%)] opacity-30"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-sm italic animate-fade-in">
                            <BookOpen className="w-4 h-4 text-[var(--gold)]" />
                            Journal Fertile
                        </div>
                        <h1 className="text-6xl md:text-[8rem] font-black text-white mb-12 leading-[0.85] tracking-tighter uppercase italic">
                            Insights & <br />
                            <span className="text-[var(--gold)] not-italic underline underline-offset-[16px] decoration-8 decoration-[var(--green)]">Vision.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-white/50 max-w-4xl mx-auto mb-16 font-normal leading-relaxed italic">
                            L'intelligence collective au service de l'excellence agricole marocaine.
                        </p>
                    </div>
                </section>

                {/* Featured Post */}
                <section className="py-24 px-6 -mt-32 relative z-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="group relative bg-white rounded-[4rem] border border-[var(--border)] overflow-hidden shadow-2xl hover:border-[#FE7F2D] transition-all duration-700">
                             <div className="grid lg:grid-cols-2">
                                <div className="p-12 lg:p-24 space-y-10 flex flex-col justify-center">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${featured.categoryColor}`}>
                                            {featured.category}
                                        </span>
                                        <div className="h-px bg-[var(--border)] flex-grow"></div>
                                    </div>
                                    <h2 className="text-4xl lg:text-6xl font-black text-[var(--text)] italic uppercase tracking-tighter leading-[0.9] group-hover:text-[var(--green)] transition-all">
                                        {featured.title}
                                    </h2>
                                    <p className="text-xl text-[var(--text2)] leading-relaxed font-normal opacity-70">
                                        {featured.excerpt}
                                    </p>
                                    <div className="flex items-center gap-8 pt-8 border-t border-[var(--border)]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[var(--green)] flex items-center justify-center text-white font-black shadow-lg">
                                                {featured.author[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-[var(--text)] italic uppercase">{featured.author}</div>
                                                <div className="text-[10px] text-[var(--text3)] uppercase tracking-widest font-black">{featured.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-[var(--text2)] font-black uppercase tracking-widest bg-[var(--bg)] px-4 py-2 rounded-xl">
                                            <Clock size={14} className="text-[var(--gold)]" />
                                            {featured.readTime}
                                        </div>
                                    </div>
                                    <Link href="/" className="inline-flex items-center gap-4 text-[var(--green)] font-black text-xs uppercase tracking-[0.3em] group/btn">
                                        Lire l'article <ArrowRight size={18} className="group-hover/btn:translate-x-3 transition-transform" />
                                    </Link>
                                </div>
                                <div className="h-full min-h-[500px] bg-[var(--sidebar-bg)] relative overflow-hidden flex items-center justify-center">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient} opacity-20 group-hover:scale-110 transition-transform duration-1000`}></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <Sprout size={180} className="text-white opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700" />
                                    </div>
                                    <div className="relative z-10 p-12 text-center text-white">
                                        <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-[var(--gold)]">Article à la une</div>
                                        <div className="text-xs font-black uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full backdrop-blur-md">Vivre l'Innovation</div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-24 px-6 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-6 mb-16">
                            <h2 className="text-[10px] font-black text-[var(--text3)] uppercase tracking-[0.5em] italic">Dernières Publications</h2>
                            <div className="h-px bg-[var(--border)] flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {posts.map((post, i) => (
                                <div key={i} className="group bg-[var(--bg)] rounded-[3rem] border border-[var(--border)] overflow-hidden hover:border-[#FE7F2D] hover:shadow-electric hover:-translate-y-4 transition-all duration-500 flex flex-col">
                                    <div className="h-64 bg-[var(--sidebar-bg)] relative overflow-hidden flex items-center justify-center">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-20 group-hover:scale-110 transition-transform duration-1000`}></div>
                                        <div className="relative group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                                            {post.category === 'Intelligence' ? <Cpu size={80} className="text-white/20" /> : post.category === 'Rendement' ? <BarChart3 size={80} className="text-white/20" /> : <ShieldCheck size={80} className="text-white/20" />}
                                        </div>
                                    </div>
                                    <div className="p-10 flex-grow flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${post.categoryColor}`}>
                                                    {post.category}
                                                </span>
                                                <div className="flex gap-4">
                                                    <button aria-label="Partager" className="text-[var(--text3)] hover:text-[var(--green)] transitoin-colors"><Share2 size={14} /></button>
                                                    <button aria-label="Sauvegarder" className="text-[var(--text3)] hover:text-[var(--green)] transitoin-colors"><Bookmark size={14} /></button>
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-black text-[var(--text)] italic uppercase tracking-tighter leading-tight group-hover:text-[var(--green)] transition-all">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-[var(--text2)] leading-relaxed font-normal opacity-70">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
                                            <div className="flex items-center gap-3">
                                                 <User size={12} className="text-[var(--gold)]" />
                                                 <span className="text-[10px] font-black text-[var(--text)] uppercase tracking-tight italic">{post.author}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-[var(--text3)] uppercase tracking-widest">{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="py-32 px-6">
                    <div className="max-w-5xl mx-auto rounded-[4rem] bg-[var(--sidebar-bg)] p-16 lg:p-32 text-center text-white relative overflow-hidden shadow-2xl pulse-electric">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,var(--green)_0%,transparent_50%)] opacity-30"></div>
                        <div className="relative z-10 space-y-12">
                            <h2 className="text-4xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                                Cultivez votre <br />
                                <span className="text-[var(--gold)] not-italic underline underline-offset-[16px] decoration-white/20">Savoir.</span>
                            </h2>
                            <p className="text-xl text-white/50 max-w-2xl mx-auto font-normal italic">
                                Recevez chaque semaine nos analyses d'experts et nos études de cas exclusives.
                            </p>
                            <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="email" 
                                    placeholder="agronome@domaine.ma" 
                                    className="flex-grow h-16 bg-white/10 border border-white/20 rounded-2xl px-6 text-white outline-none focus:border-[var(--gold)] transition-all font-medium placeholder:text-white/30"
                                    required
                                />
                                <button type="submit" className="h-16 px-10 bg-[var(--gold)] text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 italic">
                                    S'abonner <Mail size={16} />
                                </button>
                            </form>
                            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Zéro Spam • Désinscription en 1 clic</div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
