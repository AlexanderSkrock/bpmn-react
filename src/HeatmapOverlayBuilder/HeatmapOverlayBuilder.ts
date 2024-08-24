import { contours, create, geoPath, geoIdentity, scaleSequential, interpolateRgbBasis, filter } from "d3";
import { difference, feature, featureCollection } from "@turf/turf";

import { ElementLike } from "diagram-js/lib/model/Types";
import { isConnection } from "diagram-js/lib/util/ModelUtil";

import type { HeatmapOverlayBuilderOptions } from "./HeatmapOverlayBuilder.types";

import { OverlayBuilderEnvironment, OverlayDefinitionsBuilder } from "../BpmnChart/BpmnChart.types"
import { getDistances } from "./util";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

class HeatmapOverlayBuilder implements OverlayDefinitionsBuilder {

    options: HeatmapOverlayBuilderOptions;

    color: (value: number) => string;

    constructor(options: HeatmapOverlayBuilderOptions) {
        this.options = {
            renderMode: "svg",
            opacity: 0.25,
            ...options,
        };

        const minValue = Math.min(...Object.values(this.options.values));
        const maxValue = Math.max(...Object.values(this.options.values));
        this.color = scaleSequential(interpolateRgbBasis(["green", "yellow", "red"])).domain([minValue, maxValue]);
    }

    elementFilter = (element: ElementLike) => {
        const elementValue = this.options.values[element.id];
        const hasHeatValue = elementValue !== null && elementValue !== undefined;
        return hasHeatValue || isConnection(element);
    }

    buildDefinitions = (elements: ElementLike[], env: OverlayBuilderEnvironment) => {
        const overlayWidth = env.canvas().viewbox().inner.width;
        const overlayHeight = env.canvas().viewbox().inner.height;

        const overlayOffsetX = env.canvas().viewbox().inner.x;
        const overlayOffsetY = env.canvas().viewbox().inner.y;

        const heatValues = {};
        elements.forEach(element => {
            let value = this.options.values[element.id];
            if (isConnection(element)) {
                const businessObject = getBusinessObject(element);
                const inHeatValue =  this.options.values[businessObject.sourceRef.id];
                const outHeatValue =  this.options.values[businessObject.targetRef.id];
                value = Math.min(inHeatValue, outHeatValue);
            }
            heatValues[element.id] = value;
        });

        const heatMatrix = [];
        for (let rowIndex = 0; rowIndex < overlayHeight; rowIndex++) {
            for (let columnIndex = 0; columnIndex < overlayWidth; columnIndex++) {
                const coordinateX = columnIndex + overlayOffsetX;
                const coordinateY = rowIndex + overlayOffsetY
                
                const distances = getDistances({ x: coordinateX, y: coordinateY }, elements);

                const weigths = Object.fromEntries(elements.map(element => {
                    const distance = distances[element.id];
                    const distanceFactor = isConnection(element)
                        ? (-(1 / Math.pow(10, 2)) * Math.pow(distance, 2)) + 1
                        : (-(1 / Math.pow(50, 2)) * Math.pow(distance, 2)) + 1;
                    const weight = Math.max(distanceFactor, 0);
                    return [element.id, weight];
                }));



                const dividend = elements
                    .filter(element => !Number.isNaN(heatValues[element.id]))
                    .map(element => weigths[element.id] * heatValues[element.id])
                    .reduce((acc, cur) => acc + cur, 0);

                const nonNullWeights = Object.values(weigths).filter(w => w > 0);
                const divisor = nonNullWeights.reduce((acc, cur) => acc + cur, 0);

                let heatValue = Number.NaN;
                if (nonNullWeights.length === 1) {
                    heatValue = dividend;
                } else if (nonNullWeights.length > 1) {
                    heatValue = dividend / divisor;
                }

                heatMatrix[rowIndex * overlayWidth + columnIndex] = heatValue;
            }   
        }        

        const contoursGenerator = contours().size([overlayWidth, overlayHeight]).thresholds(10);
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
                nonOverlappingHeatContours.push({ ...c, ...cleanedContur.geometry });
            } else {
                nonOverlappingHeatContours.push(c);
            }
        }

        const renderFunction = this.options.renderMode === "canvas" ? this.renderContoursToCanvas : this.renderContoursToSvg;

        const htmlElement = renderFunction(overlayWidth, overlayHeight, nonOverlappingHeatContours, this.color)

        return [{
            type: "Overlay_Heatmap",
            element: env.rootElement().id,
            config: {
                position: {
                    top: overlayOffsetY,
                    left: overlayOffsetX,
                },
                html: htmlElement,
            },
        }];
    }

    renderContoursToCanvas = (width, height, heatmapContours) => {
        const canvas = create("canvas")
            .attr("width", `${width}px`)
            .attr("height", `${height}px`)
            .node();

        const renderContext = canvas.getContext("2d");
        const path = geoPath().projection(geoIdentity().scale(1)).context(renderContext);

        renderContext.globalAlpha = this.options.opacity;        

        heatmapContours.forEach(c => {
            renderContext.fillStyle = this.color(c.value);
        
            renderContext.beginPath();
            path(c);
            renderContext.fill();
            renderContext.closePath();
        });

        return canvas;
    }

    renderContoursToSvg = (width, height, heatmapContours) => {
        const svg = create("svg")
            .attr("width", `${width}px`)
            .attr("height", `${height}px`);

        const path = geoPath().projection(geoIdentity().scale(1));

        svg.append("g")
            .selectAll()
            .data(heatmapContours)
            .join("path")
            .attr("d", c => path(c))
            .attr("fill", c => this.color(c.value))
            .attr("fill-opacity", this.options.opacity);

        return svg.node();
    }
}

export default HeatmapOverlayBuilder;