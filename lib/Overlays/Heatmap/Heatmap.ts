import { difference, feature, featureCollection } from "@turf/turf";
import { contours, create, geoPath, geoIdentity, scaleSequential, interpolateRgbBasis } from "d3";
import { ContourMultiPolygon } from "d3-contour";

import { ElementLike } from "diagram-js/lib/model/Types";
import { isConnection } from "diagram-js/lib/util/ModelUtil";

import type { OverlayBuilderEnvironment, OverlayDefinitionsBuilder } from "../../Modules/DynamicOverlays"
import type { HeatDataPoint, HeatmapOptions, HeatmatrixJobResultData, Renderer } from "./Heatmap.types";

import { getBusinessObject, isAny as isAnyType } from "bpmn-js/lib/util/ModelUtil";
import asyncHtmlElement from "../asyncHtmlElement";
import { chunks2D, clamp } from "../../util/math";
import CanvasRenderer from "./CanvasRenderer";
import SvgRenderer from "./SvgRenderer";
import { contours, nonOverlappingContours } from "../../util/geometry";

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

        const renderer = this.renderMode === "canvas" ? new CanvasRenderer() : new SvgRenderer();
        renderer.init({ width: overlayWidth, height: overlayHeight });
        this.renderHeatMatrix(renderer, elements, overlayOffsetX, overlayOffsetY, overlayWidth, overlayHeight);

        return {
            type: "Overlay_Heatmap",
            interactive: false,
            element: env.rootElement().id,
            config: {
                position: {
                    top: overlayOffsetY,
                    left: overlayOffsetX,
                },
                html: renderer.element(),
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

    renderHeatMatrix = (renderer: Renderer, elements: ElementLike[], xOffset: number, yOffset: number, width: number, height: number): void => {
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

        const recommendedWorkerCount = Math.floor(width * height / 200000);
        const workerCount =  clamp(recommendedWorkerCount, 1, 4);
        const workers: Worker[] = [];
        for (let i = 0; i < workerCount; i++) {
            const opacity = this.opacity;
            const colorFunc = this.color;
            
            const worker = new Worker(new URL("./heatmap.worker", import.meta.url), {
                type: "module",
            });
            worker.onmessage = function(message: MessageEvent<HeatmatrixJobResultData>) {
                const { result } = message.data;

                const contours = nonOverlappingContours(result, width, height, 10);
                contours.forEach(c => {
                    renderer.render(c, { color: colorFunc(c.value), opacity: opacity });
                });
            }
            workers.push(worker);
        }

        const chunks = chunks2D({ width, height, chunkWidth: 500, chunkHeight: 500 });
        chunks.forEach((chunk, index) => {
            workers[index % workerCount].postMessage({ values: heatValues, elements, xOffset, yOffset, width, height, chunk });
        });
    }
}

export default Heatmap;
