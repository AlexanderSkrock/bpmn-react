import React from "react";
import { createRoot } from "react-dom/client";

import type { BreadcrumbsProps } from "../../Components/Breadcrumbs";
import { Breadcrumbs } from "../../Components/Breadcrumbs";

export const renderProcessNavigation = (container: HTMLElement, props: BreadcrumbsProps) => {
    const zoomRoot = createRoot(container);
    zoomRoot.render(<Breadcrumbs { ...props } /> );
}
