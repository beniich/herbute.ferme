import React from 'react';
import { Icon } from "../ui/Icon";

export const Footer = () => (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-2 z-40 hidden md:flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500" />
                <span className="uppercase">System Core: Operational</span>
            </div>
            <div className="flex items-center gap-2">
                <Icon name="speed" className="text-xs text-slate-400" />
                <span className="uppercase">P95 Latency: 42ms</span>
            </div>
            <div className="flex items-center gap-2">
                <Icon name="memory" className="text-xs text-slate-400" />
                <span className="uppercase">Global CPU: 14%</span>
            </div>
        </div>
        <div className="flex gap-4">
            <span>V2.4.0-stable</span>
            <span>|</span>
            <span>Last Scan: 12:44:01 GMT</span>
        </div>
    </footer>
);
