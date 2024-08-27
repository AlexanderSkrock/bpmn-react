export interface HeatmapOverlayBuilderOptions {
    values: { [key: string]: number};
    opacity?: number,
    renderMode?: "svg" | "canvas";
}