import type Diagram from "diagram-js/lib/Diagram";
import type { ZoomOptions } from "../../Components/Zoom";
import type { DiagramLike } from "../../util/services";

export interface AttachedZoomOptions extends ZoomOptions {
    initialFit?: boolean,
}

export interface ZoomControlProps {
    diagram: Diagram;
    options: AttachedZoomOptions;
    title?: string;
}

export interface ZoomControlGroupProps {
    direction?: "horizontal" | "vertical";
    diagramLike: DiagramLike | null;
    options: AttachedZoomOptions;
    zoomInTitle?: string;
    zoomOutTitle?: string;
    zoomFitTitle?: string;
}

