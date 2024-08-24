import { min as minValue, max as maxValue, contours, create, geoPath, geoIdentity, scaleSequential, interpolateRgbBasis } from "d3";
import { difference, feature, featureCollection, geometryCollection } from "@turf/turf";

import { ElementLike } from "diagram-js/lib/model/Types";

import { OverlayBuilderEnvironment, OverlayDefinitionsBuilder } from "../BpmnChart/BpmnChart.types"
import { distanceToEdge, getClosest, pointDistance } from "./util";

class HeatmapOverlayBuilder implements OverlayDefinitionsBuilder {

    values: { [key: string]: number };

    minValue: number;
    maxValue: number;

    constructor(values: { [key: string]: number }) {
        this.values = values;

        this.minValue = minValue(Object.values(values)) || 0;
        this.maxValue = maxValue(Object.values(values)) || 0;
    }

    elementFilter = (element: ElementLike) => {
        const elementValue = this.values[element.id];
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
            value: this.values[element.id],
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

        const canvas = create("canvas")
            .attr("width", `${overlayWidth}px`)
            .attr("height", `${overlayHeight}px`)
            .node();
        const renderContext = canvas.getContext("2d");
        renderContext.globalAlpha = 0.25;        

        const color = scaleSequential(interpolateRgbBasis(["green", "yellow", "red"])).domain([this.minValue, this.maxValue]);
        const path = geoPath().projection(geoIdentity().scale(1)).context(renderContext);
       
        nonOverlappingHeatContours.forEach(c => {
            renderContext.fillStyle = color(c.value);
        
            renderContext.beginPath();
            path(c);
            renderContext.fill();
            renderContext.closePath();
        });

        return [{
            type: "Overlay_Heatmap",
            element: env.rootElement().id,
            config: {
                position: {
                    top: overlayOffsetY,
                    left: overlayOffsetX,
                },
                html: canvas,
            },
        }];
    }
}

export default HeatmapOverlayBuilder;