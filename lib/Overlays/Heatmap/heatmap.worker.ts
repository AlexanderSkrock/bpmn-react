import type { ElementLike } from "diagram-js/lib/model/Types";
import type { HeatmatrixJobRequestData } from "./Heatmap.types";

import { isConnection } from "diagram-js/lib/util/ModelUtil";

import {area, GeometryMap, Line, Point, Rectangle} from "../../util/geometry";

import { calculateInfluenceMaxRange, getDistance } from "./util";

self.onmessage = function(message: MessageEvent<HeatmatrixJobRequestData>) {
    const { values, elements, chunk, xOffset, yOffset, width, height } = message.data;
    const { startX, endX, startY, endY } = chunk;

    const dimensions = new Rectangle(xOffset, yOffset, width, height);
    const chunkDimension = new Rectangle(startX, startY, endX - startX, endY - startY);

    const result = calculateHeatMatrixChunk(values, elements, dimensions, chunkDimension);

    self.postMessage({ chunk, result });
};

function calculateHeatMatrixChunk(values: { [key: string]: number }, elements: ElementLike[], dimensions: Rectangle, chunkDimensions: Rectangle): Float32Array {
    const geometryMap = calculateGeometryMap(dimensions, elements);

    let searchXRange = 6;
    let searchYRange = 6;
    elements.forEach(element => {
        if (isConnection(element)) {
            return;
        }
        // We need to add additional search range, because it seems we have an issue
        // around the connection points between activities and sequence flows.
        searchXRange = Math.max(searchXRange, (element.width / 2) + 25);
        searchYRange = Math.max(searchYRange, (element.height / 2) + 25);
    })

    const heatMatrix = new Float32Array(area(dimensions)).fill(Number.NaN);
    for (let rowIndex = chunkDimensions.upperLeft().y; rowIndex < chunkDimensions.bottomRight().y; rowIndex++) {
        const coordinateY = rowIndex + dimensions.upperLeft().y;
        for (let columnIndex = chunkDimensions.upperLeft().x; columnIndex < chunkDimensions.bottomRight().x; columnIndex++) {
            const coordinateX = columnIndex + dimensions.upperLeft().x;

            const nearbyElements = geometryMap.query(new Rectangle(coordinateX - searchXRange, coordinateY - searchYRange, searchXRange * 2, searchYRange * 2));

            const weigths = nearbyElements.reduce((result, { value: element }) => {
                const distance = getDistance({ x: coordinateX, y: coordinateY }, element);

                const maxInfluence = isConnection(element)
                    ? 0.9
                    : 1.8;
                const maxRange = isConnection(element)
                    ? 12
                    : calculateInfluenceMaxRange(element, { x: coordinateX, y: coordinateY }, 10);

                const distanceFactor = -(1 / Math.pow(maxRange, 2)) * Math.pow(distance, 2) + maxInfluence;
                const weight = Math.max(distanceFactor, 0);

                result[element.id] = weight;
                return result;
            }, {} as { [elementId: string]: number});

            const hasInfluence = Object.values(weigths).some(w => w > 0);
            if (hasInfluence) {
                const weightedSum = nearbyElements.reduce((acc, { value: element }) => {
                    if (!Number.isNaN(values[element.id])) {
                        acc.sum += weigths[element.id] * values[element.id];
                        acc.weightSum += weigths[element.id];
                    }
                    return acc;
                }, { sum: 0, weightSum: 0 });

                if (weightedSum.weightSum >= 1) {
                    heatMatrix[rowIndex * dimensions.width + columnIndex] = weightedSum.sum / weightedSum.weightSum;
                } else {
                    heatMatrix[rowIndex * dimensions.width + columnIndex] = weightedSum.sum;
                }
            }
        }
    }

    return heatMatrix;
}

function calculateGeometryMap(dimensions: Rectangle, elements: ElementLike[]): GeometryMap<ElementLike> {
    const geometryMap = new GeometryMap<ElementLike>(dimensions, 4);
    elements.forEach(element => {
        if (isConnection(element)) {
            const waypoints = element.waypoints;
            for (let i = 0; i < waypoints.length - 1; i++) {
                const current = waypoints[i];
                const next = waypoints[i + 1];
                geometryMap.insert(
                    new Line(new Point(current.x, current.y), new Point(next.x, next.y)),
                    element
                );
            }
        } else {
            geometryMap.insert(
                new Point(element.x + (element.width / 2), element.y + (element.height / 2)),
                element
            );
        }
    });
    return geometryMap;
}
