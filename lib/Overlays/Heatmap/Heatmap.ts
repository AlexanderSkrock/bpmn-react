import { difference, feature, featureCollection } from "@turf/turf";
import { contours, create, geoPath, geoIdentity, scaleSequential, interpolateRgbBasis } from "d3";
import { ContourMultiPolygon } from "d3-contour";

import { ElementLike } from "diagram-js/lib/model/Types";
import { isConnection } from "diagram-js/lib/util/ModelUtil";

import type { OverlayBuilderEnvironment, OverlayDefinitionsBuilder } from "../../Modules/DynamicOverlays"
import type { HeatDataPoint, HeatmapOptions, HeatmatrixJobResultData } from "./Heatmap.types";

import { getBusinessObject, isAny as isAnyType } from "bpmn-js/lib/util/ModelUtil";
import asyncHtmlElement from "../asyncHtmlElement";
import { clamp } from "../../util/math";
import CanvasRenderer from "./CanvasRenderer";
import SvgRenderer from "./SvgRenderer";

class Heatmap implements OverlayDefinitionsBuilder {

    renderMode: "svg" | "canvas" = "svg";
    opacity: number = 0.25;

    values: { [key: string]: HeatDataPoint };

    color: (value: number) => string;

    constructor(options: HeatmapOptions) {
        if (options.renderMode) {
            this.renderMode = options.renderMode;
        }

        if (options.opacity != null && options.opacity != undefined) {
            this.opacity = options.opacity;
        }

        const cleanedValues: { [key: string]: HeatDataPoint } = {};
        Object.entries(options.values).forEach(([id, dataPoint]) => {
            if (typeof dataPoint === "number") {
                cleanedValues[id] = { value: dataPoint };
            } else {
                cleanedValues[id] = dataPoint;
            }
        });
        this.values = cleanedValues;



        const minValue = Math.min(...Object.values(this.values).map(dataPoint => dataPoint.value));
        const maxValue = Math.max(...Object.values(this.values).map(dataPoint => dataPoint.value));
        this.color = scaleSequential(interpolateRgbBasis(["green", "yellow", "red"])).domain([minValue, maxValue]);
    }

    elementFilter = (element: ElementLike) => {
        const hasHeatValue = !!this.values[element.id];
        return hasHeatValue || isConnection(element);
    }

    buildDefinitions = (elements: ElementLike[], env: OverlayBuilderEnvironment) => {
        return [
            this.createHeatmapOverlayDefinition(elements, env),
            ...this.createTooltipOverlayDefinitions(elements, env),
        ];
    }

    createHeatmapOverlayDefinition = (elements: ElementLike[], env: OverlayBuilderEnvironment) => {
        const overlayOverflow = 30;

        const overlayWidth = env.canvas().viewbox().inner.width + overlayOverflow;
        const overlayHeight = env.canvas().viewbox().inner.height + overlayOverflow;

        const overlayOffsetX = env.canvas().viewbox().inner.x - overlayOverflow / 2;
        const overlayOffsetY = env.canvas().viewbox().inner.y - overlayOverflow / 2;

        const heatmapStart = performance.now();

        const futureHtmlElement = this.calculateHeatMatrix(elements, overlayOffsetX, overlayOffsetY, overlayWidth, overlayHeight)
            .then(heatMatrix => {
                const heatmapPreContours = performance.now();
                console.debug(`Heatmatrix calculation duration: ${heatmapPreContours - heatmapStart}`);
                const result = this.calculateContours(heatMatrix, overlayWidth, overlayHeight)
                console.debug(`Heatmap contours calculation duration: ${performance.now() - heatmapPreContours}`);
                return result;
            })
            .then(contours => {
                const renderFunction = this.renderMode === "canvas" ? this.renderContoursToCanvas : this.renderContoursToSvg;
                const heatmapPreRender = performance.now();
                const result = renderFunction(overlayWidth, overlayHeight, contours, this.color);
                console.debug(`Heatmap render duration: ${performance.now() - heatmapPreRender}`);
                return result;
            });

        return {
            type: "Overlay_Heatmap",
            interactive: false,
            element: env.rootElement().id,
            config: {
                position: {
                    top: overlayOffsetY,
                    left: overlayOffsetX,
                },
                html: asyncHtmlElement(futureHtmlElement),
            },
        };
    }

