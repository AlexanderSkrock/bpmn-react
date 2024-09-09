import React from "react";
import { createRoot } from "react-dom/client";

import { ZoomControlGroup, ZoomControlGroupProps } from "../../Control/Zoom";

export const renderZoomControl = (container: HTMLElement, props: ZoomControlGroupProps) => {
    const zoomRoot = createRoot(container);
    zoomRoot.render(<ZoomControlGroup { ...props } /> );
}
