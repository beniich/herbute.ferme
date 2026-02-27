import React from 'react';
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Icon } from "./Icon";

type KPICardProps = {
    title: string;
    value: string;
    unit?: string;
    change: string;
    changePositive?: boolean;
    icon: string;
    className?: string;
};

export const KPICard = ({
    title,
    value,
    unit,
    change,
    changePositive = true,
    icon,
    className = ""
}: KPICardProps) => (
    <Card className={`p-5 ${className}`}>
        <div className="flex justify-between items-start">
            <Icon name={icon} className="text-primary text-2xl" />
            <Badge
                variant={changePositive ? "success" : "danger"}
                className="text-xs"
            >
                {change}
            </Badge>
        </div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h4 className="text-2xl font-bold mt-2">
            {value} {unit && <span className="text-sm font-normal">{unit}</span>}
        </h4>
        {/* progress bar dummy */}
        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full w-[72%]" />
        </div>
    </Card>
);
