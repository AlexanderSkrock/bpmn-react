import React, { useCallback, useMemo } from "react";

import { BreadcrumbProps } from "./Breadcrumb.types";
import { joinClassNames } from "../../util/css";

export const breadcrumbClassName = "breadcrumbs";

export default ({ path, onClick, className }: BreadcrumbProps) => {
    const classNames = useMemo(() => joinClassNames(className, breadcrumbClassName), [className]);

    const handleClick = useCallback(() => {
        onClick?.(path)
    }, [path, onClick]);

    return (
        <div onClick={ handleClick } className={ classNames }>
            { path.name ?? path.key }
        </div>
    );
}