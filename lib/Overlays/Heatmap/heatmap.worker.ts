import type { ElementLike } from "diagram-js/lib/model/Types";
import type { HeatmatrixJobRequestData } from "./Heatmap.types";

import { isConnection } from "diagram-js/lib/util/ModelUtil";

import { GeometryMap, Line, Point, Rectangle } from "../../util/geometry";

import { calculateInfluenceMaxRange, getDistance } from "./util";

self.onmessage = function(message: MessageEvent<HeatmatrixJobRequestData>) {
    const { values, elements, chunk, xOffset, yOffset, width, height } = message.data;
    const { startX, endX, startY, endY } = chunk;

    const workerStart = performance.now();

    const result = calculateHeatMatrixChunk(values, elements, xOffset, yOffset, width, height, startX, endX, startY, endY);

    console.debug(`Worker duration: ${performance.now() - workerStart}`)

    self.postMessage({ chunk, result });
};

function calculateHeatMatrixChunk(values: { [key: string]: number }, elements: ElementLike[], xOffset: number, yOffset: number, width: number, height: number, startX: number, endX: number, startY: number, endY: number): number[] {
    const preGeometryMap = performance.now();
    
    const geometryMap = new GeometryMap<ElementLike>(new Rectangle(xOffset, yOffset, width + xOffset, height + yOffset), 4);
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

    const postGeometryMap = performance.now();
    console.debug(`Geometry map calculation duration: ${postGeometryMap - preGeometryMap}`)

    const heatMatrix = new Float32Array(width * height).fill(Number.NaN);
    for (let rowIndex = startY; rowIndex < endY; rowIndex++) {
        for (let columnIndex = startX; columnIndex < endX; columnIndex++) {
            const coordinateX = columnIndex + xOffset;
            const coordinateY = rowIndex + yOffset;

            // TODO Use dynamic value for rectangle to search in
            const nearbyElements = geometryMap.query(new Rectangle(coordinateX - 200, coordinateY - 200, 400, 400))
            const weigths = nearbyElements.reduce((result, { value: element }) => {
                const distance = getDistance({ x: coordinateX, y: coordinateY }, element);

                const maxInfluence = isConnection(element)
                    ? 0.9
                    : 1.8;
                const maxRange = isConnection(element)
                    ? 12
                    : calculateInfluenceMaxRange(element, { x: coordinateX, y: coordinateY }, 5);

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
                    heatMatrix[rowIndex * width + columnIndex] = weightedSum.sum / weightedSum.weightSum;
                } else {
                    heatMatrix[rowIndex * width + columnIndex] = weightedSum.sum;
                }
            }
        }
    }

    const postHeatMatrix = performance.now();
    console.debug(`Heatmatrix calculation duration: ${postHeatMatrix - postGeometryMap}`)

    return heatMatrix;
}
