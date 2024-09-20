import type { DiagramLike } from "../../Diagram";
import { AttachedZoomOptions } from "../../Diagram";

export interface ZoomControlProps {
    diagram: DiagramLike | null;
    options: AttachedZoomOptions;
    title?: string;
}

export interface ZoomControlGroupProps {
    direction?: "horizontal" | "vertical";
    diagram: DiagramLike | null;
    options: AttachedZoomOptions;
    zoomInTitle?: string;
    zoomOutTitle?: string;
    zoomFitTitle?: string;
    className?: string,
}

