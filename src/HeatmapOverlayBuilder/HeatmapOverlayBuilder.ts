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
        const overlayWidth = element.width;
        const overlayHeight = element.height;

        const heatValues = [];
        for (let y = 0; y < overlayHeight; y++) {
            for (let x = 0; x < overlayWidth; x++) {
                const centerToPoint = pointDistance({ x: centerX, y: centerY }, { x, y });
                const centerToEdge = distanceToEdge(overlayWidth, overlayHeight, x, y);
                const valueScale = 1 - (centerToPoint / centerToEdge);
                const pointValue = elementValue * valueScale;
                heatValues[y * overlayWidth + x] = pointValue;
            }   
        }

        const contoursGenerator = contours()
            .size([overlayWidth, overlayHeight])
            .thresholds(10);
        const heatContours = contoursGenerator(heatValues);
        const nonOverlappingHeatContours = [];
        for (let i = 0; i < heatContours.length; i++) {
            let featureC = feature(heatContours[i]);
            for (let j = i + 1; j < heatContours.length; j++) {
                featureC = difference(featureCollection([featureC, feature(heatContours[j])]));
            }
            nonOverlappingHeatContours.push({ ...heatContours[i], ...featureC.geometry });
        }

        const color = scaleSequential(interpolateRgbBasis(["green", "yellow", "red"])).domain([this.minValue, this.maxValue]);
        const path = geoPath().projection(geoIdentity().scale(1));

        const canvas = create("canvas")
            .attr("width", `${overlayWidth}px`)
            .attr("height", `${overlayHeight}px`)
            .node();
        const renderContext = canvas.getContext("2d");
        renderContext.globalAlpha = 0.25;        
       
        nonOverlappingHeatContours.forEach(c => {
            renderContext.fillStyle = color(c.value);
            
            renderContext.beginPath();
            path.context(renderContext)(c);
            renderContext.fill();
            renderContext.closePath();
        });

        return {
            type: "Overlay_Heatmap",
            element: element.id,
            config: {
                position: {
                    top: 0,
                    left: 0,
                },
                html: canvas,
            },
        };
    }
}

export default HeatmapOverlayBuilder;