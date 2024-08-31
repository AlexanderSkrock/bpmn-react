export interface HeatDataPoint {
    value: number,
    displayValue?: number | string,
}

export interface HeatmapOptions {
    values: { [key: string]: number | HeatDataPoint };
    opacity?: number,
    renderMode?: "svg" | "canvas";
}
