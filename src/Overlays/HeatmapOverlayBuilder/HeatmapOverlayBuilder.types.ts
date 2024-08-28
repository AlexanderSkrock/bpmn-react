export interface HeatDataPoint {
    value: number,
    displayValue?: number | string,
}

export interface HeatmapOverlayBuilderOptions {
    values: { [key: string]: number | HeatDataPoint };
    opacity?: number,
    renderMode?: "svg" | "canvas";
}
