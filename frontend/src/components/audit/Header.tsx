import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-6 py-3 bg-white dark:bg-slate-900 sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-primary">
                    <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
                        <span className="material-symbols-outlined">shield_person</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold">
                        AuditGuard
                    </h2>
                </div>

                <label className="flex flex-col min-w-40 h-10 max-w-64">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                        <div className="text-slate-500 dark:text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 dark:bg-slate-800 focus:ring-0 h-full placeholder:text-slate-500 text-sm rounded-r-lg"
                            placeholder="Quick search..."
                        />
                    </div>
                </label>
            </div>

            <div className="flex flex-1 justify-end gap-6 items-center">
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="#"
                        className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="#"
                        className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
                    >
                        Complaints
                    </Link>
                    <Link
                        href="#"
                        className="text-primary text-sm font-bold border-b-2 border-primary py-4"
                    >
                        Audit Logs
                    </Link>
                    <Link
                        href="#"
                        className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
                    >
                        Users
                    </Link>
                    <Link
                        href="#"
                        className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
                    >
                        Settings
                    </Link>
                </nav>

                <div className="flex gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
                    <ThemeToggle />
                    <button className="relative flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                    <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                </div>

                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDV1AEiw5lhhGlA8g6VCq5vynT9vJOk9K0ZlcFkSUubAX20qXil2HLlq22lDQNZH8PmhyN4F3aWb2hzqoVg3uRW2pJFYRMxHWf9NyNPgnrS3cBYPPRKZS4NXkoRmy5CuECauhonpCJnwZI67WQIUHT1Ti11oCP_9QkQxAjaUdSXS2FaY7jq2u56OZ9KHntn5CRsUiaGU7WyCyemk_loBgzvKBKCzflrdrM-oTVA25EeQE1y04_4CyVhWrvBl513t_NOaGIXJ-MRbH1")',
                    }}
                ></div>
            </div>
        </header>
    );
}
