import React from "react";

type Props = {
    name: string;
    className?: string;
};

export const Icon = ({ name, className = "" }: Props) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
);