    createTooltipOverlayDefinitions = (elements: ElementLike[], env: OverlayBuilderEnvironment) => {
        return elements
            .filter(element => this.values[element.id])
            .map(element => {
                const htmlElement = document.createElement("div");
                htmlElement.style.width = `${element.width}px`;
                htmlElement.style.height = `${element.height}px`;

                const heatDatapoint = this.values[element.id];
                htmlElement.title = `${heatDatapoint.displayValue ?? heatDatapoint.value}`;

                htmlElement.onclick = (event) => env.delegateEvent("element.click", event, element);

                return {
                        type: "Overlay_Heatmap_Tooltip",
                        interactive: true,
                        element: element.id,
                        config: {
                        position: {
                            top: 0,
                            left: 0,
                        },
                        html: htmlElement
                    }
                };
            });
    }

    calculateHeatMatrix = (elements: ElementLike[], xOffset: number, yOffset: number, width: number, height: number): Promise<number[]> => {
        const heatValues: { [key: string]: number} = {};

        elements.forEach(element => {
            let value = this.values[element.id]?.value;
            if (isConnection(element)) {
                const businessObject = getBusinessObject(element);
                const inHeatValue = this.values[businessObject.sourceRef.id]?.value;
                const outHeatValue =  this.values[businessObject.targetRef.id]?.value;
                value = Math.min(inHeatValue, outHeatValue);
            }
            heatValues[element.id] = value;
        });

        return new Promise((resolve) => {
            const workerCount = clamp((width * height) / 200000, 1, 8);
            const workers: Worker[] = [];

            const chunks: { startX: number, endX: number, startY: number, endY: number, done?: boolean }[] = [];
            const heatMatrix = new Array(width * height).fill(Number.NaN);

            for (let i = 0; i < workerCount; i++) {
                workers[i] = new Worker(new URL("./heatmap.worker", import.meta.url), {
                    type: "module",
                });
                workers[i].onmessage = function(message: MessageEvent<HeatmatrixJobResultData>) {
                    const { chunk: finishedChunk, result } = message.data;
                    const { startX, endX, startY, endY } = finishedChunk;

                    // TODO Consider more performant replacement
                    for (let rowIndex = startY; rowIndex < endY; rowIndex++) {
                        for (let columnIndex = startX; columnIndex < endX; columnIndex++) {
                            heatMatrix[rowIndex * width + columnIndex] = result[rowIndex * width + columnIndex];
                        }
                    }

                    const chunkReference = chunks.find(chunk => chunk.startX === finishedChunk.startX
                        && chunk.endX === finishedChunk.endX
                        && chunk.startY === finishedChunk.startY
                        && chunk.endY === finishedChunk.endY);

                    // TODO terminate worker
                    if (chunkReference) {
                        chunkReference.done = true;
                    }

                    if (chunks.every(chunk => chunk.done)) {
                        resolve(heatMatrix);
                    }
                };
            }

            const chunkHeight = Math.ceil(height / workerCount);
            for (let i = 0; i < workerCount; i++) {
                const startRow = i * chunkHeight;
                const endRow = Math.min(startRow + chunkHeight, height);
                chunks.push({ startX: 0, endX: width, startY: startRow, endY: endRow, done: false });
            }

            chunks.forEach((chunk, index) => {
                workers[index].postMessage({ values: heatValues, elements, xOffset, yOffset, width, height, chunk });
            });
        });
    }

    calculateContours = (heatMatrix: number[], width: number, height: number): ContourMultiPolygon[] => {
        const contoursGenerator = contours().size([width, height]).thresholds(10);
        const heatContours = contoursGenerator(heatMatrix);

        const nonOverlappingHeatContours = [];
        for (let i = 0; i < heatContours.length; i++) {
            const c = heatContours[i];
            const nextC = heatContours[i + 1];
            if (nextC) {
                const cleanedContur = difference(featureCollection([
                    feature(c),
                    feature(nextC),
                ]));
                if (cleanedContur) {
                    const cleanedGeometry = { ...c, ...cleanedContur.geometry } as ContourMultiPolygon
                    nonOverlappingHeatContours.push(cleanedGeometry);
                }
            } else {
                nonOverlappingHeatContours.push(c);
            }
        }
        return nonOverlappingHeatContours;
    }

    renderContoursToCanvas = (width: number, height: number, heatmapContours: ContourMultiPolygon[], color: (value: number) => string): Element => {
        const renderer = new CanvasRenderer();
        renderer.init({ width, height });

        heatmapContours.forEach(c => {
            renderer.render(c, { color: color(c.value), opacity: this.opacity });
        });

        return renderer.element();
    }

    renderContoursToSvg = (width: number, height: number, heatmapContours: ContourMultiPolygon[], color: (value: number) => string): Element => {
        const renderer = new SvgRenderer();
        renderer.init({ width, height });

        heatmapContours.forEach(c => {
            renderer.render(c, { color: color(c.value), opacity: this.opacity });
        });

        return renderer.element();
    }
}

export default Heatmap;
