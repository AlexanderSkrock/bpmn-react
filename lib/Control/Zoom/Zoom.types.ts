import type Diagram from "diagram-js/lib/Diagram";
import type { ZoomOptions } from "../../Components/Zoom";

export interface AttachedZoomOptions extends ZoomOptions {
    initialFit?: boolean,
}

export interface ZoomControlProps {
    diagram: Diagram;
    options: ZoomOptions;
    title?: string;
}

export interface ZoomControlGroupProps {
    direction?: "horizontal" | "vertical";
    diagram: Diagram | null;
    options: ZoomOptions;
    zoomInTitle?: string;
    zoomOutTitle?: string;
    zoomFitTitle?: string;
}

