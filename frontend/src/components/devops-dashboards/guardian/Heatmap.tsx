import React from 'react';

export const Heatmap = () => {
    // Generate dummy data
    const cells = Array.from({ length: 64 }).map((_, i) => {
        const value = Math.random();
        let color = "bg-green-500/20";
        if (value > 0.9) color = "bg-red-500";
        else if (value > 0.7) color = "bg-orange-500";
        else if (value > 0.5) color = "bg-yellow-500";

        return <div key={i} className={`h-8 rounded ${color} hover:opacity-80 transition cursor-pointer`} title={`Risk Score: ${(value * 100).toFixed(0)}`} />;
    });

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Risk Heatmap</h3>
            <div className="grid grid-cols-8 gap-2">
                {cells}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-500">
                <span>Low Risk</span>
                <span>Critical Risk</span>
            </div>
            {/* Gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded mt-1" />
        </div>
    );
};
