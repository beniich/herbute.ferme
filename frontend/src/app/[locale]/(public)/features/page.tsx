'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { 
    Zap, 
    ShieldCheck, 
    BarChart3, 
    Layers, 
    Cpu, 
    Globe, 
    Smartphone, 
    Cloud, 
    Users, 
    Clock, 
    Map as MapIcon, 
    CheckCircle2,
    ArrowRight,
    Search,
    Bell,
    Settings,
    Database,
    LineChart,
    PieChart,
    Calendar,
    CloudRain
} from 'lucide-react';

export default function FeaturesPage() {
    return (
        <div className="bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[var(--green)] selection:text-white">
            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-48 lg:pt-48 lg:pb-64 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,var(--green)_0%,transparent_50%)] opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-[var(--gold)] opacity-5 blur-[150px] rounded-full"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/50 backdrop-blur-md border border-[var(--green)]/20 text-[var(--green)] text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-sm italic animate-fade-in">
                            <Zap className="w-4 h-4" />
                            Puissance & Précision
                        </div>
                        <h1 className="text-6xl md:text-[8rem] font-black text-[var(--text)] mb-12 leading-[0.85] tracking-tighter uppercase italic">
                            L'Arsenal <br />
                            <span className="text-[var(--gold)] not-italic underline underline-offset-[16px] decoration-8 decoration-[var(--green)]">Technologique.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-[var(--text2)] max-w-4xl mx-auto mb-16 font-normal leading-relaxed opacity-80 italic">
                            Chaque outil d'<span className="text-[var(--green)] font-black">AgroMaître</span> est forgé pour transformer la complexité de la terre en simplicité opérationnelle.
                        </p>
                    </div>
                </section>

                {/* Main Features Grid */}
                <section className="py-32 px-6 relative bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: <Globe className="w-10 h-10" />,
                                    title: "Scanning Satellite",
                                    desc: "Analyse multispectrale infrarouge pour détecter le stress hydrique et azoté avant l'œil humain.",
                                    detail: "Résolution 10x supérieure aux standards."
                                },
                                {
                                    icon: <Cpu className="w-10 h-10" />,
                                    title: "Cerveau Prédictif IA",
                                    desc: "Modèles de Deep Learning prédisant les maladies et les besoins en engrais par parcelle.",
                                    detail: "98.7% de précision constatée."
                                },
                                {
                                    icon: <Database className="w-10 h-10" />,
                                    title: "Registre Digital",
                                    desc: "Archivage automatisé de chaque opération culturale pour une traçabilité sans faille.",
                                    detail: "Prêt pour les audits export."
                                },
                                {
                                    icon: <LineChart className="w-10 h-10" />,
                                    title: "Analytique Financière",
                                    desc: "Tableaux de bord des coûts de revient en temps réel et prévisions de marges.",
                                    detail: "Optimisation du ROI."
                                },
                                {
                                    icon: <CloudRain className="w-10 h-10" />,
                                    title: "Météo de Précision",
                                    desc: "Données hyper-locales à 1km² pour planifier vos interventions au moment idéal.",
                                    detail: "Alertes gel et canicule."
                                },
                                {
                                    icon: <Layers className="w-10 h-10" />,
                                    title: "Gestion d'Équipe",
                                    desc: "Assignation de tâches, géolocalisation des équipes et suivi de la productivité terrain.",
                                    detail: "Coordination simplifiée."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="group p-12 bg-[var(--bg)] rounded-[3.5rem] border border-[var(--border)] hover:border-[#FE7F2D] transition-all hover:shadow-electric hover:-translate-y-4 duration-500 relative overflow-hidden">
                                    <div className="mb-10 text-[var(--green)] group-hover:scale-110 transition-transform duration-500">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-[var(--text)] mb-6 uppercase italic tracking-tighter">{feature.title}</h3>
                                    <p className="text-[var(--text2)] leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity mb-8 font-normal">{feature.desc}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-[var(--green)] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity italic">
                                        <CheckCircle2 size={12} />
                                        {feature.detail}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Deep Dive Feature */}
                <section className="py-48 bg-[var(--sidebar-bg)] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-12">
                                <div className="text-[var(--gold)] font-black text-[10px] uppercase tracking-[0.5em] italic">Focus Innovation</div>
                                <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none mb-10">
                                    L'Interface <br />
                                    <span className="text-[var(--green)] not-italic underline underline-offset-8 decoration-white/20">Invisible.</span>
                                </h2>
                                <p className="text-xl text-white/60 leading-relaxed font-normal italic">
                                    Nous avons conçu AgroMaître pour qu'il s'efface derrière votre métier. Une technologie qui ne demande pas d'efforts, mais qui démultiplie vos résultats par la simplicité.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        "Installation sans câblage (Low-Power Wide-Area Network)",
                                        "Application mobile hors-ligne pour zones blanches",
                                        "Intégration API avec les principaux fabricants de machines",
                                        "Assistance agronomique par chat IA 24/7"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-white/80 group">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[var(--gold)] transition-colors">
                                                <ArrowRight size={16} />
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-widest italic">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative group p-1 bg-white/10 rounded-[4rem] backdrop-blur-3xl overflow-hidden border border-white/20 shadow-electric animate-pulse-electric">
                                <div className="h-[600px] w-full bg-[#1a1a1a] rounded-[3.8rem] relative flex items-center justify-center p-12 text-center">
                                    <div className="space-y-8 animate-fade-in">
                                        <Layers className="w-32 h-32 mx-auto text-[var(--gold)] opacity-50" />
                                        <h4 className="text-3xl font-black italic uppercase tracking-tighter">Tableau de Bord Élite</h4>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Flux Live de Données Multisectorielles</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 px-6">
                    <div className="max-w-5xl mx-auto rounded-[4rem] bg-white p-16 lg:p-24 text-center border-2 border-[var(--border)] relative overflow-hidden shadow-2xl group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--green)]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                        <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none mb-12 text-[var(--text)]">
                            Prêt à Libérer Votre <br />
                            <span className="text-[var(--gold)] not-italic underline underline-offset-8">Potentiel ?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <Link href="/register" className="w-full sm:w-auto px-12 py-6 bg-[#FE7F2D] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-electric italic">
                                Démarrer l'Essai
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto px-12 py-6 bg-transparent border-2 border-[var(--border)] text-[var(--text)] rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[var(--bg3)] transition-all flex items-center justify-center gap-4 italic group">
                                Voir une Démo <Search size={18} className="text-[var(--green)]" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
