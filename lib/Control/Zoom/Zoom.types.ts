import type Diagram from "diagram-js/lib/Diagram";

export interface ZoomOptions {
    initialZoom?: number;
    step?: number;
    minZoom?: number;
    maxZoom?: number;
}

export interface AttachedZoomOptions extends ZoomOptions {
    initialFit?: boolean,
}

export interface ZoomInButtonProps {
    onZoomIn: () => void;
    title?: string;
}

export interface ZoomOutButtonProps {
    onZoomOut: () => void;
    title?: string;
}

export interface ZoomFitButtonProps {
    onZoomFit: () => void;
    title?: string;
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

