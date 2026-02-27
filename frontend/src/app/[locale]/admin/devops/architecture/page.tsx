'use client';

import React from 'react';
import {
    Hub,
    Devices,
    Smartphone,
    Engineering,
    DesktopWindows,
    Shield,
    Speed,
    Api,
    Assignment,
    NotificationsActive,
    Inventory2,
    CalendarMonth,
    Payments,
    Database,
    Memory,
    Cloud,
    CreditCard,
    Map,
    Sms,
    Monitoring,
    Terminal,
    VerifiedUser,
    CheckCircle,
    CloudUpload
} from '@/components/icons'; // Note: Assuming Material Symbols or similar are mapped to Lucide or used via className
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Using Lucide icons as fallback for Material Symbols in React
import {
    LayoutGrid,
    ShieldCheck,
    Zap,
    Layers,
    Cpu,
    ExternalLink,
    Activity,
    Lock
} from 'lucide-react';

export default function ArchitecturePage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
            {/* Main Architecture Canvas */}
            <main className="flex-1 p-6 grid-bg">
                <div className="max-w-6xl mx-auto w-full flex flex-col gap-12">

                    {/* Header Info (Integrated in main content for this view) */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold tracking-tight">CMS Ecosystem Architecture</h1>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">High-Level System Topology</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-tighter">Cluster Status: Healthy</span>
                            </div>
                            <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
                                <CloudUpload className="w-4 h-4" />
                                <span>Deploy Changes</span>
                            </Button>
                        </div>
                    </div>

                    {/* Layer 1: Client Layer */}
                    <section className="relative group">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Devices className="w-4 h-4" /> 1. Client Layer
                            </h3>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Presentation Tier</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="p-5 hover:border-primary/50 transition-all cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">v3.2.1</span>
                                </div>
                                <h4 className="font-bold">Citizen Mobile App</h4>
                                <p className="text-xs text-slate-500 mt-1">iOS / Android (Flutter)</p>
                                <div className="mt-4 flex gap-1">
                                    <div className="h-1 flex-1 bg-primary rounded-full"></div>
                                    <div className="h-1 flex-1 bg-primary/20 rounded-full"></div>
                                </div>
                            </Card>
                            <Card className="p-5 hover:border-primary/50 transition-all cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Engineering className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">v2.8.0</span>
                                </div>
                                <h4 className="font-bold">Field Technician App</h4>
                                <p className="text-xs text-slate-500 mt-1">Android Native / Offline First</p>
                                <div className="mt-4 flex gap-1">
                                    <div className="h-1 flex-1 bg-primary rounded-full"></div>
                                    <div className="h-1 flex-1 bg-primary/20 rounded-full"></div>
                                </div>
                            </Card>
                            <Card className="p-5 hover:border-primary/50 transition-all cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <DesktopWindows className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">v4.0.5</span>
                                </div>
                                <h4 className="font-bold">Admin Management</h4>
                                <p className="text-xs text-slate-500 mt-1">React / Tailwind Web Portal</p>
                                <div className="mt-4 flex gap-1">
                                    <div className="h-1 flex-1 bg-primary rounded-full"></div>
                                    <div className="h-1 flex-1 bg-primary rounded-full"></div>
                                </div>
                            </Card>
                        </div>
                    </section>

                    {/* Layer 2: Gateway Layer */}
                    <section className="relative">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-4 h-4" /> 2. Gateway Layer
                            </h3>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-6 relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Edge Security</div>
                                <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                                    <div className="flex-1 flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl w-full text-center">
                                        <Shield className="text-primary mb-2 w-6 h-6" />
                                        <h4 className="font-bold text-sm">WAF (Web App Firewall)</h4>
                                        <p className="text-[10px] text-slate-500">OWASP Top 10 Filter</p>
                                    </div>
                                    <div className="size-12 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30">
                                        <Api className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl w-full text-center">
                                        <Speed className="text-primary mb-2 w-6 h-6" />
                                        <h4 className="font-bold text-sm">Rate Limiting</h4>
                                        <p className="text-[10px] text-slate-500">10k Req/min/IP</p>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="text-xs font-semibold text-primary">Kong API Gateway (OpenResty)</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Layer 3: Service Layer */}
                    <section className="relative">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Layers className="w-4 h-4" /> 3. Service Layer
                            </h3>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Microservices Mesh</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm text-center flex flex-col items-center hover:scale-[1.02] transition-transform cursor-pointer">
                                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3">
                                    <Assignment className="text-primary w-6 h-6" />
                                </div>
                                <h5 className="text-xs font-bold mb-1">Complaint Core</h5>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-green-500 h-full w-[94%]"></div>
                                </div>
                                <span className="text-[9px] text-slate-500 mt-2">v2.1.0 (Golang)</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm text-center flex flex-col items-center hover:scale-[1.02] transition-transform cursor-pointer">
                                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3 text-primary">
                                    <NotificationsActive className="w-6 h-6" />
                                </div>
                                <h5 className="text-xs font-bold mb-1">Notify Engine</h5>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-green-500 h-full w-[99%]"></div>
                                </div>
                                <span className="text-[9px] text-slate-500 mt-2">v1.4.2 (NodeJS)</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm text-center flex flex-col items-center hover:scale-[1.02] transition-transform cursor-pointer">
                                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3 text-primary">
                                    <Inventory2 className="w-6 h-6" />
                                </div>
                                <h5 className="text-xs font-bold mb-1">Stock Hub</h5>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-yellow-500 h-full w-[72%]"></div>
                                </div>
                                <span className="text-[9px] text-slate-500 mt-2">v2.0.1 (Spring)</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm text-center flex flex-col items-center hover:scale-[1.02] transition-transform cursor-pointer">
                                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3 text-primary">
                                    <CalendarMonth className="w-6 h-6" />
                                </div>
                                <h5 className="text-xs font-bold mb-1">Scheduling</h5>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-green-500 h-full w-[88%]"></div>
                                </div>
                                <span className="text-[9px] text-slate-500 mt-2">v1.1.0 (Python)</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm text-center flex flex-col items-center hover:scale-[1.02] transition-transform cursor-pointer">
                                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3 text-primary">
                                    <Payments className="w-6 h-6" />
                                </div>
                                <h5 className="text-xs font-bold mb-1">Billing</h5>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-green-500 h-full w-[95%]"></div>
                                </div>
                                <span className="text-[9px] text-slate-500 mt-2">v3.0.0 (Rust)</span>
                            </div>
                        </div>
                    </section>

                    {/* Layer 4: Persistence & External */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <section className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Database className="w-4 h-4" /> 4. Persistence Layer
                                </h3>
                            </div>
                            <div className="bg-slate-900/50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="size-14 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mb-3 text-blue-500">
                                        <Database className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-bold text-sm">PostgreSQL</h4>
                                    <p className="text-[10px] text-slate-500">Relational / ACID</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="size-14 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-3 text-red-500">
                                        <Memory className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-bold text-sm">Redis Cluster</h4>
                                    <p className="text-[10px] text-slate-500">In-Memory / Pub-Sub</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="size-14 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20 mb-3 text-orange-500">
                                        <Cloud className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-bold text-sm">AWS S3</h4>
                                    <p className="text-[10px] text-slate-500">Blob Storage</p>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> 5. External APIs
                                </h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors cursor-pointer">
                                    <div className="text-slate-400"><CreditCard className="w-5 h-5" /></div>
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold">Stripe Payment</h5>
                                        <p className="text-[10px] text-slate-500">Finance Gateway</p>
                                    </div>
                                    <div className="size-2 bg-green-500 rounded-full" />
                                </div>
                                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors cursor-pointer">
                                    <div className="text-slate-400"><Map className="w-5 h-5" /></div>
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold">Google Maps</h5>
                                        <p className="text-[10px] text-slate-500">Geolocation Hub</p>
                                    </div>
                                    <div className="size-2 bg-green-500 rounded-full" />
                                </div>
                                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors cursor-pointer">
                                    <div className="text-slate-400"><Sms className="w-5 h-5" /></div>
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold">Twilio SMS</h5>
                                        <p className="text-[10px] text-slate-500">Unified Messaging</p>
                                    </div>
                                    <div className="size-2 bg-green-500 rounded-full" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Side Legend & Legend (Overlay style) */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
                <Card className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-2xl border-primary/20 w-64">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                        <Monitoring className="w-4 h-4" /> Ops Console
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Uptime (Pro)</span>
                            <span className="text-green-500 font-bold">99.99%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[98%] rounded-full" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-primary/5 rounded border border-primary/10 text-[10px]">
                            <span className="font-bold">Latest Deploy</span>
                            <span className="text-slate-500">2m ago</span>
                        </div>
                    </div>
                </Card>
            </div>

            <style jsx>{`
                .grid-bg {
                    background-image: radial-gradient(#1e293b 1px, transparent 1px);
                    background-size: 32px 32px;
                }
            `}</style>
        </div>
    );
}
