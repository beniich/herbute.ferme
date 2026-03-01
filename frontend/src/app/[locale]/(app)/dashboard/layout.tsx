import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col flex-1 h-full">
            <div className="flex flex-1 pt-0 relative">
                <main className="flex-1 p-0 overflow-y-auto h-[calc(100vh-56px)] border-r" style={{ borderColor: 'var(--border)' }}>
                    {children}
                </main>
                <Sidebar />
            </div>
        </div>
    );
}
