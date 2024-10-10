import { ContourMultiPolygon } from "d3";
import { ElementLike } from "diagram-js/lib/model/Types";

/**
 * Data object which holds information for a single activity.
 */
export interface HeatDataPoint {
    /**
     * The raw technical heat value.
     */
    value: number,
    /**
     * An optional value which is used solely for display purposes.
     * This could be the technical value extended by a unit for example.
     */
    displayValue?: number | string,
}

/**
 * Options to configure the heatmap overlay.
 */
export interface HeatmapOptions {
    /**
     * Mapping to define data per activity.
     */
    values: { [key: string]: number | HeatDataPoint };
    /**
     * Possibility to modify the opacity of the heatmap overlay.
     */
    opacity?: number,
    /**
     * Configuration option to decide whether this overlay is rendered as svg or canvas.
     */
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

export interface Renderer {
    init: (options: RendererInitOptions) => void;
    render: (contour: ContourMultiPolygon, options: RendererRenderOptions) => void;
    element: () => HTMLElement;
}

export interface RendererInitOptions {
    width: number;
    height: number;
}

export interface RendererRenderOptions {
    color: string;
    opacity: number;
}
