'use client';

import Link from 'next/link';

export default function SystemInfoPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <span className="material-symbols-outlined text-white">account_tree</span>
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Municipal Portal</h1>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-9">
                            <Link href="/dashboard" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
                            <Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Work Orders</Link>
                            <Link href="/admin/info" className="text-sm font-bold text-primary border-b-2 border-primary py-4">System Info</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-10">
                {/* Hero Section */}
                <section className="mb-16">
                    <div className="flex flex-col md:flex-row items-center gap-10 bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
                        <div className="flex-1 z-10">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase rounded-full mb-4">Operations Guide</span>
                            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] mb-4 text-slate-900 dark:text-white">
                                Operational Workflow
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
                                Our mission is to ensure service efficiency and rapid response to municipal needs through a streamlined, automated lifecycle management system.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                    System Demo
                                </button>
                                <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Download Documentation
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-md relative hidden md:block">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
                            {/* Placeholder generic abstract image */}
                            <img className="rounded-xl relative z-10 shadow-2xl border border-slate-200 dark:border-slate-700 grayscale hover:grayscale-0 transition-all duration-500" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Workflow Dashboard" />
                        </div>
                    </div>
                </section>

                {/* Step-by-Step Infographic */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">The Service Lifecycle</h2>
                        <p className="text-slate-500 dark:text-slate-400">From initial contact to final resolution, every step is tracked and optimized.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                        <div className="hidden md:block absolute top-[44px] left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-0"></div>

                        {[
                            { step: '01', title: 'Intake', icon: 'call', desc: 'Customer initiates a request via call, message, or app portal.' },
                            { step: '02', title: 'Log', icon: 'app_registration', desc: 'Complaint is digitized and categorized by priority and type.' },
                            { step: '03', title: 'Dispatch', icon: 'assignment_ind', desc: 'System assigns the task to the nearest qualified specialized team.' },
                            { step: '04', title: 'Action', icon: 'engineering', desc: 'Field intervention takes place with real-time status updates.' },
                            { step: '05', title: 'Finalize', icon: 'verified_user', desc: 'Resolution is verified, documented, and the ticket is closed.' }
                        ].map((item, index) => (
                            <div key={item.step} className="flex flex-col items-center text-center group z-10">
                                <div className={`size-20 rounded-full bg-white dark:bg-slate-900 border-4 ${index === 0 ? 'border-primary text-primary' : 'border-slate-200 dark:border-slate-800 text-slate-400 group-hover:border-primary group-hover:text-primary'} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-all duration-300`}>
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${index === 0 ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>Step {item.step}</span>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Capabilities Grid */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Capabilities</h2>
                            <p className="text-slate-500 dark:text-slate-400">Expertise sectors available for field assignment.</p>
                        </div>
                        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                            View All Departments <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Water & Sewage', icon: 'water_drop', color: 'blue', desc: 'Leak repairs, pipeline maintenance, and waste-water management systems.' },
                            { title: 'Electrical', icon: 'bolt', color: 'amber', desc: 'Grid stability, street lighting repairs, and public facility power audits.' },
                            { title: 'Carpentry', icon: 'carpenter', color: 'orange', desc: 'Public furniture restoration, structural repairs, and signage installation.' },
                            { title: 'Sanitation', icon: 'delete_sweep', color: 'green', desc: 'Waste collection schedules, public hygiene maintenance, and recycling programs.' }
                        ].map((team) => (
                            <div key={team.title} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg transition-all cursor-default group">
                                <div className={`size-12 rounded-lg bg-${team.color}-100 dark:bg-${team.color}-900/20 text-${team.color}-600 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors`}>
                                    <span className="material-symbols-outlined">{team.icon}</span>
                                </div>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{team.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{team.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Dashboard Statistics Brief */}
                <section className="mb-10 p-8 rounded-xl bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">Real-time Performance</h2>
                        <p className="text-white/80 leading-relaxed">The system currently manages 1,240 active work orders with a 94% on-time resolution rate across all sectors.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-6 border-r border-white/20">
                            <div className="text-3xl font-black">12m</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-white/70">Avg response</div>
                        </div>
                        <div className="text-center px-6">
                            <div className="text-3xl font-black">89</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-white/70">Active Teams</div>
                        </div>
                    </div>
                    <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors whitespace-nowrap shadow-lg">
                        View Active Dashboard
                    </button>
                </section>
            </main>
        </div>
    );
}

