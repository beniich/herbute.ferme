export default function DevOpsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {children}
        </div>
    );
}
