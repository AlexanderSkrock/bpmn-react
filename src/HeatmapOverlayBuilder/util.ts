import { pointDistance } from "diagram-js/lib/util/Geometry";
import { center } from "diagram-js/lib/util/PositionUtil";

export function getDistances(point, elements) {
    const result = {};

    elements.forEach(element => {
        const isLineElement = !element.width || !element.height
        if (isLineElement) {
            const lines = [];
            if (element.waypoints) {
                for (let i = 0; i < element.waypoints.length - 1; i++) {
                    lines.push([element.waypoints[i], element.waypoints[i + 1]]);
                }
            }
            result[element.id] = pointLinesDistance(point, lines);
        } else {
            result[element.id] = pointDistance(point, center(element));
        }
    });

    return result;
}

export function pointLinesDistance(point, lines) {
    if (lines.length <= 0) {
        return Number.POSITIVE_INFINITY;
    }
    const distances = lines.map(([linePointA, linePointB]) => pointLineDistance(point, linePointA, linePointB));
    return Math.min(...distances);
}

export function pointLineDistance(point, linePointA, linePointB) {
    // Calculate the distance to the line segment
    const segmentLength = Math.sqrt((linePointB.x - linePointA.x) ** 2 + (linePointB.y - linePointA.y) ** 2);
    const dotProduct = (point.x - linePointA.x) * (linePointB.x - linePointA.x) + (point.y - linePointA.y) * (linePointB.y - linePointA.y);
    const t = Math.max(0, Math.min(1, dotProduct / (segmentLength * segmentLength)));
    const closestPointX = linePointA.x + t * (linePointB.x - linePointA.x);
    const closestPointY = linePointA.y + t * (linePointB.y - linePointA.y);

    return Math.sqrt((point.x - closestPointX) ** 2 + (point.y - closestPointY) ** 2);
}

export function distanceToEdge(centerX, centerY, W, H, x, y) {
    // Vector components
    const dx = x - centerX;
    const dy = y - centerY;

    // Intersection points
    let intersectX, intersectY;

    // Calculate intersection with the rectangle edges
    if (dx !== 0) {
        // Intersection with left and right edges
        const t1 = -centerX / dx;
        const t2 = (W - centerX) / dx;
        const y1 = centerY + t1 * dy;
        const y2 = centerY + t2 * dy;

        if (y1 >= 0 && y1 <= H) {
            intersectX = 0;
            intersectY = y1;
        } else if (y2 >= 0 && y2 <= H) {
            intersectX = W;
            intersectY = y2;
        }
    }

    if (dy !== 0) {
        // Intersection with top and bottom edges
        const t3 = -centerY / dy;
        const t4 = (H - centerY) / dy;
        const x1 = centerX + t3 * dx;
        const x2 = centerX + t4 * dx;

        if (x1 >= 0 && x1 <= W) {
            intersectX = x1;
            intersectY = 0;
        } else if (x2 >= 0 && x2 <= W) {
            intersectX = x2;
            intersectY = H;
        }
    }

    // Calculate the distance from the center to the intersection point
    const distance = Math.sqrt((intersectX - centerX) ** 2 + (intersectY - centerY) ** 2);
    return distance;
}