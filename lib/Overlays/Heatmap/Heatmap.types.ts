import { ElementLike } from "diagram-js/lib/model/Types";

export interface HeatDataPoint {
    value: number,
    displayValue?: number | string,
}

export interface HeatmapOptions {
    values: { [key: string]: number | HeatDataPoint };
    opacity?: number,
    renderMode?: "svg" | "canvas";
}

export interface HeatmatrixChunk {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
}

export interface HeatmatrixJobRequestData {
    values: { [key: string]: number };
    elements: ElementLike[],
    xOffset: number;
    yOffset: number;
    width: number;
    height: number; 
    chunk: HeatmatrixChunk;
}

export interface HeatmatrixJobResultData {
    chunk: HeatmatrixChunk;
    result: number[];
}