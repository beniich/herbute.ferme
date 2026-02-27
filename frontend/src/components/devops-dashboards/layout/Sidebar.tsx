import Link from "next/link";
import { Icon } from "../ui/Icon";

type MenuItem = {
    href: string;
    label: string;
    icon: string;
    active?: boolean;
};

export const Sidebar = ({ items }: { items: MenuItem[] }) => (
    <aside className="w-20 group/sidebar hover:w-64 transition-all duration-300 flex-shrink-0 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark flex flex-col h-full overflow-hidden">
        <div className="p-6 flex items-center gap-3">
            <div className="bg-primary text-white p-1.5 rounded-lg flex-shrink-0">
                <Icon name="shield_lock" className="text-2xl" />
            </div>
            <h1 className="text-xl font-bold tracking-tight opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">Guardian AI</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {items.map((it) => (
                <Link
                    key={it.href}
                    href={it.href}
                    title={it.label}
                    className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all ${it.active
                            ? "bg-primary/10 text-primary font-bold shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <Icon name={it.icon} />
                    </div>
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {it.label}
                    </span>
                </Link>
            ))}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-border-dark space-y-4">
            <button title="New Discovery Scan" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20 overflow-hidden">
                <Icon name="potted_plant" className="text-lg flex-shrink-0" />
                <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">Scan</span>
            </button>

            <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuADoeni967R9acnSVqMmN6AyTKdN6GFbI_bpxOrBaBTbz22AIUtOgte_nXahplAwsBVnyVMtqMv-puB3NgAbTOwtKyqc62lM4ovQ-k0ZpoR-MBOEo6NbOemzp-F0l219WSnwTJnwOvigWRWMCJxIUR7amT2krNVkIbUa2tP_aNgg4wgUHQhvLqaZbmMQEXyoay-oBknste_vfVKyCZXkNKyZCibxA9YKW8RKN50ztNNhk1uDIBjShC9Mk5smzup0pU7Jqt9k5Bsvr-_"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
                    <p className="text-xs font-semibold truncate">Admin User</p>
                    <p className="text-[10px] text-slate-500 truncate">SecOps</p>
                </div>
                <Icon name="settings" className="text-slate-400 group-hover/sidebar:block hidden" />
            </div>
        </div>
    </aside>
);
