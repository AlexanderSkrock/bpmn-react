import { min as minValue, max as maxValue, contours, create, geoPath, geoIdentity, scaleSequential, interpolateRgbBasis } from "d3";
import { difference, feature, featureCollection, geometryCollection } from "@turf/turf";

import { ElementLike } from "diagram-js/lib/model/Types";

import { MultipleOverlayDefinitionBuilder } from "../BpmnChart/BpmnChart.types"
import { distanceToEdge, pointDistance } from "./util";

class HeatmapOverlayBuilder implements MultipleOverlayDefinitionBuilder {

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

    buildDefinition = (element: ElementLike) => {
        const elementValue = this.values[element.id];
        const centerX = element.width / 2;
        const centerY = element.height / 2;

        const overlayOverflow = 10;
        const overlayWidth = element.width + (2 * overlayOverflow);
        const overlayHeight = element.height + (2 * overlayOverflow);

        const heatValues = [];
        for (let rowIndex = 0; rowIndex < overlayHeight; rowIndex++) {
            for (let columnIndex = 0; columnIndex < overlayWidth; columnIndex++) {
                const coordinateX = columnIndex - overlayOverflow;
                const coordinateY = rowIndex - overlayOverflow;

                const centerToPoint = pointDistance(
                    { x: centerX, y: centerY },
                    { x: coordinateX, y: coordinateY }
                );
                const centerToEdge = distanceToEdge(
                    centerX, centerY, element.width, element.height,
                    coordinateX, coordinateY
                );
                const valueScale = 1 - (centerToPoint / centerToEdge);
                const pointValue = elementValue * valueScale;
                heatValues[rowIndex * overlayWidth + columnIndex] = pointValue;
            }   
        }

        const contoursGenerator = contours()
            .size([overlayWidth, overlayHeight])
            .thresholds(10);
        const heatContours = contoursGenerator(heatValues);

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

        return {
            type: "Overlay_Heatmap",
            element: element.id,
            config: {
                position: {
                    top: -overlayOverflow,
                    left: -overlayOverflow,
                },
                html: canvas,
            },
        };
    }
}

export default HeatmapOverlayBuilder;