export interface ZoomOptions {
    initialZoom?: number;
    step?: number;
    minZoom?: number;
    maxZoom?: number;
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
