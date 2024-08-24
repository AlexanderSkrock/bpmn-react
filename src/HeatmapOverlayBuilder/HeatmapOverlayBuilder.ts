import { contours, create, geoPath, geoIdentity, scaleSequential, interpolateRgbBasis } from "d3";
import { difference, feature, featureCollection } from "@turf/turf";

import { ElementLike } from "diagram-js/lib/model/Types";

import type { HeatmapOverlayBuilderOptions } from "./HeatmapOverlayBuilder.types";

import { OverlayBuilderEnvironment, OverlayDefinitionsBuilder } from "../BpmnChart/BpmnChart.types"
import { getClosest, pointDistance } from "./util";

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
        return elementValue !== null && elementValue !== undefined;
    }

    buildDefinitions = (elements: ElementLike[], env: OverlayBuilderEnvironment) => {
        const overlayWidth = env.canvas().viewbox().inner.width;
        const overlayHeight = env.canvas().viewbox().inner.height;

        const overlayOffsetX = env.canvas().viewbox().inner.x;
        const overlayOffsetY = env.canvas().viewbox().inner.y;

        const heatPoints = elements.map(element => ({
            position: {
                x: element.x + (element.width / 2),
                y: element.y + (element.height / 2),
            },
            value: this.options.values[element.id],
        }));

        const heatMatrix = [];
        for (let rowIndex = 0; rowIndex < overlayHeight; rowIndex++) {
            for (let columnIndex = 0; columnIndex < overlayWidth; columnIndex++) {
                const coordinateX = columnIndex + overlayOffsetX;
                const coordinateY = rowIndex + overlayOffsetY
                
                const closestPosition = getClosest({ x: coordinateX, y: coordinateY }, heatPoints.map(point => point.position));
                const closestValue = heatPoints.find(point => closestPosition.x === point.position.x && closestPosition.y === point.position.y).value;
                const distance = pointDistance({ x: coordinateX, y: coordinateY }, closestPosition);

                const valueScale = 1 - (Math.min(50, distance) / 50);
                const pointValue = closestValue * valueScale;
                heatMatrix[rowIndex * overlayWidth + columnIndex] = pointValue;
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