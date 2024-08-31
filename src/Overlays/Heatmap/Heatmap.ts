import { difference, feature, featureCollection } from "@turf/turf";
import { contours, create, geoPath, geoIdentity, scaleSequential, interpolateRgbBasis } from "d3";
import { ContourMultiPolygon } from "d3-contour";

import { ElementLike } from "diagram-js/lib/model/Types";
import { isConnection } from "diagram-js/lib/util/ModelUtil";

import type { OverlayBuilderEnvironment, OverlayDefinitionsBuilder } from "../../BpmnViewer/BpmnViewer.types"
import type { HeatDataPoint, HeatmapOptions } from "./Heatmap.types";

import { calculateInfluenceMaxRange, getDistances } from "./util";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

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
            ...this.createTooltipOverlayDefinitions(elements),
        ];
    }

    createHeatmapOverlayDefinition = (elements: ElementLike[], env: OverlayBuilderEnvironment) => {
        const overlayOverflow = 30;

        const overlayWidth = env.canvas().viewbox().inner.width + overlayOverflow;
        const overlayHeight = env.canvas().viewbox().inner.height + overlayOverflow;

        const overlayOffsetX = env.canvas().viewbox().inner.x - overlayOverflow / 2;
        const overlayOffsetY = env.canvas().viewbox().inner.y - overlayOverflow / 2;

        const heatMatrix = this.calculateHeatMatrix(elements, overlayOffsetX, overlayOffsetY, overlayWidth, overlayHeight);
        const contours = this.calculateContours(heatMatrix, overlayWidth, overlayHeight);

        const renderFunction = this.renderMode === "canvas" ? this.renderContoursToCanvas : this.renderContoursToSvg;
        const htmlElement = renderFunction(overlayWidth, overlayHeight, contours, this.color)

        return {
            type: "Overlay_Heatmap",
            interactive: false,
            element: env.rootElement().id,
            config: {
                position: {
                    top: overlayOffsetY,
                    left: overlayOffsetX,
                },
                html: htmlElement,
            },
        };
    }

    createTooltipOverlayDefinitions = (elements: ElementLike[]) => {
        return elements
            .filter(element => this.values[element.id])
            .map(element => {
                const htmlElement = document.createElement("div");
                htmlElement.style.width = `${element.width}px`;
                htmlElement.style.height = `${element.height}px`;

                const heatDatapoint = this.values[element.id];
                htmlElement.title = `${heatDatapoint.displayValue ?? heatDatapoint.value}`;

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

    calculateHeatMatrix = (elements: ElementLike[], xOffset: number, yOffset: number, width: number, height: number): number[] => {
        const heatValues: { [key: string]: number} = {};
        elements.forEach(element => {
            let value = this.values[element.id]?.value;
            if (isConnection(element)) {
                const businessObject = getBusinessObject(element);
                const inHeatValue =  this.values[businessObject.sourceRef.id]?.value;
                const outHeatValue =  this.values[businessObject.targetRef.id]?.value;
                value = Math.min(inHeatValue, outHeatValue);
            }
            heatValues[element.id] = value;
        });

        const heatMatrix = [];
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            for (let columnIndex = 0; columnIndex < width; columnIndex++) {
                const coordinateX = columnIndex + xOffset;
                const coordinateY = rowIndex + yOffset

                const distances = getDistances({ x: coordinateX, y: coordinateY }, elements);

                const weigths = Object.fromEntries(elements.map(element => {
                    const distance = distances[element.id];

                    const maxInfluence = isConnection(element)
                        ? 0.9
                        : 1.8;
                    const maxRange = isConnection(element)
                        ? 12
                        : calculateInfluenceMaxRange(element, { x: coordinateX, y: coordinateY }, 5);

                    const distanceFactor = -(1 / Math.pow(maxRange, 2)) * Math.pow(distance, 2) + maxInfluence;
                    const weight = Math.max(distanceFactor, 0);
                    return [element.id, weight];
                }));

                const hasInfluence = Object.values(weigths).some(w => w > 0);

                let heatValue = Number.NaN;
                if (hasInfluence) {
                    heatValue = elements
                        .filter(element => !Number.isNaN(heatValues[element.id]))
                        .map(element => weigths[element.id] * heatValues[element.id])
                        .reduce((acc, cur) => acc + cur, 0);

                    const weightsSum = Object.values(weigths).reduce((acc, cur) => acc + cur, 0);
                    if (weightsSum >= 1) {
                        heatValue /= weightsSum;
                    }
                }

                heatMatrix[rowIndex * width + columnIndex] = heatValue;
            }
        }
        return heatMatrix;
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

    renderContoursToCanvas = (width: number, height: number, heatmapContours: ContourMultiPolygon[], color: (value: number) => string): HTMLElement => {
        const canvas = create("canvas")
            .attr("width", `${width}px`)
            .attr("height", `${height}px`)
            .node() as HTMLCanvasElement;
        const renderContext = canvas.getContext("2d") as CanvasRenderingContext2D;
        renderContext.globalAlpha = this.opacity;

        const path = geoPath().projection(geoIdentity().scale(1)).context(renderContext);

        heatmapContours.forEach(c => {
            renderContext.fillStyle = color(c.value);

            renderContext.beginPath();
            path(c);
            renderContext.fill();
            renderContext.closePath();
        });

        return canvas;
    }

    renderContoursToSvg = (width: number, height: number, heatmapContours: ContourMultiPolygon[], color: (value: number) => string): HTMLElement => {
        const svg = create("svg")
            .attr("width", `${width}px`)
            .attr("height", `${height}px`);

        const path = geoPath().projection(geoIdentity().scale(1));

        svg.append("g")
            .selectAll()
            .data(heatmapContours)
            .join("path")
            .attr("d", c => path(c))
            .attr("fill", c => color(c.value))
            .attr("fill-opacity", this.opacity);

        return svg.node() as unknown as HTMLElement;
    }
}

export default Heatmap;
