import type { ElementLike } from "diagram-js/lib/model/Types";
import Rectangle from "./Rectangle";
import Point from "./Point";
import { isConnection } from "diagram-js/lib/util/ModelUtil";
import { calculateInfluenceMaxRange, getDistances } from "./util";
import type { HeatmatrixJobRequestData } from "./Heatmap.types";
import PointMap from "./PointMap";

self.onmessage = function(message: MessageEvent<HeatmatrixJobRequestData>) {
    const { values, elements, chunk, xOffset, yOffset, width, height } = message.data;
    const { startX, endX, startY, endY } = chunk;
    const result = calculateHeatMatrixChunk(values, elements, xOffset, yOffset, width, height, startX, endX, startY, endY);
    self.postMessage({ chunk, result });
};

function calculateHeatMatrixChunk(values: { [key: string]: number }, elements: ElementLike[], xOffset: number, yOffset: number, width: number, height: number, startX: number, endX: number, startY: number, endY: number): number[] {
    const pointMap = new PointMap<ElementLike>(new Rectangle(0, 0, width, height), 4);
    elements.forEach(element => {
        pointMap.insert(
            new Point(element.x + (element.width / 2), element.y + (element.height / 2)),
            element
        );
    });
    
    const heatMatrix = new Array(width * height).fill(Number.NaN);
    for (let rowIndex = startY; rowIndex < height; rowIndex++) {
        for (let columnIndex = startX; columnIndex < width; columnIndex++) {
            const coordinateX = columnIndex + xOffset;
            const coordinateY = rowIndex + yOffset;

            const distances = getDistances({ x: coordinateX, y: coordinateY }, elements);

            // TODO Use dynamic value for rectangle to search in
            const nearbyElements = pointMap.query(new Rectangle(coordinateX - 200, coordinateY - 200, 400, 400))
            const weigths = nearbyElements.reduce((result, { value: element }) => {
                const distance = distances[element.id];

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
    return heatMatrix;
}
