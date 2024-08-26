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

export function calculateInfluenceMaxRange(element, point, borderRadius) {
    const { x: x1, y: y1, width: w, height: h } = element;
    const { x: x2, y: y2 } = point;

    // Calculate the center of the rectangle
    const x_c = x1 + w / 2;
    const y_c = y1 + h / 2;

    // Calculate the slope (m) and intercept (b) of the line
    const m = (y2 - y_c) / (x2 - x_c);
    const b = y_c - m * x_c;

    // Function to check intersection with rectangle edges
    function checkIntersection(x, y) {
        return x >= x1 && x <= x1 + w && y >= y1 && y <= y1 + h;
    }

    // Function to check intersection with quarter circles
    function checkQuarterCircleIntersection(cx, cy, r, quadrant) {
        const A = 1 + m * m;
        const B = -2 * cx + 2 * m * (b - cy);
        const C = cx * cx + (b - cy) * (b - cy) - r * r;
        const D = B * B - 4 * A * C;

        if (D >= 0) {
            const x1 = (-B + Math.sqrt(D)) / (2 * A);
            const y1 = m * x1 + b;
            if (checkIntersection(x1, y1) && isInQuadrant(x1, y1, cx, cy, quadrant)) return { x: x1, y: y1 };

            const x2 = (-B - Math.sqrt(D)) / (2 * A);
            const y2 = m * x2 + b;
            if (checkIntersection(x2, y2) && isInQuadrant(x2, y2, cx, cy, quadrant)) return { x: x2, y: y2 };
        }
        return null;
    }

    // Function to check if a point is in the specified quadrant
    function isInQuadrant(x, y, cx, cy, quadrant) {
        switch (quadrant) {
            case 'top-left':
                return x <= cx && y <= cy;
            case 'top-right':
                return x >= cx && y <= cy;
            case 'bottom-left':
                return x <= cx && y >= cy;
            case 'bottom-right':
                return x >= cx && y >= cy;
            default:
                return false;
        }
    }

    // Check intersection with rectangle edges
    let intersections = [];

    // Left edge
    let y = m * x1 + b;
    if (checkIntersection(x1, y) && y >= y1 + borderRadius && y <= y1 + h - borderRadius) intersections.push({ x: x1, y });

    // Right edge
    y = m * (x1 + w) + b;
    if (checkIntersection(x1 + w, y) && y >= y1 + borderRadius && y <= y1 + h - borderRadius) intersections.push({ x: x1 + w, y });

    // Top edge
    let x = (y1 - b) / m;
    if (checkIntersection(x, y1) && x >= x1 + borderRadius && x <= x1 + w - borderRadius) intersections.push({ x, y: y1 });

    // Bottom edge
    x = (y1 + h - b) / m;
    if (checkIntersection(x, y1 + h) && x >= x1 + borderRadius && x <= x1 + w - borderRadius) intersections.push({ x, y: y1 + h });

    // Check intersection with rounded corners
    const corners = [
        { cx: x1 + borderRadius, cy: y1 + borderRadius, quadrant: 'top-left' }, // Top-left
        { cx: x1 + w - borderRadius, cy: y1 + borderRadius, quadrant: 'top-right' }, // Top-right
        { cx: x1 + borderRadius, cy: y1 + h - borderRadius, quadrant: 'bottom-left' }, // Bottom-left
        { cx: x1 + w - borderRadius, cy: y1 + h - borderRadius, quadrant: 'bottom-right' } // Bottom-right
    ];

    corners.forEach(corner => {
        const intersection = checkQuarterCircleIntersection(corner.cx, corner.cy, borderRadius, corner.quadrant);
        if (intersection) intersections.push(intersection);
    });

    // Find the closest intersection point
    let minDistance = Infinity;

    intersections.forEach(intersection => {
        const distance = Math.sqrt((intersection.x - x_c) ** 2 + (intersection.y - y_c) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
        }
    });

    return minDistance;
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
