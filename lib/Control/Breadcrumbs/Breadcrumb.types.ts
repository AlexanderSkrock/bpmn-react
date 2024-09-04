import { ReactElement } from "react";

export interface PathEntry {
    key: string;
    name?: string | ReactElement;
}

export interface BreadcrumbProps {
    path: PathEntry;
    onClick?: (path: PathEntry) => void;
    className?: string;
}

export interface BreadcrumbsProps {
    path: PathEntry[];
    onClick?: (path: PathEntry) => void;
    direction?: "horizontal" | "vertical";
    className?: string;
}