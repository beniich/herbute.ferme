import React from 'react';

type TableProps = {
    columns: { header: string; accessor: string }[];
    data: any[];
    className?: string;
};

export const Table = ({ columns, data, className = "" }: TableProps) => (
    <div className={`overflow-x-auto ${className}`}>
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500">
                <tr>
                    {columns.map((col) => (
                        <th key={col.accessor} className="px-4 py-2">
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        {columns.map((col) => (
                            <td key={col.accessor} className="px-4 py-2">
                                {row[col.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
