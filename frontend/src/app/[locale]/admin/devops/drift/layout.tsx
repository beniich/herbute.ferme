'use client';

import { Header } from "@/components/devops-dashboards/layout/Header";
import { Sidebar } from "@/components/devops-dashboards/layout/Sidebar";

export default function DriftLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const items = [
        { href: "/admin/devops/drift", label: "Overview", icon: "dashboard", active: true },
        { href: "/admin/devops/drift/resources", label: "Resource Map", icon: "hub" },
        { href: "/admin/devops/drift/policies", label: "Policies", icon: "policy" },
        { href: "/admin/devops/drift/history", label: "History", icon: "history" },
        { href: "/admin/devops/drift/settings", label: "Settings", icon: "settings" },
    ];
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar items={items} />
                <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {children}
                </main>
            </div>
        </div>
    );
}
