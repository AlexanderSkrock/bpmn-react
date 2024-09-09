import { ReactElement } from "react";

export interface PathEntry {
    key: string;
    name?: string | ReactElement;
    onClick?: (path: PathEntry) => void;
}

export interface BreadcrumbProps {
    path: PathEntry;
    onClick?: (path: PathEntry) => void;
    direction?: "horizontal" | "vertical";
    className?: string;
}

export interface BreadcrumbsProps {
    path: PathEntry[];
    onClick?: (path: PathEntry) => void;
    direction?: "horizontal" | "vertical";
    className?: string;
}
