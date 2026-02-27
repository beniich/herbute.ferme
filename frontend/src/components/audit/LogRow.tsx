import { LogEntry } from "@/lib/audit/types";

type Props = {
    entry: LogEntry;
};

export default function LogRow({ entry }: Props) {
    const actionColors: Record<string, { bg: string; text: string }> = {
        LOGIN: { bg: "bg-emerald-100", text: "text-emerald-700" },
        LOGOUT: { bg: "bg-slate-100", text: "text-slate-700" },
        CREATE_TICKET: { bg: "bg-blue-100", text: "text-blue-700" },
        UPDATE_STATUS: { bg: "bg-amber-100", text: "text-amber-700" },
        DELETE: { bg: "bg-red-100", text: "text-red-700" },
    };

    const severityBorder = entry.severity === "critical" ? "border-l-4 border-l-red-500" : "";

    const getActionBadge = () => {
        const key = Object.keys(actionColors).find(k => entry.action.includes(k)) || "DEFAULT";
        const colors = actionColors[key] ?? { bg: "bg-gray-100", text: "text-gray-700" };

        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                {entry.action}
            </span>
        );
    };

    const formatDate = (iso: string) => {
        try {
            const d = new Date(iso);
            const now = new Date();
            const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

            if (diff < 60) return `${diff}s ago`;
            if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
            return d.toLocaleDateString();
        } catch (e) {
            return iso;
        }
    };

    // Helper to format details object or string
    const formatDetails = (details: any) => {
        if (!details) return "-";
        if (typeof details === 'string') return details;
        if (typeof details === 'object') return JSON.stringify(details).substring(0, 50) + (JSON.stringify(details).length > 50 ? '...' : '');
        return String(details);
    };

    return (
        <tr className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group ${severityBorder}`}>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    {entry.userId?.avatar ? (
                        <img
                            src={entry.userId.avatar}
                            alt={`${entry.userId.name} avatar`}
                            className="size-8 rounded-full object-cover bg-slate-200 border border-slate-200 dark:border-slate-700"
                        />
                    ) : (
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined text-xl">
                                person
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{entry.userId?.name || 'System'}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.userId?.role || 'N/A'}</span>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">{getActionBadge()}</td>

            <td className="px-6 py-4">
                <span className="text-sm font-bold text-primary hover:underline cursor-pointer">
                    {entry.targetType ? `${entry.targetType} #${entry.targetId || '?'}` : (entry.targetId || '-')}
                </span>
            </td>

            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium truncate max-w-[200px]" title={typeof entry.details === 'object' ? JSON.stringify(entry.details) : entry.details}>
                {formatDetails(entry.details)}
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatDate(entry.timestamp)}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 text-right">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </td>
        </tr>
    );
}
