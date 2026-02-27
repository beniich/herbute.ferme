'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
} from 'recharts';

interface TrendData {
    month: string;
    value: number;
}

export default function TrendChart({ data = [] }: { data?: TrendData[] }) {
    return (
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Satisfaction Trends</h4>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Weekly
                    </button>
                    <button className="px-3 py-1 text-xs rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                        Monthly
                    </button>
                </div>
            </div>

            <div className="h-64 relative w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2424eb" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#2424eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            labelStyle={{ color: '#64748b', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}
                            itemStyle={{ color: '#2424eb', fontWeight: 800, fontSize: '14px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#2424eb"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
