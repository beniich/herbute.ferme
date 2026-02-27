'use client';

export default function ResolutionEfficiency() {
    return (
        <section className="bg-primary p-6 rounded-xl text-white shadow-lg shadow-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
                <h4 className="font-bold text-base mb-2">Resolution Efficiency</h4>
                <p className="text-xs text-white/80 mb-6 font-medium">
                    You have resolved 12 more complaints this week than last.
                </p>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-3xl font-black">2.4 days</p>
                        <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest">
                            Avg. Response Time
                        </p>
                    </div>

                    <div className="size-12 rounded-full border-4 border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined filled-icon">trending_down</span>
                    </div>
                </div>
            </div>

            {/* decoration */}
            <div className="absolute -right-4 -bottom-4 size-32 bg-white/10 rounded-full blur-2xl transition-all duration-500 group-hover:bg-white/20"></div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">verified</span>
            </div>
        </section>
    );
}
