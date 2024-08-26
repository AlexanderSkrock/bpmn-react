import type Diagram from "diagram-js/lib/Diagram";

export interface ZoomOptions {
    initialZoom?: number;
    step?: number;
    minZoom?: number;
    maxZoom?: number;
}

export interface ZoomInButtonProps {
    onZoomIn: () => void;
}

export interface ZoomOutButtonProps {
    onZoomOut: () => void;
}

export interface ZoomFitButtonProps {
    onZoomFit: () => void;
}

export interface ZoomControlProps {
    diagram: Diagram;
    options: ZoomOptions;
}

export interface ZoomControlGroupProps extends ZoomControlProps {
    direction?: "horizontal" | "vertical"; 
}

